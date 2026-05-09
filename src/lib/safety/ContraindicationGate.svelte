<script lang="ts">
  import { SAFETY_COPY } from './copy.js';

  let { onAcknowledge }: { onAcknowledge: () => void | Promise<void> } = $props();

  let confirmed = $state(false);
  let busy = $state(false);

  async function submit() {
    if (!confirmed || busy) return;
    busy = true;
    try {
      await onAcknowledge();
    } finally {
      busy = false;
    }
  }
</script>

<div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
  <div class="card">
    <h1 id="gate-title">Before you continue</h1>

    <p class="lead">{SAFETY_COPY.disclaimerHeadline}</p>

    <h2>Use clinical judgment about the following before clearing the tool</h2>
    <ul>
      {#each SAFETY_COPY.contraindications as item}
        <li>{item}</li>
      {/each}
    </ul>

    <h2>Mode-specific cautions</h2>
    <p><strong>Visual mode.</strong> {SAFETY_COPY.visualModeCaution}</p>
    <p><strong>Audio mode.</strong> {SAFETY_COPY.audioModeCaution}</p>

    <h2>If a session ever needs to stop</h2>
    <p>Press the Esc key at any time to immediately blank the visual surface and silence audio.</p>

    <h2>Crisis resources for clients</h2>
    <p>{SAFETY_COPY.crisis.headline}</p>
    <ul>
      {#each SAFETY_COPY.crisis.lines as line}
        <li><strong>{line.region}.</strong> {line.text}</li>
      {/each}
    </ul>

    <label class="confirm">
      <input type="checkbox" bind:checked={confirmed} />
      <span>{SAFETY_COPY.acknowledgmentAffirmation}</span>
    </label>

    <button type="button" disabled={!confirmed || busy} onclick={submit}>
      {busy ? 'Continuing…' : 'Continue'}
    </button>
  </div>
</div>

<style>
  .gate {
    position: fixed;
    inset: 0;
    background: rgba(8, 8, 12, 0.95);
    display: grid;
    place-items: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 2rem 1rem;
  }
  .card {
    background: var(--panel, #16161a);
    border: 1px solid var(--border, #26262c);
    border-radius: 12px;
    padding: 2rem;
    max-width: 720px;
    width: 100%;
    color: var(--fg, #e6e6e6);
  }
  h1 {
    margin-top: 0;
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--fg-dim, #9a9aa3);
    margin-top: 1.75rem;
    margin-bottom: 0.5rem;
  }
  .lead {
    font-size: 1rem;
    margin: 0 0 1.5rem 0;
    color: var(--fg, #e6e6e6);
  }
  ul {
    padding-left: 1.25rem;
    margin: 0 0 0.5rem 0;
  }
  li {
    margin: 0.25rem 0;
  }
  .confirm {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    margin: 1.5rem 0 1rem 0;
    padding: 0.75rem;
    border: 1px solid var(--border, #26262c);
    border-radius: 6px;
    cursor: pointer;
  }
  .confirm input {
    margin-top: 0.25rem;
  }
  button {
    background: var(--accent, #5b8def);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.6rem 1.5rem;
    cursor: pointer;
    font-weight: 500;
  }
  button:disabled {
    background: var(--border, #26262c);
    color: var(--fg-dim, #9a9aa3);
    cursor: not-allowed;
  }
</style>
