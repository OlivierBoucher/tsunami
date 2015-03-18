// Bring Mongoose into the app 
var mongoose = require( 'mongoose' ); 

// Build the connection string 
var dbURI = 'mongodb://webApi:Tsunami2015@localhost:27017/tsunami'; 

// Create the database connection 
mongoose.connect(dbURI); 

// CONNECTION EVENTS 
mongoose.connection.on('connected', function () {
	console.log('Mongoose default connection open to ' + dbURI);
}); 

mongoose.connection.on('error',function (err) { 
	console.log('Mongoose default connection error: ' + err);
}); 

mongoose.connection.on('disconnected', function () { 
	console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
	mongoose.connection.close(function () { 
		console.log('Mongoose default connection disconnected through app termination'); 
		process.exit(0); 
	}); 
}); 

// BRING IN YOUR SCHEMAS & MODELS // For example 
require('../models/form');
require('../models/profile');
require('../models/user');    