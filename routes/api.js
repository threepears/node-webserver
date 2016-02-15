'use strict';

const express = require('express');
const router = express.Router();

const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');

const News = require('../models/news');
const AllCaps = require('../models/allcaps');


// API page with CORS header
router.get('/api', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send({hello: 'world'});
});


router.post('/api', (req, res) => {
  const obj = _.mapValues(req.body, (val) => val.toUpperCase());

  const caps = new AllCaps(obj);

  caps.save((err, _caps) => {
    if (err) throw err;

  //db.collection('allcaps').insertOne(obj, (tantrum, result) => {
    //if (tantrum) throw tantrum;

    res.send(_caps);
  });
});



// Weather page
//All callbacks in Node lead with error (err)
router.get('/api/weather', (req, res) => {
  const url = 'https://api.forecast.io/forecast/00c2032f84f5e9393b7a1eda02d49228/37.8267,-122.423';
  request.get(url, (err, response, body) => {
    if (err) throw err;

    res.header('Access-Control-Allow-Origin', '*');
    res.send(JSON.parse(body));
  });
});



// News page with web scraping
router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((tantrum, doc) => {
  //db.collection('news').findOne({}, { sort: {_id: -1}}, (tantrum, doc) => {

    if (tantrum) throw tantrum;

    if (doc) {

      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = "http://cnn.com";

    request.get(url, (tantrum, response, html) => {
      if (tantrum) throw tantrum;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      let bannerURL = $bannerText.closest('a').attr('href');

      if (bannerURL.slice(0,4) !== "http") {
        bannerURL = url + bannerURL;
      }

      news.push({
        title: $bannerText.text(),
        url: bannerURL
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).map(i => {
        const $headline = $cdHeadline.eq(i);

        let headlineURL = $headline.find('a').attr('href');

        if (headlineURL.slice(0,4) !== "http") {
          headlineURL = url + headlineURL;
        }

        news.push({
          title: $headline.text(),
          url: headlineURL
        });
      });

      const obj = new News({ top: news });

      obj.save((tantrum, newNews) => {
      //db.collection('news').insertOne({top: news}, (tantrum, result) => {
        if (tantrum) throw tantrum;

        res.send(newNews);
      });
    });
  });
});


// Get Reddit page and change out links for Rick Rolls
router.get('/api/reddit', (req, res) => {
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

module.exports = router;
