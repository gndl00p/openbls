<script lang="ts">
  import { SAFETY_COPY } from './copy.js';

  let open = $state(false);

  function toggle() {
    open = !open;
  }

  function close() {
    open = false;
  }
</script>

<button class="trigger" type="button" onclick={toggle} aria-expanded={open}>
  <span class="led" aria-hidden="true"></span>
  Crisis resources
</button>

{#if open}
  <button
    class="scrim"
    type="button"
    aria-label="Dismiss crisis resources"
    onclick={close}
  ></button>
  <div class="popover" role="dialog" aria-label="Crisis resources">
    <header>
      <span class="section-label">Crisis resources</span>
      <button class="ghost dismiss" type="button" onclick={close} aria-label="Close">×</button>
    </header>
    <p class="head">{SAFETY_COPY.crisis.headline}</p>
    <ul>
      {#each SAFETY_COPY.crisis.lines as line}
        <li>
          <span class="region">{line.region}</span>
          <span class="text">{line.text}</span>
        </li>
      {/each}
    </ul>
    <p class="hint">
      <a href={SAFETY_COPY.crisis.findAHelplineUrl} target="_blank" rel="noopener noreferrer">
        findahelpline.com
      </a>
      ·  country-specific lines
    </p>
  </div>
{/if}

<style>
  .trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    color: var(--fg-soft);
    border: 1px solid var(--rule);
    padding: 0.35rem 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }
  .trigger:hover {
    color: var(--fg);
    border-color: var(--accent-dim);
  }
  .led {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    animation: pulse 2.4s var(--ease) infinite;
  }
  @keyframes pulse {
    0%,
    100% {
      opacity: 0.55;
    }
    50% {
      opacity: 1;
    }
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(2px);
    border: 0;
    cursor: default;
    z-index: 100;
  }
  .popover {
    position: fixed;
    top: 4rem;
    right: 1.25rem;
    background: var(--bg-elev);
    border: 1px solid var(--rule-strong);
    padding: 1rem 1.1rem 1rem 1.1rem;
    max-width: 380px;
    z-index: 101;
    color: var(--fg);
    font-size: 0.88rem;
    box-shadow: 0 24px 60px -16px rgba(0, 0, 0, 0.7);
  }
  .popover header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.6rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--rule);
  }
  .dismiss {
    color: var(--fg-dim);
    font-size: 1.1rem;
    line-height: 1;
    padding: 0.1rem 0.4rem;
  }
  .head {
    margin: 0 0 0.6rem 0;
    color: var(--fg);
    font-size: 0.85rem;
    line-height: 1.45;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.15rem;
    padding: 0.5rem 0;
    border-top: 1px dotted var(--rule);
    font-size: 0.85rem;
  }
  .region {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--accent);
  }
  .hint {
    color: var(--fg-dim);
    font-size: 0.78rem;
    margin: 0.85rem 0 0 0;
    padding-top: 0.6rem;
    border-top: 1px solid var(--rule);
  }
</style>
