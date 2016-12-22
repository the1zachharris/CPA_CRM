'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	logger = require('../../controllers/logger.server.controller.js'),
    coreUtils = require('../../controllers/core.server.controller.js'),
    async = require('async'),
	mongoose = require('mongoose'),
	passport = require('passport'),
    LocalStrategy = require('passport-local'),
    crypto = require('crypto'),
	UserModel = require('../../models/users.server.model.js'),
	User = mongoose.model('User');

var salt = "TrakkTask";

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// Deserialize sessions
passport.deserializeUser(function(id, done) {
	User.findOne({
		_id: id
	}, '-salt -password', function(err, user) {
		done(err, user);
	});
});




/**
 * Signup
 */
exports.signup = function(req, res) {
	var user = new User(req.body);
	//remove problem fields
    user.cardnumber = undefined;
    user._id = undefined;
    user.__v = undefined;
    user.subscription._id = undefined;
    user.subscription.__v = undefined;
	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;
	user.username = user.email;
	user.database = user.username.replace('.', '_');
	user.database = user.database.replace('@', '_at_');
    user.password = user.hashPassword(user.password);
    var query = { username: user.username };

    User.findOneAndUpdate( query,user,{upsert:true},function( err,user ){
        if (err) {
            console.log('error with findOneAndUpdate');
            console.dir(err);
            return res.status(400).send({
                message: err
            });
        } else {
            console.log('no error with findOneAndUpdate... move along');
            res.status(200).send({checkout: "true", user: user});
        }
    });

};


exports.signin = function( req, res){
    //User.findOne with username
    User.findOne({username: req.body.username}).exec(function (err, foundUser){
        if (err) {
            console.log('there was a problem checking username');
        } else if (foundUser) {
            console.log('found user with username');

            var user = new User (foundUser);

            user.password = req.body.password;

            user.authenticate(function(passback){
                if (passback) {
                    user.loginTime = Date.now();
                    user.auth = passback;
                    //console.log('user.auth: ');
                    //console.dir(user.auth);
                    // Then save the user
                    user.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: logger.log("ERROR", __function, err)
                            });
                        } else {
                            // Remove sensitive data before login
                            user.password = undefined;
                            user.salt = undefined;
							if (user.free) {
                            	console.log('user is free!');
								req.login(user, function(err) {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    res.json(user);
                                }
                            });
                            } else {
								console.log('check user.subscription.status == Active');
								if (user.subscription.status == 'Active'){
                                    console.log('user has active subscription!');
                                    req.login(user, function(err) {
                                        if (err) {
                                            res.status(400).send(err);
                                        } else {
                                            res.json(user);
                                        }
                                    });
								} else {
									console.log('user does NOT have active subscription');
								    res.status(400).send({message: 'Subscription is not Active.', checkout: true, user: user});
								}
							}
                        }
                    });
                } else {
                    res.status(400).send({message: 'incorrect password!', auth: user.auth})
                };
            });

        } else if (!foundUser) {
            console.log('did NOT find user with username');
            return res.status(400).send({
                message: 'Could not find a user with that username.'
            })
        }
    });
};


/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};


exports.me = function(req,res){
	if(req.user){
		console.log('in auth.me');
		console.dir(req.user.username);
	    res.status(200).send({user: req.user})
	} else {
		res.status(400);
	}
};