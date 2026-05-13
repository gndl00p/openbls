# OpenBLS

> Open-source bilateral-stimulation tool for licensed clinicians.

OpenBLS is a free, cross-platform desktop and web application that delivers
configurable visual and audio bilateral-stimulation patterns. It is built for
use by licensed mental-health clinicians inside their practices, including
in EMDR-style protocols.

Apache-2.0 licensed. Local-only. Zero telemetry. Zero accounts. Zero outbound
network requests at runtime.

**Try it in your browser:** [gndl00p.github.io/openbls](https://gndl00p.github.io/openbls/)
— evaluation surface only. For clinical use, install the desktop build from
[Releases](https://github.com/gndl00p/openbls/releases).

---

## Built for clinicians

OpenBLS is positioned as a professional tool, not a consumer self-help
application. It does not diagnose, treat, cure, or prevent any condition,
and it makes no therapeutic claims.

If you are a licensed clinician — welcome. The tool is yours to configure
and use as you see fit.

If you are **not** a clinician and you are looking for help with trauma,
PTSD, anxiety, or related concerns: this tool is not the right starting
point. Bilateral stimulation outside a structured clinical relationship can
surface intense emotional content without containment. Please consider:

- Finding a clinician trained in trauma-focused therapy. The
  [EMDRIA directory](https://www.emdria.org/find-an-emdr-therapist/)
  lists EMDR-trained therapists in the US; regional associations
  ([EMDR Europe](https://emdr-europe.org/) and others) cover the rest of the
  world.
- If you are in crisis, please reach out: **988** (US), **116 123**
  (UK/Ireland Samaritans), **112** (EU), or
  [findahelpline.com](https://findahelpline.com) for a country-specific
  line.

See [DISCLAIMER.md](DISCLAIMER.md) for the full safety notice.

## What it does

- **Visual modality.** A target traverses a configurable path (horizontal,
  vertical, diagonal, circular, figure-8) at a configurable speed.
- **Audio modality.** Alternating-channel stereo tones with configurable
  frequency, volume, pan width, and voice (sine tone or short click).
- **Presets.** A set of starter presets ship with the app, plus the ability
  to save, edit, duplicate, delete, import, and export your own presets as
  JSON files for sharing between clinicians.
- **Manual mode.** Every parameter exposed in a single panel.
- **Butterfly Hug guide.** A bundled animated tutorial of the
  self-administered tactile technique, useful for clients who cannot use the
  visual or audio modalities or who benefit from the eyes-closed protocol.
- **Presentation mode.** Full-screen with auto-hiding controls. Optional
  multi-monitor: presentation surface on one monitor, controls on another.
- **Local-only.** All settings, custom presets, and acknowledgments persist
  to your local machine and never leave it.

## What it does not do

OpenBLS does **not** include:

- Tactile / haptic output. Planned for v1.x via a documented Bluetooth
  haptic protocol so existing vendor hardware (Bi-Tapp, TheraTapper,
  EMDR Kit, Neurotek) can interoperate.
- Remote sync between clinician and client devices. Planned for v1.z over
  WebRTC peer-to-peer.
- SUDS or target-memory tracking. Planned for v1.y, local-only.
- Telemetry, analytics, accounts, cloud sync, automatic crash reporting.
  These are out of scope **permanently** — the tool will never ship them.
- App-store distribution. The app is distributed as a static web build
  and as desktop installers from this repo's GitHub Releases page only.

## Installing

> **Note.** v1 is in active development. Builds and a hosted web demo will be
> linked here once v1.0.0 is tagged.

Three ways to use OpenBLS:

1. **Web app** — open the hosted build at the URL listed in the next
   release. Installs as a PWA on most platforms.
2. **Desktop installer** — download the appropriate file from the latest
   [Releases](https://github.com/gndl00p/openbls/releases) page:
   `.deb` / `.AppImage` (Linux), `.dmg` (macOS), `.msi` (Windows).
3. **Self-host** — clone this repo and follow [Building from source](#building-from-source).

## Building from source

Prerequisites:

- Node 20+ and pnpm 9+.
- Rust toolchain (stable) via [rustup](https://rustup.rs).
- Tauri v2 platform dependencies. See the
  [Tauri prerequisites guide](https://v2.tauri.app/start/prerequisites/).

```bash
git clone https://github.com/gndl00p/openbls
cd openbls
pnpm install
pnpm dev          # web dev server
pnpm tauri dev    # desktop dev (auto-reloads)
pnpm tauri build  # production desktop bundle
pnpm build        # production web SPA
```

## Privacy posture

- **No data leaves your device at runtime.** Settings, custom presets, and
  the first-launch acknowledgment persist to your local filesystem (desktop)
  or browser localStorage (web). Nothing is uploaded.
- **Crashes are surfaced locally, not reported.** If the app crashes, you
  see a modal with the report. You decide whether to copy it and file a
  GitHub issue. Nothing is submitted automatically.
- **No accounts, no sign-in, no third-party integrations.** Ever.

## Contributing

PRs welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening one. In
short:

- Telemetry, analytics, accounts, sign-in, automatic crash reporting, cloud
  sync — these will not be merged. Ever.
- Treatment claims, therapeutic-effect language, marketing copy that
  positions OpenBLS as a substitute for therapy — will not be merged.
- Safety-copy edits get a slow, careful review. Provide citations.

## Naming

OpenBLS is unaffiliated with the EMDR Institute, EMDRIA, EMDR Europe, or any
other trademark holder. "BLS" stands for **bilateral stimulation**, a
generic term. The tool supports protocols that include bilateral stimulation
as a component; it does not constitute, deliver, or endorse any specific
therapeutic protocol.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
