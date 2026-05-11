import { writable, get, type Writable } from 'svelte/store';
import { AudioEngine } from '../audio/engine.js';
import type { Preset } from '../presets/schema.js';
import { BUILT_IN_PRESETS } from '../presets/builtin.js';
import type { SweepEvent } from '../session/types.js';

export type SessionStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface SessionState {
  status: SessionStatus;
  preset: Preset;
  sweepIndex: number;
  setIndex: number;
  positionInSet: number;
  lastSweepStartedAt: number; // performance.now()
  /** Total running time in ms (excludes paused intervals). Live during run. */
  elapsedMs: number;
}

const FIRST_PRESET = BUILT_IN_PRESETS[0];

const initial: SessionState = {
  status: 'idle',
  preset: FIRST_PRESET,
  sweepIndex: 0,
  setIndex: 0,
  positionInSet: 0,
  lastSweepStartedAt: 0,
  elapsedMs: 0
};

/** Provides `performance.now()` — overridable for tests. */
export interface Clock {
  now(): number;
}

const realClock: Clock = {
  now: () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
};

export interface SessionController {
  state: Writable<SessionState>;
  setPreset: (preset: Preset) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  /** Hooks for the visual renderer to subscribe to live sweep events. */
  onSweep: (cb: (e: SweepEvent) => void) => () => void;
}

/**
 * Pure timer-tracking math. Pulled out of the controller so it can be tested
 * without a Web Audio context. Accumulates ms while running, freezes while
 * paused, and reports whether the auto-stop threshold has been crossed.
 */
export class SessionTimer {
  #accumulatedMs = 0;
  #segmentStart: number | null = null;
  #clock: Clock;

  constructor(clock: Clock = realClock) {
    this.#clock = clock;
  }

  start(): void {
    this.#accumulatedMs = 0;
    this.#segmentStart = this.#clock.now();
  }

  pause(): void {
    if (this.#segmentStart !== null) {
      this.#accumulatedMs += this.#clock.now() - this.#segmentStart;
      this.#segmentStart = null;
    }
  }

  resume(): void {
    if (this.#segmentStart === null) {
      this.#segmentStart = this.#clock.now();
    }
  }

  stop(): void {
    this.#accumulatedMs = 0;
    this.#segmentStart = null;
  }

  /** Total running time in milliseconds at the current instant. */
  elapsedMs(): number {
    if (this.#segmentStart === null) return this.#accumulatedMs;
    return this.#accumulatedMs + (this.#clock.now() - this.#segmentStart);
  }

  /** True iff configured max has been reached. `maxMinutes == null` → never. */
  isExpired(maxMinutes: number | null | undefined): boolean {
    if (maxMinutes == null) return false;
    return this.elapsedMs() >= maxMinutes * 60_000;
  }
}

const TIMER_TICK_MS = 250;

export function createSessionController(clock: Clock = realClock): SessionController {
  const state = writable<SessionState>({ ...initial });
  const sweepListeners = new Set<(e: SweepEvent) => void>();
  const timer = new SessionTimer(clock);
  let tickHandle: ReturnType<typeof setInterval> | null = null;

  function startTicker() {
    stopTicker();
    tickHandle = setInterval(() => {
      const s = get(state);
      if (s.status !== 'running') return;
      const elapsed = timer.elapsedMs();
      state.update((cur) => ({ ...cur, elapsedMs: elapsed }));
      if (timer.isExpired(s.preset.sessionMaxMinutes ?? null)) {
        controllerInternalStop('completed');
      }
    }, TIMER_TICK_MS);
  }
  function stopTicker() {
    if (tickHandle !== null) {
      clearInterval(tickHandle);
      tickHandle = null;
    }
  }

  function controllerInternalStop(finalStatus: SessionStatus) {
    engine.stop();
    timer.stop();
    stopTicker();
    state.update((s) => ({ ...s, status: finalStatus, elapsedMs: 0 }));
  }

  const engine = new AudioEngine({
    onSweep: (event) => {
      state.update((s) => ({
        ...s,
        sweepIndex: event.index,
        setIndex: event.setIndex,
        positionInSet: event.positionInSet,
        lastSweepStartedAt: clock.now()
      }));
      for (const cb of sweepListeners) cb(event);
    },
    onComplete: () => {
      controllerInternalStop('completed');
    }
  });

  return {
    state,

    setPreset(preset: Preset): void {
      const wasRunning = get(state).status === 'running';
      state.update((s) => ({ ...s, preset, sweepIndex: 0, setIndex: 0, positionInSet: 0 }));
      if (wasRunning) {
        engine.stop();
        engine.start({
          speedHz: preset.visual.speedHz,
          setLength: preset.visual.setLength,
          setCount: preset.visual.setCount,
          audio: preset.audio
        });
        state.update((s) => ({ ...s, status: 'running' }));
      }
    },

    start(): void {
      const s = get(state);
      const p = s.preset;
      engine.stop();
      timer.start();
      engine.start({
        speedHz: p.visual.speedHz,
        setLength: p.visual.setLength,
        setCount: p.visual.setCount,
        audio: p.audio
      });
      state.update((cur) => ({
        ...cur,
        status: 'running',
        sweepIndex: 0,
        setIndex: 0,
        positionInSet: 0,
        elapsedMs: 0
      }));
      startTicker();
    },

    pause(): void {
      engine.pause();
      timer.pause();
      state.update((s) => ({ ...s, status: 'paused', elapsedMs: timer.elapsedMs() }));
    },

    resume(): void {
      engine.resume();
      timer.resume();
      state.update((s) => ({ ...s, status: 'running' }));
    },

    stop(): void {
      controllerInternalStop('idle');
    },

    onSweep(cb: (e: SweepEvent) => void): () => void {
      sweepListeners.add(cb);
      return () => sweepListeners.delete(cb);
    }
  };
}

export const sessionController = createSessionController();

/** Helper for mm:ss display. */
export function formatMmSs(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
