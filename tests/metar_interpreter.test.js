'use strict';

const metar_interpreter = require('../weather/metar_interpreter');

describe('metar_interpreter', () => {
  [
    {
      metarString: 'KRNT 210353Z 13009G18KT 10SM BKN004 09/03 A2997 RMK AO2 SLP154 T00940028',
      expectedCategory: 'lifr'
    },
    {
      metarString: 'KBFI 210353Z 15011KT 2SM BKN080 BKN090 08/03 A2997 RMK AO2 SLP149 T00780033',
      expectedCategory: 'ifr'
    },
    {
      metarString: 'KSEA 210353Z 17012G22KT 10SM BKN008 BKN044 OVC100 08/03 A2996 RMK AO2 SLP154 T00780028',
      expectedCategory: 'ifr'
    },
    {
      metarString: 'KPAE 210353Z 12019G25KT 10SM FEW033 BKN042 BKN050 08/03 A2995 RMK AO2 SLP144 T00780028',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'K0S9 210355Z AUTO 13019G25KT 10SM OVC017 07/06 A2987 RMK AO2',
      expectedCategory: 'mvfr'
    },
    {
      metarString: 'KOLM 210354Z 18014G20KT 4SM FEW017 BKN075 OVC100 07/05 A2999 RMK AO2 SLP155 T00720050',
      expectedCategory: 'mvfr'
    },
    {
      metarString: 'KTCM 210358Z AUTO 17009KT 10SM FEW085 07/07 A2999 RMK AO2 SLP161 T00730072 $',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KGRF 210358Z AUTO 14010KT 10SM SCT080 SCT100 07/07 A2998 RMK AO2 SLP158 T00740070 $',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KPWT 210356Z AUTO 19011KT 10SM BKN012 OVC050 06/05 A2995 RMK AO2 RAB41E52 SLP159 P0000 T00610050',
      expectedCategory: 'mvfr'
    },
    {
      metarString: 'KSHN 210353Z AUTO 15008KT 10SM -RA FEW037 BKN048 OVC095 07/06 A2995 RMK AO2 RAB05E16B39 SLP144 P0000 T00720056 $',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KPLU 210355Z AUTO VRB06G14KT 10SM FEW047 BKN100 08/03 A2999 RMK AO2',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KAWO 210356Z AUTO 13018G25KT 10SM OVC042 08/03 A2996 RMK AO2 PK WND 12027/0304 SLP149 T00830028',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KAWO 210356Z AUTO 13018G25KT 10SM SKC 08/03 A2996 RMK AO2 PK WND 12027/0304 SLP149 T00830028',
      expectedCategory: 'vfr'
    },
    {
      metarString: 'KSHN 142111Z AUTO 00000KT 2 1/2SM RA BR FEW013 BKN025 OVC036 11/08 A3011 RMK AO2 P0005 T01060083',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KPAE 141853Z 12011KT 2 1/2SM -RA BR SCT004 BKN008 OVC014 09/08 A3018 RMK AO2 RAB1754E20B53 SLP222 P0',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KPAE 141828Z 13012KT 2 1/2SM BR SCT004 BKN008 OVC014 09/08 A3019 RMK AO2 RAB1754E20 P0001 T00890083',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KPWT 141911Z AUTO 25008KT 2 1/2SM RA BR OVC007 08/08 A3018 RMK AO2 CIG 004V012 P0002',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KPAE 141710Z 13008KT 2 1/2SM -RA BR OVC006 08/08 A3021 RMK AO2 P0001 T00830078',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KPWT 141733Z AUTO 24006KT 2 1/2SM -RA BR BKN005 OVC015 08/07 A3020 RMK AO2 CIG 004V008 P0001',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KOLM 141239Z AUTO VRB05KT 2 1/2SM RA BR BKN007 OVC013 09/08 A3024 RMK AO2 CIG 005V010 P0009 T00890078',
      expectedCategory: 'ifr',
    },
    {
      metarString: 'KSHN 142353Z AUTO 35008KT 1 1/4SM +RA BR FEW015 BKN024 OVC030 08/07 A3003 RMK AO2 SLP172 P0040 60075 T00830067 10106 20083 56027',
      expectedCategory: 'ifr',
    }
  ].forEach((testConfig) => {
    it('returns ' + testConfig.expectedCategory + ' for ' + testConfig.metarString, () => {
      const category = metar_interpreter.getCategory(testConfig.metarString);
      expect(category).toBe(testConfig.expectedCategory);
    });
  });
});