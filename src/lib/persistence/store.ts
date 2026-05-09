import type { Preset } from '../presets/schema.js';

/**
 * Persistence keys. Settings, acknowledgment, and custom presets are the
 * only things ever persisted — that's a hard invariant, see threat-model.md.
 */
export const KEYS = {
  acknowledgment: 'openbls.acknowledgment.v1',
  activePresetId: 'openbls.activePresetId.v1',
  customPresets: 'openbls.customPresets.v1',
  uiPreferences: 'openbls.uiPreferences.v1'
} as const;

export interface AcknowledgmentRecord {
  acknowledgedAt: string; // ISO timestamp
  version: number;
}

export interface UiPreferences {
  showCrisisLink: boolean;
  preferredAudioOutput?: string;
}

/**
 * Storage backend. Three implementations:
 *   - localStorage (web build)
 *   - Tauri filesystem (desktop build)
 *   - in-memory (tests)
 */
export interface StorageBackend {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

export class MemoryBackend implements StorageBackend {
  #map = new Map<string, string>();
  async read(key: string): Promise<string | null> {
    return this.#map.get(key) ?? null;
  }
  async write(key: string, value: string): Promise<void> {
    this.#map.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.#map.delete(key);
  }
}

export class LocalStorageBackend implements StorageBackend {
  async read(key: string): Promise<string | null> {
    return globalThis.localStorage?.getItem(key) ?? null;
  }
  async write(key: string, value: string): Promise<void> {
    globalThis.localStorage?.setItem(key, value);
  }
  async delete(key: string): Promise<void> {
    globalThis.localStorage?.removeItem(key);
  }
}

/**
 * Tauri filesystem backend. Lazy-initialized so the web build does not pull
 * in the Tauri APIs at all.
 */
type TauriFsApi = typeof import('@tauri-apps/plugin-fs');

export class TauriFsBackend implements StorageBackend {
  #ready: Promise<TauriFsApi> | null = null;

  #api(): Promise<TauriFsApi> {
    if (!this.#ready) {
      this.#ready = import('@tauri-apps/plugin-fs');
    }
    return this.#ready;
  }

  #pathFor(key: string): string {
    return `${key}.json`;
  }

  async read(key: string): Promise<string | null> {
    const fs = await this.#api();
    const path = this.#pathFor(key);
    const opts = { baseDir: fs.BaseDirectory.AppData };
    if (!(await fs.exists(path, opts))) return null;
    return fs.readTextFile(path, opts);
  }

  async write(key: string, value: string): Promise<void> {
    const fs = await this.#api();
    const path = this.#pathFor(key);
    const opts = { baseDir: fs.BaseDirectory.AppData };
    try {
      await fs.mkdir('', { ...opts, recursive: true });
    } catch {
      // ignore — directory may already exist
    }
    await fs.writeTextFile(path, value, opts);
  }

  async delete(key: string): Promise<void> {
    const fs = await this.#api();
    const path = this.#pathFor(key);
    const opts = { baseDir: fs.BaseDirectory.AppData };
    if (await fs.exists(path, opts)) {
      await fs.remove(path, opts);
    }
  }
}

/** Pick a backend based on the runtime environment. */
export function defaultBackend(): StorageBackend {
  if (typeof globalThis !== 'undefined') {
    const win = globalThis as unknown as { __TAURI_INTERNALS__?: unknown; localStorage?: unknown };
    if (win.__TAURI_INTERNALS__) {
      return new TauriFsBackend();
    }
    if (win.localStorage) {
      return new LocalStorageBackend();
    }
  }
  return new MemoryBackend();
}

/** High-level typed accessor over a backend. */
export class PersistedStore {
  #backend: StorageBackend;
  constructor(backend: StorageBackend = defaultBackend()) {
    this.#backend = backend;
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.#backend.read(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async setJson(key: string, value: unknown): Promise<void> {
    await this.#backend.write(key, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.#backend.delete(key);
  }

  async getAcknowledgment(): Promise<AcknowledgmentRecord | null> {
    return this.getJson<AcknowledgmentRecord>(KEYS.acknowledgment);
  }

  async setAcknowledgment(version: number): Promise<void> {
    const record: AcknowledgmentRecord = {
      acknowledgedAt: new Date().toISOString(),
      version
    };
    await this.setJson(KEYS.acknowledgment, record);
  }

  async getCustomPresets(): Promise<Preset[]> {
    return (await this.getJson<Preset[]>(KEYS.customPresets)) ?? [];
  }

  async setCustomPresets(presets: Preset[]): Promise<void> {
    await this.setJson(KEYS.customPresets, presets);
  }

  async getUiPreferences(): Promise<UiPreferences> {
    return (
      (await this.getJson<UiPreferences>(KEYS.uiPreferences)) ?? {
        showCrisisLink: true
      }
    );
  }

  async setUiPreferences(prefs: UiPreferences): Promise<void> {
    await this.setJson(KEYS.uiPreferences, prefs);
  }
}
