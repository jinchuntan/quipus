#pragma once
#include <stdbool.h>
#include <stddef.h>
#include "esp_err.h"

// Available only for an unpaired recorder. GATT writes use authenticated,
// encrypted LE Secure Connections with a fresh passkey on the physical LCD.
// Reserve controller/host memory before Wi-Fi. Preparation never advertises;
// start() opens discovery only after the unpaired setup portal is active.
esp_err_t lantern_bluetooth_prepare(void);
esp_err_t lantern_bluetooth_start(void);
void lantern_bluetooth_close(void);
void lantern_bluetooth_passkey(char output[7]);
