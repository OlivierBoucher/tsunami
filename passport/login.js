var LocalStrategy 	= require('passport-local').Strategy;
var mongoose 		= require('mongoose');
var User 			= mongoose.model('TestUser2');
var bCrypt 			= require('bcrypt-nodejs');

module.exports = function(passport){
	passport.use('login', new LocalStrategy({
		passReqToCallback : true
	},
	function(req, username, password, done){
		console.log(User);
		console.log('Recieved new login request: ' + username + '/' + password);
		User.findOne({'username' : username},
			function(err, user){
				if(err){
					console.log('Error seeking user in database');
					return done(err);
				}
				if(!user){
					console.log('User not found with username ' + username);
					return done(null, false, req.flash('message', 'user not found.'));
				}
				if(!isValidPassword(user, password)){
					console.log('Invalid password');
					return done(null, false, req.flash('message', 'Invalid password'));
				}
				return done(null, user);
			}
			)
	})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	}
}