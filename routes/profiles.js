var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
var Form = mongoose.model('Form');
var User = mongoose.model('User');
var fs = require('fs-extra');
var path = require('path');

var profiles = {
    update: function(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            var id = req.params.id;
            Profile.findById(id, function(err, profile) {
                if (err) {
                    console.log(err);
                    res.send({
                        result: "Error",
                        message: "Impossible de trouver le profil"
                    });
                } else {
                    profile.portfolioLink = req.body.portfolioLink;
                    profile.customMessage = req.body.customMessage;
                    profile.lastModified = Date.now();
                    profile.save(function(err) {
                        if (err) {
                            res.send({
                                result: "Error",
                                message: "Impossible de sauvegarder le profil"
                            });
                        } else {
                            res.send({
                                result: "Success",
                                message: "Mise à jour du profil réussie"
                            });
                            //Remove seen from all admins
                            User.find({}, function(err, users) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    users.forEach(function(user) {
                                        for (i = 0; i < user.seenProfiles.length; i++) {
                                            if (user.seenProfiles[i] === id) {
                                                //console.log('Removed seen: ' + id + 'by ' + user.username);
                                                user.seenProfiles.splice(i, 1);
                                                break;
                                            }
                                        }
                                        user.save(function(err) {
                                            console.log(err);
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.status(400).end();
        }
    },

    getOne: function(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            var id = req.params.id;
            Profile.findOne({
                'formId': id
            }, function(err, profile) {
                if (err) {
                    console.log(err);
                } else {
                    if (profile != null) {
                        //Return the profile
                        res.send({
                            result: "Success",
                            profile: profile
                        });
                    } else {
                        Form.findById(id, function(err, form) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (form != null) {
                                    //Create the profile
                                    var newProfile = new Profile({
                                        fullName: form.fullName,
                                        email: form.email,
                                        formId: id,
                                        portfolioLink: '',
                                        customMessage: '',
                                        attachments: [],
                                        lastModified: Date.now()
                                    });
                                    console.log(newProfile);
                                    newProfile.save(function(err) {
                                        if (err) {
                                            console.log(err);
                                            res.send({
                                                result: "Error",
                                                message: "Impossible de créer le profile"
                                            });
                                        } else {
                                            res.send({
                                                result: "Success",
                                                profile: newProfile
                                            });
                                            form.remove(function(err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.send({
                                        result: "Error",
                                        message: "Aucun formulaire ne correspond à la requête"
                                    });
                                }
                            }
                        });
                    }
                }
            });
        } else {
            res.send({
                result: "Error",
                message: "Requête mal formulée"
            });
        }
    },

    upload: function(req, res) {
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            var id = req.params.id;
            Profile.findById(id, function(err, profile) {
                if (err) {
                    res.status(500).end();
                } else {
                    if (typeof profile.attachments[0] === 'undefined' || profile.attachments.length < 10) {
                        //Accept the file
                        var newFileName = profile._id + '_' + req.files.file.name;
                        var newPath = path.join(__dirname, '../public/uploads/' + newFileName);
                        fs.move(req.files.file.path, newPath, function(err) {
                            if (err) {
                                res.status(500).end();
                            } else {
                                profile.attachments.push({
                                    path: 'uploads/' + newFileName,
                                    fileName: req.files.file.originalname
                                });
                                profile.save(function(err) {
                                    if (err) {
                                        res.status(500).end();
                                    } else {
                                        res.status(204).end();
                                    }
                                });
                            }
                        });
                    } else {
                        fs.remove(req.files.file.path, function(err) {
                            console.log(err);
                        });
                        res.status(409).end();
                    }
                }
            });
        } else {
            fs.remove(req.files.file.path, function(err) {
                console.log(err);
            });
            res.status(400).end();
        }
    }
}

module.exports = profiles;