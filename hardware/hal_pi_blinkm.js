'use strict';

const EventEmitter = require('events');
const debug = require('debug')('hal:pi');
const five = require('johnny-five');
const Raspi = require('raspi-io');

/**
 * Hardware implementation using a Raspberry Pi and BlinkM LEDs.
 */
class PiBlinkM extends EventEmitter {
  constructor() {
    super();
    this.ready = false;
    this.ledsInitialized = false;

    this._pi = new five.Board({
      io: new Raspi()
    });

    this._pi.on('ready', () => {
      this.ready = true;
      this.emit('ready');
    });

    this._leds = [];
  }

  /**
   * Initializing LEDs at each address provided in the array passed as argument.
   *
   * @param {Array} i2cAddresses An array of numbers corresponding to i2c addresses for each LED.
   */
  initializeLEDs(i2cAddresses) {
    if (!this.ready) {
      throw new Error('Cannot initialize LEDs if the Raspberry Pi is not ready');
    } else {
      i2cAddresses.forEach((i2cAddress) => {
        debug('Creating LED object with address ' + i2cAddress);
        this._leds[i2cAddress] = new five.Led.RGB({
          address: i2cAddress,
          controller: 'BLINKM'
        });
      });
      this.ledsInitialized = true;
    }
  }

  /**
   * Sets an LED at a specific address to a particular color.
   *
   * @param {number} i2cAddress I2C address of the LED.
   * @param {string} color      Stringified RGB code to set the LED color to.
   */
  setLEDColor(i2cAddress, color) {
    if (!this.ready) {
      throw new Error('Cannot set LED color if the Raspberry Pi is not ready');
    } else if (!this.ledsInitialized) {
      throw new Error('Cannot set LED color if the LEDs have not been initialized');
    } else {
      this._leds[i2cAddress].color(color);
    }
  }
}

module.exports = PiBlinkM;