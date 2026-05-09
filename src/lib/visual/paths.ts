import type { VisualPath } from '../session/types.js';

/**
 * Path functions return a normalized point in [-1, 1] x [-1, 1] given a phase t.
 *
 * Phase model: a single "sweep" corresponds to t ∈ [0, 1]. Two sweeps make a
 * full L→R→L cycle. Even-indexed sweeps (0, 2, 4, …) move from L to R or
 * one direction of the path; odd-indexed sweeps reverse.
 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

const TAU = Math.PI * 2;

/**
 * @param sweepIndex 0-based sweep index. Even sweeps go "forward", odd sweeps "back".
 * @param phase t in [0, 1] within the current sweep.
 */
export function pathPoint(
  path: VisualPath,
  sweepIndex: number,
  phase: number
): NormalizedPoint {
  const t = clamp01(phase);
  const forward = sweepIndex % 2 === 0;

  switch (path) {
    case 'horizontal': {
      const x = forward ? -1 + 2 * t : 1 - 2 * t;
      return { x, y: 0 };
    }
    case 'vertical': {
      const y = forward ? -1 + 2 * t : 1 - 2 * t;
      return { x: 0, y };
    }
    case 'diagonal': {
      // Travels from (-1, -1) → (1, 1) on forward, reverse on back.
      const v = forward ? -1 + 2 * t : 1 - 2 * t;
      return { x: v, y: v };
    }
    case 'circular': {
      // Each sweep traces one half of the circle; orientation alternates so
      // the target re-enters the screen smoothly rather than teleporting.
      // Forward sweeps trace the top half (y < 0); back sweeps trace the bottom.
      const angle = forward ? Math.PI + Math.PI * t : Math.PI * 2 + Math.PI * t;
      return { x: Math.cos(angle), y: Math.sin(angle) };
    }
    case 'figure-eight': {
      // Lemniscate of Bernoulli: x = cos(θ) / (1+sin²θ), y = sin(θ)cos(θ) / (1+sin²θ)
      // One full figure-eight is θ ∈ [0, 2π]. Each sweep covers half: π radians.
      const theta = forward ? Math.PI * t : Math.PI + Math.PI * t;
      const denom = 1 + Math.sin(theta) ** 2;
      return {
        x: Math.cos(theta) / denom,
        y: (Math.sin(theta) * Math.cos(theta)) / denom
      };
    }
    default: {
      // Exhaustive switch — TS will flag at compile time if a path is added without a case.
      const _exhaustive: never = path;
      void _exhaustive;
      return { x: 0, y: 0 };
    }
  }
}

/** Continuity check: does the end of sweep N equal the start of sweep N+1? */
export function isContinuousAt(path: VisualPath, sweepIndex: number): boolean {
  const a = pathPoint(path, sweepIndex, 1);
  const b = pathPoint(path, sweepIndex + 1, 0);
  return Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9;
}

function clamp01(t: number): number {
  if (t < 0) return 0;
  if (t > 1) return 1;
  return t;
}

void TAU; // reserved for future radial paths
