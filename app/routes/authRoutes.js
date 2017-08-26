'use strict';

module.exports = function (app, passport) {
    app.get('/auth/facebook', passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/dashboard',
            failureRedirect : '/login'
        }));

    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/dashboard',
            failureRedirect : '/login'
        }));

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/dashboard',
                failureRedirect : '/login'
        }));
        
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};