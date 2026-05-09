import { writable, derived, get, type Readable } from 'svelte/store';
import { BUILT_IN_PRESETS } from '../presets/builtin.js';
import { asUserPreset, deserializePreset, serializePreset } from '../presets/io.js';
import type { Preset } from '../presets/schema.js';
import { PersistedStore } from '../persistence/store.js';

export interface PresetsStore {
  customs: Readable<Preset[]>;
  all: Readable<Preset[]>;
  load: () => Promise<void>;
  save: (preset: Preset) => Promise<Preset>;
  duplicate: (preset: Preset) => Promise<Preset>;
  remove: (id: string) => Promise<void>;
  importFromText: (text: string) => Promise<Preset>;
  exportToText: (preset: Preset) => string;
}

function genId(): string {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `user-${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function createPresetsStore(persistence = new PersistedStore()): PresetsStore {
  const customs = writable<Preset[]>([]);

  const all = derived(customs, ($customs) => [...BUILT_IN_PRESETS, ...$customs]);

  return {
    customs,
    all,

    async load(): Promise<void> {
      const fromDisk = await persistence.getCustomPresets();
      customs.set(fromDisk);
    },

    async save(preset: Preset): Promise<Preset> {
      // Built-ins are read-only; saving a built-in produces a user copy.
      const finalised: Preset = preset.builtin ? asUserPreset(preset, genId()) : preset;
      const list = get(customs).filter((p) => p.id !== finalised.id);
      list.push(finalised);
      customs.set(list);
      await persistence.setCustomPresets(list);
      return finalised;
    },

    async duplicate(preset: Preset): Promise<Preset> {
      const copy: Preset = {
        ...preset,
        id: genId(),
        builtin: false,
        name: `${preset.name} (copy)`
      };
      const list = [...get(customs), copy];
      customs.set(list);
      await persistence.setCustomPresets(list);
      return copy;
    },

    async remove(id: string): Promise<void> {
      const target = get(customs).find((p) => p.id === id);
      if (!target) return;
      if (target.builtin) {
        throw new Error('Built-in presets cannot be deleted.');
      }
      const list = get(customs).filter((p) => p.id !== id);
      customs.set(list);
      await persistence.setCustomPresets(list);
    },

    async importFromText(text: string): Promise<Preset> {
      const parsed = deserializePreset(text);
      const user = asUserPreset(parsed, genId());
      const list = [...get(customs), user];
      customs.set(list);
      await persistence.setCustomPresets(list);
      return user;
    },

    exportToText(preset: Preset): string {
      return serializePreset(preset);
    }
  };
}

export const presetsStore = createPresetsStore();
