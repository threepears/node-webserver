'use strict';

const express = require('express');
const router = express.Router();


// Generate calendar pages (month-year or just year)
router.get('/cal/:month/:year', (req, res) => {
  const mo = req.params.month;
  const yr = req.params.year;

  const month = require('node-cal/lib/month');

  const result = month.printMonth(mo, yr);

  res.send('<pre>' + result + '</pre>');
});

router.get('/cal/:year', (req, res) => {
  const yr = req.params.year;

  const year = require('node-cal/lib/year');

  const result = year.printYear(yr);

  res.send('<pre>' + result + '</pre>');
});

module.exports = router;



