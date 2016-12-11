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
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables

	var user = new User(req.body);
	var message = null;


	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;
	user.username = user.email;
	console.log('signup user.salt: ' + salt);

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

			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};


exports.signin = function( req, res){
    //passport.use(new LocalStrategy(
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
                    console.log('user.auth: ');
                    console.dir(user.auth);
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

                            req.login(user, function(err) {
                                if (err) {
                                    res.status(400).send(err);
                                } else {
                                    res.json(user);
                                }
                            });
                        }
                    });

                    /*
                    //console.dir('this is the user just before save: ' + user);
                    user.save();
                    // Remove sensitive data before login
                    user.password = undefined;

                    req.login(user, function (err) {
                        if (err) {
                            console.log('error with login within signin');
                            res.status(400).send(err);
                        } else {
                            console.log('sucess with login within signin');
                            res.json(user);
                        }
                    });
                    */
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
    //));
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