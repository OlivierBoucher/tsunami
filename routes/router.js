var express 	= require('express');
var router 		= express.Router();
var mongoose 	= require('mongoose');
var validator = require('validator');
var fs = require('fs-extra');
var path = require('path');
//Models
var Form 		= mongoose.model('TestApiForm');
var Profile = mongoose.model('TestApiProfile2');
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
// API : Complete registration and get profile
router.post('/api/profile/:id', function(req, res){
  if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
    var id = req.params.id;
    console.log('Recieved a request with formId: ' + id);
    Profile.findOne({'formId': id}, function(err, profile){
      if(err){
        console.log(err);
      }
      else{
        console.log('Profile search went sucessfully');
        if(profile != null){
          console.log('A profile was found');
          //Return the profile
          res.send({result : "Success", profile: profile});
        }
        else{
          console.log('No profile was found');
          Form.findById(id, function(err, form){
            if(err){
              console.log(err);
            }
            else{
              console.log('Form search went sucessfully');
              if(form != null){
                //Create the profile
                var newProfile = new Profile({
                  fullName : form.fullName,
                  email : form.email,
                  formId : id,
                  portfolioLink : '',
                  customMessage : '',
                  attachments : []
                });
                console.log(newProfile);
                newProfile.save(function(err){
                  if(err){
                    res.send({result : "Error", message: "Impossible de créer le profile"});
                  }
                  else{
                    res.send({result : "Success", profile: newProfile});
                    console.log('Removing the form');
                    form.remove(function(err){
                      if(err){
                        console.log(err);
                      }
                      else{
                        console.log('Form removed sucessfully');
                      }
                    });
                  }
                });
              }
              else{
                console.log('No form was found');
                //No form with that id was found
                res.send({result : "Error", message: "Aucun formulaire ne correspond à la requête"});
              }
            }
          });
        }
      }
    });
  }
  else{
    res.send({result : "Error", message: "Requête mal formulée"});
  }
});
//API : Upload and link to profile
router.post('/api/upload/:id', function(req,res){
  console.log(req.files);
  console.log(req.body);
  if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
    var id = req.params.id;
    Profile.findById(id, function(err, profile){
      if(err){
        console.log(err);
        res.status(500).end();
      }
      else{
        console.log(profile.attachments.length);
        console.log(profile.attachments.length < 10);
        console.log(typeof profile.attachments[0] === 'undefined');
        if(typeof profile.attachments[0] === 'undefined'|| profile.attachments.length < 10){
          //Accept the file
          var newFileName = profile._id + '_' + req.files.file.name;
          var newPath = path.join(__dirname, '../public/uploads/' + newFileName);
          fs.move(req.files.file.path, newPath, function(err){
            if(err){
              console.log(err);
              res.status(500).end();
            }
            else{
              console.log('File moved to public uploads');
              profile.attachments.push({
                path : newPath,
                fileName : req.files.file.originalname
              });
              profile.save(function(err){
                if(err){
                  console.log(err);
                  res.status(500).end();
                }
                else{
                  res.status(204).end();
                }
              });
            }
          });
        }
        else{
          //Refuse the upload and delete the temp file
          console.log('Limit of files for this user has been reached: ' + profile.attachments.lenght);
          fs.remove(req.files.file.path, function(err){
            console.log(err);
          });
          res.status(409).end();
        }
      }
    });
  }
  else{
    //Id error, delete file
    console.log('Wrong id');
    fs.remove(req.files.file.path, function(err){
      console.log(err);
    });
    res.status(400).end();
  }
});
// API : Update user profile
router.post('/api/profile/:id/update', function(req, res){
  if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
    var id = req.params.id;
    console.log(req.body);
    Profile.findById(id, function(err, profile){
      if(err){
        console.log(err);
        res.send({result : "Error", message: "Impossible de trouver le profil"});
      }
      else{
        profile.portfolioLink = req.body.portfolioLink;
        profile.customMessage = req.body.customMessage;
        profile.save(function(err){
          if(err){
            res.send({result : "Error", message: "Impossible de sauvegarder le profil"});
          }
          else{
            res.send({result : "Success", message: "Mise à jour du profil réussie"});
          }
        });
      }
    });
  }
  else{
    //Id error
    console.log('Wrong id');
    res.status(400).end();
  }
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
// API : list forms
router.get('/api/profile/list', function(req, res) {
            Profile.find(function(err, profiles) {
                if (err){
                  console.log(err);
                    res.send(err);
                }

                res.json(profiles);
            });
        });

module.exports = router;