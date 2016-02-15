'use strict';

const express = require('express');
const router = express.Router();

const News = require('./models/news');


// Home page
router.get('/', (req, res) => {
  News.findOne().sort('-_id').exec((tantrum, doc) => {
  //db.collection('news').findOne({}, { sort: {_id: -1}}, (tantrum, doc) => {

    if (tantrum) throw tantrum;

    res.render('index', {
      date: new Date(),
      news: doc.top[0]
    });
  });
});

module.exports = router;
