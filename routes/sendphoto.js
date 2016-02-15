'use strict';

const express = require('express');
const router = express.Router();

const ImgLink = require('../models/imagelinks');

const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './tmp/uploads')
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



// Photo upload to Imgur
router.get('/sendphoto', (req, res) => {
  res.render('sendphoto');
});


router.post('/sendphoto', upload.single('image'), (req, res) => {
  console.log(req.file)

  imgur.uploadFile('./tmp/uploads/' + req.file.filename)
    .then(function (json) {
        const obj = new ImgLink({ 'url': json.data.link });

        obj.save((tantrum, newLink) => {

          res.send(newLink);

        //db.collection('imageLinks').insertOne({"url": json.data.link}, (err, result) => {
          //if (err) throw err;
        //});

        console.log(json.data.link);
        res.send(`<h1>Thanks for sending us your photo</h1><br><p>It is stored <a href="${json.data.link}">here</a>.</p>`);

        });

        fs.unlink('./tmp/uploads/' + req.file.filename, (err) => {
          if (err) throw err;
          console.log('successfully deleted ' + req.file.filename);
        });

    })
    .catch(function (err) {
        console.error(err.message);
    });

  console.log(req.file.filename);
});

module.exports = router;
