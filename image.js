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
    destination: "./upload/profile/images",
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

app.use('/profile', express.static('upload/profile'));
app.post('/upload/:uid', upload.single('profile'), (req,res) => {
    const uid = req.params.uid;
    const url = `https://pandu-teman.herokuapp.com/profile/images/${req.file.filename}`;
    const reff = db.collection('UserData').doc(uid);
    
    const send = reff.update({
        ProfilePicture : url
    })
    .then((resp) => {
        res.send({
            status: "ok",
            message: "User Profile Picture Updated"});
    }).catch((err) => {
        res.send({
            status: "error",
            message: "Error when updating the user profile picture"});
    });

})

app.get('user/profile/:uid', (req, res) => {
    const uid = req.params.uid;
    const reff = db.collection('UserData').doc(uid);
    console.log(reff.get());
})

module.exports = app;

