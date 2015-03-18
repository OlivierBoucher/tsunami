var mongoose 	= require('mongoose');
var Profile 	= mongoose.model('TestApiProfile2');
var Form 		= mongoose.model('TestApiForm');

var admin = {
	login : function(req, res){
		res.render('login');
	},
	home : function(req, res){
		
	}
}
module.exports = admin;