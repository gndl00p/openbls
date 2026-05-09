# Tactile output protocol — v1.x draft

Status: **draft — not implemented in v1**.

This document captures design notes for the tactile/haptic output
layer that ships in v1.x. It is started in v1 so vendors of existing
tactile EMDR hardware (Bi-Tapp, TheraTapper, Neurotek, EMDR Kit) can
review and propose interop changes before implementation begins.

## Goals

1. **Deliver alternating L/R tactile pulses** synchronized with
   OpenBLS's existing visual and audio engines.
2. **Vendor-agnostic.** The protocol should work for any consumer
   haptic device (vibrating wristbands, USB pulsers, Bluetooth
   buzzers, phone-as-buzzer companion app) that can implement the
   wire format.
3. **No proprietary protocols.** OpenBLS does not ship vendor-specific
   integration code. Vendors implement the documented protocol on
   their end.
4. **Out-of-the-box: zero hardware.** v1.x will continue to ship the
   Butterfly Hug guide as the no-hardware fallback. Tactile is an
   add-on, not a requirement.

## Transport options under consideration

### Web Bluetooth (browser + Tauri)

- **Pro**: works in modern Chrome / Edge on desktop; works in Tauri
  on platforms with WebBluetooth backends.
- **Con**: Apple Safari and Firefox do not support Web Bluetooth.
  iOS in particular cannot use this path. macOS Safari likewise.
- **Decision**: support as one of multiple paths, not the only one.

### USB HID (Tauri only)

- **Pro**: stable, low-latency, works for USB pulsers like
  TheraTapper.
- **Con**: not available in the web build at all. Requires a Rust-
  side bridge in the Tauri shell.
- **Decision**: ship in Tauri only; web build does not support USB.

### Companion-phone-as-buzzer (web Vibration API)

- **Pro**: zero-cost-to-the-user tactile. Phone in each hand,
  alternating vibration via WebRTC data channel from the desktop
  controller.
- **Con**: Web Vibration API is not exposed on iOS Safari. Android
  only. Requires WebRTC peer setup and a way to discover peers
  without a server (LAN broadcast or QR-paired offer/answer).
- **Decision**: ship on Android-only as opt-in.

## Wire format (proposed)

Regardless of transport, the device receives a stream of pulse
descriptors:

```
Pulse {
  channel: "L" | "R",
  startMs: number,        // milliseconds since session start
  durationMs: number,
  intensity: number,      // 0.0 – 1.0
}
```

Devices acknowledge with:

```
Ack {
  pulseId: number,
  observedDelayMs: number,
}
```

Sessions begin with a `Hello` exchange that negotiates supported
intensity granularity, max intensity, and minimum pulse duration.

## Latency budget

Bilateral stimulation timing matters. The orthodox EMDR convention
has each sweep at roughly 0.5–1.0 seconds end-to-end. A pulse delay
of >50 ms across L and R will be perceptible as out-of-sync.

Targets:

- Web Bluetooth → BLE peripheral: ≤ 30 ms median, ≤ 80 ms p99.
- USB HID via Tauri: ≤ 5 ms median, ≤ 20 ms p99.
- WebRTC to companion phone over LAN: ≤ 50 ms median, ≤ 150 ms p99.

The session engine schedules pulses with the device's reported delay
factored in, so the user-felt timing matches the visual sweep within
the perceptual threshold.

## Security

A device that connects to OpenBLS is granted control over a peripheral
on the user's body. Two non-negotiable rules:

1. **Pairing is explicit, every session.** No persistent auto-pair. The
   user confirms the device on each new session unless they opt in to
   "remember this device" with a clear UI.
2. **No unsolicited control.** A paired device cannot issue commands
   to OpenBLS — the protocol is one-way (OpenBLS commands the device,
   device only sends Acks).

## Open questions

- Does any vendor want to implement this? (Outreach to be done after
  this draft stabilizes.)
- Is there value in a reference implementation of the wire format on
  a cheap dev board (ESP32, Pi Pico)?
- Does the spec need to cover battery / power-state reporting from
  the device?
