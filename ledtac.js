'use strict';

var http = require('http');
var debug = require('debug')('ledtac');
var five = require('johnny-five');
var Raspi = require('raspi-io');
var config = require('./config.json');
var weather = require('./weather');

var categoryColor = {
  lifr: 'FF69B4',
  ifr: 'FF0000',
  mvfr: '0000FF',
  vfr: '00FF00',
  unknown: '000000'
};

var pi = new five.Board({
  io: new Raspi()
});

pi.on('ready', () => {
  debug('Raspberry PI ready');
  config.stations.forEach((station) => {
    debug('Creating LED object for ' + station.stationCode + ' with address ' + station.i2cAddress);
    station.led = new five.Led.RGB({
      address: station.i2cAddress,
      controller: "BLINKM"
    });
  });

  setInterval(() => {
    debug('Getting weather...');
    config.stations.forEach((station) => {
      debug('... for ' + station.stationCode);
      weather.getCategoryForStation(station.stationCode, (err, category) => {
        if (err) {
          debug(err.toString());
        } else {
          debug(station.stationCode + ' is ' + category + ': setting color to ' + categoryColor[category]);
          station.led.color(categoryColor[category]);
        }
      });
    });
  }, config.pollingInterval)
});
