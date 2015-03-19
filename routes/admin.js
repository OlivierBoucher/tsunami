var mongoose 	= require('mongoose');
var Profile 	= mongoose.model('TestApiProfile3');
var Form 		= mongoose.model('TestApiForm');

var admin = {
	login : function(req, res){
		var context = {
			title : 'Authentification'
		};
		res.render('login', context);
	},
	home : function(req, res){
		Profile.find(function(err, profiles){
			if(err){
				console.log(err);
				res.status(500).end();
			}
			else{
				var sortedProfiles;
				var favoriteProfiles;
				if(!profiles){
					//No profiles found
					console.log('No profiles found');
					sortedProfiles = {
						seen : [],
						unseen : []
					};
					favoriteProfiles = [];
				}
				else{
					console.log('Profiles were found');
					var sortProfiles = function(profileList){
						var seenProfiles = [];
						var unseenProfiles = [];
						//console.log('Profile list :' + profileList);
						for(var j =0; j < profileList.length; j++){
							var wasFound = false;
							for(var i =0; i < req.user.seenProfiles.length; i++){
								if(req.user.seenProfiles[i] == profileList[j].id){
									console.log('Adding to seen: ' + profileList[j]);
									seenProfiles.push(profileList[j]);
									wasFound = true;
									break;
								}
							}
							if(!wasFound)
								unseenProfiles.push(profileList[j]);
						}
						return {
							seen : seenProfiles,
							unseen : unseenProfiles,
						}
					}
					console.log('Starting to sort profiles');
					sortedProfiles = sortProfiles(profiles);
					console.log('Done sorting profiles');
					console.log('Starting to filter favorite profiles');
					favoriteProfiles = profiles.filter(function(profile){
						for(i =0; i< req.user.favoriteProfiles.length; i++){
							if(req.user.favoriteProfiles[i] == profile._id){
								return true;
							}
						}
						return false;
					});	
				}
				Form.count(function(err, formCount){
					if(err){
						console.log(err);
						res.status(500).end();
					}
					else{
						var stats = [
							{
								name : 'Qt. Formulaires',
								value : formCount
							},
							{
								name : 'Qt. Profils',
								value : sortedProfiles.seen.length + sortedProfiles.unseen.length
							}
						];
						var context = {
							'title' : 'Administration',
							'profiles' : sortedProfiles,
							'stats' : stats,
							'favorites' : favoriteProfiles
						}
						console.log(context);
						res.render('home', context);
					}
				});
			}
		});
	},
	getProfile : function(req, res){
	if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
		var id = req.params.id;
		Profile.findById(id, function(err, profile){
			if(err){
				console.log(err);
			}
			else{
				function contains(a, obj) {
					for (var i = 0; i < a.length; i++) {
						if (a[i] === obj) {
							return true;
						}
					}
					return false;
				}
				var context = {
					profile : profile,
					isFavorite : contains(req.user.favoriteProfiles, id)
				}
				res.render('profile', context);
						//Set profile as seen if required
						if(!contains(req.user.seenProfiles, id)){
							req.user.seenProfiles.push(id);
							req.user.save(function(err){
								if(err){
									console.log(err);
								}
								else{
									console.log('Profil set as seen');
								}
							});
						}
					}
				});

	}
	else{
			//Invalid id
			console.log('Wrong id');
			res.status(400).end();
		}
	},
	addFavorite : function(req, res){
		if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
			var id = req.params.id;
			req.user.favoriteProfiles.push(id);
			req.user.save(function(err){
				if(err){
					console.log(err);
					res.status(500).end();
				}
				else{
					res.redirect('/wicked-admins/home');
				}
			});
		}
		else{
			//Invalid id
			console.log('Wrong id');
			res.status(400).end();
		}
	},
	removeFavorite : function(req, res){
		if(req.params.id.match(/^[0-9a-fA-F]{24}$/)){
			var id = req.params.id;
			for(i = 0; i< req.user.favoriteProfiles.length; i++){
				if(id === req.user.favoriteProfiles[i]){
					req.user.favoriteProfiles.splice(i,1);
					break;
				}
			}
			req.user.save(function(err){
				if(err){
					console.log(err);
					res.status(500).end();
				}
				else{
					res.redirect('/wicked-admins/home');
				}
			});
		}
		else{
			//Invalid id
			console.log('Wrong id');
			res.status(400).end();
		}
	}
}
module.exports = admin;