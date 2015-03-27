// BASE SETUP
// ============================================
var express 	= require('express');
var logger 		= require('morgan');
var session 	= require('express-session');
var bodyParser 	= require('body-parser');
var path 		= require('path');
var fs 			= require('fs-extra');
var multer		= require('multer');
var passport	= require('passport');
var favicon 	= require('serve-favicon');
var db 			= require('./config/database');
var port 		= process.env.port || 1337;
var app 		= express();
module.exports 	= app;

// CONFIGURATIONS
// ============================================
app.locals.moment = require('moment');
app.set('port', port);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(multer({
	dest	: './temp_uploads/',
	limits	: {
		fields		: 0,
		fileSize	: 2000000,
		files 		: 10
	}
}));
app.use(favicon(path.join(__dirname, '/public/assets/img/favicon.ico')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'im yo daddy',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
var flash = require('connect-flash');
app.use(flash());
// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);
if(!module.parent){ app.use(logger('dev'));}
// ROUTES SETUP
// ============================================
var router 		= require('./routes/router')(passport);
// ROUTING
// ============================================
app.use('/', router);
app.use(function(req, res, next) {
	res.render('404',
		{ 
			title: 'Erreur 404' 
		}
	);
});
if(!module.parent){
	app.listen(port,);
	console.log('Server started on port 3000');
}
