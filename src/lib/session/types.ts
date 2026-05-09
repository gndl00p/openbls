// Shared types for the session engine. The same type vocabulary is used by
// the audio engine, the visual renderer, the preset schema, and the UI.

export type Channel = 'L' | 'R';

export type AudioVoice = 'sine' | 'click';

export interface AudioConfig {
  enabled: boolean;
  /** When true, audio sweeps fire on the same schedule as the visual sweeps. */
  syncWithVisual: boolean;
  frequencyHz: number; // 200–1200
  volume: number; // 0–1
  /** Stereo width: 0 = center on both channels, 1 = full L/R separation. */
  panWidth: number; // 0–1
  voice: AudioVoice;
}

export type VisualPath =
  | 'horizontal'
  | 'vertical'
  | 'diagonal'
  | 'circular'
  | 'figure-eight';

export type TargetShape = 'circle' | 'dot' | 'ring';

export type ContrastLevel = 'high' | 'standard' | 'reduced';

export interface VisualConfig {
  enabled: boolean;
  path: VisualPath;
  speedHz: number; // 0.4–2.0
  setLength: number; // sweeps per set, 1–200
  setCount: number | null; // null = open-ended
  target: {
    shape: TargetShape;
    sizePx: number; // 8–200
    color: string;
  };
  background: {
    color: string;
    contrast: ContrastLevel;
  };
}

export interface SessionConfig {
  visual: VisualConfig;
  audio: AudioConfig;
  /** When set, the visual surface renders the named guide instead of a tracking target. */
  guide?: 'butterfly-hug' | null;
}

/** A discrete tone or pulse event scheduled by the session engine. */
export interface SweepEvent {
  /** Index of this sweep within the session, starting at 0. */
  index: number;
  /** The channel this sweep is on. */
  channel: Channel;
  /** AudioContext time at which the sweep starts (seconds). */
  startTime: number;
  /** AudioContext time at which the sweep ends (seconds). */
  endTime: number;
  /** Set index this sweep belongs to (0-based). */
  setIndex: number;
  /** Sweep index within the current set (0-based). */
  positionInSet: number;
}

export interface SessionLimits {
  speedHzMin: number;
  speedHzMax: number;
  frequencyHzMin: number;
  frequencyHzMax: number;
  setLengthMin: number;
  setLengthMax: number;
  /**
   * Hard ceiling for any visual transition that approximates a flash.
   * WCAG 2.1 §2.3 Three Flashes Threshold — the renderer must enforce.
   */
  flashRateMaxHz: number;
}

export const SESSION_LIMITS: SessionLimits = {
  speedHzMin: 0.4,
  speedHzMax: 2.0,
  frequencyHzMin: 200,
  frequencyHzMax: 1200,
  setLengthMin: 1,
  setLengthMax: 200,
  flashRateMaxHz: 3
};
