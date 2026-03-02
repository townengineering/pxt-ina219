# INA219 Current / Voltage Sensor for micro:bit (MakeCode)

This MakeCode extension adds support for the Adafruit INA219 current and power sensor breakout board.

It allows a micro:bit to measure:

- Bus voltage (V)
- Shunt voltage (mV)
- Current (mA)
- Power (W)

Designed for classroom experiments with motors, turbines, batteries, and general electrical investigations.

---

## Hardware

Tested with the Adafruit INA219 breakout (default I2C address: `0x40`).

Typical shunt resistor on the breakout: **0.1Ω**

---

## Wiring

| micro:bit | INA219 |
|-----------|--------|
| 3V        | VCC    |
| GND       | GND    |
| P19       | SCL    |
| P20       | SDA    |

The micro:bit uses I2C on pins P19 (SCL) and P20 (SDA).

---

## Installing the Extension

1. Open MakeCode for micro:bit.
2. Create a new project.
3. Click **Extensions**.
4. Paste this repository’s GitHub URL.
5. Add the extension.

You will see a new **INA219** category in the Blocks menu.

---

## Basic Example

```typescript
INA219.begin(0x40, 0.1)

basic.forever(function () {
    serial.writeLine("Voltage (V): " + INA219.busVoltage_V())
    serial.writeLine("Current (mA): " + INA219.current_mA())
    serial.writeLine("Power (W): " + INA219.power_W())
    serial.writeLine("---")
    basic.pause(500)
})
```

Open the **Serial** console in MakeCode to view measurements.

---

## Calibration Notes

Default configuration assumes:

- 0.1Ω shunt resistor
- Approximately 3.2A maximum range
- 100µA current resolution

If using a different shunt resistor value:

```typescript
INA219.begin(0x40, 0.05)
```

Replace `0.05` with your actual shunt resistance in ohms.

---

## License

MIT
