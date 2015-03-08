var express 	= require('express');
var router 		= express.Router();
var mongoose 	= require( 'mongoose' )
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
	var recievedForm = new Form(req.body);
  	console.log(recievedForm);
  	recievedForm.save(function (err) {
	  if (err) return console.log(err);
	  console.log('Form added to database');
	  res.send("Form recieved and saved");
	});
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