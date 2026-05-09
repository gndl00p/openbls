<script lang="ts">
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { SESSION_LIMITS } from '$lib/session/types.js';
  import type { Preset } from '$lib/presets/schema.js';

  const sessionState = sessionController.state;

  let { open = $bindable(true) }: { open?: boolean } = $props();
  let savedMessage = $state('');

  // Apply edits by mutating a clone of the active preset and pushing it back
  // through the session controller. The controller restarts the engine/renderer
  // automatically if a session is running.
  function update<K extends keyof Preset>(key: K, value: Preset[K]) {
    const next: Preset = { ...$sessionState.preset, [key]: value } as Preset;
    sessionController.setPreset(next);
  }

  function updateVisual<K extends keyof Preset['visual']>(key: K, value: Preset['visual'][K]) {
    const next: Preset = {
      ...$sessionState.preset,
      visual: { ...$sessionState.preset.visual, [key]: value }
    };
    sessionController.setPreset(next);
  }

  function updateTarget<K extends keyof Preset['visual']['target']>(
    key: K,
    value: Preset['visual']['target'][K]
  ) {
    const next: Preset = {
      ...$sessionState.preset,
      visual: { ...$sessionState.preset.visual, target: { ...$sessionState.preset.visual.target, [key]: value } }
    };
    sessionController.setPreset(next);
  }

  function updateBackground<K extends keyof Preset['visual']['background']>(
    key: K,
    value: Preset['visual']['background'][K]
  ) {
    const next: Preset = {
      ...$sessionState.preset,
      visual: {
        ...$sessionState.preset.visual,
        background: { ...$sessionState.preset.visual.background, [key]: value }
      }
    };
    sessionController.setPreset(next);
  }

  function updateAudio<K extends keyof Preset['audio']>(key: K, value: Preset['audio'][K]) {
    const next: Preset = {
      ...$sessionState.preset,
      audio: { ...$sessionState.preset.audio, [key]: value }
    };
    sessionController.setPreset(next);
  }

  async function saveAsCustom() {
    const proposedName =
      $sessionState.preset.builtin || !$sessionState.preset.name
        ? `${$sessionState.preset.name} (custom)`
        : $sessionState.preset.name;
    const newName = prompt('Name for this preset', proposedName);
    if (!newName) return;
    const draft: Preset = { ...$sessionState.preset, name: newName };
    const saved = await presetsStore.save(draft);
    sessionController.setPreset(saved);
    savedMessage = `Saved as “${saved.name}”.`;
    setTimeout(() => (savedMessage = ''), 2500);
  }

  let preset = $derived($sessionState.preset);
  let visual = $derived(preset.visual);
  let audio = $derived(preset.audio);
</script>

<div class="panel" class:open>
  <button class="toggle" type="button" onclick={() => (open = !open)} aria-expanded={open}>
    {open ? '› Controls' : '‹ Controls'}
  </button>

  {#if open}
    <div class="body">
      <div class="badge">{preset.name}{preset.builtin ? '' : ' ★'}</div>

      <fieldset>
        <legend>Visual</legend>

        <label>
          <span>Path</span>
          <select
            value={visual.path}
            onchange={(e) =>
              updateVisual('path', (e.currentTarget as HTMLSelectElement).value as Preset['visual']['path'])}
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
            <option value="diagonal">Diagonal</option>
            <option value="circular">Circular</option>
            <option value="figure-eight">Figure-eight</option>
          </select>
        </label>

        <label>
          <span>
            Speed <small>{visual.speedHz.toFixed(2)} Hz</small>
          </span>
          <input
            type="range"
            min={SESSION_LIMITS.speedHzMin}
            max={SESSION_LIMITS.speedHzMax}
            step="0.05"
            value={visual.speedHz}
            oninput={(e) =>
              updateVisual('speedHz', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>

        <label>
          <span>
            Set length <small>{visual.setLength} sweeps</small>
          </span>
          <input
            type="range"
            min={SESSION_LIMITS.setLengthMin}
            max={80}
            step="1"
            value={visual.setLength}
            oninput={(e) =>
              updateVisual('setLength', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>

        <label>
          <span>Visual on</span>
          <input
            type="checkbox"
            checked={visual.enabled}
            onchange={(e) => updateVisual('enabled', (e.currentTarget as HTMLInputElement).checked)}
          />
        </label>

        <label>
          <span>Target shape</span>
          <select
            value={visual.target.shape}
            onchange={(e) =>
              updateTarget(
                'shape',
                (e.currentTarget as HTMLSelectElement).value as Preset['visual']['target']['shape']
              )}
          >
            <option value="circle">Circle</option>
            <option value="dot">Dot</option>
            <option value="ring">Ring</option>
          </select>
        </label>

        <label>
          <span>
            Target size <small>{visual.target.sizePx}px</small>
          </span>
          <input
            type="range"
            min="8"
            max="120"
            step="1"
            value={visual.target.sizePx}
            oninput={(e) =>
              updateTarget('sizePx', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>

        <label>
          <span>Target color</span>
          <input
            type="color"
            value={visual.target.color}
            oninput={(e) => updateTarget('color', (e.currentTarget as HTMLInputElement).value)}
          />
        </label>

        <label>
          <span>Background</span>
          <input
            type="color"
            value={visual.background.color}
            oninput={(e) => updateBackground('color', (e.currentTarget as HTMLInputElement).value)}
          />
        </label>

        <label>
          <span>Contrast</span>
          <select
            value={visual.background.contrast}
            onchange={(e) =>
              updateBackground(
                'contrast',
                (e.currentTarget as HTMLSelectElement)
                  .value as Preset['visual']['background']['contrast']
              )}
          >
            <option value="high">High</option>
            <option value="standard">Standard</option>
            <option value="reduced">Reduced</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Audio</legend>

        <label>
          <span>Audio on</span>
          <input
            type="checkbox"
            checked={audio.enabled}
            onchange={(e) => updateAudio('enabled', (e.currentTarget as HTMLInputElement).checked)}
          />
        </label>

        <label>
          <span>Voice</span>
          <select
            value={audio.voice}
            onchange={(e) =>
              updateAudio(
                'voice',
                (e.currentTarget as HTMLSelectElement).value as Preset['audio']['voice']
              )}
          >
            <option value="sine">Sine tone</option>
            <option value="click">Click</option>
          </select>
        </label>

        <label>
          <span>
            Frequency <small>{audio.frequencyHz} Hz</small>
          </span>
          <input
            type="range"
            min={SESSION_LIMITS.frequencyHzMin}
            max={SESSION_LIMITS.frequencyHzMax}
            step="10"
            value={audio.frequencyHz}
            oninput={(e) =>
              updateAudio('frequencyHz', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>

        <label>
          <span>
            Volume <small>{Math.round(audio.volume * 100)}%</small>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.volume}
            oninput={(e) =>
              updateAudio('volume', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>

        <label>
          <span>
            Pan width <small>{Math.round(audio.panWidth * 100)}%</small>
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.panWidth}
            oninput={(e) =>
              updateAudio('panWidth', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </label>
      </fieldset>

      <div class="actions">
        <button onclick={saveAsCustom}>Save as preset</button>
        <a href="/settings" class="link">Full settings →</a>
      </div>

      {#if savedMessage}<div class="ok">{savedMessage}</div>{/if}
      <p class="hint">
        Live changes restart the audio engine briefly. Sweep counter resets when set length changes.
      </p>
    </div>
  {/if}
</div>

<style>
  .panel {
    position: absolute;
    top: 1rem;
    right: 0;
    background: rgba(22, 22, 26, 0.96);
    border: 1px solid var(--border, #26262c);
    border-radius: 12px 0 0 12px;
    border-right: none;
    color: var(--fg, #e6e6e6);
    z-index: 50;
    max-width: min(360px, 90vw);
    backdrop-filter: blur(6px);
  }
  .panel.open {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  }
  .toggle {
    background: transparent;
    border: none;
    color: var(--fg, #e6e6e6);
    padding: 0.6rem 0.9rem;
    font-size: 0.85rem;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border-bottom: 1px solid var(--border, #26262c);
  }
  .panel:not(.open) .toggle {
    border-bottom: none;
    border-radius: 12px 0 0 12px;
  }
  .body {
    padding: 0.75rem 1rem 1rem 1rem;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
  }
  .badge {
    font-size: 0.85rem;
    color: var(--fg-dim, #9a9aa3);
    margin-bottom: 0.5rem;
  }
  fieldset {
    border: 1px solid var(--border, #26262c);
    border-radius: 6px;
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
    margin: 0 0 0.75rem 0;
  }
  legend {
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.06em;
    color: var(--fg-dim, #9a9aa3);
    padding: 0 0.4rem;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin: 0.4rem 0;
    font-size: 0.85rem;
  }
  label span {
    color: var(--fg-dim, #9a9aa3);
    display: flex;
    flex-direction: column;
  }
  label small {
    color: var(--fg, #e6e6e6);
    font-size: 0.75rem;
    margin-top: 0.05rem;
  }
  input[type='range'] {
    width: 160px;
  }
  input[type='color'] {
    width: 60px;
    height: 28px;
    padding: 0;
    border: 1px solid var(--border, #26262c);
    background: transparent;
    cursor: pointer;
  }
  select {
    min-width: 120px;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-top: 0.5rem;
  }
  .link {
    color: var(--accent, #5b8def);
    font-size: 0.85rem;
    text-decoration: none;
    margin-left: auto;
  }
  .link:hover {
    text-decoration: underline;
  }
  .ok {
    color: var(--ok, #4caf50);
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.75rem;
    margin: 0.5rem 0 0 0;
    line-height: 1.4;
  }
</style>
