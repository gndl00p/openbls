import { describe, expect, it } from 'vitest';
import { SessionTimer, formatMmSs } from '../../src/lib/stores/session.js';

class MockClock {
  t = 0;
  now(): number {
    return this.t;
  }
  advance(ms: number) {
    this.t += ms;
  }
}

describe('SessionTimer', () => {
  it('accumulates only while running', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(1000);
    expect(tm.elapsedMs()).toBe(1000);
    tm.pause();
    c.advance(5000); // paused — should not accumulate
    expect(tm.elapsedMs()).toBe(1000);
    tm.resume();
    c.advance(500);
    expect(tm.elapsedMs()).toBe(1500);
  });

  it('survives multiple pause/resume cycles', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(2000);
    tm.pause();
    c.advance(10_000);
    tm.resume();
    c.advance(3000);
    tm.pause();
    c.advance(8000);
    tm.resume();
    c.advance(1000);
    expect(tm.elapsedMs()).toBe(6000);
  });

  it('stop resets to zero', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(10_000);
    tm.stop();
    expect(tm.elapsedMs()).toBe(0);
  });

  it('isExpired returns false when maxMinutes is null or undefined', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(100 * 60_000);
    expect(tm.isExpired(null)).toBe(false);
    expect(tm.isExpired(undefined)).toBe(false);
  });

  it('isExpired flips true at threshold', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(5 * 60_000 - 1);
    expect(tm.isExpired(5)).toBe(false);
    c.advance(1);
    expect(tm.isExpired(5)).toBe(true);
  });

  it('paused time does not count toward expiry', () => {
    const c = new MockClock();
    const tm = new SessionTimer(c);
    tm.start();
    c.advance(4 * 60_000);
    tm.pause();
    c.advance(60 * 60_000); // huge pause
    tm.resume();
    expect(tm.isExpired(5)).toBe(false);
    c.advance(60_000);
    expect(tm.isExpired(5)).toBe(true);
  });
});

describe('formatMmSs', () => {
  it.each([
    [0, '00:00'],
    [999, '00:00'],
    [1000, '00:01'],
    [60_000, '01:00'],
    [3 * 60_000 + 7_000, '03:07'],
    [60 * 60_000, '60:00']
  ])('%i ms → %s', (ms, expected) => {
    expect(formatMmSs(ms)).toBe(expected);
  });

  it('floors negative values to 00:00', () => {
    expect(formatMmSs(-1)).toBe('00:00');
  });
});
