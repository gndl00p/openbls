<script lang="ts">
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { SESSION_LIMITS } from '$lib/session/types.js';
  import type { Preset } from '$lib/presets/schema.js';

  const sessionState = sessionController.state;

  let { open = $bindable(true) }: { open?: boolean } = $props();
  let savedMessage = $state('');

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

<aside class="panel" class:open>
  <button class="toggle" type="button" onclick={() => (open = !open)} aria-expanded={open}>
    <span class="toggle-icon" aria-hidden="true">{open ? '›' : '‹'}</span>
    <span class="toggle-label">Controls</span>
  </button>

  {#if open}
    <div class="body">
      <div class="head">
        <span class="section-label">Active</span>
        <div class="active-name">
          {preset.name}{#if !preset.builtin}<span class="star">★</span>{/if}
        </div>
        {#if preset.description}
          <p class="active-desc">{preset.description}</p>
        {/if}
      </div>

      <div class="hairline"></div>

      <fieldset>
        <legend>Visual</legend>

        <div class="row toggle-row">
          <span>Visual on</span>
          <label class="switch">
            <input
              type="checkbox"
              checked={visual.enabled}
              onchange={(e) => updateVisual('enabled', (e.currentTarget as HTMLInputElement).checked)}
            />
          </label>
        </div>

        <div class="row stack">
          <span class="lab">Path</span>
          <select
            value={visual.path}
            onchange={(e) =>
              updateVisual('path', (e.currentTarget as HTMLSelectElement).value as Preset['visual']['path'])}
          >
            <option value="horizontal">Horizontal —</option>
            <option value="vertical">Vertical |</option>
            <option value="diagonal">Diagonal ⟋</option>
            <option value="circular">Circular ◯</option>
            <option value="figure-eight">Figure-eight ∞</option>
          </select>
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Speed</span>
            <span class="readout-small numeric">{visual.speedHz.toFixed(2)} Hz</span>
          </div>
          <input
            type="range"
            min={SESSION_LIMITS.speedHzMin}
            max={SESSION_LIMITS.speedHzMax}
            step="0.05"
            value={visual.speedHz}
            oninput={(e) =>
              updateVisual('speedHz', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Set length</span>
            <span class="readout-small numeric">{visual.setLength}</span>
          </div>
          <input
            type="range"
            min={SESSION_LIMITS.setLengthMin}
            max={80}
            step="1"
            value={visual.setLength}
            oninput={(e) =>
              updateVisual('setLength', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>

        <div class="row stack">
          <span class="lab">Target</span>
          <div class="row inline">
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
            <input
              type="color"
              value={visual.target.color}
              oninput={(e) => updateTarget('color', (e.currentTarget as HTMLInputElement).value)}
              aria-label="Target color"
            />
          </div>
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Target size</span>
            <span class="readout-small numeric">{visual.target.sizePx}px</span>
          </div>
          <input
            type="range"
            min="8"
            max="120"
            step="1"
            value={visual.target.sizePx}
            oninput={(e) =>
              updateTarget('sizePx', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>

        <div class="row stack">
          <span class="lab">Background</span>
          <div class="row inline">
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
            <input
              type="color"
              value={visual.background.color}
              oninput={(e) => updateBackground('color', (e.currentTarget as HTMLInputElement).value)}
              aria-label="Background color"
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>Audio</legend>

        <div class="row toggle-row">
          <span>Audio on</span>
          <label class="switch">
            <input
              type="checkbox"
              checked={audio.enabled}
              onchange={(e) => updateAudio('enabled', (e.currentTarget as HTMLInputElement).checked)}
            />
          </label>
        </div>

        <div class="row stack">
          <span class="lab">Voice</span>
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
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Frequency</span>
            <span class="readout-small numeric">{audio.frequencyHz} Hz</span>
          </div>
          <input
            type="range"
            min={SESSION_LIMITS.frequencyHzMin}
            max={SESSION_LIMITS.frequencyHzMax}
            step="10"
            value={audio.frequencyHz}
            oninput={(e) =>
              updateAudio('frequencyHz', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Volume</span>
            <span class="readout-small numeric">{Math.round(audio.volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.volume}
            oninput={(e) =>
              updateAudio('volume', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>

        <div class="row stack">
          <div class="row label-row">
            <span class="lab">Pan width</span>
            <span class="readout-small numeric">{Math.round(audio.panWidth * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.panWidth}
            oninput={(e) =>
              updateAudio('panWidth', Number((e.currentTarget as HTMLInputElement).value))}
          />
        </div>
      </fieldset>

      <div class="footer">
        <button class="primary" onclick={saveAsCustom}>Save as preset</button>
        <a href="/settings" class="link">Full settings →</a>
        {#if savedMessage}
          <div class="ok">{savedMessage}</div>
        {/if}
      </div>

      <p class="hint">
        Live changes restart the audio engine briefly. Sweep counter resets on set-length change.
      </p>
    </div>
  {/if}
</aside>

<style>
  .panel {
    position: absolute;
    top: 1rem;
    right: 0;
    background: linear-gradient(to bottom, rgba(19, 18, 20, 0.96), rgba(12, 12, 13, 0.96));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-left: 1px solid var(--rule-strong);
    border-top: 1px solid var(--rule-strong);
    border-bottom: 1px solid var(--rule-strong);
    color: var(--fg);
    z-index: 10;
    max-width: min(360px, 92vw);
    box-shadow: -10px 0 30px -6px rgba(0, 0, 0, 0.5);
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--rule);
    color: var(--fg-soft);
    padding: 0.7rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color var(--dur) var(--ease);
  }
  .panel:not(.open) .toggle {
    border-bottom: none;
  }
  .toggle:hover {
    color: var(--accent);
    border-color: var(--rule);
  }
  .toggle:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: -2px;
  }
  .toggle-icon {
    color: var(--accent);
    font-size: 1rem;
  }

  .body {
    padding: 1rem 1.1rem 1.1rem 1.1rem;
    max-height: calc(100vh - 9rem);
    overflow-y: auto;
    width: 360px;
  }

  .head {
    margin-bottom: 0.85rem;
  }
  .head .section-label {
    margin-bottom: 0.25rem;
    display: block;
  }
  .active-name {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--fg);
    letter-spacing: -0.005em;
    font-variation-settings: 'opsz' 18;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .active-name .star {
    color: var(--accent);
    font-size: 0.85rem;
  }
  .active-desc {
    font-size: 0.78rem;
    color: var(--fg-dim);
    line-height: 1.45;
    margin: 0.4rem 0 0 0;
  }

  .hairline {
    height: 1px;
    background: var(--rule);
    margin: 0.85rem -1.1rem;
  }

  fieldset {
    border: none;
    padding: 0;
    margin: 0 0 1rem 0;
  }
  legend {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    color: var(--accent);
    padding: 0;
    margin-bottom: 0.65rem;
    width: 100%;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 0.4rem;
  }

  .row {
    display: flex;
    align-items: center;
    margin: 0.5rem 0;
  }
  .row.stack {
    flex-direction: column;
    align-items: stretch;
    gap: 0.35rem;
  }
  .row.label-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin: 0;
  }
  .row.inline {
    flex-direction: row;
    gap: 0.5rem;
  }
  .row.inline > select {
    flex: 1;
  }

  .toggle-row {
    justify-content: space-between;
  }
  .toggle-row > span {
    color: var(--fg-soft);
  }

  .lab {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg-dim);
  }
  .readout-small {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    color: var(--fg);
  }

  .switch {
    cursor: pointer;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--rule);
  }
  .footer .primary {
    flex: 1;
    min-width: 0;
  }
  .link {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    text-decoration: none;
    white-space: nowrap;
  }
  .link:hover {
    color: var(--accent-bright);
  }
  .ok {
    color: var(--ok);
    font-size: 0.78rem;
    width: 100%;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .hint {
    font-family: var(--font-mono);
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--fg-faint);
    line-height: 1.55;
    margin: 0.85rem 0 0 0;
  }
</style>
