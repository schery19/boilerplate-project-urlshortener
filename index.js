require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dns = require('dns');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const { parse } = require('url');

const app = express();


// Basic Configuration
const port = process.env.PORT || 3000;


app.use(express.urlencoded());
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));



app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const { url } = req.body;

  if (!isValidHttpUrl(url)) {
    return res.json({ error: 'invalid url' });
  }

  const parsedUrl = parse(url);

  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err || !address) {
      // Si l'URL n'est pas valide
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const short_url = generateShortUrl();
    localStorage.setItem(short_url, url);

    res.json({original_url: url, short_url });
  });


});


app.get('/api/shorturl/:shortUrl', (req, res) => {
  let original_url = localStorage.getItem(req.params.shortUrl);

  if(original_url) 
    res.redirect(original_url)
  else
    res.status(404).json({ error: 'URL not found' });
})


const generateShortUrl = () => Math.floor(Math.random() * 10000);

function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:'; // Only allow HTTP/HTTPS URLs
  } catch (_) {
    return false;
  }
}



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
