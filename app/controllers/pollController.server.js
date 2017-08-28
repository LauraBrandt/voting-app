'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler () {
    
    this.addPoll = function(req, callback) {
        Users
            .findOne({oauthID : req.user.oauthID})
            .exec(function(err, user) {
                if (err) { throw err; }
                
                var newPoll = new Polls({
                    question: req.body.question,
                    answers : req.body.answers,
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
	
}

module.exports = PollHandler;
