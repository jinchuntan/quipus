# Waveshare ESP32-S3-LCD-1.54

This profile targets the **non-touch** 240 × 240 Waveshare board, with ESP32-S3R8,
16 MB flash, 8 MB octal PSRAM, ST7789 LCD, ES7210 microphone ADC, ES8311 speaker
DAC, NS4150B amplifier and microSD slot. It uses the existing Quipus
`/api/device/v1/*` protocol, pairing, consent, wake word, reports, encrypted SD
archive and upload/recovery paths. No new backend routes or device-side cloud
API keys are required.

## Hardware mapping

| Function | ESP32-S3 GPIO |
| --- | --- |
| LCD MOSI / SCLK / CS / DC / RESET / backlight | 39 / 38 / 21 / 45 / 40 / 46 |
| Shared I2C SDA / SCL | 42 / 41 |
| Audio MCLK / BCLK / LRCK | 8 / 9 / 10 |
| ES7210 microphone data / ES8311 speaker data | 11 / 12 |
| NS4150B amplifier enable, active high | 7 |
| PLUS / BOOT / PWR | 4 / 0 / 5 |
| Battery power hold / charging signal, active low | 2 / 3 |
| Battery ADC, 3:1 divider | 1 (ADC1 channel 0) |
| SD CLK / CMD / D0 | 16 / 15 / 17 |

ES7210 uses I2C address `0x40`; ES8311 uses `0x18` (7-bit addresses). Both audio
directions run at 16 kHz, 16-bit stereo on one I2S clock. Only MIC1/MIC2 are
enabled, selecting ordinary stereo I2S instead of the factory four-channel TDM
example. MIC1 supplies Quipus's mono stream. Playback duplicates mono into both
output slots, using the existing 24-to-16 kHz speech conversion. Beamforming,
acoustic echo cancellation, stereo cloud recording, touchscreen, IMU, BLE
provisioning and USB phone microphone are not enabled by this profile.

SD uses one-bit SDMMC at 10 MHz. **Recording requires a FAT32 microSD card**;
pairing and reports work without one. Cards are never formatted by Quipus.

## Build and flash

The Waveshare defaults target **https://cordra.vercel.app**. Device API calls
and the setup portal's return link use this same origin. For another deployment,
set **Lantern hardware → Quipus backend URL** in `menuconfig`, then rebuild.
An existing `sdkconfig.waveshare` keeps saved settings; editing the defaults
file alone does not override an already configured URL.

Use Quipus's **ESP-IDF 5.2.3**, pinned `esp_codec_dev` 1.5.11 and ESP-SR 2.0.1.
Waveshare's current examples use IDF 5.5.1; this integration implements the
hardware mapping through Quipus's existing 5.2 APIs and Agora integration.

On Windows, after installing the repository's toolchain, from this directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-agora-sdk.ps1
powershell -ExecutionPolicy Bypass -File .\build-waveshare.ps1
powershell -ExecutionPolicy Bypass -File .\flash-waveshare.ps1 -Port COM5 -Monitor
```

On Linux/macOS, install the existing Agora component and activate ESP-IDF:

```sh
idf.py -B build-waveshare -D IDF_TARGET=esp32s3 \
  -D SDKCONFIG=sdkconfig.waveshare \
  -D SDKCONFIG_DEFAULTS=sdkconfig.waveshare.defaults build
idf.py -B build-waveshare -D SDKCONFIG=sdkconfig.waveshare \
  -p /dev/ttyACM0 flash monitor
```

Output is isolated in `build-waveshare`. Flash the complete build initially to
install the bootloader, partition table, app and WakeNet model; this replaces
the factory application. Original and V2 images target different hardware.
If automatic USB reset fails, hold BOOT while reconnecting USB, release BOOT,
then use `-ManualBootloader` in the Windows flash script.

The default assumes USB power and reports battery percentage as unknown. With
a battery attached, run the build command with `menuconfig` instead of `build`,
enable **Lantern hardware → Waveshare lithium battery installed**, then rebuild.
Voltage uses ESP-IDF curve-fitting calibration and the board's 3:1 divider.
Percentage is an estimate to check against the actual battery; capacity and
charge-time estimates are not assumed for an optional accessory.

## Pair and use

1. Sign in at **https://cordra.vercel.app/dashboard/devices** and create a
   pairing code. Use the deployment configured in your firmware if you changed it.
   Join `Quipus-XXXX`, password `lanternsetup`, then return to that dashboard
   tab and choose **Open recorder setup**. Firmware 0.9.2 and later fill in the code;
   enter 2.4 GHz Wi-Fi/hotspot details and save. Reconnect the phone/laptop to
   normal internet; setup returns to the Quipus website when it is reachable.
   A **Return to Quipus** link remains available. The manual fallback is
   `http://192.168.4.1/` plus the pairing code shown on the dashboard.
2. Short-press **PLUS** to request recording, then follow the consent prompt.
   Press PLUS again to stop. Hold PLUS for 1.2 seconds while ready for a daily
   report. PLUS also interrupts report playback.
3. The existing wake phrase is **Computer**; follow it with a command.
4. Hold **BOOT + PLUS** for three seconds to clear Wi-Fi/pairing. Unsynced
   private recordings block reset until synced.
5. Hold **PWR** for two seconds while ready to power down. Active sessions and
   unsynced private recordings block shutdown. USB-powered boards enter deep
   sleep after button release; press PWR again to wake.

## Validation

Run `python3 scripts/test-firmware-boards.py` from the repository root for
portable board selection and audio channel regressions.

Run `python3 hardware/lantern-firmware/generate-setup-portal.py --check` to check
the embedded HTML/JavaScript. The portal browser test also covers fragment
handoff, offline waiting and online return for both confirmation pages. On
Linux, set `QUIPUS_CHROMIUM_EXECUTABLE` to an installed Chromium binary, then
run `node hardware/lantern-firmware/tests/setup-portal.browser.mjs`.
Set `QUIPUS_WEB_ORIGIN=https://cordra.vercel.app` to test the Waveshare return
destination; otherwise the browser harness uses the original backend fallback.

Package the compiled image from the repository root:

```sh
python3 scripts/package-hardware-artifacts.py --profile waveshare
```

The ZIP contains the exact
generated flash offsets, all five images, checksums and setup instructions.

No physical board was available during implementation. Before using this image
for a meeting, verify display colors/orientation, microphone speech/silence
levels, audible prompts, PLUS controls, pairing/heartbeats and a recording over
60 seconds whose replay duration matches capture. Test recovery after loss of
Wi-Fi and check optional battery voltage against a meter.

## Sources

- [Waveshare documentation](https://docs.waveshare.com/ESP32-S3-Touch-LCD-1.54)
  covers both touch and non-touch variants.
- [Waveshare schematic](https://files.waveshare.com/wiki/ESP32-S3-Touch-LCD-1.54/ESP32-S3-LCD-1.54-Schematic.pdf).
- [Factory BSP at commit 5157db7](https://github.com/waveshareteam/ESP32-S3-Touch-LCD-1.54/tree/5157db7c888e476fd57f8a95020800377447478f/examples/ESP32-S3-LCD-1.54-demo/ESP-IDF-5.5.1/01_factory/components/esp_bsp):
  `bsp_display.h/.c`, `bsp_codec.c`, `bsp_i2c.h`, `bsp_power_manager.c`,
  `bsp_sdcard.h`; buttons from `02_button_example/main/main.c`.
