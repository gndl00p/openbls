<script lang="ts">
  import { githubIssueUrl, reportToText, type CrashReport } from './report.js';

  let { report, onDismiss }: { report: CrashReport; onDismiss: () => void } = $props();

  let copied = $state(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(reportToText(report));
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      copied = false;
    }
  }

  function open() {
    const url = githubIssueUrl(report);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }
</script>

<div class="overlay" role="alertdialog" aria-modal="true" aria-labelledby="crash-title">
  <article class="card">
    <header class="head">
      <span class="section-label">Error · captured locally</span>
      <h1 id="crash-title">Something went wrong.</h1>
      <p class="lede">
        OpenBLS hit an unexpected error. Nothing is uploaded automatically. Copy the report and
        decide whether to file a GitHub issue.
      </p>
    </header>

    <details open>
      <summary>
        <span class="section-label">Crash report</span>
      </summary>
      <pre>{reportToText(report)}</pre>
    </details>

    <div class="actions">
      <button class="primary" onclick={copy}>{copied ? 'Copied ✓' : 'Copy report'}</button>
      <button onclick={open}>Open new GitHub issue</button>
      <button class="ghost" onclick={onDismiss}>Dismiss</button>
    </div>

    <p class="hint">
      Please review the report above before filing — we do not collect telemetry, so we only see
      what you choose to paste.
    </p>
  </article>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(184, 95, 66, 0.12), transparent 50%),
      rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: grid;
    place-items: center;
    z-index: 2000;
    padding: 1.5rem;
    overflow-y: auto;
  }
  .card {
    background: var(--bg-elev);
    border: 1px solid var(--danger);
    border-top-width: 3px;
    border-top-color: var(--danger);
    padding: 1.75rem;
    max-width: 720px;
    width: 100%;
    color: var(--fg);
    box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7);
  }
  .head {
    margin-bottom: 1rem;
  }
  .head .section-label {
    color: var(--danger);
    margin-bottom: 0.4rem;
    display: block;
  }
  h1 {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 2rem;
    letter-spacing: -0.02em;
    color: var(--fg);
    margin: 0 0 0.6rem 0;
  }
  .lede {
    color: var(--fg-soft);
    margin: 0;
  }
  details {
    background: var(--bg-dim);
    border: 1px solid var(--rule);
    padding: 0.6rem 0.85rem;
    margin: 1rem 0;
  }
  summary {
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary::before {
    content: '▸';
    font-size: 0.6rem;
    color: var(--accent);
    margin-right: 0.5rem;
    display: inline-block;
    transition: transform var(--dur) var(--ease);
  }
  details[open] summary::before {
    transform: rotate(90deg);
  }
  pre {
    margin: 0.6rem 0 0 0;
    overflow-x: auto;
    font-size: 0.74rem;
    max-height: 320px;
    color: var(--fg-soft);
    font-family: var(--font-mono);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .hint {
    color: var(--fg-dim);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0.85rem 0 0 0;
    line-height: 1.55;
  }
</style>
