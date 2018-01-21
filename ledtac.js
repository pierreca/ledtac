'use strict';

const debug = require('debug')('ledtac');
const isPi = require('detect-rpi');
const config = require('./config.json');
const weather = require('./weather');
const Hardware = isPi() ? require('./hardware/hal_pi_blinkm') : require('./hardware/hal_simulated');

const categoryColor = {
  lifr: 'FF69B4',
  ifr: 'FF0000',
  mvfr: '0000FF',
  vfr: '00FF00',
  unknown: '000000'
};

const hardware = new Hardware();
hardware.on('ready', () => {
  debug('Hardware ready.');
  hardware.initializeLEDs(config.stations.map((station => station.i2cAddress)));

  setInterval(() => {
    debug('Getting weather...');
    config.stations.forEach((station) => {
      debug('... for ' + station.stationCode);
      weather.getCategoryForStation(station.stationCode, (err, category) => {
        if (err) {
          debug(err.toString());
          hardware.setLEDColor(station.i2cAddress, categoryColor['unknown']);
        } else {
          debug(station.stationCode + ' is ' + category + ': setting color to ' + categoryColor[category]);
          hardware.setLEDColor(station.i2cAddress, categoryColor[category]);
        }
      });
    });
  }, config.pollingInterval);
});
