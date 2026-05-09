import { SESSION_LIMITS } from '../session/types.js';

/**
 * WCAG 2.1 §2.3 (Three Flashes Threshold) guard.
 *
 * Smooth motion (a target sweeping across the screen) is NOT a flash and is
 * not subject to this threshold — the guideline targets luminance transitions,
 * not lateral motion. The session can run up to 2.0 Hz sweep speed safely
 * with the current renderer.
 *
 * This guard exists to police any FUTURE code that introduces a visual
 * transition tied to sweep boundaries (target opacity blink, full-screen
 * color invert, on-sweep flash). At max sweep speed (2.0 Hz → 4 sweeps/sec),
 * such a 1:1 effect would exceed the threshold and must be downsampled or
 * smoothed before reaching the renderer. Any such code path must call
 * {@link assertSafeFlashRate} or {@link safeFlashRate} on its derived rate.
 */
export const WCAG_FLASH_RATE_MAX_HZ = SESSION_LIMITS.flashRateMaxHz;

export class FlashRateExceededError extends Error {
  constructor(
    public readonly proposedHz: number,
    public readonly limitHz: number = WCAG_FLASH_RATE_MAX_HZ
  ) {
    super(
      `Proposed flash rate ${proposedHz.toFixed(3)} Hz exceeds WCAG 2.1 §2.3 limit of ${limitHz} Hz.`
    );
    this.name = 'FlashRateExceededError';
  }
}

/** Throws if proposed flash rate exceeds the WCAG threshold. */
export function assertSafeFlashRate(proposedHz: number): void {
  if (!Number.isFinite(proposedHz) || proposedHz < 0) {
    throw new FlashRateExceededError(proposedHz);
  }
  if (proposedHz > WCAG_FLASH_RATE_MAX_HZ) {
    throw new FlashRateExceededError(proposedHz);
  }
}

/** Clamps a proposed flash rate to the safe threshold. */
export function safeFlashRate(proposedHz: number): number {
  if (!Number.isFinite(proposedHz) || proposedHz < 0) return 0;
  return Math.min(proposedHz, WCAG_FLASH_RATE_MAX_HZ);
}

/**
 * Movement is not flashing — but a sweep speed of 2.0 Hz means the target
 * crosses centerline 4 times per second. That is below standard photic-trigger
 * thresholds (which require luminance flashing, not lateral motion) but we
 * still enforce the documented session ceiling here so any change to
 * SESSION_LIMITS in one place is enforced everywhere.
 */
export function isSweepSpeedAllowed(speedHz: number): boolean {
  return (
    Number.isFinite(speedHz) &&
    speedHz >= SESSION_LIMITS.speedHzMin &&
    speedHz <= SESSION_LIMITS.speedHzMax
  );
}
