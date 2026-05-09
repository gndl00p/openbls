<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import CrisisLink from '$lib/safety/CrisisLink.svelte';
  import ContraindicationGate from '$lib/safety/ContraindicationGate.svelte';
  import CrashModal from '$lib/crash/CrashModal.svelte';
  import { createAcknowledgmentStore } from '$lib/safety/store.js';
  import { presetsStore } from '$lib/stores/presets.js';
  import { sessionController } from '$lib/stores/session.js';
  import { dismissCrash, installCrashHandler, lastCrash } from '$lib/crash/handler.js';
  import { setupI18n } from '$lib/i18n/index.js';
  import { page } from '$app/stores';

  let { children } = $props();

  const ack = createAcknowledgmentStore();
  const ackState = ack.state;
  const sessionState = sessionController.state;

  onMount(async () => {
    setupI18n();
    installCrashHandler(() => ({
      activePresetId: $sessionState.preset.id,
      sessionStatus: $sessionState.status,
      sweepIndex: $sessionState.sweepIndex,
      setIndex: $sessionState.setIndex
    }));
    await ack.load();
    await presetsStore.load();
  });

  const navItems = [
    { href: '/', label: 'Session' },
    { href: '/presets', label: 'Presets' },
    { href: '/settings', label: 'Settings' },
    { href: '/about', label: 'About' }
  ];
</script>

<div class="app">
  <header>
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22">
          <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="0.5" />
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" stroke-width="0.4" stroke-dasharray="1 2" />
        </svg>
      </span>
      <span class="brand-word">OpenBLS</span>
      <span class="brand-tag">for clinicians</span>
    </a>

    <nav>
      {#each navItems as item}
        <a class:active={$page.url.pathname === item.href} href={item.href}>{item.label}</a>
      {/each}
    </nav>

    <div class="chrome-right">
      <CrisisLink />
    </div>
  </header>

  <main class="content">
    {#if !$ackState.loaded}
      <div class="loading">
        <span class="numeric">— —</span>
        <span class="eyebrow">Loading</span>
      </div>
    {:else if !$ackState.acknowledged}
      <ContraindicationGate
        onAcknowledge={async () => {
          await ack.acknowledge();
        }}
      />
    {:else}
      {@render children()}
    {/if}
  </main>

  {#if $lastCrash}
    <CrashModal report={$lastCrash} onDismiss={dismissCrash} />
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 2.5rem;
    padding: 0.95rem 1.5rem;
    border-bottom: 1px solid var(--rule);
    background: linear-gradient(to bottom, rgba(19, 18, 20, 0.7), rgba(12, 12, 13, 0.7));
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    position: sticky;
    top: 0;
    z-index: 30;
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
    text-decoration: none;
    color: var(--fg);
  }
  .brand-mark {
    align-self: center;
    color: var(--accent);
    display: inline-flex;
  }
  .brand-word {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    font-variation-settings: 'opsz' 18, 'SOFT' 30;
  }
  .brand-tag {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: var(--tracking-caps);
    color: var(--fg-dim);
    margin-left: 0.4rem;
    padding-left: 0.55rem;
    border-left: 1px solid var(--rule-strong);
    align-self: center;
    line-height: 1;
  }

  nav {
    display: flex;
    gap: 1.6rem;
    justify-content: center;
  }
  nav a {
    color: var(--fg-dim);
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: var(--tracking-caps);
    padding: 0.4rem 0;
    position: relative;
    transition: color var(--dur) var(--ease);
  }
  nav a:hover {
    color: var(--fg);
  }
  nav a.active {
    color: var(--fg);
  }
  nav a.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1px;
    background: var(--accent);
  }

  .chrome-right {
    justify-self: end;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .loading {
    padding: 3rem;
    color: var(--fg-dim);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .loading .numeric {
    font-size: 1.5rem;
    color: var(--fg-soft);
  }
</style>
