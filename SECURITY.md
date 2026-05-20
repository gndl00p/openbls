# Security Policy

## Reporting a vulnerability

Please do not file public GitHub issues for suspected security or privacy
vulnerabilities in OpenBLS.

Two private channels:

1. **GitHub Security Advisories.** Open a private advisory at
   https://github.com/gndl00p/openbls/security/advisories/new.
2. **Email.** `security@openbls.invalid` (replace with the canonical
   address once registered).

Please include:

- A description of the issue and its impact.
- Steps to reproduce, or a proof-of-concept if you have one.
- Affected versions if known.
- Whether the issue has been disclosed elsewhere.

We aim to acknowledge reports within 72 hours and provide a remediation
timeline within 7 days.

## Scope

In scope:

- Code in this repository (SvelteKit web app, Tauri shell, Rust shell).
- Default build configurations and CI workflows.
- Anything that could leak local user data, settings, or custom presets
  off the user's device.

Out of scope:

- Third-party services not run by this project (we don't run any).
- Vulnerabilities in upstream dependencies that are already publicly
  disclosed and have a documented fix path. Please file those upstream.

## Privacy reports

OpenBLS's stated posture is zero outbound network requests at runtime.
If you observe the app making any unexpected network request (DNS
resolution, HTTP, WebSocket, anything), please treat that as a privacy
defect and report it under this policy. We treat unintended outbound
traffic as a security-class issue.

## Disclosure

We coordinate disclosure with reporters and aim for a public advisory
once a fix is available. Credit is offered to reporters who want it.
