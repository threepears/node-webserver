"use strict";

const app = require("express")();
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const routes = require('./routes/');

const PORT = process.env.PORT || 3000;

const MONGODB_HOST = process.env.MONGODB_HOST || 'localhost';
const MONGODB_PORT = process.env.MONGODB_PORT || 27017;
const MONGODB_USER = process.env.MONGODB_USER || '';
const MONGODB_PASS = process.env.MONGODB_PASS || '';
const MONGODB_NAME = process.env.MONGODB_NAME || 'node-webserver';

const MONGODB_AUTH = MONGODB_USER
  ? `${MONGODB_USER}:${MONGODB_PASS}@`
  : '';

const MONGODB_URL = `mongodb://${MONGODB_AUTH}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}`;

//if (process.env.NODE_ENV === 'production') {
//  const MONGODB_URL = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`;
//} else {
  //const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';
//}

app.set('view engine', 'jade');

app.locals.title = "Super Cool Calendar App";

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(routes);

// Message for terminal to list current port
mongoose.connect(MONGODB_URL);

mongoose.connection.on('open', () => {
  console.log("MONGO OPEN");

  app.listen(PORT, () => {
    console.log(`Node.js server started. Listening on port ${PORT}`);
  });
});

// END






//const fs = require('fs');
//const multer = require('multer');

//const storage = multer.diskStorage({
    //destination: function (req, file, cb) {
      //cb(null, 'tmp/uploads')
   //},
    //filename: function (req, file, cb) {
    //const beforeDot = file.fieldname + '-' + Date.now();
    //const getFileType = file.originalname;
    //const afterDot = getFileType.slice(-4);

    //const newFileName = beforeDot + afterDot;

    //cb(null, newFileName)
    //}
//});

//const upload = multer({ storage: storage });

//const imgur = require('imgur');
//const request = require('request');
//const _ = require('lodash');
//const cheerio = require('cheerio');


//const News = require('./models/news');
//const AllCaps = require('./models/allcaps');
//const Contact = require('./models/contact');


//const MongoClient = require('mongodb').MongoClient;

//let db;



