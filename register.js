const admin = require('./firebase');
const express = require('express').Router();
const bodyParser = require('body-parser');
const db = admin.firestore();
const Joi = require('joi');
const jsonyes = require('./JsonFile/register-Duplicate-true.json');
const jsonno = require('./JsonFile/register-Duplicate-false.json');
express.use(bodyParser.json());
const { DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot } = require('@google-cloud/firestore');
const cookieParser = require('cookie-parser');
express.use(cookieParser());

express.post('/register/data', (req, res) => {

    async function create(){
      var fAuth = admin.auth();
      fAuth.languageCode = 'pt';
      var phoneuser = req.body.phoneNumber;
      phoneuser = String(phoneuser);
      fAuth.createUser({
        phoneNumber: phoneuser
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          const reff = db.collection('UserData').doc(userRecord.uid);
          const UID = reff.id;
          const result = {};
          admin.auth().createCustomToken(UID)
          .then((customToken) =>{
            const response = {status: "ok", message: "register succesfully done"};
            result.Result = response;
            res.json(result);
          }).catch((error) =>{
            res.send('error creating token : ', error);
          });
   
          let data = {
            fullName: req.body.fullName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            uid: UID,
            status: "Regular"
          };
          reff.set(data);
        })
        .catch(function(error) {
          
          res.send({status: "error", message: error.message});
          
        });
  
    }

    function ValidateData(Data){
        const schema = Joi.object({
            fullName: Joi.string().required(),
            phoneNumber: Joi.string().required(),
            email: Joi.string().required(),
        });
      
        return schema.validate(Data);
      }
  
  
    const result = ValidateData(req.body);
  
    if(result.error){
      res.status(400).send(result.error.details[0].message);
    }else{
      create();
    }
    
  });

  express.post('/register/duplicate', (req, res) => {
      var condition = false;

    function Duplicate(condition){
      admin.auth().getUserByPhoneNumber(req.body.PhoneNumber)
      .then((check)=>{
          res.send(jsonyes);
      }).catch((error) => {
          res.send(jsonno);
      });
      }

    function ValidateData(Data){
        const schema = Joi.object({
            PhoneNumber: Joi.string().required(),
        });
      
        return schema.validate(Data);
    }

    const result = ValidateData(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
      }else{
        Duplicate(condition);
      }
  });
  module.exports = express;