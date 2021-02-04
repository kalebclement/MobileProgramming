const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
var app = express();
app.use(bodyParser.json());

app.get('/home', (req, res) => {
var data = [];
var reff = dbrealtime.ref('Home');
const Result = {};
reff.get()
.then((doc) => {
    doc.forEach(snapshot => {
        var snap = {
            city: snapshot.val().city,
            description: snapshot.val().description,
            imageURL: snapshot.val().imageURL,
        }
        data.push(snap);
    })
    Result.result = data;
    res.json(Result);
})

});

app.get('/user/info/:uid', (req,res) => {
    var uid = req.params.uid;
    const reff = db.collection('UserData').doc(uid);
    reff.get()
    .then(doc => {
        let data = {
            fullName: doc.data().fullName,
            phoneNumber: doc.data().phoneNumber,
            email: doc.data().email,
        }
        res.json(data);
    })
})

module.exports = app;