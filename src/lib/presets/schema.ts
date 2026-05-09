import { z } from 'zod';
import { SESSION_LIMITS } from '../session/types.js';

export const PresetSchemaVersion = 1;

const cssColor = z
  .string()
  .min(1)
  .regex(/^(#[0-9a-fA-F]{3,8}|rgb\(.+\)|rgba\(.+\)|hsl\(.+\)|hsla\(.+\)|[a-zA-Z]+)$/);

const visualSchema = z.object({
  enabled: z.boolean(),
  path: z.enum(['horizontal', 'vertical', 'diagonal', 'circular', 'figure-eight']),
  speedHz: z.number().min(SESSION_LIMITS.speedHzMin).max(SESSION_LIMITS.speedHzMax),
  setLength: z.number().int().min(SESSION_LIMITS.setLengthMin).max(SESSION_LIMITS.setLengthMax),
  setCount: z.number().int().min(1).max(50).nullable(),
  target: z.object({
    shape: z.enum(['circle', 'dot', 'ring']),
    sizePx: z.number().int().min(8).max(200),
    color: cssColor
  }),
  background: z.object({
    color: cssColor,
    contrast: z.enum(['high', 'standard', 'reduced'])
  })
});

const audioSchema = z.object({
  enabled: z.boolean(),
  syncWithVisual: z.boolean(),
  frequencyHz: z
    .number()
    .min(SESSION_LIMITS.frequencyHzMin)
    .max(SESSION_LIMITS.frequencyHzMax),
  volume: z.number().min(0).max(1),
  panWidth: z.number().min(0).max(1),
  voice: z.enum(['sine', 'soft', 'tone', 'click', 'woodblock', 'chime', 'pluck'])
});

export const presetSchema = z.object({
  schemaVersion: z.literal(PresetSchemaVersion),
  id: z.string().min(1).max(128),
  name: z.string().min(1).max(80),
  builtin: z.boolean(),
  description: z.string().max(500).optional(),
  visual: visualSchema,
  audio: audioSchema,
  guide: z.enum(['butterfly-hug']).nullable().optional()
});

export type Preset = z.infer<typeof presetSchema>;
export type PresetVisual = z.infer<typeof visualSchema>;
export type PresetAudio = z.infer<typeof audioSchema>;

/** Wraps preset validation with a friendlier error message for import flow. */
export function parsePreset(input: unknown): Preset {
  const parsed = presetSchema.safeParse(input);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`);
    throw new Error(`Invalid preset:\n  ${issues.join('\n  ')}`);
  }
  return parsed.data;
}
