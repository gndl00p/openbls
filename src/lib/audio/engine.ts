import type { AudioConfig, AudioVoice, Channel, SweepEvent } from '../session/types.js';

/**
 * Lookahead scheduler. Each tick we look ahead this far and queue any
 * sweeps that fall in the window. Larger = more robust against tab-throttle
 * stalls; smaller = lower latency for live parameter changes.
 */
const SCHEDULE_LOOKAHEAD_S = 0.25;
const SCHEDULE_INTERVAL_MS = 25;

/** A pluggable AudioContext factory — overridable for tests. */
export type AudioContextFactory = () => AudioContext;

const defaultAudioContextFactory: AudioContextFactory = () => {
  const Ctor =
    (globalThis as unknown as { AudioContext?: typeof AudioContext })
      .AudioContext ??
    (globalThis as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) {
    throw new Error('Web Audio API is not available in this environment.');
  }
  return new Ctor();
};

export interface AudioEngineCallbacks {
  /** Fired when a sweep starts ringing. Used by the visual renderer to sync target motion. */
  onSweep?: (event: SweepEvent) => void;
  /** Fired when a set boundary is crossed. */
  onSet?: (setIndex: number) => void;
  /** Fired when a fixed setCount is reached and the session ends naturally. */
  onComplete?: () => void;
}

export interface StartOptions {
  /** Speed in Hz — number of complete L→R→L cycles per second. */
  speedHz: number;
  /** Sweeps per set. A "sweep" is one half-cycle (a single L or R tone). */
  setLength: number;
  /** Number of sets to play; null for open-ended. */
  setCount: number | null;
  audio: AudioConfig;
}

interface ScheduledSweep extends SweepEvent {
  audioNodes?: AudioNode[];
  pannerNode?: StereoPannerNode | null;
  notified?: boolean;
}

export class AudioEngine {
  #ctx: AudioContext | null = null;
  #factory: AudioContextFactory;
  #callbacks: AudioEngineCallbacks;

  // Schedule state
  #scheduled: ScheduledSweep[] = [];
  #nextIndex = 0;
  #nextStartTime = 0;
  #intervalId: ReturnType<typeof setInterval> | null = null;
  #notifyRafId: ReturnType<typeof setTimeout> | null = null;

  // Live config
  #opts: StartOptions | null = null;

  constructor(callbacks: AudioEngineCallbacks = {}, factory: AudioContextFactory = defaultAudioContextFactory) {
    this.#callbacks = callbacks;
    this.#factory = factory;
  }

  /** Currently active session options, or null if stopped. */
  get options(): Readonly<StartOptions> | null {
    return this.#opts;
  }

  get isRunning(): boolean {
    return this.#intervalId !== null;
  }

  get audioContext(): AudioContext | null {
    return this.#ctx;
  }

  /** Compute the duration of one sweep (one tone) at a given speed. */
  static sweepDuration(speedHz: number): number {
    // Two sweeps per cycle (L+R), so each sweep lasts 1 / (2 * speedHz).
    return 1 / (2 * speedHz);
  }

  /** Determine the channel for the n-th sweep starting from L on n=0. */
  static channelForIndex(index: number): Channel {
    return index % 2 === 0 ? 'L' : 'R';
  }

  start(opts: StartOptions): void {
    this.stop();
    this.#ctx = this.#factory();
    this.#opts = { ...opts, audio: { ...opts.audio } };
    this.#nextIndex = 0;
    // Begin scheduling slightly in the future so the first sweep is sample-accurate.
    this.#nextStartTime = this.#ctx.currentTime + 0.05;
    this.#tick();
    this.#intervalId = setInterval(() => this.#tick(), SCHEDULE_INTERVAL_MS);
  }

  pause(): void {
    if (this.#ctx && this.#ctx.state === 'running') {
      void this.#ctx.suspend();
    }
  }

  resume(): void {
    if (this.#ctx && this.#ctx.state === 'suspended') {
      void this.#ctx.resume();
    }
  }

  stop(): void {
    if (this.#intervalId !== null) {
      clearInterval(this.#intervalId);
      this.#intervalId = null;
    }
    if (this.#notifyRafId !== null) {
      clearTimeout(this.#notifyRafId);
      this.#notifyRafId = null;
    }
    for (const sweep of this.#scheduled) {
      if (sweep.audioNodes) {
        for (const node of sweep.audioNodes) {
          if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
            try {
              node.stop();
            } catch {
              // ignore; source may already have stopped
            }
          }
          try {
            node.disconnect();
          } catch {
            // ignore double-disconnect
          }
        }
      }
      sweep.pannerNode?.disconnect();
    }
    this.#scheduled = [];
    if (this.#ctx) {
      void this.#ctx.close();
      this.#ctx = null;
    }
    this.#opts = null;
  }

  /** Update audio params live. Frequency / volume / pan / voice changes
   * apply to subsequent scheduled sweeps; in-flight sweeps keep their params. */
  updateAudio(audio: Partial<AudioConfig>): void {
    if (!this.#opts) return;
    this.#opts.audio = { ...this.#opts.audio, ...audio };
  }

  #tick(): void {
    if (!this.#ctx || !this.#opts) return;
    const horizon = this.#ctx.currentTime + SCHEDULE_LOOKAHEAD_S;
    while (this.#nextStartTime < horizon) {
      this.#scheduleOne(this.#nextIndex, this.#nextStartTime);
      const dur = AudioEngine.sweepDuration(this.#opts.speedHz);
      this.#nextStartTime += dur;
      this.#nextIndex += 1;
      if (this.#opts.setCount !== null) {
        const totalSweeps = this.#opts.setCount * this.#opts.setLength;
        if (this.#nextIndex >= totalSweeps) {
          // Schedule a one-shot completion at the end of the last sweep.
          const completeAt = this.#nextStartTime;
          this.#scheduleCompletion(completeAt);
          if (this.#intervalId !== null) {
            clearInterval(this.#intervalId);
            this.#intervalId = null;
          }
          break;
        }
      }
    }
    this.#deliverNotifications();
  }

  #scheduleOne(index: number, startTime: number): void {
    if (!this.#ctx || !this.#opts) return;
    const dur = AudioEngine.sweepDuration(this.#opts.speedHz);
    const channel = AudioEngine.channelForIndex(index);
    const setIndex = Math.floor(index / this.#opts.setLength);
    const positionInSet = index % this.#opts.setLength;

    const event: ScheduledSweep = {
      index,
      channel,
      startTime,
      endTime: startTime + dur,
      setIndex,
      positionInSet,
      notified: false,
      audioNodes: []
    };

    if (this.#opts.audio.enabled) {
      this.#scheduleAudioFor(event);
    }
    this.#scheduled.push(event);
    this.#prune();
  }

  #scheduleAudioFor(event: ScheduledSweep): void {
    if (!this.#ctx || !this.#opts) return;
    const cfg = this.#opts.audio;
    const ctx = this.#ctx;
    const dur = event.endTime - event.startTime;
    const peak = cfg.volume;

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(
      event.channel === 'L' ? -cfg.panWidth : cfg.panWidth,
      event.startTime
    );
    panner.connect(ctx.destination);
    event.pannerNode = panner;
    event.audioNodes = [panner];

    const synth: VoiceSynth = VOICE_SYNTHS[cfg.voice] ?? VOICE_SYNTHS.sine;
    synth({
      ctx,
      panner,
      freq: cfg.frequencyHz,
      startTime: event.startTime,
      endTime: event.endTime,
      dur,
      peak,
      addNode: (n) => event.audioNodes!.push(n)
    });
  }

  #prune(): void {
    if (!this.#ctx) return;
    const now = this.#ctx.currentTime;
    // Keep events that are still ringing or yet to ring; drop completed ones older than 1s.
    this.#scheduled = this.#scheduled.filter((s) => s.endTime > now - 1);
  }

  #deliverNotifications(): void {
    if (!this.#ctx) return;
    const ctx = this.#ctx;
    const fire = () => {
      if (!this.#ctx) return;
      const now = this.#ctx.currentTime;
      let firedSet = -1;
      for (const sweep of this.#scheduled) {
        if (!sweep.notified && sweep.startTime <= now + 0.005) {
          sweep.notified = true;
          if (sweep.positionInSet === 0) {
            this.#callbacks.onSet?.(sweep.setIndex);
            firedSet = sweep.setIndex;
          }
          this.#callbacks.onSweep?.({
            index: sweep.index,
            channel: sweep.channel,
            startTime: sweep.startTime,
            endTime: sweep.endTime,
            setIndex: sweep.setIndex,
            positionInSet: sweep.positionInSet
          });
        }
      }
      void firedSet;
      this.#notifyRafId = setTimeout(fire, 10);
    };
    if (this.#notifyRafId === null) {
      this.#notifyRafId = setTimeout(fire, 10);
    }
    // Touch ctx so unused-var lint doesn't complain about the closure.
    void ctx;
  }

  #scheduleCompletion(at: number): void {
    if (!this.#ctx) return;
    const delay = Math.max(0, (at - this.#ctx.currentTime) * 1000);
    setTimeout(() => {
      this.#callbacks.onComplete?.();
    }, delay);
  }
}

// ──────────────────────── Voice synthesis ────────────────────────

interface VoiceCtx {
  ctx: AudioContext;
  panner: StereoPannerNode;
  freq: number;
  startTime: number;
  endTime: number;
  dur: number;
  peak: number;
  addNode: (n: AudioNode) => void;
}

type VoiceSynth = (ctx: VoiceCtx) => void;

/**
 * One synth function per voice. Each constructs its node graph, schedules
 * envelopes, connects to the panner, and registers nodes with addNode for
 * cleanup on stop().
 */
const VOICE_SYNTHS: Record<AudioVoice, VoiceSynth> = {
  sine: ({ ctx, panner, freq, startTime, endTime, dur, peak, addNode }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    const attack = 0.01;
    const release = Math.min(0.05, dur * 0.3);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + attack);
    gain.gain.setValueAtTime(peak, endTime - release);
    gain.gain.linearRampToValueAtTime(0, endTime);

    osc.connect(gain).connect(panner);
    osc.start(startTime);
    osc.stop(endTime + 0.05);
    addNode(osc);
    addNode(gain);
  },

  soft: ({ ctx, panner, freq, startTime, endTime, dur, peak, addNode }) => {
    // Long attack + long release → pad-like, very gentle.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    const attack = Math.min(0.18, dur * 0.4);
    const release = Math.min(0.22, dur * 0.5);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak * 0.85, startTime + attack);
    gain.gain.setValueAtTime(peak * 0.85, endTime - release);
    gain.gain.linearRampToValueAtTime(0, endTime);

    osc.connect(gain).connect(panner);
    osc.start(startTime);
    osc.stop(endTime + 0.05);
    addNode(osc);
    addNode(gain);
  },

  tone: ({ ctx, panner, freq, startTime, endTime, dur, peak, addNode }) => {
    // Square through gentle low-pass — body without harshness.
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(8000, freq * 4), startTime);
    filter.Q.setValueAtTime(0.7, startTime);

    const attack = 0.012;
    const release = Math.min(0.08, dur * 0.35);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak * 0.55, startTime + attack);
    gain.gain.setValueAtTime(peak * 0.55, endTime - release);
    gain.gain.linearRampToValueAtTime(0, endTime);

    osc.connect(filter).connect(gain).connect(panner);
    osc.start(startTime);
    osc.stop(endTime + 0.05);
    addNode(osc);
    addNode(filter);
    addNode(gain);
  },

  click: ({ ctx, panner, freq, startTime, endTime, dur, peak, addNode }) => {
    // Sharp percussive square with quick decay.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, startTime);

    const attack = 0.002;
    const release = Math.min(0.04, dur * 0.4);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + attack);
    gain.gain.linearRampToValueAtTime(0, startTime + attack + release);

    osc.connect(gain).connect(panner);
    osc.start(startTime);
    osc.stop(startTime + attack + release + 0.02);
    addNode(osc);
    addNode(gain);
  },

  woodblock: ({ ctx, panner, freq, startTime, peak, addNode }) => {
    // Pitched percussive: sine + filtered noise burst, exponential decay.
    const sineOsc = ctx.createOscillator();
    const sineGain = ctx.createGain();
    sineOsc.type = 'triangle';
    sineOsc.frequency.setValueAtTime(freq * 1.6, startTime);

    const decay = 0.12;
    sineGain.gain.setValueAtTime(peak * 0.9, startTime);
    sineGain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

    sineOsc.connect(sineGain).connect(panner);
    sineOsc.start(startTime);
    sineOsc.stop(startTime + decay + 0.02);
    addNode(sineOsc);
    addNode(sineGain);

    // Noise tap at attack
    const noise = createNoiseNode(ctx, 0.04);
    const noiseFilter = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(freq * 2.5, startTime);
    noiseFilter.Q.setValueAtTime(2, startTime);
    noiseGain.gain.setValueAtTime(peak * 0.4, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.03);

    noise.connect(noiseFilter).connect(noiseGain).connect(panner);
    noise.start(startTime);
    addNode(noise);
    addNode(noiseFilter);
    addNode(noiseGain);
  },

  chime: ({ ctx, panner, freq, startTime, peak, addNode }) => {
    // Bell-like additive synthesis with inharmonic overtones.
    const partials = [
      { mult: 1, gain: 0.7 },
      { mult: 2.01, gain: 0.35 },
      { mult: 3.04, gain: 0.18 },
      { mult: 4.7, gain: 0.08 }
    ];
    const decay = 0.6;
    for (const p of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.mult, startTime);
      gain.gain.setValueAtTime(peak * p.gain * 0.7, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay * (1 - 0.05 * p.mult));
      osc.connect(gain).connect(panner);
      osc.start(startTime);
      osc.stop(startTime + decay + 0.05);
      addNode(osc);
      addNode(gain);
    }
  },

  pluck: ({ ctx, panner, freq, startTime, peak, addNode }) => {
    // Plucked-string-ish: sine + saw with fast exponential decay.
    const decay = 0.18;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq, startTime);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + decay);

    gain.gain.setValueAtTime(peak * 0.85, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + decay);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(panner);
    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + decay + 0.02);
    osc2.stop(startTime + decay + 0.02);
    addNode(osc1);
    addNode(osc2);
    addNode(filter);
    addNode(gain);
  }
};

function createNoiseNode(ctx: AudioContext, durationSec: number): AudioBufferSourceNode {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * durationSec));
  const buf = ctx.createBuffer(1, length, sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  return src;
}
