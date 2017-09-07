'use strict';

var PollHandler = require(process.cwd() + '/app/controllers/pollController.server.js');

module.exports = function (app, passport) {
	
    var pollHandler = new PollHandler();
    
    var numRandPolls = 6;
    
	app.get('/', function (req, res) {
		pollHandler.getRandomPolls(numRandPolls, function(polls) {
			res.render('home', 
				{
					auth: req.isAuthenticated(),
					user: req.user,
					title: 'Home',
					page: 'home', 
					randPolls: polls
				});
		});
	});
			
	app.get('/allpolls', function (req, res) {
		var page
		req.query.page ? page=req.query.page-1 : page=0;
		pollHandler.getAllPollsPaginated(page, function(polls, numPages) {
			if ( (page+1) > numPages ) {
				res.end("that page doesn't exist");
			} else {
				res.render('all-polls', 
					{
						auth: req.isAuthenticated(),
						user: req.user,
						title: 'All Polls',
						page: 'allpolls',
						polls: polls,
						page: page,
						numPages: numPages
					});	
			}
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
		pollHandler.getUserPolls(req.user.oauthID, function(polls) {
	    		 res.render('my-polls',
	    			{
	    				auth: true,
	    				user: req.user,
	    				title: 'My Polls',
	    				page: 'mypolls',
	    				polls: polls
	    			});
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
	    	pollHandler.addPoll(req.user.oauthID, req.body, function(poll) {
	    		 res.render('create-poll-success', 
	    			{
	    				auth: true,
	    				user: req.user,
	    				title: 'Create a Poll',
	    				page: 'createpoll',
	    				baseUrl: req.headers.host,
	    				url: '/polls/' + poll.url
	    			});
	    	});
    	});

	app.route('/polls/:pollurl')
		.get(function (req, res) {
			var pollid = req.params.pollurl.match(/[^\-]*/)[0];  // Get the url up to the first '-'
			pollHandler.getPoll(pollid, function(poll) {
				res.render('view-poll', 
					{
						auth: req.isAuthenticated(),
						user: req.user,
						title: poll.question,
						page: '',
						poll: poll
					});
			});
		})
		.post(function (req, res) {
			var pollid = req.params.pollurl.match(/[^\-]*/)[0];  // Get the url up to the first '-'
			pollHandler.updatePollResults(pollid, req.body, function(poll) {
				res.redirect('/results/'+poll.url);
			});
		});

	app.get('/results/:pollurl', function (req, res) {
		var pollid = req.params.pollurl.match(/[^\-]*/)[0];  // Get the url up to the first '-'
		pollHandler.getPoll(pollid, function(poll) {
			res.render('view-results', 
				{
					auth: req.isAuthenticated(),
					user: req.user,
					title: poll.question,
					page: '',
					poll: poll
				});
		});
	});

	app.route('/api/:pollid')
		.get(function(req, res) {
			pollHandler.getPoll(req.params.pollid, function(poll) {
				res.send(poll);
			});
		})
		.delete(function(req, res) {
			pollHandler.deletePoll(req.params.pollid, function(poll) {
				res.send('/mypolls');
			});
		});
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
};
