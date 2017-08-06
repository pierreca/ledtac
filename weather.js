'use strict';

var http = require('http');
var parseMetar = require('metar');

function downloadMetar(airportCode, callback) {
  var url = 'http://tgftp.nws.noaa.gov/data/observations/metar/stations/' + airportCode + '.TXT';
  var req = http.request(url, (res) => {
    if (res.statusCode >= 300) {
      callback(new Error('could not get METAR for ' + airpotCode));
    } else {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        var metarString = rawData.split('\n')[1]
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
    console.log('could not determine category based on visibility: ' + visibility);
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
      var ceiling = getMetarCeiling(decoded);
      var category = getMetarCategory(ceiling, decoded.visibility);

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