var mongoose 	= require('mongoose');
var Profile 	= mongoose.model('TestApiProfile3');
var Form 		= mongoose.model('TestApiForm');

var admin = {
	login : function(req, res){
		res.render('login');
	},
	home : function(req, res){
		Profile.find(function(err, profiles){
			if(err){
				console.log(err);
			}
			else{
				if(!profiles){
					//No profiles found
					console.log('No profiles found');
				}
				else{
					Form.count(function(err, formCount){
						var likedProfiles = profiles.filter(function(profile){
							for(var i =0; req.user.favoriteProfiles.length; i++){
								if(req.user.favoriteProfiles[i] == profile._id){
									return true;
								}
							}
							return false;
						});
						var sortProfiles = function(profileList){
							var seenProfiles = [];
							var unseenProfiles = [];
							console.log('Profile list :' + profileList);

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
								unseen : unseenProfiles
							}
						}
						var context = {
							'profiles' : sortProfiles(profiles),
							'formCount' : formCount,
							'likedProfiles' : likedProfiles
						}
						console.log(context);
						res.render('home', context);
					});
				}
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
					//Set profile as seen fi required
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
		}
	},
	addFavorite : function(req, res){
		
	},
	removeFavorite : function(req, res){

	}
}
module.exports = admin;