
const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
const jsonyes = require('./JsonFile/login-Phone-true.json');
const jsonno = require('./JsonFile/login-Phone-false.json');
var app = express();
app.use(bodyParser.json());
const { DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } = require('@google-cloud/firestore');
const { IdTokenClient } = require('google-auth-library');

app.post('/explore/input/:City', (req,res) => {
    var city = req.params.City;
    var reff = dbrealtime.ref('Explore').child('City').child(city);
    var key = reff.push().key;
    var inputreff = reff.child(key);
    let data = {
        place_uid : key,
        place_name: "The Great Asia Africa",
        price : 340000,
        opening_hours: "09.00 - 18.00",
        details: "Looking for a quick escape without having to leave the country ? Come visit the great asia afrika where you can exploce 10 countries in 1 place."
    }
    
    inputreff.set(data).then( ()=> {
        res.send("data inputed");
    }).catch((err) => {
        res.send(err);
    })
    
    
    });
    
    // app.post('/explore/input', (req,res) => {
    //    res.send("test") 
    // });

module.exports = app;

// {
//     "place_uid" : "auto",
//     "place_name" : "The Great Asia Africa",
//     "price" : 340000,
//     "opening_hours": "09.00 - 18.00",
//     "detail": "Looking for a quick escape without having to leave the country ? Come visit the great asia afrika where you can exploce 10 countries in 1 place."
// }