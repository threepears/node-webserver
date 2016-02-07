"use strict";

const express = require("express");
const bodyParser = require("body-parser");
//const upload = require('multer')({ dest: 'tmp/uploads' });

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'tmp/uploads')
   },
    filename: function (req, file, cb) {
    const beforeDot = file.fieldname + '-' + Date.now();
    const getFileType = file.originalname;
    const afterDot = getFileType.slice(-4);

    const newFileName = beforeDot + afterDot;

    cb(null, newFileName)
    }
})

const upload = multer({ storage: storage })

const imgur = require('imgur');
const path = require('path');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.locals.title = "Super Cool Calendar App";


// Home page
app.get('/', (req, res) => {
  res.render('index', {
    date: new Date()
  });
});


// API page with CORS header
app.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});

app.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, (val) => val.toUpperCase());
  res.send(obj);
});


// Weather page
//All callbacks in Node lead with error (err)
app.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/00c2032f84f5e9393b7a1eda02d49228/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});


// News page with web scraping
app.get('/api/news', (req, res) => {
  const url = "http://cnn.com";

  request.get(url, (err, response, html) => {
    if (err) throw err;

    const news = [];
    const $ = cheerio.load(html);

    const $bannerText = $('.banner-text');

    news.push({
      title: $bannerText.text(),
      url: $bannerText.closest('a').attr('href')
    });

    const $cdHeadline = $('.cd__headline');

    _.range(1, 12).map(i => {
      const $headline = $cdHeadline.eq(i);

      news.push({
        title: $headline.text(),
        url: $headline.find('a').attr('href')
      });
    });

    res.send(news);
  });
});


// Get Reddit page and change out links for Rick Rolls
app.get('/api/reddit', (req, res) => {
  const url = "https://www.reddit.com/";

  request.get(url, (err, response, body) => {
    if (err) throw err;

    const $ = cheerio.load(body);

    $('a.title').each(function() {
      $(this).attr('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    });

    console.log(body);

    res.send($.html());
  });
});


// Contact form page
app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact', (req, res) => {
  debugger;
  res.send('<h1>Thanks for contacting us!</h1>');
});


// Photo upload to Imgur
app.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});

app.post('/sendphoto', upload.single('image'), (req, res) => {
  console.log(req.file)

  imgur.uploadFile('tmp/uploads/' + req.file.filename)
    .then(function (json) {
        console.log(json.data.link);
        res.send(`<h1>Thanks for sending us your photo</h1><br><p>It is stored <a href="${json.data.link}">here</a>.</p>`);

        fs.unlink('tmp/uploads/' + req.file.filename, (err) => {
          if (err) throw err;
          console.log('successfully deleted ' + req.file.filename);
        });

    })
    .catch(function (err) {
        console.error(err.message);
    });

  console.log(req.file.filename);
});


// Greeting page
app.get('/hello', (req, res) => {
    const name = req.query.name;

    const msg = `<h1>Nashville Software School Cohort 11 is the ${name}!</h1>`;
    let time = 1000;
    const events = [];

    console.log('QUERY PARAMS>>>>', req.query);

    res.writeHead(200, {
      "Content-type": "text/html"
    });

    msg.split('').forEach((char, i) => {
      setTimeout(() => {
        res.write(char);
      }, time += 200);
    });

    setTimeout(() => {
      res.end();
    }, msg.length * 1000 + 2000);
});


// Generate random number page
app.get('/random/:min/:max', (req, res) => {
  const num1 = parseInt(req.params.min);
  const num2 = parseInt(req.params.max);
  const result = Math.floor(Math.random() * (num2 - num1 + 1)) + num1;

  res.send(`A random number between ${num1} and ${num2} is ${result}`);
});


// Generate calendar pages (month-year or just year)
app.get('/cal/:month/:year', (req, res) => {
  const mo = req.params.month;
  const yr = req.params.year;

  const month = require('node-cal/lib/month');

  const result = month.printMonth(mo, yr);

  res.send('<pre>' + result + '</pre>');
});

app.get('/cal/:year', (req, res) => {
  const yr = req.params.year;

  const year = require('node-cal/lib/year');

  const result = year.printYear(yr);

  res.send('<pre>' + result + '</pre>');
});


// Page which logs a 403 error
app.all('/secret', (req, res) => {
  res.status(403).send('Access Denied!');
});


// Message for terminal to list current port
app.listen(PORT, () => {
  console.log(`Node.js server started. Listening on port ${PORT}`);
});
