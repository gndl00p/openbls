<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { VisualRenderer } from './renderer.js';
  import type { Preset } from '../presets/schema.js';

  let {
    preset,
    running
  }: {
    preset: Preset;
    running: boolean;
  } = $props();

  let canvas: HTMLCanvasElement | undefined = $state();
  let renderer: VisualRenderer | null = null;
  let resizeObserver: ResizeObserver | null = null;

  function fit() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    if (renderer) renderer.renderNow();
  }

  onMount(() => {
    if (!canvas) return;
    renderer = new VisualRenderer(canvas);
    fit();
    resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(canvas);
  });

  onDestroy(() => {
    renderer?.stop();
    resizeObserver?.disconnect();
  });

  // React to preset / running changes.
  $effect(() => {
    if (!renderer) return;
    if (running && preset.visual.enabled) {
      renderer.start({
        speedHz: preset.visual.speedHz,
        setLength: preset.visual.setLength,
        config: preset.visual
      });
    } else {
      renderer.stop();
      // Render one neutral frame so the canvas is not blank.
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = preset.visual.background.color;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  });
</script>

<canvas bind:this={canvas} aria-label="Bilateral stimulation visual surface"></canvas>

<style>
  canvas {
    display: block;
    width: 100%;
    height: 100%;
    background: #0e0e10;
  }
</style>
