'use strict';

const debug = require('debug')('weather');
const metarDownloader = require('./metar_downloader');
const metarInterpreter = require('./metar_interpreter');

module.exports.getCategoryForStation = function (stationCode, callback) {
  metarDownloader.downloadFor(stationCode, (err, metar) => {
    if (err) {
      debug(err.toString());
      callback(err);
    } else {
      const category = metarInterpreter.getCategory(metar);
      callback(undefined, category);
    }
  });
};
