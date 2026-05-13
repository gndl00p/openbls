<script lang="ts">
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { BUILT_IN_PRESETS } from '$lib/presets/builtin.js';
  import { SESSION_LIMITS, AUDIO_VOICES, type VisualPath } from '$lib/session/types.js';
  import type { Preset } from '$lib/presets/schema.js';
  import PromptModal from '$lib/ui/PromptModal.svelte';

  const sessionState = sessionController.state;
  const allPresets = presetsStore.all;

  let { open = $bindable(true) }: { open?: boolean } = $props();
  let savedMessage = $state('');
  let promptOpen = $state(false);
  let promptDefault = $state('');
  import { GUIDE_BY_KEY } from '$lib/guide/content.js';
  let helpOpen = $state<string | null>(null);
  function toggleHelp(key: string) {
    helpOpen = helpOpen === key ? null : key;
  }

  const SIZE_BUCKETS = [
    { label: 'S', sizePx: 24 },
    { label: 'M', sizePx: 48 },
    { label: 'L', sizePx: 72 },
    { label: 'XL', sizePx: 108 }
  ];
  const BG_SWATCHES = ['#0c0c0d', '#131214', '#1f1d1a', '#0e1320', '#ede8de', '#f5efe2'];
  const TARGET_SWATCHES = ['#ede8de', '#d4a04a', '#7aa6c8', '#c87e6c', '#a884c8', '#8aa073'];
  const PATH_GLYPHS: Record<VisualPath, string> = {
    horizontal: '—',
    vertical: '|',
    diagonal: '⟋',
    circular: '◯',
    'figure-eight': '∞'
  };
  const PATHS: VisualPath[] = ['horizontal', 'vertical', 'diagonal', 'circular', 'figure-eight'];
  const CONTRAST_LEVELS: Preset['visual']['background']['contrast'][] = ['high', 'standard', 'reduced'];
  const SHAPES: Preset['visual']['target']['shape'][] = ['circle', 'dot', 'ring'];
  const SHAPE_GLYPHS: Record<Preset['visual']['target']['shape'], string> = {
    dot: '●',
    ring: '◯',
    circle: '⬤'
  };

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

  function updateSessionMax(value: number | null) {
    const next: Preset = { ...$sessionState.preset, sessionMaxMinutes: value };
    sessionController.setPreset(next);
  }

  function openSaveAsPrompt() {
    promptDefault =
      $sessionState.preset.builtin || !$sessionState.preset.name
        ? `${$sessionState.preset.name} (custom)`
        : $sessionState.preset.name;
    promptOpen = true;
  }

  async function handleSaveAsSubmit(newName: string) {
    const draft: Preset = { ...$sessionState.preset, name: newName };
    const saved = await presetsStore.save(draft);
    sessionController.setPreset(saved);
    flash(`Saved as “${saved.name}”.`);
  }

  function resetToSaved() {
    const current = $sessionState.preset;
    const ref = current.builtin
      ? BUILT_IN_PRESETS.find((p) => p.id === current.id)
      : $allPresets.find((p) => p.id === current.id && !p.builtin);
    if (!ref) {
      const fallback = BUILT_IN_PRESETS[0];
      sessionController.setPreset(fallback);
      flash(`Reset to ${fallback.name}.`);
      return;
    }
    sessionController.setPreset(ref);
    flash(`Reset to saved ${ref.name}.`);
  }

  function selectPreset(p: Preset) {
    sessionController.setPreset(p);
  }

  function flash(msg: string) {
    savedMessage = msg;
    setTimeout(() => (savedMessage = ''), 2500);
  }

  let preset = $derived($sessionState.preset);
  let visual = $derived(preset.visual);
  let audio = $derived(preset.audio);

  const TIME_MIN = 1;
  const TIME_MAX = 60;
  let timeSliderValue = $derived(preset.sessionMaxMinutes ?? 10);
  let timeOff = $derived(preset.sessionMaxMinutes == null);
  function timePctMin(min: number): number {
    return ((min - TIME_MIN) / (TIME_MAX - TIME_MIN)) * 100;
  }

  function speedPct(hz: number): number {
    const { speedHzMin: lo, speedHzMax: hi } = SESSION_LIMITS;
    return ((hz - lo) / (hi - lo)) * 100;
  }
  function freqPct(hz: number): number {
    const { frequencyHzMin: lo, frequencyHzMax: hi } = SESSION_LIMITS;
    return ((hz - lo) / (hi - lo)) * 100;
  }
  function pct01(v: number): number {
    return Math.max(0, Math.min(1, v)) * 100;
  }
</script>

{#snippet helpBtn(key: string)}
  <button
    type="button"
    class="help-btn"
    class:on={helpOpen === key}
    onclick={() => toggleHelp(key)}
    aria-label="What is this?"
    aria-expanded={helpOpen === key}
  >?</button>
{/snippet}

{#snippet helpBox(key: string)}
  {#if helpOpen === key && GUIDE_BY_KEY[key]}
    <div class="help-box" role="note">
      <p class="help-what">{GUIDE_BY_KEY[key].short.what}</p>
      <p class="help-why"><span class="help-label">Why:</span> {GUIDE_BY_KEY[key].short.why}</p>
      {#if GUIDE_BY_KEY[key].short.cite}
        <p class="help-cite">{GUIDE_BY_KEY[key].short.cite}</p>
      {/if}
      <a class="help-more" href={`/guide#${key}`}>Read more in the clinicians' guide →</a>
    </div>
  {/if}
{/snippet}

<aside class="panel" class:open>
  <button class="toggle" type="button" onclick={() => (open = !open)} aria-expanded={open}>
    <span class="toggle-icon" aria-hidden="true">{open ? '›' : '‹'}</span>
    <span class="toggle-label">Controls</span>
  </button>

  {#if open}
    <div class="body">
      <div class="head">
        <div class="head-row">
          <div class="active">
            <span class="section-label">Active</span>
            <span class="active-name">
              {preset.name}{#if !preset.builtin}<span class="star">★</span>{/if}
            </span>
          </div>
          <div class="head-actions">
            <button class="primary sm" type="button" onclick={openSaveAsPrompt}>Save</button>
            <button class="outline sm" type="button" onclick={resetToSaved}>Reset</button>
          </div>
        </div>
        {#if savedMessage}
          <div class="ok">{savedMessage}</div>
        {/if}
      </div>

      <div class="section">
        <div class="section-head">
          <span class="lab">Saved settings</span>
          {@render helpBtn('saved')}
        </div>
        {@render helpBox('saved')}
        <div class="chip-strip" role="group" aria-label="Saved presets">
          {#each $allPresets as p (p.id)}
            <button
              class="chip name-chip"
              class:active={p.id === preset.id}
              type="button"
              onclick={() => selectPreset(p)}
              title={p.description ?? p.name}
            >
              {p.name}{#if !p.builtin}<span class="chip-star" aria-hidden="true">★</span>{/if}
            </button>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="toggles">
          <label class="big-toggle">
            <input
              type="checkbox"
              checked={visual.enabled}
              onchange={(e) => updateVisual('enabled', (e.currentTarget as HTMLInputElement).checked)}
            />
            <span>Visual</span>
            {@render helpBtn('visual')}
          </label>
          <label class="big-toggle">
            <input
              type="checkbox"
              checked={audio.enabled}
              onchange={(e) => updateAudio('enabled', (e.currentTarget as HTMLInputElement).checked)}
            />
            <span>Audio</span>
            {@render helpBtn('audio')}
          </label>
        </div>
        {@render helpBox('visual')}
        {@render helpBox('audio')}
      </div>

      <div class="section">
        <div class="section-head">
          <span class="lab">Time</span>
          {@render helpBtn('time')}
        </div>
        {@render helpBox('time')}
        <div class="time-row">
          <button
            class="chip"
            class:active={timeOff}
            type="button"
            onclick={() => updateSessionMax(timeOff ? 10 : null)}
            aria-pressed={timeOff}
          >
            Off
          </button>
          <div class="slider-wrap time-slider" class:disabled={timeOff}>
            <div class="bubble" style="left: {timePctMin(timeSliderValue)}%">
              {timeOff ? '∞' : `${timeSliderValue} min`}
            </div>
            <input
              class="slider tick-5"
              type="range"
              min={TIME_MIN}
              max={TIME_MAX}
              step="1"
              value={timeSliderValue}
              disabled={timeOff}
              oninput={(e) => updateSessionMax(Number((e.currentTarget as HTMLInputElement).value))}
              style="--fill: {timePctMin(timeSliderValue)}%"
              aria-label="Auto-stop time"
            />
            <div class="rail-caps">
              <span>{TIME_MIN}m</span>
              <span>{TIME_MAX}m</span>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Object speed</span>{@render helpBtn('speed')}</div>
        {@render helpBox('speed')}
        <div class="slider-wrap">
          <div class="bubble" style="left: {speedPct(visual.speedHz)}%">{visual.speedHz.toFixed(2)} Hz</div>
          <input
            class="slider"
            type="range"
            min={SESSION_LIMITS.speedHzMin}
            max={SESSION_LIMITS.speedHzMax}
            step="0.05"
            value={visual.speedHz}
            oninput={(e) =>
              updateVisual('speedHz', Number((e.currentTarget as HTMLInputElement).value))}
            style="--fill: {speedPct(visual.speedHz)}%"
            aria-label="Speed"
          />
          <div class="rail-caps">
            <span>{SESSION_LIMITS.speedHzMin.toFixed(1)}</span>
            <span>{SESSION_LIMITS.speedHzMax.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Set length</span>{@render helpBtn('setLength')}</div>
        {@render helpBox('setLength')}
        <div class="slider-wrap">
          <div class="bubble" style="left: {(visual.setLength / 80) * 100}%">{visual.setLength}</div>
          <input
            class="slider"
            type="range"
            min={SESSION_LIMITS.setLengthMin}
            max="80"
            step="1"
            value={visual.setLength}
            oninput={(e) =>
              updateVisual('setLength', Number((e.currentTarget as HTMLInputElement).value))}
            style="--fill: {(visual.setLength / 80) * 100}%"
            aria-label="Set length"
          />
          <div class="rail-caps">
            <span>1</span>
            <span>80</span>
          </div>
        </div>
      </div>

      <div class="hairline"></div>

      <div class="section">
        <div class="section-head"><span class="lab">Audio tone</span>{@render helpBtn('tone')}</div>
        {@render helpBox('tone')}
        <div class="chip-strip num-strip" role="group" aria-label="Audio voice">
          {#each AUDIO_VOICES as v, i (v.value)}
            <button
              class="chip num-chip"
              class:active={audio.voice === v.value}
              type="button"
              title={`${v.label}. ${v.description}`}
              aria-label={v.label}
              onclick={() => updateAudio('voice', v.value)}
            >
              {i + 1}
            </button>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Frequency</span>{@render helpBtn('frequency')}</div>
        {@render helpBox('frequency')}
        <div class="slider-wrap">
          <div class="bubble" style="left: {freqPct(audio.frequencyHz)}%">{audio.frequencyHz} Hz</div>
          <input
            class="slider"
            type="range"
            min={SESSION_LIMITS.frequencyHzMin}
            max={SESSION_LIMITS.frequencyHzMax}
            step="10"
            value={audio.frequencyHz}
            oninput={(e) =>
              updateAudio('frequencyHz', Number((e.currentTarget as HTMLInputElement).value))}
            style="--fill: {freqPct(audio.frequencyHz)}%"
            aria-label="Frequency"
          />
          <div class="rail-caps">
            <span>{SESSION_LIMITS.frequencyHzMin}</span>
            <span>{SESSION_LIMITS.frequencyHzMax}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Volume</span>{@render helpBtn('volume')}</div>
        {@render helpBox('volume')}
        <div class="slider-wrap">
          <div class="bubble" style="left: {pct01(audio.volume)}%">{Math.round(audio.volume * 100)}%</div>
          <input
            class="slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.volume}
            oninput={(e) =>
              updateAudio('volume', Number((e.currentTarget as HTMLInputElement).value))}
            style="--fill: {pct01(audio.volume)}%"
            aria-label="Volume"
          />
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Pan width</span>{@render helpBtn('panWidth')}</div>
        {@render helpBox('panWidth')}
        <div class="slider-wrap">
          <div class="bubble" style="left: {pct01(audio.panWidth)}%">{Math.round(audio.panWidth * 100)}%</div>
          <input
            class="slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={audio.panWidth}
            oninput={(e) =>
              updateAudio('panWidth', Number((e.currentTarget as HTMLInputElement).value))}
            style="--fill: {pct01(audio.panWidth)}%"
            aria-label="Pan width"
          />
        </div>
      </div>

      <div class="hairline"></div>

      <div class="section">
        <div class="section-head"><span class="lab">Object size</span>{@render helpBtn('size')}</div>
        {@render helpBox('size')}
        <div class="seg">
          {#each SIZE_BUCKETS as b}
            <button
              class="chip seg-chip"
              class:active={visual.target.sizePx === b.sizePx}
              type="button"
              onclick={() => updateTarget('sizePx', b.sizePx)}
              aria-label={`Size ${b.label}`}
            >
              {b.label}
            </button>
          {/each}
          {#if !SIZE_BUCKETS.some((b) => b.sizePx === visual.target.sizePx)}
            <button class="chip seg-chip active" type="button" disabled>
              {visual.target.sizePx}px
            </button>
          {/if}
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Object shape</span>{@render helpBtn('shape')}</div>
        {@render helpBox('shape')}
        <div class="seg">
          {#each SHAPES as s}
            <button
              class="chip seg-chip glyph"
              class:active={visual.target.shape === s}
              type="button"
              onclick={() => updateTarget('shape', s)}
              aria-label={s}
              title={s}
            >
              {SHAPE_GLYPHS[s]}
            </button>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Background</span>{@render helpBtn('background')}</div>
        {@render helpBox('background')}
        <div class="swatch-row">
          {#each BG_SWATCHES as c}
            <button
              class="swatch sq"
              class:active={visual.background.color.toLowerCase() === c.toLowerCase()}
              type="button"
              style="background: {c}"
              onclick={() => updateBackground('color', c)}
              aria-label={`Background ${c}`}
            ></button>
          {/each}
          <label class="swatch sq custom" title="Custom background color">
            <span aria-hidden="true">+</span>
            <input
              type="color"
              value={visual.background.color}
              oninput={(e) => updateBackground('color', (e.currentTarget as HTMLInputElement).value)}
              aria-label="Custom background color"
            />
          </label>
        </div>
        <div class="contrast-sub">
          <span class="lab sub">Contrast</span>
          {@render helpBtn('contrast')}
        </div>
        {@render helpBox('contrast')}
        <div class="seg seg-tight">
          {#each CONTRAST_LEVELS as level}
            <button
              class="chip seg-chip"
              class:active={visual.background.contrast === level}
              type="button"
              onclick={() => updateBackground('contrast', level)}
            >
              {level}
            </button>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Object color</span>{@render helpBtn('targetColor')}</div>
        {@render helpBox('targetColor')}
        <div class="swatch-row">
          {#each TARGET_SWATCHES as c}
            <button
              class="swatch round"
              class:active={visual.target.color.toLowerCase() === c.toLowerCase()}
              type="button"
              style="background: {c}"
              onclick={() => updateTarget('color', c)}
              aria-label={`Target ${c}`}
            ></button>
          {/each}
          <label class="swatch round custom" title="Custom target color">
            <span aria-hidden="true">+</span>
            <input
              type="color"
              value={visual.target.color}
              oninput={(e) => updateTarget('color', (e.currentTarget as HTMLInputElement).value)}
              aria-label="Custom target color"
            />
          </label>
        </div>
      </div>

      <div class="section">
        <div class="section-head"><span class="lab">Object path</span>{@render helpBtn('path')}</div>
        {@render helpBox('path')}
        <div class="seg">
          {#each PATHS as p}
            <button
              class="chip seg-chip glyph"
              class:active={visual.path === p}
              type="button"
              onclick={() => updateVisual('path', p)}
              aria-label={p}
              title={p}
            >
              {PATH_GLYPHS[p]}
            </button>
          {/each}
        </div>
      </div>

      <div class="footer">
        <a href="/settings" class="link">Full settings →</a>
      </div>

      <p class="hint">Changes apply live. The audio briefly restarts when you edit.</p>
    </div>
  {/if}
</aside>

<PromptModal
  bind:open={promptOpen}
  title="Save preset"
  label="Preset name"
  placeholder="e.g. My Standard"
  defaultValue={promptDefault}
  confirmLabel="Save"
  onSubmit={handleSaveAsSubmit}
/>

<style>
  .panel {
    position: absolute;
    top: 1rem;
    right: 0;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
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
  .panel:not(.open) {
    bottom: auto;
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
    padding: 0.9rem 1rem 1rem 1rem;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    width: 360px;
  }

  .head {
    position: sticky;
    top: 0;
    z-index: 2;
    background: rgba(12, 12, 13, 0.92);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    margin: -0.9rem -1rem 0.6rem -1rem;
    padding: 0.9rem 1rem 0.6rem 1rem;
    border-bottom: 1px solid var(--rule);
  }
  .head-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 0.6rem;
  }
  .active {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
  }
  .active-name {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 500;
    color: var(--fg);
    letter-spacing: -0.005em;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .active-name .star {
    color: var(--accent);
    font-size: 0.8rem;
  }
  .head-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  .section {
    margin: 0.7rem 0;
  }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.45rem;
  }
  .lab {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--fg-dim);
  }

  .hairline {
    height: 1px;
    background: var(--rule);
    margin: 0.85rem -1rem;
  }

  /* chip strips (saved presets) */
  .chip-strip {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    padding-bottom: 0.15rem;
  }
  .chip {
    background: transparent;
    border: 1px solid var(--rule-strong);
    color: var(--fg-soft);
    border-radius: 4px;
    padding: 0.4rem 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    cursor: pointer;
    transition:
      background var(--dur-fast) var(--ease),
      color var(--dur-fast) var(--ease),
      border-color var(--dur-fast) var(--ease);
    white-space: nowrap;
  }
  .chip:hover {
    border-color: var(--accent-dim);
    color: var(--fg);
  }
  .chip.active {
    background: var(--accent);
    color: var(--bg);
    border-color: var(--accent);
  }
  .chip:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
  }
  .chip:disabled {
    cursor: default;
    opacity: 0.7;
  }
  .name-chip {
    flex-shrink: 0;
  }
  .chip-star {
    color: inherit;
    margin-left: 0.3rem;
    opacity: 0.8;
  }

  .num-strip {
    flex-wrap: wrap;
    gap: 0.4rem;
    overflow: visible;
  }
  .num-chip {
    width: 2.1rem;
    height: 2.1rem;
    padding: 0;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
  }

  /* segmented + glyph chips */
  .seg {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }
  .seg-tight {
    margin-top: 0.5rem;
  }
  .seg-chip {
    flex: 1;
    min-width: 2.4rem;
    text-align: center;
  }
  .seg-chip.glyph {
    font-family: var(--font-body);
    font-size: 1rem;
    letter-spacing: 0;
    padding: 0.35rem 0.4rem;
    line-height: 1;
  }

  /* sliders */
  .slider-wrap {
    position: relative;
    padding-top: 1.35rem;
    padding-bottom: 0.15rem;
  }
  .bubble {
    position: absolute;
    top: 0;
    transform: translate(-50%, 0);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    color: var(--fg);
    background: var(--bg-elev);
    border: 1px solid var(--rule-strong);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    pointer-events: none;
    white-space: nowrap;
    line-height: 1.2;
  }
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: transparent;
    margin: 0;
    height: 1.3rem;
    cursor: pointer;
  }
  .slider::-webkit-slider-runnable-track {
    height: 2px;
    background: linear-gradient(
      to right,
      var(--accent) 0%,
      var(--accent) var(--fill, 0%),
      var(--rule-strong) var(--fill, 0%),
      var(--rule-strong) 100%
    );
    border-radius: 1px;
  }
  .slider::-moz-range-track {
    height: 2px;
    background: var(--rule-strong);
    border-radius: 1px;
  }
  .slider::-moz-range-progress {
    height: 2px;
    background: var(--accent);
    border-radius: 1px;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--bg-elev);
    border: 2px solid var(--accent);
    margin-top: -6px;
    cursor: pointer;
    transition: transform var(--dur-fast) var(--ease);
  }
  .slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }
  .slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--bg-elev);
    border: 2px solid var(--accent);
    cursor: pointer;
  }
  .slider:focus-visible {
    outline: none;
  }
  .slider:focus-visible::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px rgba(212, 160, 74, 0.3);
  }
  .rail-caps {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--fg-faint);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-top: 0.15rem;
  }

  /* swatches */
  .swatch-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .swatch {
    width: 28px;
    height: 28px;
    border: 1px solid var(--rule-strong);
    cursor: pointer;
    padding: 0;
    background-clip: padding-box;
    transition: box-shadow var(--dur-fast) var(--ease);
    position: relative;
    overflow: hidden;
  }
  .swatch.sq {
    border-radius: 4px;
  }
  .swatch.round {
    border-radius: 50%;
  }
  .swatch:hover {
    box-shadow: 0 0 0 2px var(--rule-strong);
  }
  .swatch.active {
    box-shadow: 0 0 0 2px var(--bg-elev), 0 0 0 4px var(--accent);
  }
  .swatch:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--bg-elev), 0 0 0 4px var(--accent);
  }
  .swatch.custom {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-elev);
    color: var(--fg-dim);
    font-family: var(--font-mono);
    font-size: 0.95rem;
  }
  .swatch.custom input[type='color'] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    padding: 0;
  }

  /* big toggles */
  .toggles {
    display: flex;
    gap: 0.5rem;
  }
  .big-toggle {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--rule-strong);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--fg-soft);
    cursor: pointer;
    transition: border-color var(--dur-fast) var(--ease);
  }
  .big-toggle:hover {
    border-color: var(--accent-dim);
  }
  .big-toggle input[type='checkbox'] {
    accent-color: var(--accent);
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }

  /* head buttons (override global sm) */
  .head-actions .primary,
  .head-actions .outline {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    padding: 0.4rem 0.7rem;
    border-radius: 3px;
    cursor: pointer;
    transition: all var(--dur-fast) var(--ease);
  }
  .head-actions .primary {
    background: var(--accent);
    color: var(--bg);
    border: 1px solid var(--accent);
  }
  .head-actions .primary:hover {
    background: var(--accent-bright);
    border-color: var(--accent-bright);
  }
  .head-actions .outline {
    background: transparent;
    color: var(--fg);
    border: 1px solid var(--rule-strong);
  }
  .head-actions .outline:hover {
    border-color: var(--accent);
    color: var(--accent-bright);
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--rule);
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
    margin-top: 0.4rem;
    color: var(--ok);
    font-size: 0.7rem;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .hint {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--fg-faint);
    line-height: 1.5;
    margin: 0.7rem 0 0 0;
  }
  .section-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--fg-dim);
  }

  /* help button + popover */
  .help-btn {
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 1px solid var(--rule-strong);
    background: transparent;
    color: var(--fg-dim);
    font-family: var(--font-mono);
    font-size: 0.62rem;
    line-height: 1;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.4rem;
    transition: all var(--dur-fast) var(--ease);
    flex-shrink: 0;
  }
  .help-btn:hover {
    color: var(--accent);
    border-color: var(--accent-dim);
  }
  .help-btn.on {
    color: var(--bg);
    background: var(--accent);
    border-color: var(--accent);
  }
  .help-box {
    margin: 0 0 0.5rem 0;
    padding: 0.55rem 0.7rem;
    border: 1px solid var(--rule-strong);
    background: var(--bg-dim);
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 0.74rem;
    color: var(--fg-soft);
    line-height: 1.45;
  }
  .help-what {
    margin: 0;
    color: var(--fg);
  }
  .help-why {
    margin: 0.3rem 0 0 0;
  }
  .help-label {
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--fg-dim);
    margin-right: 0.25rem;
  }
  .help-cite {
    margin: 0.35rem 0 0 0;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .help-more {
    display: inline-block;
    margin-top: 0.45rem;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--accent);
    text-decoration: none;
  }
  .help-more:hover {
    color: var(--accent-bright);
  }

  /* time row: Off chip + slider */
  .time-row {
    display: flex;
    align-items: stretch;
    gap: 0.6rem;
  }
  .time-row > .chip {
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
  }
  .time-slider {
    flex: 1;
  }
  .time-slider.disabled {
    opacity: 0.45;
  }
  .time-slider .bubble {
    color: var(--fg);
  }
  /* 5-minute tick marks: ticks at every 5 across 1-60 range */
  .slider.tick-5 {
    background-image: repeating-linear-gradient(
      to right,
      transparent 0,
      transparent calc((100% / 11.8) - 1px),
      var(--rule-strong) calc((100% / 11.8) - 1px),
      var(--rule-strong) calc(100% / 11.8)
    );
    background-repeat: no-repeat;
    background-position: 0 calc(50% + 4px);
    background-size: 100% 4px;
  }

  /* contrast sub-row inside background section */
  .contrast-sub {
    display: flex;
    align-items: center;
    margin-top: 0.6rem;
    margin-bottom: 0.35rem;
  }
  .lab.sub {
    font-size: 0.62rem;
    color: var(--fg-faint);
  }

  .big-toggle .help-btn {
    margin-left: auto;
  }
</style>
