var login = require('./login');
var mongoose = require('mongoose');
var User = mongoose.model('TestUser2');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    console.log('Adding login strategy');
    login(passport);
}