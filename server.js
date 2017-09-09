'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var appRoutes = require('./app/routes/appRoutes.js');
var authRoutes = require('./app/routes/authRoutes.js');
var errorRoutes = require('./app/routes/errorRoutes.js');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/views');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));
app.use('/node_modules', express.static(process.cwd() + '/node_modules'));

app.use(session({
	secret: 'secretPollPlace',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

appRoutes(app, passport);
authRoutes(app, passport);
errorRoutes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
