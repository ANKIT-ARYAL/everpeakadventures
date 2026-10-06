const https = require('https');

https.get('https://www.tripadvisor.com/WidgetEmbed-cdspropertysummary?display=true&locationId=34231219', {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(res.statusCode);
    console.log(data.substring(0, 500));
  });
}).on('error', err => console.log(err));
