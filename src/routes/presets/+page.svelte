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
  <header class="page-head">
    <span class="section-label">Library</span>
    <h1>Presets</h1>
    <p class="hint">
      Built-in presets are read-only. Duplicate one, tune it in the Controls panel or Settings page,
      then save back here. Custom presets are stored on this device only.
    </p>
  </header>

  <div class="actions-bar">
    <label class="import-btn">
      <span class="plus" aria-hidden="true">+</span>
      Import preset
      <input type="file" accept=".json,application/json" onchange={handleImport} hidden />
    </label>
    {#if importError}
      <span class="err">{importError}</span>
    {/if}
  </div>

  <ul class="catalog">
    {#each $all, idx}{/each}
    {#each $all as p, i}
      <li class:builtin={p.builtin}>
        <div class="seq numeric">{String(i + 1).padStart(2, '0')}</div>

        <div class="meta-col">
          <div class="name-row">
            <span class="name">{p.name}</span>
            {#if p.builtin}<span class="tag">built-in</span>{/if}
            {#if !p.builtin}<span class="tag tag-accent">custom ★</span>{/if}
            {#if p.guide === 'butterfly-hug'}<span class="tag tag-accent">guide</span>{/if}
          </div>
          {#if p.description}
            <p class="desc">{p.description}</p>
          {/if}
          <div class="specs">
            <span class="spec">
              <span class="spec-label">Path</span>
              <span class="spec-val">{p.visual.enabled ? p.visual.path : 'off'}</span>
            </span>
            <span class="spec">
              <span class="spec-label">Speed</span>
              <span class="spec-val numeric">{p.visual.enabled ? `${p.visual.speedHz} Hz` : '—'}</span>
            </span>
            <span class="spec">
              <span class="spec-label">Audio</span>
              <span class="spec-val numeric"
                >{p.audio.enabled ? `${p.audio.frequencyHz} Hz · ${p.audio.voice}` : 'off'}</span
              >
            </span>
            <span class="spec">
              <span class="spec-label">Sets</span>
              <span class="spec-val numeric">
                {p.visual.setLength} × {p.visual.setCount ?? '∞'}
              </span>
            </span>
          </div>
        </div>

        <div class="row-actions">
          <button class="ghost" onclick={() => makeActive(p)}>Use</button>
          <button class="ghost" onclick={() => duplicate(p)}>Duplicate</button>
          <button class="ghost" onclick={() => exportPreset(p)}>Export</button>
          {#if !p.builtin}
            <button class="ghost danger" onclick={() => remove(p)}>Delete</button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  .presets {
    max-width: 1080px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem 2rem;
  }
  .page-head {
    display: grid;
    gap: 0.4rem;
    margin-bottom: 2.5rem;
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

  .actions-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 0.85rem;
    border-bottom: 1px solid var(--rule);
  }
  .import-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: 1px solid var(--rule);
    padding: 0.55rem 1rem;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg);
    cursor: pointer;
    transition:
      border-color var(--dur) var(--ease),
      color var(--dur) var(--ease);
  }
  .import-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
  .plus {
    color: var(--accent);
    font-size: 1rem;
    line-height: 1;
  }
  .err {
    color: var(--danger);
    font-family: var(--font-mono);
    font-size: 0.78rem;
  }

  .catalog {
    list-style: none;
    padding: 0;
    margin: 0;
    border-top: 1px solid var(--rule);
  }
  .catalog li {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    gap: 1.5rem;
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--rule);
    align-items: start;
  }

  .seq {
    font-size: 0.85rem;
    color: var(--accent-dim);
    padding-top: 0.25rem;
  }

  .name-row {
    display: flex;
    align-items: baseline;
    gap: 0.65rem;
    flex-wrap: wrap;
    margin-bottom: 0.25rem;
  }
  .name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--fg);
    letter-spacing: -0.01em;
    font-variation-settings: 'opsz' 24;
  }
  .tag {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.62rem;
    padding: 0.1rem 0.4rem;
    border: 1px solid var(--rule-strong);
    color: var(--fg-dim);
  }
  .tag-accent {
    color: var(--accent);
    border-color: var(--accent-dim);
  }

  .desc {
    color: var(--fg-soft);
    font-size: 0.92rem;
    margin: 0.25rem 0 0.6rem 0;
    line-height: 1.5;
    max-width: 60ch;
  }

  .specs {
    display: flex;
    flex-wrap: wrap;
    gap: 1.3rem;
    margin-top: 0.4rem;
  }
  .spec {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
  }
  .spec-label {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.62rem;
    color: var(--fg-dim);
  }
  .spec-val {
    font-size: 0.82rem;
    color: var(--fg);
  }

  .row-actions {
    display: flex;
    flex-direction: row;
    gap: 0.4rem;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-end;
  }
  .row-actions button {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 0.35rem 0.7rem;
  }

  @media (max-width: 720px) {
    .catalog li {
      grid-template-columns: 2.5rem 1fr;
    }
    .row-actions {
      grid-column: 1 / -1;
      justify-content: flex-start;
      padding-left: 4rem;
    }
  }
</style>
