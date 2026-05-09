<script lang="ts">
  import { SAFETY_COPY } from '$lib/safety/copy.js';
</script>

<section class="about">
  <h1>About OpenBLS</h1>

  <p class="lede">{SAFETY_COPY.appTagline}</p>

  <h2>What this is</h2>
  <p>
    OpenBLS is a free, open-source desktop and web tool that delivers configurable visual and audio
    bilateral-stimulation patterns for use by licensed clinicians inside their practices. It is
    intentionally narrow in scope: it produces stimulation patterns. It does not include any
    therapy-content layer, any guided protocol, or any client-data tracking.
  </p>

  <h2>What this is not</h2>
  <p>{SAFETY_COPY.disclaimerHeadline}</p>

  <h2>If you are not a clinician</h2>
  <p>{SAFETY_COPY.nonClinicianRouting}</p>
  <p>
    <a href={SAFETY_COPY.emdriaDirectoryUrl} target="_blank" rel="noopener noreferrer">
      EMDRIA find-a-therapist directory
    </a>
    ·
    <a href={SAFETY_COPY.emdrEuropeUrl} target="_blank" rel="noopener noreferrer">
      EMDR Europe
    </a>
  </p>

  <h2>Privacy</h2>
  <p>
    No accounts, no cloud, no telemetry, no outbound network requests at runtime. Settings and
    custom presets persist to your local device only. The crash handler shows reports locally and
    lets you decide whether to file them on GitHub. Nothing is sent automatically.
  </p>

  <h2>License & contribution</h2>
  <p>
    Apache-2.0. Source and contribution guide:
    <a href="https://github.com/gndl00p/openbls" target="_blank" rel="noopener noreferrer">
      github.com/gndl00p/openbls
    </a>
  </p>

  <h2>Trademark</h2>
  <p>
    OpenBLS is unaffiliated with the EMDR Institute, EMDRIA, EMDR Europe, or any other trademark
    holder. “BLS” stands for bilateral stimulation, a generic term.
  </p>
</section>

<style>
  .about {
    max-width: 720px;
    margin: 0 auto;
    padding: 1.5rem;
    line-height: 1.55;
  }
  h1 {
    margin: 0 0 0.5rem 0;
  }
  .lede {
    font-size: 1.05rem;
    color: var(--fg, #e6e6e6);
    margin: 0 0 1.5rem 0;
  }
  h2 {
    margin-top: 1.5rem;
    margin-bottom: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--fg-dim, #9a9aa3);
  }
  a {
    color: var(--accent, #5b8def);
  }
</style>
