INA219.begin(0x40, 0.1)

basic.forever(function () {
    serial.writeLine("V=" + INA219.busVoltage_V())
    serial.writeLine("I(mA)=" + INA219.current_mA())
    serial.writeLine("P(W)=" + INA219.power_W())
    basic.pause(500)
})