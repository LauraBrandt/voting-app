'use strict';

module.exports = {
	facebook: {
	    clientID: process.env.FACEBOOK_KEY,
	    clientSecret: process.env.FACEBOOK_SECRET,
	    callbackURL: process.env.APP_URL + 'auth/facebook/callback'
	},
	twitter: {
	    consumerKey: process.env.TWITTER_KEY,
	    consumerSecret: process.env.TWITTER_SECRET,
	    callbackURL: process.env.APP_URL + 'auth/twitter/callback'
	},
	google: {
	    clientID: process.env.GOOGLE_KEY,
	    clientSecret: process.env.GOOGLE_SECRET,
	    callbackURL: process.env.APP_URL + 'auth/google/callback'
	}
};
