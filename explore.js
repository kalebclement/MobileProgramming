
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
    
    var placename = req.body.place_name;
    var openinghours = req.body.opening_hours;
    var locationdetail = req.body.location_detail;
    var priceadults = req.body.priceadults;
    var pricekids = req.body.pricekids;
    var description = req.body.description;
    var price = {adults: priceadults, kids: pricekids};
    var displayurl = {url: req.body.image_display}
    var image1 = req.body.image1;
    var image2 = req.body.image2;
    var image3 = req.body.image3;
    var otherimage =  {
        1: image1,
        2: image2,
        3: image3,
    }

    var image = {
        display: displayurl,
        other: otherimage,
    }


    let data = {
        place_uid : key,
        place_name: placename,
        location_detail : locationdetail,
        price : price,
        opening_hours: openinghours,
        description: description,
        image: image,
        rating : 0,
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