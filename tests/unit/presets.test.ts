import { describe, expect, it } from 'vitest';
import { BUILT_IN_PRESETS, findBuiltIn } from '../../src/lib/presets/builtin.js';
import {
  PresetSchemaVersion,
  parsePreset,
  presetSchema
} from '../../src/lib/presets/schema.js';
import {
  asUserPreset,
  deserializePreset,
  presetFilename,
  serializePreset
} from '../../src/lib/presets/io.js';

describe('Built-in presets', () => {
  it('all built-ins are valid against the schema', () => {
    for (const p of BUILT_IN_PRESETS) {
      expect(() => presetSchema.parse(p)).not.toThrow();
    }
  });

  it('all built-ins have unique ids and stable schema version', () => {
    const ids = BUILT_IN_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of BUILT_IN_PRESETS) {
      expect(p.schemaVersion).toBe(PresetSchemaVersion);
      expect(p.builtin).toBe(true);
    }
  });

  it('expected built-ins exist by id', () => {
    const required = [
      'standard',
      'faster-processing',
      'slow-resourcing',
      'audio-only-eyes-closed',
      'fixed-40-sweep',
      'butterfly-hug-guide'
    ];
    for (const id of required) {
      expect(findBuiltIn(id)).not.toBeNull();
    }
  });

  it('butterfly-hug-guide preset has guide flag set', () => {
    const guide = findBuiltIn('butterfly-hug-guide');
    expect(guide?.guide).toBe('butterfly-hug');
  });
});

describe('Preset import/export round-trip', () => {
  it('every built-in serializes and deserializes losslessly', () => {
    for (const original of BUILT_IN_PRESETS) {
      const text = serializePreset(original);
      const back = deserializePreset(text);
      expect(back).toEqual(original);
    }
  });

  it('rejects malformed JSON with a clear error', () => {
    expect(() => deserializePreset('not json')).toThrow(/not valid JSON/);
  });

  it('rejects out-of-range fields', () => {
    const original = BUILT_IN_PRESETS[0];
    const broken = { ...original, visual: { ...original.visual, speedHz: 99 } };
    expect(() => deserializePreset(JSON.stringify(broken))).toThrow(/Invalid preset/);
  });

  it('rejects unknown / out-of-range path values', () => {
    const original = BUILT_IN_PRESETS[0];
    const broken = { ...original, visual: { ...original.visual, path: 'spiral' } };
    expect(() => parsePreset(broken)).toThrow();
  });

  it('asUserPreset strips the builtin flag and sets a new id', () => {
    const u = asUserPreset(BUILT_IN_PRESETS[0], 'my-uuid', 'My Standard');
    expect(u.builtin).toBe(false);
    expect(u.id).toBe('my-uuid');
    expect(u.name).toBe('My Standard');
  });

  it('presetFilename produces a slug-based filename', () => {
    const file = presetFilename(BUILT_IN_PRESETS[0]);
    expect(file).toBe('standard.openbls-preset.json');
  });

  it('presetFilename handles unicode and punctuation safely', () => {
    const exotic = { ...BUILT_IN_PRESETS[0], name: 'My!! 🌈 Custom Preset' };
    const file = presetFilename(exotic);
    expect(file.endsWith('.openbls-preset.json')).toBe(true);
    expect(/[^a-z0-9.-]/.test(file)).toBe(false);
  });
});
