import { describe, expect, it } from 'vitest';
import { MemoryBackend, PersistedStore } from '../../src/lib/persistence/store.js';
import { BUILT_IN_PRESETS } from '../../src/lib/presets/builtin.js';

describe('PersistedStore over MemoryBackend', () => {
  it('returns null for unset keys and records what it stores', async () => {
    const store = new PersistedStore(new MemoryBackend());
    expect(await store.getAcknowledgment()).toBeNull();
    await store.setAcknowledgment(1);
    const ack = await store.getAcknowledgment();
    expect(ack?.version).toBe(1);
    expect(ack?.acknowledgedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('persists custom presets as a list and round-trips', async () => {
    const store = new PersistedStore(new MemoryBackend());
    expect(await store.getCustomPresets()).toEqual([]);
    const userPreset = { ...BUILT_IN_PRESETS[0], id: 'mine', name: 'Mine', builtin: false };
    await store.setCustomPresets([userPreset]);
    const back = await store.getCustomPresets();
    expect(back).toEqual([userPreset]);
  });

  it('persists ui preferences with sane defaults', async () => {
    const store = new PersistedStore(new MemoryBackend());
    const prefs = await store.getUiPreferences();
    expect(prefs.showCrisisLink).toBe(true);
    await store.setUiPreferences({ ...prefs, showCrisisLink: false });
    const after = await store.getUiPreferences();
    expect(after.showCrisisLink).toBe(false);
  });
});
