# Built-in presets

Presets are JSON-serializable bundles of session settings. Built-in
presets ship with the app; users can save, edit, duplicate, delete,
import, and export their own.

## Schema (v1)

A preset has these fields:

```ts
type Preset = {
  id: string;          // stable identifier (slug for built-ins, uuid for user)
  name: string;        // display name
  builtin: boolean;    // true for shipped presets, locked from edit/delete
  description?: string;

  visual: {
    enabled: boolean;
    path: "horizontal" | "vertical" | "diagonal" | "circular" | "figure-eight";
    speedHz: number;             // 0.4–2.0
    setLength: number;           // sweeps per set, 1–200
    setCount: number | null;     // null = open-ended
    target: {
      shape: "circle" | "dot" | "ring";
      sizePx: number;            // 8–200
      color: string;             // CSS color
    };
    background: {
      color: string;             // CSS color
      contrast: "high" | "standard" | "reduced";
    };
  };

  audio: {
    enabled: boolean;
    syncWithVisual: boolean;
    frequencyHz: number;         // 200–1200
    volume: number;              // 0–1
    panWidth: number;            // 0–1
    voice: "sine" | "click";
  };

  guide?: "butterfly-hug" | null;  // when set, replace tracking target with the guide loop
};
```

## Built-in presets (v1 starter set)

The starter set is intentionally small. Users build their own library on
top.

### 1. Standard

The unmarked default. Horizontal sweep, 1.0 Hz, 24 sweeps per set, open-
ended set count. Visual + audio enabled, synced. Sine tone at 440 Hz.

### 2. Faster Processing

Horizontal sweep at 1.6 Hz, 24 sweeps per set. Per van Veen et al. (2015),
faster eye movements produce greater memory blurring up to a ceiling.
Useful when the clinician wants more working-memory taxation than the
default delivers. Audio synced.

### 3. Slow Resourcing

Slow figure-eight at 0.5 Hz, 30 sweeps per set, reduced contrast,
softer color palette. Audio off by default. Intended for resourcing /
Calm Place / Container work where the goal is grounding rather than
processing.

### 4. Audio-Only Eyes-Closed

Visual disabled. Audio at 1.0 Hz, sine tone, full pan width. For
eyes-closed protocols, dissociation-prone clients, telehealth fallback
when video bandwidth is poor, or any client who cannot or should not
track a visual target.

### 5. ART 40-Sweep

Horizontal sweep at 1.0 Hz, **40 sweeps per set with auto-stop**, fixed
set count of 1 unless the user changes it. Matches the Accelerated
Resolution Therapy fixed-set convention. Visual + audio synced.

### 6. Butterfly Hug Guide

No tracking target — replaces the visual surface with the bundled
animated guide for the self-administered Butterfly Hug technique. Audio
disabled. Used to teach the technique to clients in-session, or as a
session frame for groups (EMDR-IGTP / GTEP) and children.

## Add a built-in preset

1. Add an entry to the `BUILT_IN_PRESETS` constant in
   `src/lib/presets/builtin.ts`.
2. Add reasoning here explaining why the preset is general-purpose
   enough to ship versus being a user-saved custom preset.
3. Update tests in `tests/unit/presets.test.ts`.

## Custom user presets

Custom presets live in the persisted store (Tauri filesystem on
desktop, localStorage on web). Each gets a uuid; built-in presets keep
their slug ids. Users can duplicate a built-in to create a new custom.

## Import / export

Presets export as `.openbls-preset.json` files following the schema
above. The importer validates against the schema and rejects unknown
or out-of-range fields with a clear message.
