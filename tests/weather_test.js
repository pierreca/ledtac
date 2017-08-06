var weather = require('../weather');

weather.downloadMetar('KRNT', (err, metar) => {
  console.log('Metar for KRNT: ' + metar);
});


weather.getCategoryForStation('KRNT', (err, cat) => {
  console.log('Category for KRNT: ' + cat);
});