import { parsePreset, type Preset } from './schema.js';

export const PRESET_FILE_EXTENSION = '.openbls-preset.json';
export const PRESET_MIME_TYPE = 'application/json';

/** Serialize a preset to a string suitable for writing to disk. */
export function serializePreset(preset: Preset): string {
  return JSON.stringify(preset, null, 2) + '\n';
}

/** Parse a JSON string back into a validated preset. */
export function deserializePreset(text: string): Preset {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    throw new Error(`Preset is not valid JSON: ${(e as Error).message}`);
  }
  return parsePreset(parsed);
}

/** Generate a safe filename for a preset based on its name. */
export function presetFilename(preset: Preset): string {
  const slug = preset.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'preset';
  return `${slug}${PRESET_FILE_EXTENSION}`;
}

/** Mark a preset as user-created when imported (strip builtin flag). */
export function asUserPreset(preset: Preset, newId: string, newName?: string): Preset {
  return {
    ...preset,
    id: newId,
    name: newName ?? preset.name,
    builtin: false
  };
}
