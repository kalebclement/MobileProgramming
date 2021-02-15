
const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
var app = express();
app.use(bodyParser.json());

function checkavailable(city, place_uid, number_of_adults, number_of_kids, booking_date){
    // var ts = new Date();
    // console.log(ts.getDate());
    // console.log(ts.toLocaleDateString());

    // console.log(ts.toDateString());
    // console.log(ts.toTimeString());
    const reff = dbrealtime.ref('Ticket').child(city).child(place_uid).child(booking_date);
    const max = 5;
    reff.get().then(doc => {
        var adult = 0;
        var kid = 0;
        doc.forEach(snapshot => {
            adult = adult + snapshot.val().number_of_adult;
            kid = kid + snapshot.val().number_of_kid;
        })
        console.log(adult);
        console.log(kid);
        console.log(number_of_adults);
        console.log(number_of_kids);
    })
    
}

app.post('/ticket/available', (req,res) => {
    function ValidateData(Data){
        const schema = Joi.object({
            city: Joi.string().required(),
            place_uid: Joi.string().required(),
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
        checkavailable(req.body.city, req.body.place_uid, req.body.number_of_adults, req.body.number_of_kids, req.body.booking_date);
      }
})

app.post('/ticket/booking', (req,res) => {
    function ValidateData(Data){
        const schema = Joi.object({
            city: Joi.string().required(),
            place_uid: Joi.string().required(),
            number_of_adult: Joi.number().required(),
            number_of_kid: Joi.number().required(),
        });
      
    return schema.validate(Data);
    }

    const result = ValidateData(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
      }else{
        bookticket();
      }

    function bookticket(){
        var city = req.body.city;
        var place_uid = req.body.place_uid;
        var number_of_adult = req.body.number_of_adult;
        var number_of_kid = req.body.number_of_kid;

        let date_ob = new Date();

        // current date
        // adjust 0 before single digit date
        let date = ("0" + date_ob.getDate()).slice(-2);
        
        // current month
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        
        // current year
        let year = date_ob.getFullYear();
        
        // current hours
        let hours = date_ob.getHours();
        
        // current minutes
        let minutes = date_ob.getMinutes();
        
        // current seconds
        let seconds = date_ob.getSeconds();
        var booking_date = year + "/" + month + "/" + date;

        const reffprice = dbrealtime.ref('Explore').child('City').child(city).child(place_uid);
        reffprice.get()
        .then((doc) => {
            const adultprice = doc.val().price.adults;
            const kidsprice = doc.val().price.kids;
            const totaladult = adultprice * number_of_adult;
            const totalkid = kidsprice * number_of_kid;
            const total_price = totaladult + totalkid;
            pushticket(total_price);
        })


        function pushticket(total_price){
            const reff = dbrealtime.ref('Ticket').child(city).child(place_uid).child(booking_date);
            var key = reff.push().key;
            const inputreff = reff.child(key);

            let data = {
                ticket_id: key,
                place_uid: place_uid,
                city: city,
                number_of_adult: number_of_adult,
                number_of_kid: number_of_kid,
                total_price : total_price,
                booking_date: booking_date,
            }
            console.log(data)

            inputreff.set(data)
            .then( res.send(data));
        }
        
        
    }
})

module.exports = app;