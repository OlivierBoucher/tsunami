var mongoose 	= require('mongoose');
var Profile 	= mongoose.model('TestApiProfile3');
var Form 		= mongoose.model('TestApiForm');
var fs 			= require('fs-extra');
var path 		= require('path');

var profiles = {
	// TODO : Remove from seen in each profile
	update : function(req, res){
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
					profile.lastModified = Date.now();
					profile.save(function(err){
						if(err){
							res.send({result : "Error", message: "Impossible de sauvegarder le profil"});
						}
						else{
							res.send({result : "Success", message: "Mise à jour du profil réussie"});
							//Remove seen from all admins
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
		},

		getOne : function(req, res){
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
			                	attachments : [],
			                	lastModified : Date.now()
			                });
			                console.log(newProfile);
			                newProfile.save(function(err){
			                	if(err){
			                		console.log(err);
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
},

upload : function(req,res){
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
			          			path : 'uploads/' + newFileName,
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
		},
		getAll : function(req, res) {
			Profile.find(function(err, profiles) {
				if (err){
					console.log(err);
					res.send(err);
				}

				res.json(profiles);
			});
		}
	}

	module.exports = profiles;