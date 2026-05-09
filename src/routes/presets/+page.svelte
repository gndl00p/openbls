<script lang="ts">
  import { presetsStore } from '$lib/stores/presets.js';
  import { sessionController } from '$lib/stores/session.js';
  import { presetFilename } from '$lib/presets/io.js';
  import type { Preset } from '$lib/presets/schema.js';

  const all = presetsStore.all;
  let importError = $state('');

  function makeActive(p: Preset) {
    sessionController.setPreset(p);
  }

  async function duplicate(p: Preset) {
    const copy = await presetsStore.duplicate(p);
    sessionController.setPreset(copy);
  }

  async function remove(p: Preset) {
    if (p.builtin) return;
    if (!confirm(`Delete preset “${p.name}”?`)) return;
    await presetsStore.remove(p.id);
  }

  function exportPreset(p: Preset) {
    const text = presetsStore.exportToText(p);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = presetFilename(p);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: Event) {
    importError = '';
    const file = (e.currentTarget as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = await presetsStore.importFromText(text);
      sessionController.setPreset(imported);
    } catch (err) {
      importError = (err as Error).message;
    } finally {
      (e.currentTarget as HTMLInputElement).value = '';
    }
  }
</script>

<section class="presets">
  <header>
    <h1>Presets</h1>
    <p class="hint">
      Built-in presets are read-only. Duplicate one, edit in Settings, then save back here. Custom
      presets are stored locally and never leave this device.
    </p>
  </header>

  <div class="actions">
    <label class="import-btn">
      Import preset…
      <input type="file" accept=".json,application/json" onchange={handleImport} hidden />
    </label>
    {#if importError}
      <span class="err">{importError}</span>
    {/if}
  </div>

  <ul>
    {#each $all as p}
      <li class:builtin={p.builtin}>
        <div>
          <div class="name">
            {p.name}
            {#if p.builtin}<span class="tag">built-in</span>{/if}
            {#if p.guide === 'butterfly-hug'}<span class="tag accent">guide</span>{/if}
          </div>
          {#if p.description}<div class="desc">{p.description}</div>{/if}
          <div class="meta">
            {p.visual.enabled ? `${p.visual.path}, ${p.visual.speedHz} Hz` : 'visual off'}
            ·
            {p.audio.enabled ? `audio ${p.audio.frequencyHz} Hz` : 'audio off'}
            ·
            {p.visual.setLength} sweeps × {p.visual.setCount ?? '∞'}
          </div>
        </div>
        <div class="row">
          <button onclick={() => makeActive(p)}>Use</button>
          <button onclick={() => duplicate(p)}>Duplicate</button>
          <button onclick={() => exportPreset(p)}>Export</button>
          {#if !p.builtin}
            <button class="danger" onclick={() => remove(p)}>Delete</button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  .presets {
    max-width: 900px;
    margin: 0 auto;
    padding: 1.5rem;
  }
  header h1 {
    margin: 0 0 0.25rem 0;
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    margin: 0 0 1.5rem 0;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .import-btn {
    background: var(--panel, #16161a);
    border: 1px solid var(--border, #26262c);
    border-radius: 6px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--fg, #e6e6e6);
  }
  .err {
    color: var(--danger, #c75555);
    font-size: 0.85rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  li {
    background: var(--panel, #16161a);
    border: 1px solid var(--border, #26262c);
    border-radius: 8px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }
  .name {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .tag {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: rgba(154, 154, 163, 0.15);
    color: var(--fg-dim, #9a9aa3);
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
  }
  .tag.accent {
    background: rgba(91, 141, 239, 0.18);
    color: var(--accent, #5b8def);
  }
  .desc {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.9rem;
    margin: 0.2rem 0 0.4rem 0;
  }
  .meta {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.8rem;
  }
  .row {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }
  button.danger {
    color: var(--danger, #c75555);
    border-color: var(--danger, #c75555);
  }
</style>
