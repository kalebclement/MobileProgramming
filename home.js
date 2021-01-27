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

module.exports = app;