'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler () {
    
    this.addPoll = function(userid, body, callback) {
        Users
            .findOne({oauthID : userid})
            .exec(function(err, user) {
                if (err) { throw err; }
                
                var resultsObject = {};
                for (var i=0; i<body.answers.length; i++) {
                	var key = body.answers[i];
                	resultsObject[key] = 0;
                }
                
                var newPoll = new Polls({
                    question: body.question,
                    answers: body.answers,
                    resultsObject : resultsObject,
                    creator : user._id
                });
                
                newPoll.save(function(err, poll) {
                    if (err) { throw err; }
                    
	                callback(poll);
                });
            });
    };

	this.getPoll = function(pollid, callback) {
		Polls
			.findById({ _id : pollid })
			.populate('creator')
			.exec(function (err, poll) {
				if (err) { throw err; }

				callback(poll);
			});
	};
	
	this.getUserPolls = function(userid, callback) {
	    Users.findOne({oauthID: userid}).exec(function(err, user) {
	        if (err) { throw err; }
	        
	        Polls
	        	.find({ creator: user._id })
	        	.sort({createdAt: 'desc'})
	        	.exec(function(err, polls) {
		            if (err) { throw err; }
	
					callback(polls);
		        });
	    });
	};
	
	this.deletePoll = function(pollid, callback) {
	    Polls
	        .findByIdAndRemove(pollid)
			.exec(function (err, poll) {
				if (err) { throw err; }

				callback(poll);
			});
	};
	
	this.updatePollResults = function(pollid, body, callback) {
		Polls
			.findById(pollid)
			.populate('creator')
			.exec(function(err, poll) {
				if (err) { throw err; }
				
				if (poll.resultsObject[body.answer] >= 0 ) {
					poll.resultsObject[body.answer] += 1;
				} else {
					poll.resultsObject[body.answer] = 1;
					poll.answers.push(body.answer);
				}
				
				poll.markModified('resultsObject');
				
				poll.save(function(err, poll) {
					if (err) { throw err; }
					
					callback(poll);	
				});
			});
	};
	
	this.getAllPollsPaginated = function(pageNumber, callback) {
		var perPage = 10;
		
		Polls
			.find()
			.limit(perPage)
			.skip(pageNumber * perPage)
			.sort({createdAt: 'desc'})
			.exec(function(err, polls) {
				if (err) { throw err; }
				
				Polls.count().exec(function (err, count) {
					if (err) { throw err; }
					
					var numPages = Math.ceil(count/perPage);
					//console.log(polls, numPages, count);
					callback(polls, numPages);
				});
			});
	};
	
	this.getRandomPolls = function(numPolls, callback) {
		Polls.count().exec(function (err, count) {
			if (err) { throw err; }
			Polls.find().exec(function(err, polls) {
				if (err) { throw err; }
				
				var randomPolls = [];
				var max = count;
				for (var i=0; i<numPolls; i++) {
					var randNumber = Math.floor(Math.random()*max);
					randomPolls.push(polls[randNumber]);
					
					/* Swap random poll and last poll, then decrease max by 1,
						which will ensure polls are not repeated.
						Based on Fisher-Yates shuffle */
					var temp1 = polls[randNumber];
					var temp2 = polls[max-1];
					polls[randNumber] = temp2;
					polls[max-1] = temp1;
					
					max = max-1;
				}
				
				callback(randomPolls);
			});
		});
	};
}

module.exports = PollHandler;
