# LED-TAC: Terminal Area Chart with Weather Information

[![Build Status](https://travis-ci.org/pierreca/ledtac.svg?branch=master)](https://travis-ci.org/pierreca/ledtac)

[Project Page on hackaday.io](https://hackaday.io/project/28354-lighted-tac-chart-with-weather-information). (includes details about the hardware).

[Johnny-5](https://github.com/rwaldron/johnny-five) is used with the BlinkM driver for the RGB LEDs. There is also a rudimentary "hardware simulator" to enable running this on something else than the Raspberry Pi hardware (useful for debugging). [raspi-io](https://github.com/nebrius/raspi-io) is used to run Johnny 5 on the Raspberry Pi itself.

[MetarJS](https://github.com/skydivejkl/metar.js) is used to decode the weather information (Metar reports).

Metars can be downloaded using the following format:
```
http://www.aviationweather.gov/metar/data?ids=' + <AIRPORT_CODE> + '&format=raw&hours=0&taf=off&layout=off&date=0
```

The `config.json` file contains the list of stations for which to download METAR information as well as the matching i2c address for the BlinkM LEDs.
