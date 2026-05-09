<script lang="ts">
  import { sessionController } from '$lib/stores/session.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { SESSION_LIMITS } from '$lib/session/types.js';
  import type { Preset } from '$lib/presets/schema.js';

  const sessionState = sessionController.state;

  // Edits operate on a working copy of the active preset. Save persists as a custom preset.
  let working = $state<Preset>(structuredClone($sessionState.preset));
  let savedMessage = $state('');

  $effect(() => {
    // When the active preset id changes externally, refresh the working copy.
    if ($sessionState.preset.id !== working.id) {
      working = structuredClone($sessionState.preset);
    }
  });

  async function saveAsCustom() {
    const newName =
      working.builtin || !working.name
        ? prompt('Name for this preset', working.builtin ? `${working.name} (custom)` : working.name)
        : working.name;
    if (!newName) return;
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
  <header>
    <h1>Manual settings</h1>
    <p class="hint">
      Tune every parameter for the active preset. Apply changes to the current session, or save as a
      custom preset.
    </p>
  </header>

  <div class="card">
    <h2>Visual</h2>
    <div class="grid">
      <label>
        Enabled
        <input type="checkbox" bind:checked={working.visual.enabled} />
      </label>

      <label>
        Path
        <select bind:value={working.visual.path}>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
          <option value="diagonal">Diagonal</option>
          <option value="circular">Circular</option>
          <option value="figure-eight">Figure-eight</option>
        </select>
      </label>

      <label>
        Speed (Hz)
        <input
          type="number"
          step="0.1"
          min={SESSION_LIMITS.speedHzMin}
          max={SESSION_LIMITS.speedHzMax}
          bind:value={working.visual.speedHz}
        />
      </label>

      <label>
        Set length (sweeps)
        <input
          type="number"
          min={SESSION_LIMITS.setLengthMin}
          max={SESSION_LIMITS.setLengthMax}
          bind:value={working.visual.setLength}
        />
      </label>

      <label>
        Set count
        <input
          type="number"
          min="1"
          max="50"
          placeholder="open-ended"
          value={working.visual.setCount ?? ''}
          oninput={(e) => {
            const v = (e.currentTarget as HTMLInputElement).value;
            working.visual.setCount = v ? Math.max(1, Math.min(50, Number(v))) : null;
          }}
        />
      </label>

      <label>
        Target shape
        <select bind:value={working.visual.target.shape}>
          <option value="circle">Circle</option>
          <option value="dot">Dot</option>
          <option value="ring">Ring</option>
        </select>
      </label>

      <label>
        Target size (px)
        <input type="number" min="8" max="200" bind:value={working.visual.target.sizePx} />
      </label>

      <label>
        Target color
        <input type="color" bind:value={working.visual.target.color} />
      </label>

      <label>
        Background color
        <input type="color" bind:value={working.visual.background.color} />
      </label>

      <label>
        Contrast
        <select bind:value={working.visual.background.contrast}>
          <option value="high">High</option>
          <option value="standard">Standard</option>
          <option value="reduced">Reduced</option>
        </select>
      </label>
    </div>
  </div>

  <div class="card">
    <h2>Audio</h2>
    <div class="grid">
      <label>
        Enabled
        <input type="checkbox" bind:checked={working.audio.enabled} />
      </label>

      <label>
        Sync with visual
        <input type="checkbox" bind:checked={working.audio.syncWithVisual} />
      </label>

      <label>
        Frequency (Hz)
        <input
          type="number"
          min={SESSION_LIMITS.frequencyHzMin}
          max={SESSION_LIMITS.frequencyHzMax}
          step="10"
          bind:value={working.audio.frequencyHz}
        />
      </label>

      <label>
        Volume
        <input type="range" min="0" max="1" step="0.01" bind:value={working.audio.volume} />
      </label>

      <label>
        Pan width
        <input type="range" min="0" max="1" step="0.01" bind:value={working.audio.panWidth} />
      </label>

      <label>
        Voice
        <select bind:value={working.audio.voice}>
          <option value="sine">Sine tone</option>
          <option value="click">Click</option>
        </select>
      </label>
    </div>
  </div>

  <footer class="actions">
    <button onclick={applyToSession}>Apply to session</button>
    <button class="primary" onclick={saveAsCustom}>Save as custom preset</button>
    {#if savedMessage}<span class="ok">{savedMessage}</span>{/if}
  </footer>
</section>

<style>
  .settings {
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  header h1 {
    margin: 0 0 0.25rem 0;
    font-size: 1.4rem;
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    margin: 0;
  }
  .card {
    background: var(--panel, #16161a);
    border: 1px solid var(--border, #26262c);
    border-radius: 8px;
    padding: 1rem 1.25rem;
  }
  .card h2 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--fg-dim, #9a9aa3);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem 1rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: var(--fg-dim, #9a9aa3);
  }
  input,
  select {
    color: var(--fg, #e6e6e6);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  button.primary {
    background: var(--accent, #5b8def);
    color: #fff;
    border-color: var(--accent, #5b8def);
  }
  .ok {
    color: var(--ok, #4caf50);
    font-size: 0.85rem;
  }
</style>
