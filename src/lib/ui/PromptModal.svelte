<script lang="ts">
  import { focusTrap } from '$lib/a11y/focus-trap.js';

  let {
    open = $bindable(false),
    title = 'Enter a value',
    label = '',
    placeholder = '',
    defaultValue = '',
    confirmLabel = 'Save',
    onSubmit,
    onCancel
  }: {
    open?: boolean;
    title?: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    confirmLabel?: string;
    onSubmit: (value: string) => void | Promise<void>;
    onCancel?: () => void;
  } = $props();

  let value = $state('');
  let inputEl: HTMLInputElement | undefined = $state();
  let busy = $state(false);

  $effect(() => {
    if (open) {
      value = defaultValue;
    }
  });

  async function submit() {
    if (busy) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    busy = true;
    try {
      await onSubmit(trimmed);
      open = false;
    } finally {
      busy = false;
    }
  }

  function cancel() {
    open = false;
    onCancel?.();
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  }
</script>

{#if open}
  <div class="overlay" role="dialog" aria-modal="true" aria-labelledby="prompt-title">
    <div class="card" use:focusTrap onkeydown={handleKey} role="presentation">
      <span class="section-label" id="prompt-title">{title}</span>
      {#if label}<label class="lab" for="prompt-input">{label}</label>{/if}
      <input
        id="prompt-input"
        type="text"
        bind:value
        bind:this={inputEl}
        {placeholder}
        autocomplete="off"
        spellcheck="false"
      />
      <div class="actions">
        <button type="button" class="ghost" onclick={cancel}>Cancel</button>
        <button type="button" class="primary" disabled={busy || !value.trim()} onclick={submit}
          >{busy ? '…' : confirmLabel}</button
        >
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: grid;
    place-items: center;
    z-index: 1500;
    padding: 1.5rem;
  }
  .card {
    background: var(--bg-elev);
    border: 1px solid var(--rule-strong);
    border-top: 2px solid var(--accent);
    padding: 1.25rem 1.5rem 1rem 1.5rem;
    width: min(420px, 100%);
    color: var(--fg);
    box-shadow: 0 24px 60px -16px rgba(0, 0, 0, 0.6);
  }
  .section-label {
    display: block;
    color: var(--accent);
    margin-bottom: 0.6rem;
  }
  .lab {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--fg-dim);
    margin: 0.4rem 0 0.3rem 0;
  }
  input[type='text'] {
    width: 100%;
    padding: 0.5rem 0.7rem;
    font-size: 0.95rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }
</style>
