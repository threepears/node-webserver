'use strict';

const express = require('express');
const router = express.Router();

// Greeting page
router.get('/hello', (req, res) => {
    const name = req.query.name || 'World';
    const msg = `<h1>Nashville Software School Cohort 11 is the ${name}!</h1>`;
    let time = 1000;
    const events = [];

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

module.exports = router;
