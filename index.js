require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const bodyParser = require('body-parser');
const { parse } = require('url');
const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('api/shorturl', function(req, res) {
  const { originalUrl } = req.body;
  const parsedUrl = parse(originalUrl);

  dns.lookup(parsedUrl.hostname, (err) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortUrl = generateShortUrl();
    res.json({ originalUrl, shortUrl });
  });

});


const generateShortUrl = () => Math.random().toString(36).substr(2, 5);



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
