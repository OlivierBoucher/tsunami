var express 	= require('express');
var router 		= express.Router();
var mongoose 	= require('mongoose');
var validator = require('validator');
//Models
var Form 		= mongoose.model('TestApi');
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
router.post('/api/forms/create', function(req, res) {

  console.log(req.body);

  if(req.body.$valid){

    console.log('Recieved a valid form');

    var recievedForm = new Form({
      firstName:  req.body.firstName.$modelValue,
      lastName:   req.body.lastName.$modelValue,
      birthDate:  req.body.birthDate.$modelValue,
      email:      req.body.email.$modelValue,
      category:   req.body.category.$modelValue
    });

    console.log(recievedForm);

    recievedForm.save(function (err) {
      if (err){
        res.send({result : "Error", message: "Impossible de sauvegarder le formulaire"});
      }
      console.log('Form added to database');
      res.send({result : "Success", form: recievedForm});
    });
  }
  else{
    res.send({result : "Error", message: "Le formulaire recu est invalide"});
  }
});

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