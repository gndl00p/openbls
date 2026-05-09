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

  let { children } = $props();

  setupI18n();

  const ack = createAcknowledgmentStore();
  const ackState = ack.state;
  const sessionState = sessionController.state;

  onMount(async () => {
    installCrashHandler(() => ({
      activePresetId: $sessionState.preset.id,
      sessionStatus: $sessionState.status,
      sweepIndex: $sessionState.sweepIndex,
      setIndex: $sessionState.setIndex
    }));
    await ack.load();
    await presetsStore.load();
  });
</script>

<div class="app">
  <header>
    <a class="brand" href="/">
      <strong>OpenBLS</strong>
      <span class="brand-sub">for clinicians</span>
    </a>
    <nav>
      <a href="/">Session</a>
      <a href="/presets">Presets</a>
      <a href="/settings">Settings</a>
      <a href="/about">About</a>
    </nav>
    <div class="chrome-right">
      <CrisisLink />
    </div>
  </header>

  <main class="content">
    {#if !$ackState.loaded}
      <div class="loading">Loading…</div>
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
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border, #26262c);
    background: var(--panel, #16161a);
  }
  .brand {
    text-decoration: none;
    color: var(--fg, #e6e6e6);
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .brand-sub {
    font-size: 0.8rem;
    color: var(--fg-dim, #9a9aa3);
  }
  nav {
    display: flex;
    gap: 1rem;
  }
  nav a {
    color: var(--fg-dim, #9a9aa3);
    text-decoration: none;
    font-size: 0.9rem;
  }
  nav a:hover {
    color: var(--fg, #e6e6e6);
  }
  .chrome-right {
    margin-left: auto;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .loading {
    padding: 2rem;
    color: var(--fg-dim, #9a9aa3);
  }
</style>
