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
}

const FIRST_PRESET = BUILT_IN_PRESETS[0];

const initial: SessionState = {
  status: 'idle',
  preset: FIRST_PRESET,
  sweepIndex: 0,
  setIndex: 0,
  positionInSet: 0,
  lastSweepStartedAt: 0
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

export function createSessionController(): SessionController {
  const state = writable<SessionState>({ ...initial });
  const sweepListeners = new Set<(e: SweepEvent) => void>();

  const engine = new AudioEngine({
    onSweep: (event) => {
      state.update((s) => ({
        ...s,
        sweepIndex: event.index,
        setIndex: event.setIndex,
        positionInSet: event.positionInSet,
        lastSweepStartedAt: performance.now()
      }));
      for (const cb of sweepListeners) cb(event);
    },
    onComplete: () => {
      state.update((s) => ({ ...s, status: 'completed' }));
      engine.stop();
    }
  });

  return {
    state,

    setPreset(preset: Preset): void {
      const wasRunning = get(state).status === 'running';
      state.update((s) => ({ ...s, preset, sweepIndex: 0, setIndex: 0, positionInSet: 0 }));
      if (wasRunning) {
        // Restart the engine so audio param changes (frequency, voice, volume,
        // pan width) and timing changes (speed, set length, set count) take
        // effect immediately. Sweep counter resets to zero — that's the right
        // behavior since the new preset may have a different set length.
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
        positionInSet: 0
      }));
    },

    pause(): void {
      engine.pause();
      state.update((s) => ({ ...s, status: 'paused' }));
    },

    resume(): void {
      engine.resume();
      state.update((s) => ({ ...s, status: 'running' }));
    },

    stop(): void {
      engine.stop();
      state.update((s) => ({ ...s, status: 'idle' }));
    },

    onSweep(cb: (e: SweepEvent) => void): () => void {
      sweepListeners.add(cb);
      return () => sweepListeners.delete(cb);
    }
  };
}

export const sessionController = createSessionController();
