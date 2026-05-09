import { writable, type Writable } from 'svelte/store';
import { PersistedStore } from '../persistence/store.js';
import { ACKNOWLEDGMENT_VERSION } from './copy.js';

export interface AcknowledgmentState {
  loaded: boolean;
  acknowledged: boolean;
  acknowledgedVersion: number | null;
  acknowledgedAt: string | null;
}

const initial: AcknowledgmentState = {
  loaded: false,
  acknowledged: false,
  acknowledgedVersion: null,
  acknowledgedAt: null
};

export function createAcknowledgmentStore(persistence = new PersistedStore()): {
  state: Writable<AcknowledgmentState>;
  load: () => Promise<void>;
  acknowledge: () => Promise<void>;
  reset: () => Promise<void>;
} {
  const state = writable<AcknowledgmentState>(initial);

  return {
    state,
    async load(): Promise<void> {
      const record = await persistence.getAcknowledgment();
      state.set({
        loaded: true,
        acknowledged: !!record && record.version >= ACKNOWLEDGMENT_VERSION,
        acknowledgedVersion: record?.version ?? null,
        acknowledgedAt: record?.acknowledgedAt ?? null
      });
    },
    async acknowledge(): Promise<void> {
      await persistence.setAcknowledgment(ACKNOWLEDGMENT_VERSION);
      state.set({
        loaded: true,
        acknowledged: true,
        acknowledgedVersion: ACKNOWLEDGMENT_VERSION,
        acknowledgedAt: new Date().toISOString()
      });
    },
    async reset(): Promise<void> {
      await persistence.delete('openbls.acknowledgment.v1');
      state.set({ ...initial, loaded: true });
    }
  };
}
