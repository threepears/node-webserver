"use strict";

const app = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const routes = require('./routes/');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = 'mongodb://localhost:27017/node-webserver';

app.set('view engine', 'jade');

app.locals.title = "Super Cool Calendar App";

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
});

const upload = multer({ storage: storage });

const imgur = require('imgur');
const path = require('path');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');


const News = require('./models/news');
const AllCaps = require('./models/allcaps');
const Contact = require('./models/contact');


//const MongoClient = require('mongodb').MongoClient;

const app = express();

let db;

app.use(express.static(path.join(__dirname, 'public')));

