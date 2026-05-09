<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import SessionCanvas from '$lib/visual/SessionCanvas.svelte';
  import ButterflyHugGuide from '$lib/butterfly-hug/ButterflyHugGuide.svelte';
  import ControlsPanel from '$lib/session/ControlsPanel.svelte';
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import type { Preset } from '$lib/presets/schema.js';

  const sessionState = sessionController.state;
  const allPresets = presetsStore.all;

  let fullscreen = $state(false);
  let surfaceEl: HTMLDivElement | undefined = $state();
  let controlsHidden = $state(false);
  let cursorTimer: ReturnType<typeof setTimeout> | null = null;
  let panelOpen = $state(true);

  function pickPreset(p: Preset) {
    sessionController.setPreset(p);
  }

  function start() {
    sessionController.start();
  }
  function pause() {
    if ($sessionState.status === 'running') sessionController.pause();
    else if ($sessionState.status === 'paused') sessionController.resume();
  }
  function stop() {
    sessionController.stop();
  }

  function toggleFullscreen() {
    if (!surfaceEl) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void surfaceEl.requestFullscreen();
    }
  }

  function handleFullscreenChange() {
    fullscreen = !!document.fullscreenElement;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && $sessionState.status !== 'idle') {
      sessionController.stop();
    }
    if (e.key === 'f' || e.key === 'F') {
      toggleFullscreen();
    }
    if (e.key === ' ') {
      e.preventDefault();
      if ($sessionState.status === 'running' || $sessionState.status === 'paused') {
        pause();
      } else {
        start();
      }
    }
  }

  function showControls() {
    controlsHidden = false;
    if (cursorTimer) clearTimeout(cursorTimer);
    if (fullscreen) {
      cursorTimer = setTimeout(() => {
        controlsHidden = true;
      }, 2500);
    }
  }

  onMount(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKey);
  });

  onDestroy(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    window.removeEventListener('keydown', handleKey);
    if (cursorTimer) clearTimeout(cursorTimer);
    sessionController.stop();
  });

  let preset = $derived($sessionState.preset);
  let running = $derived($sessionState.status === 'running');
  let paused = $derived($sessionState.status === 'paused');
  let displaySet = $derived($sessionState.setIndex + (running || paused ? 1 : 0));
  let displaySweep = $derived(
    Math.min($sessionState.positionInSet + (running || paused ? 1 : 0), preset.visual.setLength)
  );

  function statusLabel(s: string): string {
    return (
      {
        idle: 'Standby',
        running: 'Running',
        paused: 'Paused',
        completed: 'Complete'
      }[s] ?? s
    );
  }
</script>

<div
  class="surface"
  class:fullscreen
  class:hide-cursor={controlsHidden && fullscreen}
  bind:this={surfaceEl}
  onmousemove={showControls}
  role="application"
  aria-label="Bilateral stimulation session"
>
  <div class="canvas-area">
    {#if preset.guide === 'butterfly-hug'}
      <ButterflyHugGuide speedHz={preset.visual.speedHz} />
    {:else}
      <SessionCanvas {preset} {running} />
    {/if}

    {#if !running && !paused && !fullscreen && preset.guide !== 'butterfly-hug'}
      <div class="hero" aria-hidden="true">
        <div class="hero-eyebrow section-label">{statusLabel($sessionState.status)} · {preset.name}</div>
        <div class="hero-title">
          <span class="numeric">{preset.visual.speedHz.toFixed(2)}</span>
          <span class="hz">Hz</span>
        </div>
        <div class="hero-sub">
          <span class="numeric">{preset.visual.setLength}</span>
          <span> sweeps per set</span>
          <span class="dot">·</span>
          <span class="path-name">{preset.visual.path}</span>
        </div>
      </div>
    {/if}

    <ControlsPanel bind:open={panelOpen} />
  </div>

  {#if !controlsHidden || !fullscreen}
    <aside class="console">
      <!-- Status pillar -->
      <div class="cell status">
        <span class="section-label">Status</span>
        <div class="status-row">
          <span class="led" data-state={$sessionState.status}></span>
          <span class="status-text">{statusLabel($sessionState.status)}</span>
        </div>
      </div>

      <!-- Preset pillar -->
      <div class="cell preset">
        <span class="section-label">Preset</span>
        <select
          aria-label="Active preset"
          value={preset.id}
          onchange={(e) => {
            const id = (e.currentTarget as HTMLSelectElement).value;
            const next = $allPresets.find((p) => p.id === id);
            if (next) pickPreset(next);
          }}
        >
          {#each $allPresets as p}
            <option value={p.id}>{p.name}{p.builtin ? '' : ' ★'}</option>
          {/each}
        </select>
      </div>

      <!-- Counters pillar — instrument readout -->
      <div class="cell counters">
        <div class="readout">
          <span class="section-label">Set</span>
          <span class="big-num numeric">{String(displaySet).padStart(2, '0')}</span>
          {#if preset.visual.setCount}
            <span class="frac numeric">/ {preset.visual.setCount}</span>
          {:else}
            <span class="frac">/ ∞</span>
          {/if}
        </div>
        <div class="readout">
          <span class="section-label">Sweep</span>
          <span class="big-num numeric">{String(displaySweep).padStart(2, '0')}</span>
          <span class="frac numeric">/ {preset.visual.setLength}</span>
        </div>
      </div>

      <!-- Buttons pillar -->
      <div class="cell actions">
        {#if $sessionState.status === 'idle' || $sessionState.status === 'completed'}
          <button class="primary" onclick={start}>Start session</button>
        {:else if $sessionState.status === 'running'}
          <button onclick={pause}>Pause</button>
          <button class="danger" onclick={stop}>Stop</button>
        {:else if $sessionState.status === 'paused'}
          <button class="primary" onclick={pause}>Resume</button>
          <button class="danger" onclick={stop}>Stop</button>
        {/if}
        <button class="ghost" onclick={toggleFullscreen}
          >{fullscreen ? 'Exit fullscreen' : 'Fullscreen'}</button
        >
      </div>
    </aside>

    <div class="hints">
      <span><span class="kbd">Esc</span> stop</span>
      <span><span class="kbd">Space</span> pause / resume</span>
      <span><span class="kbd">F</span> fullscreen</span>
    </div>
  {/if}
</div>

<style>
  .surface {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    position: relative;
  }
  .surface.fullscreen {
    background: #000;
  }
  .surface.hide-cursor {
    cursor: none;
  }

  .canvas-area {
    flex: 1;
    min-height: 360px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    /* Clinical reticle / graph-paper hairlines, fade at edges */
    background-image:
      linear-gradient(
        to right,
        transparent calc(50% - 0.5px),
        rgba(212, 160, 74, 0.06) calc(50% - 0.5px),
        rgba(212, 160, 74, 0.06) calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      ),
      linear-gradient(
        to bottom,
        transparent calc(50% - 0.5px),
        rgba(212, 160, 74, 0.04) calc(50% - 0.5px),
        rgba(212, 160, 74, 0.04) calc(50% + 0.5px),
        transparent calc(50% + 0.5px)
      );
    background-size: 100% 100%;
  }
  .surface.fullscreen .canvas-area {
    background-image: none;
  }

  /* Hero idle-state readout — big serif/mono headline that vanishes when running */
  .hero {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 4rem 4.5rem;
    pointer-events: none;
    color: var(--fg);
    z-index: 2;
  }
  .hero-eyebrow {
    margin-bottom: 1rem;
  }
  .hero-title {
    font-family: var(--font-mono);
    font-size: clamp(4rem, 12vw, 9rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
    color: var(--fg);
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
  }
  .hero-title .hz {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 0.32em;
    color: var(--accent);
    letter-spacing: 0;
    font-variation-settings: 'opsz' 14;
  }
  .hero-sub {
    font-family: var(--font-body);
    font-size: 0.95rem;
    color: var(--fg-dim);
    margin-top: 1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .hero-sub .numeric {
    color: var(--fg);
  }
  .hero-sub .dot {
    color: var(--rule-strong);
  }
  .hero-sub .path-name {
    text-transform: capitalize;
  }

  /* ──────────────── Console (bottom instrument bar) ──────────────── */
  .console {
    display: grid;
    grid-template-columns: 12rem 1fr 1.4fr auto;
    align-items: stretch;
    gap: 0;
    border-top: 1px solid var(--rule);
    background: linear-gradient(to bottom, var(--bg-elev), var(--bg));
    padding: 0;
    position: relative;
    z-index: 4;
  }
  .console::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--accent-dim) 25%,
      var(--accent) 50%,
      var(--accent-dim) 75%,
      transparent 100%
    );
    opacity: 0.4;
  }

  .cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.85rem 1.25rem;
    min-height: 76px;
    border-right: 1px solid var(--rule);
  }
  .cell:last-child {
    border-right: none;
  }
  .cell .section-label {
    margin-bottom: 0.3rem;
  }

  .status-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }
  .status-text {
    font-family: var(--font-mono);
    font-size: 0.95rem;
    color: var(--fg);
    letter-spacing: 0.02em;
  }
  .led {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--rule-strong);
    transition: background var(--dur) var(--ease);
  }
  .led[data-state='idle'] {
    background: var(--rule-strong);
  }
  .led[data-state='running'] {
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: pulse-led 1.6s var(--ease) infinite;
  }
  .led[data-state='paused'] {
    background: var(--warn);
  }
  .led[data-state='completed'] {
    background: var(--ok);
  }
  @keyframes pulse-led {
    0%,
    100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  .preset select {
    width: 100%;
    background: var(--bg-dim);
  }

  .counters {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: center;
  }
  .counters .section-label {
    margin-bottom: 0.2rem;
  }
  .readout {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
  }
  .readout > .section-label + .big-num,
  .readout > .big-num {
    line-height: 1;
  }
  .big-num {
    font-family: var(--font-mono);
    font-size: 2.2rem;
    font-weight: 500;
    color: var(--fg);
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .frac {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--fg-dim);
    margin-top: 0.15rem;
  }

  .actions {
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    padding-right: 1.5rem;
  }

  /* Hints strip */
  .hints {
    display: flex;
    gap: 1.25rem;
    padding: 0.5rem 1.5rem 0.7rem 1.5rem;
    background: var(--bg-dim);
    border-top: 1px solid var(--rule-faint);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg-dim);
  }
  .hints span {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  /* ──────────────── Fullscreen overrides ──────────────── */
  .surface.fullscreen .console,
  .surface.fullscreen .hints {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: min(900px, calc(100% - 2rem));
    border: 1px solid var(--rule-strong);
    background: rgba(19, 18, 20, 0.92);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 24px 60px -16px rgba(0, 0, 0, 0.7);
  }
  .surface.fullscreen .hints {
    bottom: -2.6rem;
    background: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
  }
</style>
