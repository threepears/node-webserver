'use strict';

const express = require('express');
const router = express.Router();

router.get('/random', (req, res) => {
  res.send(Math.random().toString());
});

// Generate random number page
router.get('/random/:min/:max', (req, res) => {
  const num1 = parseInt(req.params.min);
  const num2 = parseInt(req.params.max);
  const result = Math.floor(Math.random() * (num2 - num1 + 1)) + num1;

  res.send(`A random number between ${num1} and ${num2} is ${result}`);
});

module.exports = router;
