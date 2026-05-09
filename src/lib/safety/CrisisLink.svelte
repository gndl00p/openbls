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
    <p class="head">{SAFETY_COPY.crisis.headline}</p>
    <ul>
      {#each SAFETY_COPY.crisis.lines as line}
        <li><strong>{line.region}.</strong> {line.text}</li>
      {/each}
    </ul>
    <p class="hint">
      <a href={SAFETY_COPY.crisis.findAHelplineUrl} target="_blank" rel="noopener noreferrer">
        findahelpline.com
      </a>
      maintains country-specific lines.
    </p>
    <button type="button" class="close" onclick={close}>Close</button>
  </div>
{/if}

<style>
  .trigger {
    background: transparent;
    color: var(--fg-dim, #9a9aa3);
    border: 1px solid var(--border, #26262c);
    padding: 0.3rem 0.7rem;
    font-size: 0.85rem;
    border-radius: 4px;
    cursor: pointer;
  }
  .trigger:hover {
    color: var(--fg, #e6e6e6);
  }
  .scrim {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    border: 0;
    cursor: default;
    z-index: 100;
  }
  .popover {
    position: fixed;
    top: 4rem;
    right: 1rem;
    background: var(--panel, #16161a);
    border: 1px solid var(--border, #26262c);
    border-radius: 8px;
    padding: 1rem;
    max-width: 380px;
    z-index: 101;
    color: var(--fg, #e6e6e6);
    font-size: 0.9rem;
  }
  .head {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
  }
  ul {
    padding-left: 1.1rem;
    margin: 0.25rem 0;
  }
  li {
    margin: 0.2rem 0;
  }
  .hint {
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.85rem;
    margin: 0.75rem 0 0.5rem 0;
  }
  .close {
    margin-top: 0.5rem;
  }
</style>
