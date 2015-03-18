var mongoose = require('mongoose');
var schema = {
	username : {type : String},
	password : {type : String},
	favoriteProfiles: [{type : String}],
	seenProfiles: [{type : String}],
	discardedProfiles: [{type : String}]

}
module.exports = mongoose.model('TestUser2', schema);