'use strict';

module.exports = function (app, passport) {
    app.use(function(req, res, next){
        res.status(404);
        res.render('error', {
			auth: req.isAuthenticated(),
			user: req.user,
			title: 'Not Found',
			page: 'notfound',
			status: '404'
		});
    });
    
    app.use(function(err, req, res, next) {
        if(err) {
            console.error(err);
            res.status(err.status || 500);
            res.render('error', {
    			auth: req.isAuthenticated(),
    			user: req.user,
    			title: 'Error',
    			page: 'error',
    			status: err.status
    		});
        } 
    });
};