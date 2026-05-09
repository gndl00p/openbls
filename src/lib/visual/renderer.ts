import type { VisualConfig } from '../session/types.js';
import { pathPoint } from './paths.js';
import { isSweepSpeedAllowed } from './wcag.js';

export interface RendererStartOptions {
  speedHz: number;
  setLength: number;
  config: VisualConfig;
}

export interface VisualClock {
  /** Returns the current time in seconds. Replaceable for tests. */
  now(): number;
}

const realClock: VisualClock = {
  now: () => performance.now() / 1000
};

/**
 * Canvas 2D renderer. Drives target motion off a clock — independent of the
 * audio engine so a frame stutter doesn't desync, and so the audio engine can
 * be paused while the renderer continues showing the static guide / paused
 * state.
 */
export class VisualRenderer {
  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #clock: VisualClock;
  #opts: RendererStartOptions | null = null;
  #startTime = 0;
  #rafId: number | null = null;

  constructor(canvas: HTMLCanvasElement, clock: VisualClock = realClock) {
    this.#canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable.');
    }
    this.#ctx = ctx;
    this.#clock = clock;
  }

  start(opts: RendererStartOptions): void {
    if (!isSweepSpeedAllowed(opts.speedHz)) {
      throw new Error(`Sweep speed ${opts.speedHz} Hz is outside the allowed range.`);
    }
    // The current renderer draws smooth motion only — no per-sweep luminance
    // flashes — so the WCAG §2.3 guard does not apply to sweep events here.
    // Any future visual effect tied to sweep boundaries (target blink, color
    // invert) must call assertSafeFlashRate() on its own derived rate, which
    // for speeds above 1.5 Hz means downsampling against the sweep stream.
    this.#opts = { ...opts, config: { ...opts.config } };
    this.#startTime = this.#clock.now();
    this.#scheduleFrame();
  }

  stop(): void {
    if (this.#rafId !== null) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
    this.#opts = null;
    this.#clear();
  }

  /** Update visual params live. Effective on next frame. */
  update(config: Partial<VisualConfig>): void {
    if (!this.#opts) return;
    this.#opts.config = { ...this.#opts.config, ...config };
  }

  /** Force a redraw immediately. Used by the harness to drive deterministic frames in tests. */
  renderNow(): void {
    if (!this.#opts) {
      this.#clear();
      return;
    }
    const { sweepIndex, phase } = this.#sweepState();
    this.#draw(sweepIndex, phase);
  }

  #scheduleFrame(): void {
    this.#rafId = requestAnimationFrame(() => {
      this.renderNow();
      this.#scheduleFrame();
    });
  }

  #sweepState(): { sweepIndex: number; phase: number } {
    if (!this.#opts) return { sweepIndex: 0, phase: 0 };
    const sweepDuration = 1 / (2 * this.#opts.speedHz);
    const elapsed = Math.max(0, this.#clock.now() - this.#startTime);
    const totalSweeps = Math.floor(elapsed / sweepDuration);
    const phase = (elapsed % sweepDuration) / sweepDuration;
    return { sweepIndex: totalSweeps, phase };
  }

  #draw(sweepIndex: number, phase: number): void {
    if (!this.#opts) return;
    const cfg = this.#opts.config;
    const ctx = this.#ctx;
    const w = this.#canvas.width;
    const h = this.#canvas.height;

    ctx.fillStyle = cfg.background.color;
    ctx.fillRect(0, 0, w, h);

    if (!cfg.enabled) {
      // Visual disabled (e.g. audio-only preset). Draw a neutral cross-hair so the user knows
      // the surface is intentionally inert, not crashed.
      ctx.strokeStyle = withOpacity(cfg.target.color, 0.15);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 8, h / 2);
      ctx.lineTo(w / 2 + 8, h / 2);
      ctx.moveTo(w / 2, h / 2 - 8);
      ctx.lineTo(w / 2, h / 2 + 8);
      ctx.stroke();
      return;
    }

    const { x: nx, y: ny } = pathPoint(cfg.path, sweepIndex, phase);
    // Map normalized [-1, 1] to canvas with margin so the target never clips.
    const margin = cfg.target.sizePx + 12;
    const cx = w / 2 + nx * (w / 2 - margin);
    const cy = h / 2 + ny * (h / 2 - margin);

    drawTarget(ctx, cx, cy, cfg);
  }

  #clear(): void {
    const w = this.#canvas.width;
    const h = this.#canvas.height;
    this.#ctx.clearRect(0, 0, w, h);
  }
}

function drawTarget(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  cfg: VisualConfig
): void {
  const r = cfg.target.sizePx / 2;
  ctx.fillStyle = cfg.target.color;
  ctx.strokeStyle = cfg.target.color;
  ctx.lineWidth = Math.max(2, r * 0.25);

  ctx.beginPath();
  switch (cfg.target.shape) {
    case 'circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'dot':
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'ring':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }
}

function withOpacity(color: string, alpha: number): string {
  // Best-effort: prepend rgba if the color is hex; otherwise use color unchanged.
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) {
    let r = 0;
    let g = 0;
    let b = 0;
    const c = color.slice(1);
    if (c.length === 3) {
      r = parseInt(c[0] + c[0], 16);
      g = parseInt(c[1] + c[1], 16);
      b = parseInt(c[2] + c[2], 16);
    } else {
      r = parseInt(c.slice(0, 2), 16);
      g = parseInt(c.slice(2, 4), 16);
      b = parseInt(c.slice(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}
