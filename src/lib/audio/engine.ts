import type { AudioConfig, Channel, SweepEvent } from '../session/types.js';

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
  oscNode?: OscillatorNode | null;
  gainNode?: GainNode | null;
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
      try {
        sweep.oscNode?.stop();
      } catch {
        // ignore; oscillator may have already stopped
      }
      sweep.oscNode?.disconnect();
      sweep.gainNode?.disconnect();
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
      notified: false
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

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();

    osc.type = cfg.voice === 'click' ? 'square' : 'sine';
    osc.frequency.setValueAtTime(cfg.frequencyHz, event.startTime);

    panner.pan.setValueAtTime(event.channel === 'L' ? -cfg.panWidth : cfg.panWidth, event.startTime);

    // Short attack/release so we don't get clicks between sweeps. Click voice
    // gets a sharper envelope to feel percussive; sine gets a smooth one.
    const dur = event.endTime - event.startTime;
    const attack = cfg.voice === 'click' ? 0.002 : 0.01;
    const release = cfg.voice === 'click' ? Math.min(0.04, dur * 0.4) : Math.min(0.05, dur * 0.3);
    const peak = cfg.volume;

    gain.gain.setValueAtTime(0, event.startTime);
    gain.gain.linearRampToValueAtTime(peak, event.startTime + attack);
    if (cfg.voice === 'click') {
      // Click: short body, then decay.
      gain.gain.linearRampToValueAtTime(0, event.startTime + attack + release);
    } else {
      // Sine: hold for the body of the sweep, then release.
      gain.gain.setValueAtTime(peak, event.endTime - release);
      gain.gain.linearRampToValueAtTime(0, event.endTime);
    }

    osc.connect(gain).connect(panner).connect(ctx.destination);
    osc.start(event.startTime);
    osc.stop(event.endTime + 0.05);

    event.oscNode = osc;
    event.gainNode = gain;
    event.pannerNode = panner;
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
