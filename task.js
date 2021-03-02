
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
        data.forEach(dataquery => { //return table name from customer & score from table grade
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

app.get('/task/innerjoin', (req,res) => {
    // inner join data user dan explore from ticket 
    const rootRef = dbrealtime.ref('Ticket');
    const exploreRef = dbrealtime.ref('Explore').child('City');
    const key_ticket = rootRef.child('Jakarta/-MS5z81LzqHmt6z6veU6/2021/04/05/');
    const userRef = db.collection('UserData');
    let result = [];
   

    function getUserUID(key_ticket, cb){
        
        key_ticket.once('child_added', snapshot => {
            result.push(snapshot.val());

            let explore_key = exploreRef.child(snapshot.val().city).child(snapshot.val().place_uid);
            explore_key.get().then(exploredata => {
                result.push(exploredata.val());

                let user_key = userRef.doc(snapshot.val().user_uid);
                user_key.get().then(userdata => {
                    result.push(userdata.data());
                    cb();
                })
            })
            
        })
        
    }

    getUserUID(key_ticket, snap => {
        res.send(result);
    });
})



module.exports = app;