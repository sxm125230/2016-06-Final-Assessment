var express = require('express');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ForgeOauth2 = require('forge-oauth2');
var app = express();
var request = require('request');
app.use(cookieParser('shhhh, my secret'));
app.use(session({
    secret: 'shhhhhh'
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
    next();
});



mongoose.connect('mongodb://localhost/assessment');
require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);
app.listen(3000);
module.exports = app;
