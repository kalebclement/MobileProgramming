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

app.post('/home/search', (req, res) => {
    function ValidateData(Data){
        const schema = Joi.object({
            price_range: Joi.number().required(),
            city: Joi.string().required(),
            number_of_adults: Joi.number().required(),
            number_of_kids: Joi.number().required(),
            booking_date: Joi.string().required(),
        });
      
        return schema.validate(Data);
      }

    const result = ValidateData(req.body);
  
    if(result.error){
      res.status(400).send(result.error.details[0].message);
    }else{
      search();
    }

    function search(){
        let result = [];
        const city = req.body.city;
        const price_range = req.body.price_range;
        const number_of_adults = req.body.number_of_adults;
        const number_of_kids = req.body.number_of_kids;
        const booking_date = req.body.booking_date;
        const reff = dbrealtime.ref('Explore').child('City').child(city);
        reff.get()
        .then(doc => {
            doc.forEach(snapshot => {
                var adults = snapshot.val().price.adults * number_of_adults;
                var kids = snapshot.val().price.kids * number_of_kids;
                var total = adults + kids;

                var adultprice = snapshot.val().price.adults;
                var kidsprice = snapshot.val().price.kids;
                var price;
                if(adultprice > kidsprice){
                    price = kidsprice;
                }else{
                    price = adultprice;
                }

                if(price_range >= total){
                    let data = {
                        imageURL: snapshot.val().image.display.url,
                        place_name: snapshot.val().place_name,
                        place_uid: snapshot.val().place_uid,
                        price: price,
                        rating: snapshot.val().rating,
                    }
                    result.push(data);
                    
                }
            })
            let Result = {};
            Result.result = result;
            res.send(Result);
        })
        
    }
})

module.exports = app;