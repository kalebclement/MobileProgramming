const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const multer = require('multer')
const path = require('path')
const Joi = require('joi');
var app = express();
app.use(bodyParser.json());

//set storage
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        return cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
    }
})

const upload = multer({
    storage: storage,
})

app.use('/profile', express.static('upload/images'));
app.post('/upload', upload.single('profile'), (req,res) => {
    res.json({
        status: "ok",
        url: `https://pandu-teman.herokuapp.com/profile/${req.file.filename}`
    })
})

module.exports = app;

