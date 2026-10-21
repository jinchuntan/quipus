# Bluetooth recorder setup

Chrome on Windows and Android can provision the Waveshare recorder directly
from `/dashboard/devices`. The browser stays connected to the internet. The
user chooses a nearby recorder, approves OS Bluetooth pairing if requested,
enters Wi-Fi details, and chooses **Save and connect**. The account pairing code
is generated automatically. Bluetooth does not replace the recorder's Wi-Fi
for recording uploads, speech or Agora. iPhone Safari uses the existing local
Wi-Fi setup, available under **Use Wi-Fi setup instead**.

Firmware 0.10.0 must be installed once through USB; opening the new website
cannot enable Bluetooth in an older image. Existing sdkconfig files must have
NimBLE and `CONFIG_QUIPUS_BLE_SETUP` enabled; changed defaults do not override
saved configurations. The packaged manifest reports `bluetoothSetup: true`.

## Security and ownership

- Setup advertises only while the device is unpaired and its setup portal is
  active. A paired recorder cannot be claimed or transferred through BLE.
- GATT setup writes and status reads require authenticated, encrypted Bluetooth
  LE Secure Connections, a 16-byte encryption key, and a fresh six-digit passkey
  shown on the physical LCD. Legacy pairing and debug keys are disabled. The OS
  owns the pairing dialog; the website cannot bypass its device chooser or PIN.
- The only public characteristic reports protocol version, firmware, backend
  origin, hardware ID and availability. Browser code checks the backend before
  accessing private status or sending credentials. Hardware IDs are returned
  only for the signed-in user's devices by the existing device API.
- Wi-Fi details stay in component memory and encrypted GATT writes. They are
  never sent to Quipus HTTP APIs, logged or saved in browser storage. The pairing
  API receives only a device name. Password fields and transfer copies are
  cleared after submission, failure or disconnect.
- Bluetooth and HTTP share the same validated NVS save path. A mutex excludes
  cloud claiming during an atomic setup save, and a committed save prevents a
  late claim using the previous configuration before restart.
- A browser disconnect during commit is ambiguous. The website verifies the
  physical hardware ID against a fresh online update in the signed-in account.
  A local `saved` acknowledgement never marks the recorder online.

## GATT protocol v1

| Purpose | UUID | Access |
| --- | --- | --- |
| Service | `71817060-8ac5-45ec-9c18-21429ab00001` | Advertised |
| Public info | `71817060-8ac5-45ec-9c18-21429ab00002` | Read |
| Setup control | `71817060-8ac5-45ec-9c18-21429ab00003` | Authenticated encrypted write with response |
| Status | `71817060-8ac5-45ec-9c18-21429ab00004` | Authenticated encrypted read |

Info JSON: `v`, `firmware`, `backend`, `hardwareId`, `available`.
Status JSON: `v`, `state`, `error`, `savedSsid`, `networks` (up to four SSIDs).
States: `ready`, `scanning`, `saving`, `saved`, `error`. Reads are bounded at 512
bytes and Wi-Fi scan results are trimmed to fit. No password or cloud device
credential is returned.

Control writes fit the default 23-byte ATT MTU; no platform MTU negotiation or
deprecated Web Bluetooth write API is required:

| Opcode | Payload |
| --- | --- |
| `01` begin | Two-byte little-endian total length, 1–1024 bytes |
| `02` data | Two-byte little-endian sequence, starting at zero; 1–17 data bytes |
| `03` commit | No payload; valid only when the declared byte count is complete |
| `04` cancel | No payload; erases staged credentials |
| `05` scan | No payload; scans Wi-Fi asynchronously, then read status |

The body is the existing UTF-8 form encoding of `ssid`, `password`, `code`.
Empty SSID/password can reuse the recorder's saved network. Only a complete,
ordered transfer within 30 seconds can be queued. Invalid length, sequence,
embedded NUL, cancellation or disconnect erases staging. The HTTP form parser
rejects duplicates, unknown fields, invalid encoding and overlong values.

## Validation

- `python3 scripts/test-firmware-boards.py`: board/PCM regression checks plus
  portable C tests for credential encoding, partial commits, bounds, ordering,
  timeout, replay after cleanup and clearing staged credentials.
- `node --import tsx --test tests/recorder-bluetooth.test.ts`: browser transport
  framing, immediate chooser, backend/ownership checks, interrupted writes,
  credential validation and exact-device verification.
- `QUIPUS_CHROMIUM_EXECUTABLE=/path/to/chromium node
  hardware/lantern-firmware/tests/bluetooth-setup.browser.mjs`: real Chromium
  component UI with a simulated GATT peripheral, desktop/320px layouts,
  cancel/unsupported/wrong-backend/disconnect paths and cloud verification.
- Production Next.js and Waveshare ESP-IDF builds, application tests, ESLint,
  TypeScript, CSS lint and formatting.

Physical acceptance is still required: pair from Chrome on Windows and Android,
check the displayed PIN and OS prompt, verify scan/hidden/open networks and a
wrong password, retry after Bluetooth/radio interruption and power loss, confirm
Bluetooth disappears after pairing, and record/upload/replay audio with Agora.

## References

- [Chrome Web Bluetooth](https://developer.chrome.com/docs/capabilities/bluetooth)
- [ESP-IDF NimBLE peripheral example](https://github.com/espressif/esp-idf/tree/v5.2.3/examples/bluetooth/nimble/bleprph)
- [ESP32-S3 Bluetooth overview](https://docs.espressif.com/projects/esp-idf/en/v5.2.1/esp32s3/api-guides/bluetooth.html)
