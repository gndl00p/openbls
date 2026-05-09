# Contributing to OpenBLS

Thanks for your interest. OpenBLS is built carefully, deliberately, and with
some firm constraints. Read this before opening a PR.

## What we will not merge

These categories of contributions will not be merged regardless of code
quality:

- **Telemetry, analytics, instrumentation, or any phone-home behavior.**
  This includes opt-in/off-by-default versions, "anonymous" crash reporters,
  feature-usage pings, font-loading endpoints that double as beacons, and
  anything else that sends data off the user's device.
- **Accounts, sign-in, OAuth, or any user identity surface.**
- **Cloud sync, server-side persistence, or any service that requires us
  to maintain a backend.** Settings and presets stay on the user's device.
- **Therapeutic claims of any kind.** Copy that says or implies OpenBLS
  treats, cures, prevents, or manages any condition; that it delivers
  EMDR therapy; that it is a substitute for clinician-delivered care.
- **Brand changes that put `EMDR` into the product name, binary name,
  window title, or marketing.** The trademark belongs to the E.M.D.R.
  Institute. Descriptive use ("for use in EMDR-style protocols") in docs
  is fine.
- **App-store packaging or submission as part of v1.** Apple and Google
  health-app review surfaces add liability and legal exposure that we
  intentionally avoid.

If you think you have a case for any of the above, open an issue first
to discuss. Don't write the code and then argue the policy in review.

## What we welcome

- Bug fixes, performance improvements, accessibility improvements.
- Additional movement paths, target shapes, audio voicings, presets.
- Translations into additional languages. Note that **safety copy
  translations** (DISCLAIMER, first-launch screen, crisis resources) get
  a careful review and may require a second pair of eyes from a
  clinician fluent in the target language. Don't be discouraged — just
  expect the merge to be slow.
- Documentation, especially clinician-perspective documentation about how
  OpenBLS fits into specific protocols.
- Tactile-output support that follows the documented Bluetooth haptic
  protocol (in `docs/tactile-protocol-draft.md` once published). Vendor
  interop is welcome.
- Tests of any kind.

## Process

1. **Open an issue first** for anything non-trivial. We'd rather discuss
   shape before you sink hours into code.
2. **Fork, branch, PR.** Branch names that describe the work
   (`feat/figure-eight-path`, `fix/audio-drift-on-suspend`) are appreciated.
3. **Tests.** Unit tests via Vitest live under `tests/unit/`; e2e tests via
   Playwright live under `tests/e2e/`. Add or update tests for behavior
   changes.
4. **Lint and typecheck.** `pnpm lint` and `pnpm check` both pass on PR
   branches before merge.
5. **One concern per PR.** Smaller, focused PRs merge faster.

## Safety-copy review

Edits to any of the following get a slower, more careful review than typical
code changes:

- `DISCLAIMER.md`
- `docs/safety-copy.md`
- `docs/research/`
- The first-launch acknowledge gate component
- The crisis-resources link content
- Any user-facing string that frames OpenBLS's purpose, scope, or limits

If you're proposing a change to safety copy, please cite your sources in
the PR description (peer-reviewed > practice guidelines > clinician opinion).

## Code style

- TypeScript strict mode. No `any` without justification.
- Svelte components: keep them focused. If a component is doing too many
  things, split it.
- No comments that describe what the code does. Comments are for the
  non-obvious why — invariants, hidden constraints, references to
  surprising clinical or accessibility requirements.
- No new dependencies without explanation. Apache-2.0-compatible licenses
  only.

## Reporting security issues

See [SECURITY.md](SECURITY.md). Do **not** file public issues for
suspected security or privacy vulnerabilities.

## License

By contributing, you agree your contributions are licensed under
[Apache-2.0](LICENSE).
