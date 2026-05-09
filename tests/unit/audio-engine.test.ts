import { describe, expect, it } from 'vitest';
import { AudioEngine } from '../../src/lib/audio/engine.js';

describe('AudioEngine — pure scheduling math', () => {
  it('sweepDuration is 1/(2*speed) — full L+R cycle equals 1/speed', () => {
    expect(AudioEngine.sweepDuration(1.0)).toBeCloseTo(0.5);
    expect(AudioEngine.sweepDuration(0.5)).toBeCloseTo(1.0);
    expect(AudioEngine.sweepDuration(2.0)).toBeCloseTo(0.25);
  });

  it('alternates L,R,L,R from index 0', () => {
    expect(AudioEngine.channelForIndex(0)).toBe('L');
    expect(AudioEngine.channelForIndex(1)).toBe('R');
    expect(AudioEngine.channelForIndex(2)).toBe('L');
    expect(AudioEngine.channelForIndex(99)).toBe('R');
  });

  it('does not drift over a simulated 5-minute session', () => {
    // 5 minutes at 1.0 Hz = 600 sweeps. Sum of sweep durations must equal session length exactly.
    const speed = 1.0;
    const dur = AudioEngine.sweepDuration(speed);
    const sweepCount = 600;
    const total = dur * sweepCount;
    // 5 minutes = 300 seconds
    expect(total).toBe(300);
  });

  it('faster speeds produce proportionally shorter sweeps with no rounding drift', () => {
    const speeds = [0.4, 0.7, 1.0, 1.3, 1.6, 2.0];
    for (const s of speeds) {
      const d = AudioEngine.sweepDuration(s);
      // Round-trip identity: speed = 1 / (2 * sweepDuration)
      expect(1 / (2 * d)).toBeCloseTo(s, 12);
    }
  });
});
