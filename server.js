'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var morgan       = require('morgan');

var pageRoutes = require('./app/routes/pageRoutes.js');
var authRoutes = require('./app/routes/authRoutes.js');
var apiRoutes = require('./app/routes/apiRoutes.js');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);
app.use(morgan('dev'));

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.set('view engine', 'pug');
app.set('views', process.cwd() + '/views');

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretPollPlace',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

pageRoutes(app, passport);
authRoutes(app, passport);
apiRoutes(app, passport);


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
