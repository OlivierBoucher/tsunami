var mongoose = require('mongoose');
var schema = {
	fullName 	: {type : String},
	email		: {type : String},
}
module.exports = mongoose.model('TestApiForm', schema);