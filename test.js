const https = require('https');
https.get('https://www.tripadvisor.com/WidgetEmbed-selfserveprop?locationId=34231219&lang=en_US&display=true', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data.length));
});
