import { describe, expect, it } from 'vitest';
import { isContinuousAt, pathPoint } from '../../src/lib/visual/paths.js';
import type { VisualPath } from '../../src/lib/session/types.js';

const ALL_PATHS: VisualPath[] = [
  'horizontal',
  'vertical',
  'diagonal',
  'circular',
  'figure-eight'
];

describe('visual paths — endpoints', () => {
  it('horizontal: forward sweep 0 goes from x=-1 to x=1', () => {
    expect(pathPoint('horizontal', 0, 0)).toEqual({ x: -1, y: 0 });
    expect(pathPoint('horizontal', 0, 1)).toEqual({ x: 1, y: 0 });
  });
  it('horizontal: back sweep 1 reverses', () => {
    expect(pathPoint('horizontal', 1, 0)).toEqual({ x: 1, y: 0 });
    expect(pathPoint('horizontal', 1, 1)).toEqual({ x: -1, y: 0 });
  });
  it('vertical and diagonal endpoints are correct', () => {
    expect(pathPoint('vertical', 0, 0)).toEqual({ x: 0, y: -1 });
    expect(pathPoint('vertical', 0, 1)).toEqual({ x: 0, y: 1 });
    expect(pathPoint('diagonal', 0, 0)).toEqual({ x: -1, y: -1 });
    expect(pathPoint('diagonal', 0, 1)).toEqual({ x: 1, y: 1 });
  });
});

describe('visual paths — continuity at sweep boundaries', () => {
  it.each(ALL_PATHS)('path %s is continuous between consecutive sweeps', (path) => {
    for (let i = 0; i < 6; i++) {
      expect(isContinuousAt(path, i)).toBe(true);
    }
  });
});

describe('visual paths — bounded in [-1, 1]', () => {
  it.each(ALL_PATHS)('path %s never leaves the unit box', (path) => {
    for (let s = 0; s < 4; s++) {
      for (let p = 0; p <= 1; p += 0.05) {
        const pt = pathPoint(path, s, p);
        expect(pt.x).toBeGreaterThanOrEqual(-1.0001);
        expect(pt.x).toBeLessThanOrEqual(1.0001);
        expect(pt.y).toBeGreaterThanOrEqual(-1.0001);
        expect(pt.y).toBeLessThanOrEqual(1.0001);
      }
    }
  });
});

describe('visual paths — phase clamping', () => {
  it('clamps out-of-range phase to [0, 1] without throwing', () => {
    const a = pathPoint('horizontal', 0, -0.5);
    const b = pathPoint('horizontal', 0, 0);
    expect(a).toEqual(b);
    const c = pathPoint('horizontal', 0, 1.5);
    const d = pathPoint('horizontal', 0, 1);
    expect(c).toEqual(d);
  });
});
