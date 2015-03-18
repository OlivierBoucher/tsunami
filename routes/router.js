var express 	= require('express');
var router 		= express.Router();
// Import routes
var profiles  = require('./profiles');
var forms     = require('./forms');
var admin 	  = require('./admin');

// Intercepts the request before it gets further
/*router.use(function(req, res, next){
	//Do something with the request
	console.log("New request intercepted");
	next();
});
// Intercepts parameters and can sanitize them
router.param('paramName', function(req, res, next, paramName){
	// Do validation on parameter
	console.log("Doing validation on a parameter");
	req.paramName = paramName;
	next();
});*/
var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/wicked-admins/login');
}

module.exports = function(passport){
	// GET Angular app
	router.get('/', function(req, res) {
		res.render('index',
		{ 
			title: 'Tsunami' 
		}
		);
	});
	// API : Create form - First step into registration
	router.post('/api/forms/create', forms.create);
	// API : List forms
	router.get('/api/forms/list', forms.getAll);
	// API : Complete registration and get profile
	router.post('/api/profile/:id', profiles.getOne);
	// API : Upload and link to profile
	router.post('/api/profile/:id/upload', profiles.upload);
	// API : Update user profile
	router.post('/api/profile/:id/update', profiles.update);
	// API : List profiles
	router.get('/api/profile/list', profiles.getAll);
	//=======================================================
	// SECURED ADMIN PANEL
	//=======================================================
	router.post('/wicked-admins/auth', passport.authenticate('login', {
		successRedirect: '/wicked-admins/home',
		failureRedirect: '/',
		failureFlash : true
	}));
	router.get('/wicked-admins/login', admin.login);
	router.get('/wicked-admins/home', isAuthenticated, admin.home);
	router.get('/wicked-admins/profile/:id', isAuthenticated, admin.getProfile);
	router.get('/wicked-admins/profile/:id/addFavorite', isAuthenticated, admin.addFavorite);
	router.get('/wicked-admins/profile/:id/removeFavorite', isAuthenticated, admin.removeFavorite);

	return router;
}