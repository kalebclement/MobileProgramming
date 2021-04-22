const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
var app = express();
app.use(bodyParser.json());

app.get('/quiz/question', (req, res) => {
    
})

module.exports = app;