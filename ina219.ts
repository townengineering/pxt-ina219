//% color=#0fbcf9 icon="\uf201" block="INA219"
namespace INA219 {
    const INA219_ADDR_DEFAULT = 0x40

    const REG_CONFIG = 0x00
    const REG_SHUNT_VOLTAGE = 0x01
    const REG_BUS_VOLTAGE = 0x02
    const REG_POWER = 0x03
    const REG_CURRENT = 0x04
    const REG_CALIBRATION = 0x05

    const CONFIG_BVOLTAGERANGE_32V = 0x2000
    const CONFIG_GAIN_8_320MV = 0x1800
    const CONFIG_BADCRES_12BIT = 0x0400
    const CONFIG_SADCRES_12BIT = 0x0018
    const CONFIG_MODE_SANDBUS_CONTINUOUS = 0x0007

    let _addr = INA219_ADDR_DEFAULT
    let _shuntOhms = 0.1
    let _currentLSB_A = 0.0001
    let _powerLSB_W = 0.0
    let _initialized = false

    function writeReg16(reg: number, value: number) {
        const buf = pins.createBuffer(3)
        buf[0] = reg & 0xff
        buf[1] = (value >> 8) & 0xff
        buf[2] = value & 0xff
        pins.i2cWriteBuffer(_addr, buf)
    }

    function readReg16(reg: number): number {
        pins.i2cWriteNumber(_addr, reg, NumberFormat.UInt8BE)
        const buf = pins.i2cReadBuffer(_addr, 2)
        return (buf[0] << 8) | buf[1]
    }

    function readReg16Signed(reg: number): number {
        const v = readReg16(reg)
        return (v & 0x8000) ? (v - 0x10000) : v
    }

    function ensureInit() {
        if (!_initialized) begin(INA219_ADDR_DEFAULT, 0.1)
    }

    /**
     * Initialize the INA219 with a practical default calibration.
     * @param addr I2C address (default 0x40)
     * @param shuntOhms Shunt resistor value in ohms (default 0.1)
     */
    //% block="INA219 begin addr $addr shunt(ohms) $shuntOhms"
    //% addr.defl=0x40
    //% shuntOhms.defl=0.1
    export function begin(addr: number = INA219_ADDR_DEFAULT, shuntOhms: number = 0.1) {
        _addr = addr
        _shuntOhms = shuntOhms

        _currentLSB_A = 0.0001
        _powerLSB_W = 20 * _currentLSB_A

        const cal = Math.floor(0.04096 / (_currentLSB_A * _shuntOhms))
        writeReg16(REG_CALIBRATION, cal)

        const config =
            CONFIG_BVOLTAGERANGE_32V |
            CONFIG_GAIN_8_320MV |
            CONFIG_BADCRES_12BIT |
            CONFIG_SADCRES_12BIT |
            CONFIG_MODE_SANDBUS_CONTINUOUS

        writeReg16(REG_CONFIG, config)
        _initialized = true
    }

    /**
     * Bus voltage in volts.
     */
    //% block="INA219 bus voltage (V)"
    export function busVoltage_V(): number {
        ensureInit()
        const raw = readReg16(REG_BUS_VOLTAGE)
        return (raw >> 3) * 0.004
    }

    /**
     * Shunt voltage in millivolts.
     */
    //% block="INA219 shunt voltage (mV)"
    export function shuntVoltage_mV(): number {
        ensureInit()
        const raw = readReg16Signed(REG_SHUNT_VOLTAGE)
        return raw * 0.01
    }

    /**
     * Current in milliamps.
     */
    //% block="INA219 current (mA)"
    export function current_mA(): number {
        ensureInit()
        const raw = readReg16Signed(REG_CURRENT)
        return raw * _currentLSB_A * 1000
    }

    /**
     * Power in watts.
     */
    //% block="INA219 power (W)"
    export function power_W(): number {
        ensureInit()
        const raw = readReg16(REG_POWER)
        return raw * _powerLSB_W
    }
}