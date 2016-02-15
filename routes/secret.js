'use strict';

const express = require('express');
const router = express.Router();

// Page which logs a 403 error
router.all('/secret', (req, res) => {
  res
    .status(403)
    .send('Access Denied!');
});

module.exports = router;
