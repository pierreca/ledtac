'use strict';

var http = require('http');
var five = require('johnny-five');
var config = require('config.json');
var weather = require('./weather');

var categoryColor = {
  lifr: 'FF69B4',
  ifr: 'FF0000',
  mvfr: '0000FF',
  vfr: '00FF00',
  unknown: '000000'
};

var pi = new five.Board();
pi.on('ready', () => {
  config.stations.forEach((station) => {
    station.led = new five.Led.RGB({
      address: station.i2cAddress,
      controller: "BLINKM"
    });
  });

  setInterval(() => {
    config.stations.forEach((station) => {
      weather.getCategoryForStation(station, (category) => {
        station.color(categoryColor[category]);
      });
    });
  }, config.pollingInterval)
});
