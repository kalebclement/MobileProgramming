const admin = require('./firebase');
const express = require('express').Router();
const bodyParser = require('body-parser');
const db = admin.firestore();
const Joi = require('joi');
const jsonyes = require('./JsonFile/login-Phone-true.json');
const jsonno = require('./JsonFile/login-Phone-false.json');
express.use(bodyParser.json());

express.post('/login/phonenumber', (req, res) => {
    var condition = false;

  function Exist(condition){
    admin.auth().getUserByPhoneNumber(req.body.phoneNumber)
    .then((check)=>{
        alreadylogin(check.uid)
    }).catch((error) => {
        res.send(jsonno);
    });
    
    }

    function alreadylogin(uid){
        const ref = db.collection('UserData').doc(uid);
        ref.get()
        .then(doc => {
            if(doc.exists){
                const data = doc.get('login');
                if(data == true){
                    res.send({ status : "error", message: "user with this phone number had already logged in"});
                }
                else{
                    res.send(jsonyes);
                }
            }
        });
    }

    const result = ValidateData(req.body);
    if(result.error){
      res.status(400).send(result.error.details[0].message);
    }else{
      Exist(condition);
    }
});

express.post('/login/authentication', (req, res ) => {
    function CreateTokenLogin(uid){
        
        const result = {};
        admin.auth().createCustomToken(uid)
        .then((customToken) =>{
            const Token = {IDToken: customToken};
            result.result = Token;
            res.json(result);
        }).catch((error) =>{
            res.json('error creating token : ', error);
        });
    }

    function Login(number, callback){
        admin.auth().getUserByPhoneNumber(number)
        .then((check)=>{
            CreateTokenLogin(check.uid);
        }).catch((error) => {
            res.send(jsonno);
        });
    }
    

    const number = req.body.phoneNumber;
    const result = ValidateData(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
    }else{
        Login(number);
    }
});

function ValidateData(Data){
    const schema = Joi.object({
        phoneNumber: Joi.string().required(),
    });
  
    return schema.validate(Data);
}


express.post('/user/currentToken', (req, res) => {
    function ValidateData(Data){
        const schema = Joi.object({
            currentToken: Joi.string().required(),
            uid: Joi.string().required(),
        });
      
    return schema.validate(Data);
    }
    
    async function getDestinationFromToken(){
        const UID = req.body.uid;
        let data = {
            currentToken: req.body.currentToken,
            login: true
        }
        var reff = db.collection('UserData').doc(UID);
        const ress = await reff.update({currentToken: data.currentToken, login: data.login})
        .then((resp) => {
            res.send({
                status: "ok",
                message: "Current token updated, user Loged in"});
        }).catch((err) => {
            res.send({
                status: "error",
                message: "Error when updating the token"});
        });
    }

    const result = ValidateData(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
      }else{
        getDestinationFromToken();
      }

})

express.get('/profile/user/:uid', (req, res) => {
    const uid = req.params.uid;
    const reff = db.collection('UserData').doc(uid);
    reff.get()
    .then(doc => {
        if(doc.exists){
            res.json(doc.data());
        }
    });
});

module.exports = express;