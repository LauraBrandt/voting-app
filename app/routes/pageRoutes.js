'use strict';

var PollHandler = require(process.cwd() + '/app/controllers/pollController.server.js');

module.exports = function (app, passport) {
	
    var pollHandler = new PollHandler();
    
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
	
	app.route('/createpoll')
		.get(isLoggedIn, function (req, res) {
			res.render('create-poll', 
				{
					auth: true,
					user: req.user,
					title: 'Create a Poll',
					page: 'createpoll'
				});
		
		})
		.post(isLoggedIn, function(req, res) {
	    	pollHandler.addPoll(req, function(poll) {
	    		 res.render('create-poll-success', 
	    			{
	    				auth: true,
	    				user: req.user,
	    				title: 'Create a Poll',
	    				page: 'createpoll',
	    				pollUrl: poll.url,
	    				baseUrl: req.headers.host
	    			});
	    	});
    	});

	app.get('/polls/:pollurl', function (req, res) {
		var pollid = req.params.pollurl.match(/[^\-]*/)[0];  // Get the url up to the first '-'
		pollHandler.getPoll(pollid, function(poll) {
			res.render('view-poll', 
				{
					auth: req.isAuthenticated(),
					user: req.user,
					title: '',
					page: '',
					poll: poll
				});
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
