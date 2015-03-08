var mongoose = require('mongoose');
var schema = {
    lastName 	: {type : String},
    firstName 	: {type : String},
    birthDate	: {type : String},
    email		: {type : String},
    category	: {type : String}
}
module.exports = mongoose.model('TestApi', schema);