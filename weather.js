'use strict';

var debug = require('debug')('weather');
var http = require('http');
var parseMetar = require('metar');

function downloadMetar(airportCode, callback) {
  var url = 'http://tgftp.nws.noaa.gov/data/observations/metar/stations/' + airportCode + '.TXT';
  var req = http.request(url, (res) => {
    if (res.statusCode >= 300) {
      callback(new Error('could not get METAR for ' + airportCode));
    } else {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        debug('raw data: ' + rawData);
        var metarString = rawData.split('\n')[1]
        debug('raw metar: ' + metarString);
        callback(undefined, metarString);
      });
    }
  });
  req.end();
}

function getMetarCeiling(decodedMetar) {
  var ceiling = 9999;
  decodedMetar.clouds.forEach((layer) => {
    if (layer.abbreviation === 'BKN' || layer.abbreviation === 'OVC') {
      ceiling = layer.altitude;
    }
  });

  return ceiling;
}

function getMetarCategory(ceiling, visibility) {
  var category = 'unknown';
  if (visibility < 3) {
    category = 'ifr';
  } else if (visibility <= 5) {
    category = 'mvfr';
  } else {
    category = 'vfr';
  }

  if (category === 'unknown') {
    debug.log('could not determine category based on visibility: ' + visibility);
  } else {  
    if (ceiling < 500 || category === 'lifr') {
      category = 'lifr';
    } else if (ceiling < 1000 && category !== 'ifr') {
      category = 'ifr';
    } else if (ceiling < 3000 && category === 'vfr') {
      category = 'mvfr';
    }
  }

  return category;
}

function getCategoryForStation (stationCode, callback) {
  downloadMetar(stationCode, (err, metar) => {
    if (err) {
      console.error(err.toString());
      callback(err);
    } else {
      var decoded = parseMetar(metar);
      debug('decoded metar:');
      debug(JSON.stringify(decoded, null, 2));
      var ceiling = getMetarCeiling(decoded);
      debug('ceiling: ' + ceiling);
      var category = getMetarCategory(ceiling, decoded.visibility);
      debug('category: ' + category);
      callback(undefined, category);
    }
  });
};

module.exports = {
  downloadMetar: downloadMetar,
  getMetarCeiling: getMetarCeiling,
  getMetarCategory: getMetarCategory,
  getCategoryForStation: getCategoryForStation,
}
