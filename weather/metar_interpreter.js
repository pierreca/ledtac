'use strict';

const debug = require('debug')('metar_interpreter');
const parseMetar = require('metar');

module.exports.getCategory = function (metarString) {
  const decoded = parseMetar(metarString);
  debug('decoded metar:');
  debug(JSON.stringify(decoded, null, 2));

  let ceiling = 9999;
  decoded.clouds.forEach((layer) => {
    if (layer.abbreviation === 'BKN' || layer.abbreviation === 'OVC') {
      if (layer.altitude < ceiling) {
        ceiling = layer.altitude;
      }
    }
  });
  debug('ceiling: ' + ceiling);

  let category;
  if (decoded.visibility < 3) {
    category = 'ifr';
  } else if (decoded.visibility <= 5) {
    category = 'mvfr';
  } else {
    category = 'vfr';
  }

  if (ceiling < 500) {
    category = 'lifr';
  } else if (ceiling < 1000) {
    category = 'ifr';
  } else if (ceiling < 3000 && category === 'vfr') {
    category = 'mvfr';
  }

  return category;
};
