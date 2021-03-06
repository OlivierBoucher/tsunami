var express = require('express');
var router = express.Router();
// Import routes
var profiles = require('./profiles');
var forms = require('./forms');
var admin = require('./admin');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/wicked-admins/login');
}

module.exports = function(passport) {
    //=======================================================
    // ANGULAR APP
    //=======================================================
    router.get('/', function(req, res) {
        res.render('index', {
            title: 'Tsunami'
        });
    });
    //=======================================================
    // API
    //=======================================================
    router.post('/api/forms/create', forms.create);
    router.post('/api/profile/:id', profiles.getOne);
    router.post('/api/profile/:id/upload', profiles.upload);
    router.post('/api/profile/:id/update', profiles.update);
    //=======================================================
    // SECURED ADMIN PANEL
    //=======================================================
    router.post('/wicked-admins/auth', passport.authenticate('login', {
        successRedirect: '/wicked-admins/home',
        failureRedirect: '/',
        failureFlash: true
    }));
    router.get('/wicked-admins/login', admin.login);
    router.get('/wicked-admins/', isAuthenticated, admin.home);
    router.get('/wicked-admins/home', isAuthenticated, admin.home);
    router.get('/wicked-admins/profile/:id', isAuthenticated, admin.getProfile);
    router.get('/wicked-admins/profile/:id/addFavorite', isAuthenticated, admin.addFavorite);
    router.get('/wicked-admins/profile/:id/removeFavorite', isAuthenticated, admin.removeFavorite);

    return router;
}