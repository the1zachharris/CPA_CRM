'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	logger = require('../../controllers/logger.server.controller.js'),
    coreUtils = require('../../controllers/core.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
    ldapStrategy = require('passport-ldapauth'),
	UserModel = require('../../models/users.server.model.js'),
	User = mongoose.model('User'),
	allConfig = require('../../../config/env/all');
/**
 * Signup
 */

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

exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	//user.displayName = user.firstName + ' ' + user.lastName;

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


// A requirement for this function to work is connectivity to the TW or Lev3 network.
exports.signin = function( req, res, next ){
    var fallbackLdapHost = allConfig.fallbackLdapHost;  // #FIXME: needs code for fallback LDAP server
    
    var authOpts = {
        server: {
            url:          allConfig.ldapHost,
            searchBase:   'dc=corp,dc=global,dc=level3,dc=com',
            searchFilter: '(sAMAccountName={{username}})'
        },
        usernameField: 'username',
        passwordField: 'password'
    };

    passport.use( new ldapStrategy( authOpts ));
    passport.initialize();

	passport.authenticate( 'ldapauth', { session: false }, function( err, ldapUsr, info ){
        if( err ){
            return next( err ); // Will generate a 500 error
        }
        if( ! ldapUsr ){   // ldapUsr is the retrieved LDAP record
            return res.status( 401 ).send( info );  // unauthorized
        }

        if (coreUtils.methodCop([ldapUsr.department])) {
            var myDept = ldapUsr.department;
        } else {
            var myDept = '';
        };
		var deptSplit = myDept.split('-');
		var deptNum = deptSplit[0].replace( /\D/g, '');

        var query = User.findOne();
        var filter = ldapUsr.sAMAccountName;
        query.where( { username: filter });
        query.exec( function( err, user ){
            if( err ){
                console.log( 'User error ' + err ); // Don't know why we'd get an error here
                return next( err ); // Will generate a 500 error
            }

            if( ! user ){    // OCL hasn't seen this login before
                //console.log( 'Couldnt find user ' + ldapUsr.sAMAccountName );
                user = new User({
                    username:  ldapUsr.sAMAccountName,
                    provider:  'LDAP',
                    created:   Date.now(),
                    updated:   Date.now(),
					groups: ldapUsr.memberOf,
					department: deptNum
                });
            }
			if (user){
				//console.log( 'Found user ' + ldapUsr.sAMAccountName );
                //console.log('Now do a findOneAndUpdate where I update groups in the query but nothing else');
                User.findOneAndUpdate({_id:user._id},{groups:ldapUsr.memberOf},{upsert:false},function(err,doc){
					if (err){
						logger.log("ERROR", __function, err, req, res);
					}
				})
			}

            user.loginTime   = Date.now();
            //console.log('user.loginTime: ' + user.loginTime);
            user.email       = ldapUsr.userPrincipalName;
            //console.log('user.email: ' + user.email);
            user.displayName = ldapUsr.displayName;
            //console.log('user.displayName: ' + user.displayName);
            user.department = deptNum;
            //console.log('user.department: ' + user.department);

            //Divide up the username to firstname and lastname
            if( ldapUsr.sAMAccountName.indexOf( '.' ) !== -1 ){
                user.firstName = ldapUsr.sAMAccountName.substring( ldapUsr.sAMAccountName.indexOf( '.' ) + 1 );
                user.lastName  = ldapUsr.sAMAccountName.substring( 0, ldapUsr.sAMAccountName.indexOf( '.' ));
            }

			if (coreUtils.methodCop([ldapUsr.telephoneNumber])) {
				user.phone = ldapUsr.telephoneNumber;
			}

            //console.dir('this is the user just before save: ' + user);
            user.save();
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});

            // Notice that we're not returning at the exact bottom of the signin func, but rather here in the (asynchronous) mongo callback.
        //    res.send( JSON.stringify( user ));
        });               ////////////////////
	})( req, res, next );
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
		res.status(200).send({user: req.user.username})
	} else {
		res.status(400);
	}
};