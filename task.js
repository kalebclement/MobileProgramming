
const admin = require('./firebase');
const express = require('express');
const bodyParser = require('body-parser');
var db = admin.firestore();
var dbrealtime = admin.database();
const Joi = require('joi');
var app = express();
app.use(bodyParser.json());

app.post('/query/search/', (req, res) => {
    let description = [];
    var keywords = req.body.keywords;
    console.log("KEYWRODS : " + keywords);

    const reff = dbrealtime.ref('Explore').child('City');
    reff.get()
    .then((doc) => {
        var data = doc;
        data.forEach(dataquery => {
            var datasnapshot = dataquery;
            datasnapshot.forEach(snapshot => {
                var stringquery = snapshot.val().description;
                stringquery = stringquery.toString();
                console.log(stringquery.includes(keywords));
                console.log(stringquery);

                if(stringquery.includes(keywords) == true){
                    description.push(snapshot.val());
                }
                
            })
        })
        res.send(description);
    })
})

module.exports = app;