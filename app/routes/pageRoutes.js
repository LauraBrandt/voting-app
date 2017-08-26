'use strict';

module.exports = function (app, passport) {
	app.get('/', function (req, res) {
		res.render('home', 
			{
				auth: req.isAuthenticated(),
				user: req.user,
				title: 'Home',
				page: 'home'
			});
	});
			
	app.get('/allpolls', function (req, res) {
		res.render('all-polls', 
			{
				auth: req.isAuthenticated(),
				user: req.user,
				title: 'All Polls',
				page: 'allpolls'
			});
	});
	
	app.get('/login', function(req, res) {
        res.render('login', 
			{
				auth: req.isAuthenticated(),
				user: req.user,
				title: 'Login',
				page: 'login'
			});
    });
	
	app.get('/mypolls', isLoggedIn, function (req, res) {
		res.render('my-polls', 
			{
				auth: true,
				user: req.user,
				title: 'My Polls',
				page: 'mypolls'
			});
	});
	
	app.get('/createpoll', isLoggedIn, function (req, res) {
		res.render('create-poll', 
			{
				auth: true,
				user: req.user,
				title: 'Create a Poll',
				page: 'createpoll'
			});
	});
	
	app.get('/dashboard', isLoggedIn, function (req, res) {
		res.render('dashboard', 
			{
				auth: true,
				user: req.user,
				title: 'Dashboard',
				page: 'dashboard'
			});
	});
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
};
