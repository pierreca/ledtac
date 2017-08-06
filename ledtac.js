'use strict';

var http = require('http');
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
  console.log('Raspberry PI ready');
  config.stations.forEach((station) => {
    station.led = new five.Led.RGB({
      address: station.i2cAddress,
      controller: "BLINKM"
    });
  });

  setInterval(() => {
    console.log('Getting weather...');
    config.stations.forEach((station) => {
      console.log(station);
      weather.getCategoryForStation(station.stationCode, (err, category) => {
        if (err) {
          console.error(err.toString());
        } else {
          console.log(station.stationCode + ' is ' + category);
          station.led.color(categoryColor[category]);
        }
      });
    });
  }, config.pollingInterval)
});
