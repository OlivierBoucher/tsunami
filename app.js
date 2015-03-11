// BASE SETUP
// ============================================
var express 	= require('express');
var logger 		= require('morgan');
var session 	= require('express-session');
var bodyParser 	= require('body-parser');
var path 		= require('path');
var fs 			= require('fs-extra');
var multer		= require('multer');
var db 			= require('./config/database');
var port 		= process.env.port || 3000;
var app 		= express();
module.exports 	= app;

// ROUTES SETUP
// ============================================
var router 		= require('./routes/router');
// CONFIGURATIONS
// ============================================
app.set('port', port);
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(multer({
	dest	: './temp_uploads/',
	limits	: {
		fields		: 0,
		fileSize	: 2000000,
		files 		: 5
	}
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'im yo daddy',
	resave: false,
	saveUninitialized: true
}));
if(!module.parent){ app.use(logger('dev'));}
// ROUTING
// ============================================
app.use('/', router);

if(!module.parent){
	app.listen(port);
	console.log('Server started on port 3000');
}