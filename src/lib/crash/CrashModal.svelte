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
  <div class="card">
    <h1 id="crash-title">Something went wrong.</h1>
    <p class="lede">
      OpenBLS hit an unexpected error. Nothing is uploaded automatically. You can copy this report
      and decide whether to file a GitHub issue.
    </p>

    <details open>
      <summary>Crash report</summary>
      <pre>{reportToText(report)}</pre>
    </details>

    <div class="actions">
      <button class="primary" onclick={copy}>{copied ? 'Copied ✓' : 'Copy report'}</button>
      <button onclick={open}>Open new GitHub issue</button>
      <button onclick={onDismiss}>Dismiss</button>
    </div>

    <p class="hint">
      Please review the report above before filing — we do not collect telemetry, so what we see is
      exactly what you paste.
    </p>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    display: grid;
    place-items: center;
    z-index: 2000;
    padding: 1.5rem;
    overflow-y: auto;
  }
  .card {
    background: var(--panel, #16161a);
    border: 1px solid var(--danger, #c75555);
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 720px;
    width: 100%;
    color: var(--fg, #e6e6e6);
  }
  h1 {
    margin: 0 0 0.5rem 0;
    color: var(--danger, #c75555);
  }
  .lede {
    margin: 0 0 1rem 0;
    color: var(--fg-dim, #9a9aa3);
  }
  details {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--border, #26262c);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    margin-bottom: 1rem;
  }
  summary {
    cursor: pointer;
    font-size: 0.85rem;
    color: var(--fg-dim, #9a9aa3);
  }
  pre {
    margin: 0.5rem 0 0 0;
    overflow-x: auto;
    font-size: 0.78rem;
    max-height: 320px;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  button.primary {
    background: var(--accent, #5b8def);
    color: #fff;
    border-color: var(--accent, #5b8def);
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.8rem;
    margin: 0.75rem 0 0 0;
  }
</style>
