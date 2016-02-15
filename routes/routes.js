'use strict';

const express = require('express');
const router = express.Router();

const api = require('./api');
const contact = require('./contact');
const hello = require('./hello');
const home = require('./home');
const random = require('./random');
const secret = require('./secret');
const sendphoto = require('./sendphoto');

app.use(api);
app.use(contact);
app.use(random);
app.use(sendphoto);
app.use(hello);
app.use(secret);
app.use(index);








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
