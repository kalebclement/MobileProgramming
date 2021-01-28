
const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
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
    var locationmap = req.body.location_map;
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
        location_map: locationmap,
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

    app.get('/explore/:city', (req, res) => {

        const city = req.params.city;
        let data = [];
            const reff = dbrealtime.ref('Explore').child('City').child(city);
            reff.get()
            .then( (doc) => {
                doc.forEach(snapshot => {
                    
                    const imageURl = snapshot.val().image.display.url;
                    const place_name = snapshot.val().place_name;
                    var price;
                    var adultprice = snapshot.val().price.adults;
                    var kidsprice = snapshot.val().price.kids;
                    if(adultprice > kidsprice){
                        price = kidsprice;
                    }else{
                        price = adultprice;
                    }
                    const place_uid = snapshot.val().place_uid;
                    const rating = snapshot.val().rating;
                    data.push({
                        imageURl : imageURl,
                        place_name : place_name,
                        place_uid: place_uid,
                        price: price,
                        rating: rating,
                    })
                })
                let result = {};
                result.result = data;
                res.json(result);
            })
        


    });

    app.get('/explore/:city/:place_uid', (req, res) => {
        let data = [];
        let relateddata = [];
        const city = req.params.city;
        const place_uid = req.params.place_uid;
        const reff = dbrealtime.ref('Explore').child('City').child(city);
        const reffdetail = reff.child(place_uid);
        
        // get related tour attraction
        reff.get()
        .then((doc) => {
            doc.forEach((snapshot) => {
                if(snapshot.val().place_uid != place_uid){
                    var adultprice = snapshot.val().price.adults;
                    var kidsprice = snapshot.val().price.kids;
                    var price;
                    if(adultprice > kidsprice){
                        price = kidsprice;
                    }else{
                        price = adultprice;
                    }

                    relateddata.push({
                        imageURL: snapshot.val().image.display.url,
                        place_name: snapshot.val().place_name,
                        place_uid: snapshot.val().place_uid,
                        price: price,
                        rating: snapshot.val().rating,
                    })
                }
            })
        })

        reffdetail.get()
        .then((doc) => {
            const snapshot = doc;
                const display = snapshot.val().image.display.url;
                const other_1 = snapshot.val().image.other[1];
                const other_2 = snapshot.val().image.other[2];
                const other_3 = snapshot.val().image.other[3];
                const adult = snapshot.val().price.adults;
                const kid = snapshot.val().price.kids;
                const facildata = [];
                const facilities = snapshot.val().facilities;
                facilities.forEach((dat) => {
                    if(dat != null){
                        facildata.push(dat);
                    }
                })
                
                data.push({
                    description: snapshot.val().description,
                    location_detailL: snapshot.val().location_detail,
                    location_map: snapshot.val().location_map,
                    opening_hours: snapshot.val().opening_hours,
                    place_name: snapshot.val().place_name,
                    place_uid: snapshot.val().place_uid,
                    rating: snapshot.val().rating,
                    imageURL: { display, other_1, other_2, other_3},
                    price: { adult, kid },
                    facilities: facildata,
                    relatedexplore: relateddata,
                })

            
            let result = {};
            result.result = data;
            res.json(result);
        })

    });


    
    

module.exports = app;
