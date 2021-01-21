var admin = require("firebase-admin");

var serviceAccount = require("./sdk/pandu-temann-firebase-adminsdk-kibdl-e84e0ce520.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pandu-temann-default-rtdb.firebaseio.com",
});

module.exports = admin;