'use strict';

const metar_downloader = require('../weather/metar_downloader.js');

describe('metar_downloader', () => {
  [
    'KRNT',
    'KBFI',
    'KSEA',
    'KPAE',
    'K0S9',
    'KOLM',
    'KTCM',
    'KGRF',
    'KPWT',
    'KSHN',
    'KPLU',
    'KAWO'
  ].forEach((station) => {
    it('can download metar for ' + station, (testCallback) => {
      metar_downloader.downloadFor(station, (err, metarString) => {
        expect(err).toBeUndefined();
        expect(metarString).toContain(station);
        testCallback();
      });
    });
  });

  it('cannot download metar for inexistant airport', (testCallback) => {
    metar_downloader.downloadFor('FAKEAIRPORT', (err, metarString) => {
      expect(metarString).toBeUndefined();
      expect(err).toBeInstanceOf(Error);
      testCallback();
    });
  });
});