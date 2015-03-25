var mongoose 	= require('mongoose');
var User 		= mongoose.model('TestUser2');

var olivier = new User({
	username: 'olivier',
	password: '$2a$12$WGZ5PniJmCAlzjaNVU8a2.9s6/le7.yBkBMDzX6hjP5TD4rRvT3Em',
	favoriteProfiles: [],
	seenProfiles: [],
	discardedProfiles: []
});
olivier.save(function(err){
	if(err){
		console.log(err);
	}
	console.log('Added user olivier');
});
var testAdmin = new User({
	username: 'testadmin2',
	password: '$2a$04$GUbPP.Wm4j4OB7nqXeAAQ.myX/1W9aX8Ch4HIR82t02SnxGzEneMi',
	favoriteProfiles: [],
	seenProfiles: [],
	discardedProfiles: []
});
testAdmin.save(function(err){
	if(err){
		console.log(err);
	}
	console.log('Added user testadmin');
});