'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    coreUtils = require('../../controllers/core.server.controller.js'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    //ldapgroupModel = require('../../models/ldapgroups.server.model.js'),
    logger = require('../../controllers/logger.server.controller.js');

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
    User.findOne({
        _id: req.params.userid
    }).exec(function(err, user) {
        if (err) {
            return next('There was an error: ' + err);
        }
        if (!user) {
            return next(new Error('Failed to load User ' + id));
        }
        req.profile = user;
        next();
    });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    if (process.env.NODE_ENV !== 'test'){
        if (!req.isAuthenticated()) {
            return res.status(401).send({
                message: 'User is not logged in'
            });
        }
    }
    //console.log(req.user.roles);
    next();
};

/**
 * User authorizations (role based) routing middleware
 */
exports.hasAuthorization = function(roles) {
    var _this = this;

    return function(req, res, next) {
        _this.requiresLogin(req, res, function() {
            if (_.intersection(req.user.roles, roles).length) {
                return next();
            } else {
                return res.status(403).send({
                    message: 'User is not authorized'
                });
            }
        });
    };
};


var checkAuth = exports.checkAuth = function (user, app, perm, res, usrMenu, menuitem, callback) {
    var isAuth = false;

    if (typeof app === 'string') {
        var appName = app;
    } else {
        var appName = app.name;
    }

    logger.log("TRACE", __function, 'Going to try and find a matching role for ' + user.username + ' with \'' + appName + '\':\'' + perm + '\'');

    var findRoleQuery = User.find({
        username : user.username,
        roles : {
            $elemMatch : {
                appName : appName,
                perms : {
                    $elemMatch : {
                        name : perm
                    }
                }
            }
        }
    });

    findRoleQuery.exec(function(err, auth){
        if (err){
            logger.log("ERROR", __function, 'There was an error trying to query Mongo.');
            return res.status(400).send({
                message: logger.log("ERROR", __function, err, null, res)
            });
        } else if (auth.length > 0) {
            logger.log("TRACE", __function, user.username + ' is authorized by their OCL permission alone.');
            isAuth = true;
            callback(isAuth,app,perm,usrMenu,menuitem);
        } else {
            logger.log("TRACE", __function, user.username + ' is not authorized for ' + appName + ':' + perm + ' by their OCL permission alone. We are going to check their LDAP groups.');
            // Get all groups that have the perm
            var findGroupRoleQuery = Ldapgroup.find({
                roles : {
                    $elemMatch : {
                        appName : appName,
                        perms : {
                            $elemMatch : {
                                name : perm
                            }
                        }
                    }
                }
            });

            findGroupRoleQuery.exec(function(err,roleGroups){
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    if (roleGroups.length > 0){
                        //We have a match - there is a group that has this perm
                        async.eachSeries(
                            roleGroups,
                            function (group,gCB) {
                                //console.log('role: ' + group.name);
                                var thisGroup = group.name;
                                var searchQuery = thisGroup;
                                if (typeof searchQuery != "undefined") {
                                    if (searchQuery.indexOf(".") !== -1 && exactsearch == false) {
                                        searchQuery = searchQuery.replace(/\./g, "\\.");
                                    }
                                }
                                //we check to see if the user has this group
                                var userHasGroup = User.find(
                                    {
                                        username : user.username,
                                        groups : {
                                            //does the user have this group
                                            $in : [new RegExp(searchQuery, 'i')]
                                        }
                                    }
                                );

                                userHasGroup.exec(function(err,usersGroupMatch){
                                    if (err) {
                                        return res.status(400).send({
                                            message: logger.log("ERROR", __function, err, req, res)
                                        });
                                    } else {
                                        //console.log(user.username);
                                        //console.log('usersGroupMatch');
                                        //console.dir(usersGroupMatch);
                                        if (usersGroupMatch.length > 0){

                                            //user is a match for the group that has the perm
                                            isAuth = true;
                                            //console.log('app: ' + app);
                                            //console.log('myperm: ' + myperm);
                                            //console.log('usermatchgroup: ' + thisGroup + ': ' + isAuth);

                                            gCB('Loop done.');

                                        } else {
                                            var request = {};
                                            request.user = user;
                                            request.body = {};
                                            logger.log("DEBUG", __function, 'else group search: ' + searchQuery, request);
                                            //console.log('else group search: ' + searchQuery);
                                            //convert searchQuery to just numbers
                                            var deptNum = searchQuery.replace( /\D/g, '');
                                            logger.log("DEBUG", __function, 'deptNum: ' + deptNum, request);
                                            //console.log('deptNum: ' + deptNum);
                                            if (deptNum !== '') {
                                                //test for dept
                                                var userHasDept = User.find(
                                                    {
                                                        username : user.username,
                                                        department : searchQuery
                                                    }
                                                );

                                                userHasDept.exec(function(err,userDeptMatch){

                                                    if (err){
                                                        var request = {};
                                                        request.user = user;
                                                        request.body = {};
                                                        logger.log("ERROR", __function, err, request);
                                                        console.log(err);
                                                        gCB();
                                                    } else {
                                                        if (userDeptMatch.length = 1) {
                                                            var request = {};
                                                            request.user = user;
                                                            request.body = {};
                                                            logger.log("DEBUG", __function, 'deptNum query ran and found that user has match', request);
                                                            isAuth = true;
                                                            gCB('User Deptartment Match found. No more looping.');
                                                        } else {
                                                            gCB();
                                                        }
                                                    }
                                                });
                                            } else {
                                                var request = {};
                                                request.user = user;
                                                request.body = {};
                                                logger.log("DEBUG", __function, 'no deptNum query ran', request);
                                                gCB();
                                            }

                                        }
                                    }
                                });
                            },
                            function (err) {
                                if (err) {
                                    var request = {};
                                    request.user = user;
                                    request.body = {};
                                    logger.log("ERROR", __function, err, request);
                                    callback(isAuth,app,perm,usrMenu,menuitem);
                                } else {
                                    callback(isAuth,app,perm,usrMenu,menuitem);
                                }
                            }
                        );
                    } else {
                        logger.log("TRACE", __function, 'Couldn\'t find matching LDAP groups for ' + user.username);

                        //console.log('app: ' + app);
                        //console.log('myperm: ' + myperm);
                        //console.log('four: ' + isAuth);
                        isAuth = false;

                        callback(isAuth,app,perm,usrMenu,menuitem);

                    }
                }

            });


        }
        //console.log('app: ' + app);
        //console.log('myperm: ' + myperm);
        //console.log('return this: ' + isAuth);

    });

};


/**
 * User permission based authorizations routing middleware
 */
exports.isAuthorized = function(req, res, next) {

    var myapp,
        myperm;

    // console.log(req.params.myApp);
    if (Object.keys(req.params).length > 0) {
        // console.log('params: ' + req.params);
        myapp = decodeURIComponent(req.params.myApp);
        myperm = decodeURIComponent(req.params.myPerm);
    } else if (Object.keys(req.body).length > 0) {
        // console.log('body: ' + req.body);
        myapp = req.body.myApp;
        myperm = req.body.myPerm;
    } else if (Object.keys(req.query).length > 0) {
        // console.log('query: ' + req.query);
        myapp = decodeURIComponent(req.query.myApp);
        myperm = decodeURIComponent(req.query.myPerm);
    }

    logger.log("TRACE", __function, myapp + ':' + myperm);

    if (process.env.NODE_ENV !== 'test'){
        if (!req.isAuthenticated()) {
            res.status(401).send({
                message: 'User is not logged in'
            });
        } else {
            // (user, app, perm, res, usrMenu, menuitem, callback)
            checkAuth(req.user, myapp, myperm, res, null, null, function (auth,app,perm) {
                if (auth) {
                    // console.info(req.user.username + ' is authrorized for ' + app + ':' + perm);
                    return next();
                } else {
                    // console.error(req.user.username + ' is NOT authrorized for ' + app + ':' + perm);
                    res.status(403).send({
                        message: 'User is not authorized'
                    });
                }
            });

            //call checkAuth function
            /*
             if (checkAuth(req.user, myapp, myperm)){

             } else {

             }
             */
        }

    }

};


/*****************************************************************************
 * Checks authorization for client
 *****************************************************************************/

exports.isClientAuthorized = function(req, res) {

    var app = decodeURIComponent(req.query.app);
    var perm = decodeURIComponent(req.query.perm);
    var user = req.user;

    if (!req.isAuthenticated()) {
        res.status(401).send({
            message: 'User is not logged in'
        });
    } else {
        checkAuth(user, app, perm, res, null, null, function (auth) {
            if (auth) {
                res.status(200).send({
                    message : 'User is authorized'
                });
            } else {
                res.status(400).send({
                    message: 'User is not authorized'
                });
            }
        });

    }

};