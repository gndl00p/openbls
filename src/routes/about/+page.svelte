<script lang="ts">
  import { SAFETY_COPY } from '$lib/safety/copy.js';
</script>

<section class="about">
  <header class="page-head">
    <span class="section-label">About</span>
    <h1>OpenBLS</h1>
    <p class="lede">{SAFETY_COPY.appTagline}</p>
  </header>

  <article class="block">
    <span class="section-label">§ 1 &nbsp; What this is</span>
    <p>
      OpenBLS is a free, open-source desktop and web tool that delivers visual and audio
      bilateral-stimulation patterns for licensed clinicians to use in their practice. The
      scope is deliberately narrow. It produces the stimulation. It does not deliver therapy
      content, walk through a protocol, or track anything about your client.
    </p>
  </article>

  <article class="block">
    <span class="section-label">§ 2 &nbsp; What this is not</span>
    <p>{SAFETY_COPY.disclaimerHeadline}</p>
  </article>

  <article class="block">
    <span class="section-label">§ 3 &nbsp; If you are not a clinician</span>
    <p>{SAFETY_COPY.nonClinicianRouting}</p>
    <p class="links">
      <a href={SAFETY_COPY.emdriaDirectoryUrl} target="_blank" rel="noopener noreferrer">
        EMDRIA find-a-therapist
      </a>
      <span class="sep">·</span>
      <a href={SAFETY_COPY.emdrEuropeUrl} target="_blank" rel="noopener noreferrer">
        EMDR Europe
      </a>
    </p>
  </article>

  <article class="block">
    <span class="section-label">§ 4 &nbsp; Privacy</span>
    <p>
      No accounts. No cloud. No telemetry. No network calls at runtime. Settings and custom
      presets live on this device. The crash handler shows reports locally and lets you decide
      whether to send one in on GitHub. Nothing is sent automatically.
    </p>
  </article>

  <article class="block">
    <span class="section-label">§ 5 &nbsp; License and contribution</span>
    <p>
      Apache-2.0. Source and contribution guide at
      <a href="https://github.com/gndl00p/openbls" target="_blank" rel="noopener noreferrer"
        >github.com/gndl00p/openbls</a
      >.
    </p>
  </article>

  <article class="block">
    <span class="section-label">§ 6 &nbsp; Trademark</span>
    <p>
      OpenBLS is not affiliated with the EMDR Institute, EMDRIA, EMDR Europe, or any other
      trademark holder. BLS stands for bilateral stimulation, which is a generic term.
    </p>
  </article>

  <article class="block dedication">
    <span class="section-label">Dedication</span>
    <p class="ded-headline">{SAFETY_COPY.dedication.headline}</p>
    <p class="ded-body">{SAFETY_COPY.dedication.body}</p>
    <p class="ded-vcl">{SAFETY_COPY.dedication.veteransCrisisLine}</p>
  </article>
</section>

<style>
  .about {
    max-width: 720px;
    margin: 0 auto;
    padding: 3rem 2rem 4rem 2rem;
  }
  .page-head {
    display: grid;
    gap: 0.4rem;
    margin-bottom: 2rem;
  }
  .page-head h1 {
    font-size: clamp(3rem, 7vw, 5rem);
    font-weight: 300;
    line-height: 0.95;
    letter-spacing: -0.025em;
    font-variation-settings: 'opsz' 144, 'SOFT' 30, 'WONK' 1;
  }
  .lede {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.15rem;
    color: var(--fg-soft);
    margin: 0.5rem 0 0 0;
    max-width: 50ch;
    font-variation-settings: 'opsz' 14;
  }

  .block {
    border-top: 1px solid var(--rule);
    padding: 1.5rem 0;
  }
  .block:last-child {
    border-bottom: 1px solid var(--rule);
  }
  .block .section-label {
    display: block;
    margin-bottom: 0.6rem;
    color: var(--accent-dim);
  }
  .block p {
    color: var(--fg-soft);
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 0.5rem 0;
    max-width: 60ch;
  }

  .links {
    margin-top: 0.6rem;
  }
  .links .sep {
    color: var(--rule-strong);
    margin: 0 0.4rem;
  }

  .dedication .section-label {
    color: var(--accent);
  }
  .ded-headline {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 1.4rem;
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
