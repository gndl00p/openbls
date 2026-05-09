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

  it('any future per-sweep luminance flash above 1.5 Hz speed must downsample', () => {
    // Smooth target motion is not a flash, so the renderer does not assert
    // against the raw sweep rate. But IF a future feature ties a luminance
    // transition (color invert, target blink) 1:1 to sweep events, that
    // derived flash rate at max speed would be 2 * 2.0 = 4 Hz — above the
    // §2.3 threshold. This test documents the policy: any such code path
    // must call assertSafeFlashRate on its own derived rate and downsample.
    const perSweepFlashRate = 2 * SESSION_LIMITS.speedHzMax; // 4 Hz
    expect(perSweepFlashRate).toBeGreaterThan(WCAG_FLASH_RATE_MAX_HZ);
    expect(() => assertSafeFlashRate(perSweepFlashRate)).toThrow(FlashRateExceededError);
  });
});
