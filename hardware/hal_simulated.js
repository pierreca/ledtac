'use strict';

const EventEmitter = require('events');
const debug = require('debug')('hal:simulated');

/**
 * Fake LED class that implements the color method.
 *
 * @param {number} i2cAddress The i2c address of the LED
 */
class SimulatedLED {
  constructor(i2cAddress) {
    this._i2cAddress = i2cAddress;
  }

  /**
   * Simulates setting an LED to a particular color
   *
   * @param {string} colorCode The hex code for the color to use
   */
  color(colorCode) {
    debug('LED at address ' + this._i2cAddress + ' set to color ' + colorCode);
  }
}

/**
 * Hardware simulator class to test the code when it's not running on a Raspberry Pi.
 */
class HardwareSimulator extends EventEmitter {
  constructor() {
    super();
    this.ready = false;
    this.ledsInitialized = false;
    this._leds = [];
    setTimeout(() => {
      this.ready = true;
      this.emit('ready');
    }, 1000);
  }

  /**
   * Simulates initializing LEDs at each address provided in the array passed as argument.
   *
   * @param {Array} i2cAddresses An array of numbers corresponding to i2c addresses for each LED.
   */
  initializeLEDs(i2cAddresses) {
    if (!this.ready) {
      throw new Error('Cannot initialize LEDs if the Raspberry Pi is not ready');
    } else {
      i2cAddresses.forEach((i2cAddress) => {
        debug('Creating LED object with address ' + i2cAddress);
        this._leds[i2cAddress] = new SimulatedLED(i2cAddress);
      });
      this.ledsInitialized = true;
    }
  }

  /**
   * Simulates setting an LED at a specific address to a particular color.
   *
   * @param {number} i2cAddress I2C address of the LED.
   * @param {string} color      Stringified RGB code to set the LED color to.
   */
  setLEDColor(i2cAddress, color) {
    if (!this.ready) {
      throw new Error('Cannot set LED color if the simulator is not ready');
    } else if (!this.ledsInitialized) {
      throw new Error('Cannot set LED color if the LEDs not been initialized');
    } else {
      this._leds[i2cAddress].color(color);
    }
  }
}

module.exports = HardwareSimulator;