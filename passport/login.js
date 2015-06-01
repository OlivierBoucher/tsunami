var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('TestUser2');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            User.findOne({
                    'username': username
                },
                function(err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, req.flash('message', 'user not found.'));
                    }
                    if (!isValidPassword(user, password)) {
                        return done(null, false, req.flash('message', 'Invalid password'));
                    }
                    return done(null, user);
                }
            )
        }));

    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}