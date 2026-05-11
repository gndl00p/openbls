<script lang="ts">
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { SESSION_LIMITS, AUDIO_VOICES, SESSION_LENGTH_CHOICES } from '$lib/session/types.js';
  import type { Preset } from '$lib/presets/schema.js';
  import PromptModal from '$lib/ui/PromptModal.svelte';

  const sessionState = sessionController.state;

  let working = $state<Preset>(structuredClone($sessionState.preset));
  let savedMessage = $state('');
  let promptOpen = $state(false);
  let promptDefault = $state('');

  $effect(() => {
    if ($sessionState.preset.id !== working.id) {
      working = structuredClone($sessionState.preset);
    }
  });

  function openSaveAsPrompt() {
    promptDefault = working.builtin ? `${working.name} (custom)` : working.name;
    promptOpen = true;
  }

  async function handleSaveAsSubmit(newName: string) {
    const draft: Preset = { ...working, name: newName };
    const saved = await presetsStore.save(draft);
    working = structuredClone(saved);
    sessionController.setPreset(saved);
    savedMessage = `Saved as “${saved.name}”.`;
    setTimeout(() => (savedMessage = ''), 2500);
  }

  function applyToSession() {
    sessionController.setPreset(working);
    savedMessage = 'Applied to session (not persisted).';
    setTimeout(() => (savedMessage = ''), 2500);
  }
</script>

<section class="settings">
  <header class="page-head">
    <span class="section-label">Manual mode</span>
    <h1>Settings</h1>
    <p class="hint">
      Tune every parameter for the active preset. Apply changes to the current session, or save as a
      new custom preset.
    </p>
  </header>

  <article class="card">
    <header class="card-head">
      <span class="section-label">Visual</span>
      <span class="card-meta numeric">{working.visual.path} · {working.visual.speedHz.toFixed(2)} Hz</span>
    </header>

    <div class="grid">
      <label>
        <span class="lab">Enabled</span>
        <input type="checkbox" bind:checked={working.visual.enabled} />
      </label>

      <label>
        <span class="lab">Path</span>
        <select bind:value={working.visual.path}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="diagonal">Diagonal</option>
          <option value="circular">Circular</option>
          <option value="figure-eight">Figure-eight</option>
        </select>
      </label>

      <label>
        <span class="lab">Speed (Hz)</span>
        <input
          type="number"
          step="0.1"
          min={SESSION_LIMITS.speedHzMin}
          max={SESSION_LIMITS.speedHzMax}
          bind:value={working.visual.speedHz}
        />
      </label>

      <label>
        <span class="lab">Set length</span>
        <input
          type="number"
          min={SESSION_LIMITS.setLengthMin}
          max={SESSION_LIMITS.setLengthMax}
          bind:value={working.visual.setLength}
        />
      </label>

      <label>
        <span class="lab">Set count</span>
        <input
          type="number"
          min="1"
          max="50"
          placeholder="∞"
          value={working.visual.setCount ?? ''}
          oninput={(e) => {
            const v = (e.currentTarget as HTMLInputElement).value;
            working.visual.setCount = v ? Math.max(1, Math.min(50, Number(v))) : null;
          }}
        />
      </label>

      <label>
        <span class="lab">Auto-stop after</span>
        <select
          value={String(working.sessionMaxMinutes ?? '')}
          onchange={(e) => {
            const v = (e.currentTarget as HTMLSelectElement).value;
            working.sessionMaxMinutes = v === '' ? null : Number(v);
          }}
        >
          {#each SESSION_LENGTH_CHOICES as choice}
            <option value={choice.value === null ? '' : String(choice.value)}>{choice.label}</option>
          {/each}
        </select>
      </label>

      <label>
        <span class="lab">Target shape</span>
        <select bind:value={working.visual.target.shape}>
          <option value="circle">Circle</option>
          <option value="dot">Dot</option>
          <option value="ring">Ring</option>
        </select>
      </label>

      <label>
        <span class="lab">Target size (px)</span>
        <input type="number" min="8" max="200" bind:value={working.visual.target.sizePx} />
      </label>

      <label>
        <span class="lab">Target color</span>
        <input type="color" bind:value={working.visual.target.color} />
      </label>

      <label>
        <span class="lab">Background color</span>
        <input type="color" bind:value={working.visual.background.color} />
      </label>

      <label>
        <span class="lab">Contrast</span>
        <select bind:value={working.visual.background.contrast}>
          <option value="high">High</option>
          <option value="standard">Standard</option>
          <option value="reduced">Reduced</option>
        </select>
      </label>
    </div>
  </article>

  <article class="card">
    <header class="card-head">
      <span class="section-label">Audio</span>
      <span class="card-meta numeric"
        >{working.audio.enabled
          ? `${working.audio.frequencyHz} Hz · ${working.audio.voice}`
          : 'off'}</span
      >
    </header>

    <div class="grid">
      <label>
        <span class="lab">Enabled</span>
        <input type="checkbox" bind:checked={working.audio.enabled} />
      </label>

      <label>
        <span class="lab">Frequency (Hz)</span>
        <input
          type="number"
          min={SESSION_LIMITS.frequencyHzMin}
          max={SESSION_LIMITS.frequencyHzMax}
          step="10"
          bind:value={working.audio.frequencyHz}
        />
      </label>

      <label>
        <span class="lab">Volume</span>
        <input type="range" min="0" max="1" step="0.01" bind:value={working.audio.volume} />
      </label>

      <label>
        <span class="lab">Pan width</span>
        <input type="range" min="0" max="1" step="0.01" bind:value={working.audio.panWidth} />
      </label>

      <label>
        <span class="lab">Voice</span>
        <select bind:value={working.audio.voice}>
          {#each AUDIO_VOICES as v}
            <option value={v.value} title={v.description}>{v.label}</option>
          {/each}
        </select>
      </label>
    </div>
  </article>

  <footer class="actions">
    <button onclick={applyToSession}>Apply to session</button>
    <button class="primary" onclick={openSaveAsPrompt}>Save as custom preset</button>
    {#if savedMessage}<span class="ok">{savedMessage}</span>{/if}
  </footer>
</section>

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
  .settings {
    max-width: 920px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .page-head {
    display: grid;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }
  .page-head h1 {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    font-weight: 300;
    letter-spacing: -0.02em;
    font-variation-settings: 'opsz' 144, 'SOFT' 25;
  }
  .page-head .hint {
    color: var(--fg-dim);
    max-width: 60ch;
    margin: 0.4rem 0 0 0;
  }

  .card {
    border: 1px solid var(--rule);
    background: linear-gradient(to bottom, rgba(19, 18, 20, 0.5), rgba(12, 12, 13, 0.5));
  }
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.85rem 1.25rem;
    border-bottom: 1px solid var(--rule);
  }
  .card-meta {
    font-size: 0.78rem;
    color: var(--fg-dim);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0;
  }
  .grid label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.85rem 1.25rem;
    border-right: 1px solid var(--rule);
    border-bottom: 1px solid var(--rule);
  }
  /* remove right-border on last column of each row using nth-child math is brittle;
     use a fade-on-overflow approach via background instead */
  .grid label:last-child {
    border-bottom: none;
  }
  .lab {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg-dim);
  }
  .grid input,
  .grid select {
    color: var(--fg);
  }

  .actions {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    padding-top: 0.5rem;
    border-top: 1px solid var(--rule);
    padding: 1rem 0 0 0;
  }
  .ok {
    color: var(--ok);
    font-family: var(--font-mono);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
</style>
