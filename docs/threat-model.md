# Threat model and design constraints

This file documents the non-obvious constraints that shape OpenBLS's
design. It is the second-most-important document in the repo (after
the research brief).

## Regulatory positioning

OpenBLS is positioned as a **professional tool** that delivers
configurable visual and audio bilateral-stimulation patterns. It is
not a medical device and makes no therapeutic claims. This positioning
is what keeps it outside the FDA's Software-as-a-Medical-Device (SaMD)
framework and the EU MDR Rule 11 classification.

Practical implications for code, copy, and PRs:

- **No therapeutic claims** anywhere — README, in-app text, marketing,
  release notes, commit messages, blog posts, social media.
- **The brand is OpenBLS**. The trademark `EMDR` belongs to the
  E.M.D.R. Institute (US Reg. 1,808,113 and 1,986,652). Descriptive
  use ("for use in EMDR-style protocols") in docs is fine; brand use
  is not. Never put `EMDR` in:
  - the product name
  - the binary name (`openbls`, not `emdr-something`)
  - the macOS bundle identifier or Windows app name
  - the window title
  - the README's first H1
  - app-store-style listing copy
- **Clinician-addressed voice throughout**. The user is the clinician.
  The phrase "your client" appears, not "your trauma." Take-home use is
  framed as the clinician's call, not the app's invitation.
- The minute the marketing or in-app copy says "treats PTSD" or
  "delivers EMDR therapy," the FDA SaMD definition is triggered.
  Reviewers should reject any PR that drifts into therapeutic claim
  territory regardless of how innocuous the change appears.

## Photosensitive epilepsy

This is the largest legal-exposure surface. Photosensitive epilepsy
affects roughly 1 in 4,000 of the general population, ~3–5% of people
with epilepsy. Full-screen flashing or moving content at 0.5–2 Hz with
high luminance contrast is the standard EMDR setup and is also the
standard photosensitive trigger profile.

Mitigations (all enforced in code, not optional):

- **Flash rate cap**: any opacity, color, or visibility transition that
  approximates a flash is capped at 3 transitions per second (WCAG 2.1
  §2.3 Three Flashes Threshold). Tested in
  `tests/unit/visual-flash-rate.test.ts`.
- **Movement-rate cap**: visual sweep frequency is capped at 2.0 Hz,
  the upper end of the EMDR clinical convention range, well below
  flashing thresholds. Speed slider does not allow values above 2.0 Hz.
- **Luminance contrast policy**: targets and backgrounds are not
  full-saturation at full brightness. The "Reduced contrast" preset
  drops further. Code in `src/lib/visual/wcag.ts` documents the
  policy and provides helpers components must use.
- **Pre-launch warning**: the first-launch acknowledge gate calls out
  photosensitive seizure history as a contraindication for visual
  mode.
- **In-session emergency stop**: ESC key always immediately blanks
  the visual surface and stops audio. Documented and tested.

## Privacy posture

Three principles, in order:

1. **No outbound network requests at runtime.** The web build is a
   static SPA. The desktop build is a Tauri app with no remote calls.
   CI verifies this; PRs that introduce a `fetch`, `XMLHttpRequest`,
   `WebSocket`, or `EventSource` call to anything but a documented
   build-time CDN should fail review.
2. **No accounts, no identity.** No sign-in, no user IDs, no device
   fingerprints.
3. **No telemetry.** No analytics. No crash auto-submission. No
   "anonymous usage statistics." If a future feature needs server
   support to make sense, that feature does not belong in OpenBLS.

The crash handler renders crashes locally and provides a deeplink to
GitHub Issues. The user copies and pastes; nothing is sent
automatically.

## Trademark exposure

- `EMDR` and `E.M.D.R.` are registered trademarks of the E.M.D.R.
  Institute. We do not use them in branding.
- `EMDRIA` is a registered trademark of the EMDR International
  Association. We do not claim association.
- `BLS`, `bilateral stimulation`, `dual attention stimulus`, `DAS`,
  `alternating tones`, `alternating taps` are generic / descriptive
  and not trademarked. We use them freely.
- The product name `OpenBLS` should be confirmed clear of conflicting
  registrations via a USPTO TESS search before public v1 release.

## Liability surface

The Apache-2.0 license includes a strong warranty disclaimer and a
limitation-of-liability clause. That is necessary but not sufficient
on its own.

Additional measures:

- The first-launch acknowledge gate requires the user to affirm
  that they have read the contraindication list.
- The DISCLAIMER and README route non-clinicians toward finding a
  clinician rather than into the session flow.
- Crisis-resource links are persistent and visible on every screen.
- No take-home processing flow ships in v1. The app is configured
  for use by clinicians; clinicians decide what the client does
  with it.

## Threats we explicitly accept

- **A non-clinician will install OpenBLS and use it on themselves.**
  We don't gate downloads. The mitigations above (positioning,
  acknowledge gate, crisis links, no processing flow) are the
  defense; perfection is not the goal.
- **Someone may fork OpenBLS and remove the safety surface.** The
  Apache-2.0 license permits this. We make the safety surface easy
  to keep and hard to remove without obvious blame; we do not add
  DRM or anti-fork measures.
- **Vendor hardware integration in v1.x will introduce a Bluetooth
  attack surface.** Documented in `docs/tactile-protocol-draft.md`.
  Mitigations are designed-in before that ships.
