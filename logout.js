const admin = require('./firebase');
const express = require('express').Router();
const bodyParser = require('body-parser');
const db = admin.firestore();
const Joi = require('joi');
const jsonyes = require('./JsonFile/login-Phone-true.json');
const jsonno = require('./JsonFile/login-Phone-false.json');
express.use(bodyParser.json());



express.post('/logout', (req, res) => {
    async function Logout(){
        var reff = db.collection('UserData').doc(req.body.uid);
        const ress = await reff.update({login: false})
        .then((resp) => {
            res.json({status: "ok", message: "logout success"})
        }).catch((err) => {
            res.send({status: "error", message: err});
        });
    }

    const result = ValidateData(req.body);
    if(result.error){
      res.status(400).send(result.error.details[0].message);
    }else{
      Logout();
    }
});



function ValidateData(Data){
    const schema = Joi.object({
        uid: Joi.string().required(),
    });
  
    return schema.validate(Data);
}

module.exports = express;