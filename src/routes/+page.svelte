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
    <ControlsPanel bind:open={panelOpen} />
  </div>

  {#if !controlsHidden || !fullscreen}
    <aside class="controls">
      <div class="row">
        <label>
          Preset
          <select
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
        </label>

        <div class="counters">
          <span>set <strong>{$sessionState.setIndex + (running ? 1 : 0)}</strong></span>
          <span>
            sweep
            <strong>
              {Math.min($sessionState.positionInSet + (running ? 1 : 0), preset.visual.setLength)}
              / {preset.visual.setLength}
            </strong>
          </span>
        </div>
      </div>

      <div class="row buttons">
        {#if $sessionState.status === 'idle' || $sessionState.status === 'completed'}
          <button class="primary" onclick={start}>Start</button>
        {:else if $sessionState.status === 'running'}
          <button onclick={pause}>Pause</button>
          <button onclick={stop}>Stop</button>
        {:else if $sessionState.status === 'paused'}
          <button class="primary" onclick={pause}>Resume</button>
          <button onclick={stop}>Stop</button>
        {/if}
        <button onclick={toggleFullscreen}>{fullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}</button>
      </div>

      <p class="hint">Esc immediately stops. Space toggles play/pause. F toggles fullscreen.</p>
    </aside>
  {/if}
</div>

<style>
  .surface {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #0e0e10;
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
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .controls {
    border-top: 1px solid var(--border, #26262c);
    background: rgba(22, 22, 26, 0.96);
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .surface.fullscreen .controls {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid var(--border, #26262c);
    border-radius: 12px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    width: min(720px, calc(100% - 2rem));
  }
  .row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .buttons {
    gap: 0.5rem;
  }
  .counters {
    display: flex;
    gap: 1rem;
    margin-left: auto;
    font-size: 0.9rem;
    color: var(--fg-dim, #9a9aa3);
  }
  .counters strong {
    color: var(--fg, #e6e6e6);
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
    color: var(--fg-dim, #9a9aa3);
  }
  button.primary {
    background: var(--accent, #5b8def);
    color: #fff;
    border-color: var(--accent, #5b8def);
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.8rem;
    margin: 0;
  }
</style>
