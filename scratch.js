const https = require('https');

https.get('https://www.tripadvisor.com/Attraction_Review-g293890-d34231219-Reviews-Ever_Peak_Adventures-Kathmandu_Kathmandu_Valley_Bagmati_Zone_Central_Region.html', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(res.statusCode);
    const match = data.match(/(\d{1,3}(,\d{3})*)\s+reviews/i) || data.match(/(\d+)\s+reviews/i) || data.match(/class="[^"]*reviewCount[^"]*">([^<]+)<\//i);
    if (match) {
        console.log("Match:", match[1]);
    } else {
        console.log("No match found.");
        // console.log(data.substring(0, 1000));
    }
  });
}).on('error', err => console.log(err));
