import { SESSION_LIMITS } from '../session/types.js';

/**
 * WCAG 2.1 §2.3 (Three Flashes Threshold) guard.
 *
 * The session engine produces sweep events at 2 * speedHz Hz (each L or R sweep
 * is one event). Visual transitions tied to those events — including any color
 * inversion, opacity blink, or new-target flash — must not exceed the threshold.
 *
 * We enforce by capping the maximum effective flash rate any UI surface can
 * derive from the engine. Any code that introduces new flashing visuals must
 * route through this module and call {@link assertSafeFlashRate} or
 * {@link safeFlashRate}.
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
