var mongoose 	= require('mongoose');
var User 		= mongoose.model('TestUser');

var olivier = new User({
	username: 'olivier',
	password: '$2a$12$WGZ5PniJmCAlzjaNVU8a2.9s6/le7.yBkBMDzX6hjP5TD4rRvT3Em'
});
olivier.save(function(err){
	if(err){
		console.log(err);
	}
	console.log('Added user olivier');
});