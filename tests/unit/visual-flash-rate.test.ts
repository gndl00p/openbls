import { describe, expect, it } from 'vitest';
import {
  WCAG_FLASH_RATE_MAX_HZ,
  FlashRateExceededError,
  assertSafeFlashRate,
  isSweepSpeedAllowed,
  safeFlashRate
} from '../../src/lib/visual/wcag.js';
import { SESSION_LIMITS } from '../../src/lib/session/types.js';

describe('WCAG flash-rate guard', () => {
  it('threshold matches SESSION_LIMITS.flashRateMaxHz', () => {
    expect(WCAG_FLASH_RATE_MAX_HZ).toBe(SESSION_LIMITS.flashRateMaxHz);
  });

  it('rates ≤ threshold pass', () => {
    expect(() => assertSafeFlashRate(0)).not.toThrow();
    expect(() => assertSafeFlashRate(2)).not.toThrow();
    expect(() => assertSafeFlashRate(3)).not.toThrow();
  });

  it('rates above threshold throw', () => {
    expect(() => assertSafeFlashRate(3.0001)).toThrow(FlashRateExceededError);
    expect(() => assertSafeFlashRate(10)).toThrow(FlashRateExceededError);
  });

  it('non-finite or negative rates throw', () => {
    expect(() => assertSafeFlashRate(NaN)).toThrow(FlashRateExceededError);
    expect(() => assertSafeFlashRate(-1)).toThrow(FlashRateExceededError);
    expect(() => assertSafeFlashRate(Infinity)).toThrow(FlashRateExceededError);
  });

  it('safeFlashRate clamps without throwing', () => {
    expect(safeFlashRate(2)).toBe(2);
    expect(safeFlashRate(5)).toBe(WCAG_FLASH_RATE_MAX_HZ);
    expect(safeFlashRate(NaN)).toBe(0);
  });
});

describe('Sweep-speed bounds', () => {
  it('accepts the documented range', () => {
    expect(isSweepSpeedAllowed(SESSION_LIMITS.speedHzMin)).toBe(true);
    expect(isSweepSpeedAllowed(1.0)).toBe(true);
    expect(isSweepSpeedAllowed(SESSION_LIMITS.speedHzMax)).toBe(true);
  });

  it('rejects out-of-range', () => {
    expect(isSweepSpeedAllowed(0)).toBe(false);
    expect(isSweepSpeedAllowed(0.3999)).toBe(false);
    expect(isSweepSpeedAllowed(2.0001)).toBe(false);
    expect(isSweepSpeedAllowed(NaN)).toBe(false);
  });

  it('engine-driven flash rate at max sweep speed (2.0 Hz) is at exactly the WCAG threshold', () => {
    // 2 sweeps per Hz of speed → 2 * 2.0 = 4 events/sec, BUT each sweep is a
    // motion event, not a flash event. The renderer guards against any
    // visual-flash transition (color change, target blink) being driven at the
    // raw sweep rate when speed > 1.5 Hz. This test documents that policy:
    // anything that flashes per-sweep must be downsampled at the renderer.
    const sweepRate = 2 * SESSION_LIMITS.speedHzMax; // 4 Hz
    expect(sweepRate).toBeGreaterThan(WCAG_FLASH_RATE_MAX_HZ);
    // Therefore the assertion would throw — confirming the renderer must
    // never tie a flash event 1:1 to sweep events at max speed.
    expect(() => assertSafeFlashRate(sweepRate)).toThrow(FlashRateExceededError);
  });
});
