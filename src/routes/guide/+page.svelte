<script lang="ts">
  import { GUIDE_ENTRIES } from '$lib/guide/content.js';
  import { SAFETY_COPY } from '$lib/safety/copy.js';
</script>

<svelte:head>
  <title>Clinicians' guide · OpenBLS</title>
</svelte:head>

<section class="guide">
  <header class="page-head">
    <span class="section-label">Clinicians' guide</span>
    <h1>Controls and evidence</h1>
    <p class="lede">
      Every setting in OpenBLS, what moves when you change it, and the research it sits on. Built for licensed clinicians using BLS in practice.
    </p>
  </header>

  <article class="block primer">
    <span class="section-label">Working-memory primer</span>
    <p>
      The most-studied theory behind EMDR and adjacent BLS protocols is the working-memory
      taxation hypothesis. Holding a target memory in mind while a secondary task loads the
      central executive reduces how vivid and emotional that memory feels later. The bilateral
      part is not strictly necessary. Vertical eye movements, mental arithmetic, complex tapping,
      Tetris, and drawing complex figures all do it (van den Hout &amp; Engelhard 2012; Andrade,
      Kavanagh &amp; Baddeley 1997). The active variable is
      <strong>central executive load during retrieval</strong>.
    </p>
    <p>
      Channels load working memory differently. Visual eye-movement BLS has the strongest
      outcome-evidence base in the literature (Lee &amp; Cuijpers 2013: d ≈ 0.41 in clinical
      trials, d ≈ 0.74 in lab studies for the additive effect of eye movements over
      no-eye-movement EMDR). Auditory tones have weaker dismantling evidence at the
      working-memory level (van den Hout et al. 2011 reported that beeps did not slow responses
      to visual cues, suggesting weaker WM loading). Configurable speed and pattern matter more
      than which channel you pick.
    </p>
    <p class="caveats">
      <strong>Caveats.</strong> OpenBLS is a stimulus-delivery tool. It does not provide therapy
      content, protocol guidance, or treatment decisions. Use it inside your scope of practice
      and training (EMDRIA, EMDR Europe, EMDR-IBA, or your national equivalent). Screen clients
      for photosensitive epilepsy, hyperacusis, dissociation history, and the standard EMDR
      contraindications before use.
    </p>
  </article>

  {#each GUIDE_ENTRIES as entry (entry.key)}
    <article class="block control" id={entry.key}>
      <span class="section-label">{entry.label}</span>
      <h2>{entry.label}</h2>

      <div class="row">
        <span class="lab">What it does</span>
        <p>{entry.long.description}</p>
      </div>

      <div class="row">
        <span class="lab">Moving it</span>
        <p>{entry.long.moving}</p>
      </div>

      <div class="row">
        <span class="lab">Research</span>
        <p>{entry.long.research}</p>
      </div>

      {#if entry.long.citations.length > 0}
        <div class="row citations">
          <span class="lab">Citations</span>
          <ul>
            {#each entry.long.citations as c}
              <li>
                <span class="cite-author">{c.author}</span>
                <span class="cite-year">({c.year})</span>
                <span class="cite-venue">· {c.venue}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

    </article>
  {/each}

  <article class="block">
    <span class="section-label">A note on citations</span>
    <p>
      Citations here are author-and-year only. Read the primary sources before drawing
      clinical conclusions. This guide is a starting reference, not a substitute for clinician
      training or protocol-specific certification.
    </p>
  </article>

  <article class="block dedication">
    <span class="section-label">Why this exists</span>
    <p class="ded-headline">{SAFETY_COPY.dedication.headline}</p>
    <p class="ded-body">{SAFETY_COPY.dedication.body}</p>
    <p class="ded-vcl">{SAFETY_COPY.dedication.veteransCrisisLine}</p>
  </article>
</section>

<style>
  .guide {
    max-width: 760px;
    margin: 0 auto;
    padding: 3rem 2rem 5rem 2rem;
  }
  .page-head {
    display: grid;
    gap: 0.4rem;
    margin-bottom: 2.5rem;
  }
  .page-head h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.025em;
    font-variation-settings: 'opsz' 144, 'SOFT' 30, 'WONK' 1;
    margin: 0;
  }
  .lede {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.1rem;
    color: var(--fg-soft);
    margin: 0.5rem 0 0 0;
    max-width: 56ch;
    font-variation-settings: 'opsz' 14;
  }

  .block {
    border-top: 1px solid var(--rule);
    padding: 1.8rem 0;
  }
  .block:last-child {
    border-bottom: 1px solid var(--rule);
  }
  .block .section-label {
    display: block;
    margin-bottom: 0.4rem;
    color: var(--accent-dim);
  }
  .block h2 {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 400;
    margin: 0 0 1rem 0;
    color: var(--fg);
    letter-spacing: -0.015em;
    font-variation-settings: 'opsz' 28, 'SOFT' 30;
    scroll-margin-top: 5rem;
  }
  .block.control {
    scroll-margin-top: 5rem;
  }

  .row {
    margin: 0.9rem 0;
  }
  .lab {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--fg-dim);
    display: block;
    margin-bottom: 0.35rem;
  }
  .row p {
    color: var(--fg-soft);
    font-size: 0.98rem;
    line-height: 1.65;
    margin: 0;
    max-width: 64ch;
  }

  .citations ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border-left: 1px solid var(--rule);
  }
  .citations li {
    padding: 0.35rem 0 0.35rem 0.85rem;
    font-size: 0.92rem;
    color: var(--fg-soft);
    line-height: 1.5;
  }
  .cite-author {
    color: var(--fg);
    font-weight: 500;
  }
  .cite-year {
    color: var(--fg-dim);
    margin-left: 0.2rem;
  }
  .cite-venue {
    color: var(--fg-dim);
    font-style: italic;
  }


  .primer p {
    color: var(--fg-soft);
    font-size: 1rem;
    line-height: 1.65;
    margin: 0 0 0.85rem 0;
    max-width: 64ch;
  }
  .primer strong {
    color: var(--fg);
  }
  .caveats {
    border-left: 2px solid var(--accent-dim);
    padding-left: 0.85rem;
    margin-top: 1.25rem !important;
  }

  .dedication .section-label {
    color: var(--accent);
  }
  .ded-headline {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.35rem;
    color: var(--fg);
    margin: 0.5rem 0 0.8rem 0;
    font-variation-settings: 'opsz' 18, 'SOFT' 30;
    max-width: 36ch;
  }
  .ded-body {
    color: var(--fg-soft);
    font-size: 1rem;
    line-height: 1.65;
    max-width: 60ch;
    margin: 0 0 1rem 0;
  }
  .ded-vcl {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--fg);
    background: var(--bg-elev);
    padding: 0.6rem 0.8rem;
    border-left: 2px solid var(--danger);
    margin: 0;
    max-width: 60ch;
  }
</style>
