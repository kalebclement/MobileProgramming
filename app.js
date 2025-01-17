var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var Register = require('./register');
var Login = require('./login');
var Logout = require('./logout');
var Explore = require('./explore');
var Images = require('./image')
var Home = require('./home');
var Ticket = require('./ticket')
var Task = require('./task');

var http = require('http');
var app = express();
var server = http.createServer(app);
app.use(Register);
app.use(Login);
app.use(Logout);
app.use(Explore);
app.use(Images);
app.use(Home);
app.use(Ticket);
app.use(Task);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`Listening Port ${port} ......`));

app.get('/', (req, res) =>{
    
    var h1 = "Welcome To Pandu - Teman"    

    res.send(h1);
});
