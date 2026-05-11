# Changelog

All notable changes to OpenBLS are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Session-length auto-stop (`sessionMaxMinutes`) preset field with snap select
  (Off / 5 / 10 / 15 / 20 / 30 / 45 / 60 min) wired in `ControlsPanel` and
  `/settings`. Engine tracks elapsed running time (excluding pauses) and
  auto-stops at threshold.
- Live `mm:ss` elapsed / remaining readout in the bottom-console counters
  pillar.
- `PromptModal` component — in-app modal replacing native `prompt()` for
  preset naming. Focus-trapped, Enter to submit, Esc to cancel.
- `focusTrap` Svelte action applied to `ContraindicationGate`, `CrashModal`,
  and `PromptModal`. Restores prior focus on teardown.
- Unit tests covering `SessionTimer` pause/resume accumulation, threshold
  hits, and `formatMmSs`.

### Changed
- Removed the `audio.syncWithVisual` schema field. It had no effect in the
  engine. Existing presets with the field validate fine (Zod strips unknown
  keys); UI no longer surfaces the toggle.

## [0.1.0-rc.1] — 2026-05-09

First release candidate. Web SPA + cross-platform Tauri desktop builds.

### Added
- Audio engine with seven synthesized voices (sine, soft, tone, click, woodblock, chime, pluck) and a no-drift sample-accurate scheduler.
- Visual renderer with five movement paths (horizontal, vertical, diagonal, circular, figure-eight), configurable target shape, size, and color, configurable background color and contrast.
- Six built-in presets covering the common clinical use cases (Standard, Faster Processing, Slow Resourcing, Audio-Only Eyes-Closed, ART 40-Sweep, Butterfly Hug Guide).
- Custom user presets with create / save / duplicate / delete / import / export to `.openbls-preset.json`.
- Manual settings page exposing every parameter; inline `ControlsPanel` drawer on the session view for live tuning.
- Session controls: start / pause / resume / stop, sweep and set counters, fullscreen presentation mode with auto-hiding controls.
- First-launch contraindication acknowledge gate with a formal-document layout, persisted locally.
- Persistent crisis-resources link in the app chrome, country-specific lines.
- Crash handler: local modal with stack and non-PII state snapshot, Copy-report button, GitHub-issue deeplink. No automatic submission. No server.
- Persistence abstraction: Tauri filesystem on desktop, `localStorage` on web.
- WCAG 2.1 §2.3 (Three Flashes Threshold) guard module with unit tests.
- `svelte-i18n` scaffolded with English locale.
- Apache-2.0 license + NOTICE, full safety documentation suite (`DISCLAIMER`, `SECURITY`, `CONTRIBUTING`, `CODE_OF_CONDUCT`, `docs/threat-model.md`, `docs/safety-copy.md`, `docs/presets.md`, `docs/tactile-protocol-draft.md`).
- Research brief preserved at `docs/research/2026-05-09-bls-evidence-and-regulatory-brief.md`.
- GitHub Actions: CI (lint + typecheck + unit + e2e), Pages deploy, Tauri release matrix (Linux / macOS / Windows).

### Notes
- Tauri binaries: macOS `.dmg` is unsigned — right-click → Open on first run.
- No telemetry, no accounts, no outbound network requests at runtime.
- Marketed exclusively for use by licensed clinicians inside their practices. See [DISCLAIMER.md](DISCLAIMER.md) for the full safety notice.

[Unreleased]: https://github.com/gndl00p/openbls/compare/v0.1.0-rc.1...HEAD
[0.1.0-rc.1]: https://github.com/gndl00p/openbls/releases/tag/v0.1.0-rc.1
