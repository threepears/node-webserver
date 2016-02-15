'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('imageLinks',
  mongoose.Schema({
  "url": String
}));
