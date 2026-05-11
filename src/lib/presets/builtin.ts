import type { Preset } from './schema.js';
import { PresetSchemaVersion } from './schema.js';

const TARGET_DEFAULT = { shape: 'circle' as const, sizePx: 32, color: '#d4a04a' };
const TARGET_SOFT = { shape: 'dot' as const, sizePx: 22, color: '#c8c0b1' };
const BG_STANDARD = { color: '#0c0c0d', contrast: 'standard' as const };
const BG_REDUCED = { color: '#15140f', contrast: 'reduced' as const };

export const BUILT_IN_PRESETS: Preset[] = [
  {
    schemaVersion: PresetSchemaVersion,
    id: 'standard',
    name: 'Standard',
    builtin: true,
    description: 'Horizontal sweep at 1.0 Hz, 24 sweeps per set, open-ended set count.',
    visual: {
      enabled: true,
      path: 'horizontal',
      speedHz: 1.0,
      setLength: 24,
      setCount: null,
      target: TARGET_DEFAULT,
      background: BG_STANDARD
    },
    audio: {
      enabled: true,
      frequencyHz: 440,
      volume: 0.5,
      panWidth: 1.0,
      voice: 'sine'
    },
    guide: null
  },
  {
    schemaVersion: PresetSchemaVersion,
    id: 'faster-processing',
    name: 'Faster Processing',
    builtin: true,
    description: 'Horizontal sweep at 1.6 Hz; greater working-memory taxation per van Veen et al. 2015.',
    visual: {
      enabled: true,
      path: 'horizontal',
      speedHz: 1.6,
      setLength: 24,
      setCount: null,
      target: TARGET_DEFAULT,
      background: BG_STANDARD
    },
    audio: {
      enabled: true,
      frequencyHz: 440,
      volume: 0.5,
      panWidth: 1.0,
      voice: 'sine'
    },
    guide: null
  },
  {
    schemaVersion: PresetSchemaVersion,
    id: 'slow-resourcing',
    name: 'Slow Resourcing',
    builtin: true,
    description: 'Slow figure-eight at 0.5 Hz, reduced contrast, soft palette. Audio off by default.',
    visual: {
      enabled: true,
      path: 'figure-eight',
      speedHz: 0.5,
      setLength: 30,
      setCount: null,
      target: TARGET_SOFT,
      background: BG_REDUCED
    },
    audio: {
      enabled: false,
      frequencyHz: 320,
      volume: 0.3,
      panWidth: 0.6,
      voice: 'sine'
    },
    guide: null
  },
  {
    schemaVersion: PresetSchemaVersion,
    id: 'audio-only-eyes-closed',
    name: 'Audio-Only Eyes-Closed',
    builtin: true,
    description: 'Visual disabled. Alternating sine tones at 1.0 Hz, full pan width.',
    visual: {
      enabled: false,
      path: 'horizontal',
      speedHz: 1.0,
      setLength: 24,
      setCount: null,
      target: TARGET_DEFAULT,
      background: BG_STANDARD
    },
    audio: {
      enabled: true,
      frequencyHz: 440,
      volume: 0.5,
      panWidth: 1.0,
      voice: 'sine'
    },
    guide: null
  },
  {
    schemaVersion: PresetSchemaVersion,
    id: 'art-40-sweep',
    name: 'ART 40-Sweep',
    builtin: true,
    description: 'Horizontal sweep at 1.0 Hz, fixed 40 sweeps per set, single set with auto-stop.',
    visual: {
      enabled: true,
      path: 'horizontal',
      speedHz: 1.0,
      setLength: 40,
      setCount: 1,
      target: TARGET_DEFAULT,
      background: BG_STANDARD
    },
    audio: {
      enabled: true,
      frequencyHz: 440,
      volume: 0.5,
      panWidth: 1.0,
      voice: 'sine'
    },
    guide: null
  },
  {
    schemaVersion: PresetSchemaVersion,
    id: 'butterfly-hug-guide',
    name: 'Butterfly Hug Guide',
    builtin: true,
    description: 'Animated guide for the self-administered Butterfly Hug technique. No tracking target, no audio.',
    visual: {
      enabled: false,
      path: 'horizontal',
      speedHz: 0.7,
      setLength: 30,
      setCount: null,
      target: TARGET_SOFT,
      background: BG_REDUCED
    },
    audio: {
      enabled: false,
      frequencyHz: 320,
      volume: 0.3,
      panWidth: 0.4,
      voice: 'sine'
    },
    guide: 'butterfly-hug'
  }
];

export function findBuiltIn(id: string): Preset | null {
  return BUILT_IN_PRESETS.find((p) => p.id === id) ?? null;
}
