# LED-TAC: Terminal Area Chart with Weather Information

Johnny-5 is used with the BlinkM driver for the RGB LEDs.

MetarJS is used to decode the weather information.

Metars can be downloaded using the following format:
```
http://www.aviationweather.gov/metar/data?ids=' + <AIRPORT_CODE> + '&format=raw&hours=0&taf=off&layout=off&date=0 
```

The `config.json` file contains the list of stations for which to download METAR information as well as the matching i2c address for the BlinkM LEDs.