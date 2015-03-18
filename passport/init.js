var login 		= require('./login');
var mongoose 	= require('mongoose');
var User 		= mongoose.model('TestUser');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		console.log('serializing user:', user);
		done(null, user._id);
	});
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			console.log('deserializing user:', user);
			done(err, user);
		});
	});
	console.log('Adding login strategy');
	login(passport);
}