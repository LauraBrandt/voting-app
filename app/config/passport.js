'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
//var GoogleStrategy = require('passport-google-oauth2').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	/****************************** FACEBOOK ******************************/
	
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebook.clientID,
		clientSecret: configAuth.facebook.clientSecret,
		callbackURL: configAuth.facebook.callbackURL
	},
	function(token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'oauthID': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}
				
				if (user) {
					return done(null, user);
					
				} else {
					var newUser = new User();
					
					newUser.oauthID = profile.id;
                	newUser.displayName = profile.displayName;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
		
		
	/****************************** TWITTER ******************************/
	
	passport.use(new TwitterStrategy({
        consumerKey     : configAuth.twitter.consumerKey,
        consumerSecret  : configAuth.twitter.consumerSecret,
        callbackURL     : configAuth.twitter.callbackURL
	},
	function(token, tokenSecret, profile, done) {
        process.nextTick(function() {
        	
            User.findOne({ 'oauthID' : profile.id }, function(err, user) {
				if (err) {
					return done(err);
				}
				
                if (user) {
                    return done(null, user);
                    
                } else {
                    var newUser = new User();

                    newUser.oauthID = profile.id;
                	newUser.displayName = profile.displayName;

                    newUser.save(function(err) {
                        if (err) {
							throw err;
						}
						
                        return done(null, newUser);
                    });
            	}
        	});
		});
	}));
    
    /****************************** GOOGLE ******************************/
    
	passport.use(new GoogleStrategy({
        clientID        : configAuth.google.clientID,
        clientSecret    : configAuth.google.clientSecret,
        callbackURL     : configAuth.google.callbackURL
    },
    function(token, refreshToken, profile, done) {
    	
        process.nextTick(function() {
            User.findOne({ 'oauthID' : profile.id }, function(err, user) {
                if (err) {
					return done(err);
				}
				
                if (user) {
                    return done(null, user);
                    
                } else {
                    var newUser = new User();

                    newUser.oauthID = profile.id;
                	newUser.displayName = profile.displayName ;
                	
                    newUser.save(function(err) {
                        if (err) {
							throw err;
						}
						
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
    
};
