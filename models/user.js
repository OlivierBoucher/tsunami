var mongoose = require('mongoose');
var schema = {
	username : {type : String},
	password : {type : String}
}
module.exports = mongoose.model('TestUser', schema);