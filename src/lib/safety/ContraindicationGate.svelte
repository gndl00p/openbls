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
  <article class="paper">
    <header class="paper-head">
      <div class="meta">
        <span class="seq">No. 01</span>
        <span class="dot">·</span>
        <span>Pre-session waiver</span>
        <span class="dot">·</span>
        <span>OpenBLS v0.1</span>
      </div>
      <h1 id="gate-title">
        Before<br />you continue.
      </h1>
      <p class="lede">{SAFETY_COPY.disclaimerHeadline}</p>
    </header>

    <section>
      <span class="section-label">§ 1 &nbsp; Clinical judgment required</span>
      <ol class="contra">
        {#each SAFETY_COPY.contraindications as item, i}
          <li>
            <span class="num numeric">{String(i + 1).padStart(2, '0')}</span>
            <span>{item}</span>
          </li>
        {/each}
      </ol>
    </section>

    <section class="cautions">
      <span class="section-label">§ 2 &nbsp; Mode-specific cautions</span>
      <div class="caut-grid">
        <div>
          <span class="mode-tag">Visual</span>
          <p>{SAFETY_COPY.visualModeCaution}</p>
        </div>
        <div>
          <span class="mode-tag">Audio</span>
          <p>{SAFETY_COPY.audioModeCaution}</p>
        </div>
      </div>
    </section>

    <section>
      <span class="section-label">§ 3 &nbsp; Stopping a session</span>
      <p class="prose">
        Press <span class="kbd">Esc</span> at any time to immediately blank the visual surface and silence
        audio. Press <span class="kbd">Space</span> to pause and resume.
      </p>
    </section>

    <section>
      <span class="section-label">§ 4 &nbsp; Crisis resources</span>
      <p class="prose">{SAFETY_COPY.crisis.headline}</p>
      <ul class="crisis">
        {#each SAFETY_COPY.crisis.lines as line}
          <li>
            <span class="region">{line.region}</span>
            <span class="rule"></span>
            <span>{line.text}</span>
          </li>
        {/each}
      </ul>
    </section>

    <footer class="affirm">
      <label>
        <input type="checkbox" bind:checked={confirmed} />
        <span>{SAFETY_COPY.acknowledgmentAffirmation}</span>
      </label>
      <button type="button" class="primary" disabled={!confirmed || busy} onclick={submit}>
        {busy ? 'Continuing…' : 'Continue →'}
      </button>
    </footer>
  </article>
</div>

<style>
  .gate {
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse at 50% 0%, rgba(212, 160, 74, 0.08), transparent 60%),
      rgba(8, 8, 10, 0.9);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    display: grid;
    place-items: center;
    z-index: 1000;
    overflow-y: auto;
    padding: 3rem 1.5rem;
  }
  .paper {
    background: var(--paper);
    color: var(--paper-ink);
    width: 100%;
    max-width: 720px;
    padding: 3rem 3rem 2.25rem 3rem;
    box-shadow:
      0 0 0 1px rgba(0, 0, 0, 0.4),
      0 30px 80px -20px rgba(0, 0, 0, 0.6),
      0 8px 18px -8px rgba(0, 0, 0, 0.5);
    /* Subtle paper texture */
    background-image:
      url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.10  0 0 0 0 0.09  0 0 0 0 0.07  0 0 0 0.03 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>"),
      linear-gradient(180deg, #efeae0, #e6e0d3);
  }

  .paper-head {
    border-bottom: 1px solid rgba(26, 24, 20, 0.18);
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: rgba(26, 24, 20, 0.55);
    display: flex;
    gap: 0.6rem;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  .meta .seq {
    color: rgba(26, 24, 20, 0.85);
  }
  .meta .dot {
    color: rgba(26, 24, 20, 0.3);
  }

  h1 {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(2.5rem, 5vw, 3.6rem);
    line-height: 0.95;
    letter-spacing: -0.025em;
    font-variation-settings: 'opsz' 144, 'SOFT' 30, 'WONK' 1;
    color: var(--paper-ink);
    margin-bottom: 1.25rem;
  }
  .lede {
    font-family: var(--font-display);
    font-style: italic;
    font-weight: 400;
    font-size: 1.05rem;
    line-height: 1.5;
    color: rgba(26, 24, 20, 0.85);
    max-width: 56ch;
    margin: 0;
    font-variation-settings: 'opsz' 14;
  }

  .paper section {
    padding: 1.25rem 0 1.5rem 0;
    border-bottom: 1px dotted rgba(26, 24, 20, 0.18);
  }
  .paper section:last-of-type {
    border-bottom: none;
  }

  .section-label {
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    color: rgba(26, 24, 20, 0.55);
    display: block;
    margin-bottom: 0.85rem;
  }

  .contra {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 0.5rem 1.5rem;
  }
  .contra li {
    display: flex;
    gap: 0.85rem;
    align-items: baseline;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(26, 24, 20, 0.07);
    font-size: 0.92rem;
    line-height: 1.4;
  }
  .contra li .num {
    font-size: 0.7rem;
    color: rgba(26, 24, 20, 0.4);
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .caut-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  @media (max-width: 600px) {
    .caut-grid {
      grid-template-columns: 1fr;
    }
  }
  .caut-grid p {
    margin: 0.4rem 0 0 0;
    font-size: 0.9rem;
    line-height: 1.45;
  }
  .mode-tag {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--accent-dim);
    border: 1px solid rgba(138, 100, 32, 0.45);
    padding: 0.1rem 0.4rem;
    display: inline-block;
  }

  .prose {
    font-size: 0.95rem;
    line-height: 1.55;
    margin: 0;
    color: rgba(26, 24, 20, 0.92);
    max-width: 60ch;
  }
  .kbd {
    font-family: var(--font-mono);
    font-size: 0.78rem;
    padding: 0.05rem 0.4rem;
    border: 1px solid rgba(26, 24, 20, 0.35);
    background: rgba(0, 0, 0, 0.04);
    border-radius: 2px;
  }

  .crisis {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0 0;
  }
  .crisis li {
    display: grid;
    grid-template-columns: 12rem 1fr 1fr;
    gap: 0.75rem;
    align-items: baseline;
    padding: 0.4rem 0;
    border-top: 1px solid rgba(26, 24, 20, 0.12);
    font-size: 0.88rem;
  }
  .crisis li .region {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(26, 24, 20, 0.7);
  }
  .crisis li .rule {
    height: 1px;
    background: rgba(26, 24, 20, 0.2);
    align-self: center;
  }
  @media (max-width: 600px) {
    .crisis li {
      grid-template-columns: 1fr;
      gap: 0.1rem;
    }
    .crisis li .rule {
      display: none;
    }
  }

  .affirm {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 2px solid rgba(26, 24, 20, 0.6);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  .affirm label {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    cursor: pointer;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.02rem;
    line-height: 1.45;
    color: var(--paper-ink);
    font-variation-settings: 'opsz' 14;
  }
  .affirm input[type='checkbox'] {
    margin-top: 0.3rem;
    flex-shrink: 0;
    border-color: rgba(26, 24, 20, 0.45);
  }
  .affirm input[type='checkbox']:checked {
    background: var(--paper-ink);
    border-color: var(--paper-ink);
  }
  .affirm input[type='checkbox']:checked::after {
    border-right-color: var(--paper);
    border-bottom-color: var(--paper);
  }

  .affirm button {
    align-self: flex-end;
    background: var(--paper-ink);
    color: var(--paper);
    border-color: var(--paper-ink);
    padding: 0.7rem 1.6rem;
    font-family: var(--font-body);
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .affirm button:hover:not(:disabled) {
    background: var(--accent-dim);
    border-color: var(--accent-dim);
    color: var(--paper);
  }
  .affirm button:disabled {
    background: rgba(26, 24, 20, 0.18);
    color: rgba(26, 24, 20, 0.4);
    border-color: rgba(26, 24, 20, 0.18);
    cursor: not-allowed;
  }
</style>
