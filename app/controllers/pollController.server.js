'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler () {
    
    this.addPoll = function(userid, body, callback) {
        Users
            .findOne({oauthID : userid})
            .exec(function(err, user) {
                if (err) { throw err; }
                
                var answersObject = {};
                for (var i=0; i<body.answers.length; i++) {
                	var key = body.answers[i];
                	answersObject[key] = 0;
                }
                
                var newPoll = new Polls({
                    question: body.question,
                    answersObject : answersObject,
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
	        
	        Polls.find({ creator: user._id }).exec(function(err, polls) {
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
}

module.exports = PollHandler;
