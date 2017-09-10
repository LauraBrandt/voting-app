'use strict';

var PollHandler = require(process.cwd() + '/app/controllers/pollController.server.js');

module.exports = function (app, passport) {
	
    var pollHandler = new PollHandler();
    
    var numRandPolls = 6;
    
	app.get('/', function (req, res, next) {
		pollHandler.getRandomPolls(numRandPolls, function(polls) {
			res.render('home', 
				{
					auth: req.isAuthenticated(),
					user: req.user,
					title: 'Home',
					page: 'home', 
					randPolls: polls
				});
		}, next);
	});
			
	app.get('/allpolls', function (req, res, next) {
		var page;
		req.query.page ? page=req.query.page-1 : page=0;
		pollHandler.getAllPollsPaginated(page, function(polls, numPages) {
			if ( (page+1) > numPages ) {
				res.render('error', {
					auth: req.isAuthenticated(),
					user: req.user,
					title: 'Not Found',
					page: 'notfound',
					status: '404'
				});
			} else {
				res.render('all-polls', 
					{
						auth: req.isAuthenticated(),
						user: req.user,
						title: 'All Polls',
						page: 'allpolls',
						polls: polls,
						pageNum: page,
						numPages: numPages
					});	
			}
		}, next);
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
	
	app.get('/mypolls', isLoggedIn, function (req, res, next) {
		var page;
		req.query.page ? page=req.query.page-1 : page=0;
		pollHandler.getUserPollsPaginated(req.user.oauthID, page, function(polls, numPages) {
			if ( (page+1) > numPages ) {
				res.render('error', {
					auth: req.isAuthenticated(),
					user: req.user,
					title: 'Not Found',
					page: 'notfound',
					status: '404'
				});
			} else {
	    		 res.render('my-polls',
	    			{
	    				auth: true,
	    				user: req.user,
	    				title: 'My Polls',
	    				page: 'mypolls',
	    				polls: polls,
	    				pageNum: page,
						numPages: numPages
	    			});
			}
	    }, next);
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
		.post(isLoggedIn, function(req, res, next) {
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
	    	}, next);
    	});

	app.route('/polls/:pollurl')
		.get(function (req, res, next) {
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
			}, next);
		})
		.post(function (req, res, next) {
			var pollid = req.params.pollurl.match(/[^\-]*/)[0];  // Get the url up to the first '-'
			pollHandler.updatePollResults(pollid, req.body, function(poll) {
				res.redirect('/results/'+poll.url);
			}, next);
		});

	app.get('/results/:pollurl', function (req, res, next) {
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
		}, next);
	});

	app.route('/api/:pollid')
		.get(function(req, res, next) {
			pollHandler.getPoll(req.params.pollid, function(poll) {
				res.send(poll);
			}, next);
		})
		.delete(function(req, res, next) {
			pollHandler.deletePoll(req.params.pollid, function(poll) {
				res.send('/mypolls');
			}, next);
		});
	
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}
	
};
