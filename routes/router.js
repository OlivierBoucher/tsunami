var express 	= require('express');
var router 		= express.Router();
var mongoose 	= require('mongoose');
var validator = require('validator');
//Models
var Form 		= mongoose.model('TestApiForm');
var Profile = mongoose.model('TestApiProfile');
// Intercepts the request before it gets further
/*router.use(function(req, res, next){
	//Do something with the request
	console.log("New request intercepted");
	next();
});
// Intercepts parameters and can sanitize them
router.param('paramName', function(req, res, next, paramName){
	// Do validation on parameter
	console.log("Doing validation on a parameter");
	req.paramName = paramName;
	next();
});*/

// GET home page
router.get('/', function(req, res) {
  res.render('index',
  	{ 
  		title: 'Tsunami' 
  	}
  );
});

// API : Create form - First step into registration
router.post('/api/forms/create', function(req, res) {

  console.log(req.body);
  // If the form recieved has passed validation
  if(req.body.$valid){
    console.log('Recieved a valid form');
    //Extracts values from request into mongo document
    var recievedForm = new Form({
      fullName:  req.body.fullName.$modelValue,
      email:   req.body.email.$modelValue,
    });

    console.log(recievedForm);
    //Saves the document
    recievedForm.save(function (err) {
      if (err){
        res.send({result : "Error", message: "Impossible de sauvegarder le formulaire"});
      }
      console.log('Form added to database');
      //Send result back to angular app
      res.send({result : "Success", form: recievedForm});
      //Import stuff required for the mailer
      var path            = require('path');
      var mailer          = require('../config/mailer');
      var templatesDir    = path.resolve(__dirname, '..', 'email_templates');
      var emailTemplates  = require('email-templates');
      //Send a mail using templates
      emailTemplates(templatesDir, function(err, template){
        if(err){
          console.log(err);
        }
        else{
          //Creating the context that will be passed to the template
          locals = {
            form: recievedForm
          }
          //Render the template
          template('register-email', locals, function(err, html, text){
            if(err){
              console.log(err);
            }
            else{
              //Create the mail options
              var mailOptions = {
                from: 'Tsunami <inscriptions.tsunami@gmail.com>',
                to: locals.form.email,
                subject: 'Demande d\'inscription Tsunami',
                text: text,
                html: html
              }
              //Send the mail
              mailer.sendMail(mailOptions, function(err, responseStatus){
                if(err){
                  console.log(err);
                }
                else{
                  console.log(responseStatus.response);
                }
              });
            }
          });
        }
      });
    });
  }
  else{
    //The posted form was not validated
    res.send({result : "Error", message: "Le formulaire recu est invalide"});
  }
});
// API : Complete registration
router.post('/api/registration/:id', function(req, res){
  var id = req.params.id;
  
});
// API : list forms
router.get('/api/forms/list', function(req, res) {
            Form.find(function(err, forms) {
                if (err){
                	console.log(err);
                    res.send(err);
                }

                res.json(forms);
            });
        });

module.exports = router;