var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Register = require('./register');
var Login = require('./login');
var Logout = require('./logout');
var Explore = require('./explore');

var http = require('http');
var app = express();
var server = http.createServer(app);
app.use(Register);
app.use(Login);
app.use(Logout);
app.use(Explore);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening Port ${port} ......`));

app.get('/', (req, res) =>{
    
    var h1 = "Welcome To Pandu - Teman"    

    res.send(h1);
});
