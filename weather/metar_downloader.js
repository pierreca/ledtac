'use strict';

const debug = require('debug')('metar_downloader');
const http = require('http');

module.exports.downloadFor = function (airportCode, callback) {
  const url = 'http://tgftp.nws.noaa.gov/data/observations/metar/stations/' + airportCode + '.TXT';
  const req = http.request(url, (res) => {
    if (res.statusCode >= 300) {
      callback(new Error('could not get METAR for ' + airportCode));
    } else {
      let rawData = '';
      res.on('data', (chunk) => { rawData += chunk; });
      res.on('end', () => {
        debug('raw data: ' + rawData);
        const metarString = rawData.split('\n')[1];
        debug('raw metar: ' + metarString);
        callback(undefined, metarString);
      });
    }
  });
  req.end();
};
