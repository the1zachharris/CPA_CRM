'use strict';

// This controller is for any updates to the user's profile including but not limited to roles and permissions

/**
 * Module dependencies.
 */
var _ = require('lodash'),  // lodash is crap, why are we using it ??
    async = require('async'),
    coreutils = require('../core.server.controller.js'),
    logger = require('../../controllers/logger.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	//Audit = require('../audits.server.controller'),
	User = mongoose.model('User');


exports.updtUser = function( req, res ){
    var query = { username: req.body.updatedUser.username };
    User.findOneAndUpdate( query,req.body.updatedUser,{upsert:false},function( err,doc ){
        if( err ){
            return res.status(400).send({
                message: logger.log("ERROR", __function, err, req, res)
            });
        }else{
            //Audit.create(req.user,'Update specified user',req.body,req.url,req.method,doc);
            res.status(200).send({results: doc});
            //console.log( 'users.profile.server.cont updated ' + req.body.updatedUser.username );
        }
    });
};

/**
 * Update user details
 */
exports.update = function(req, res) {
    var user = new User (req.body);
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
    user.database = user.email.replace('.', '_');
    user.database = user.database.replace('@', '_at_');
    user.updated = Date.now();
    var query = { username: user.username };
    User.findOneAndUpdate( query,user,{upsert:true},function( err,user ){
        if (err) {
            console.log('error with findOneAndUpdate');
            console.dir(err);
            return res.status(400).send({
                message: err
            });
        } else {
            console.log('no error with findOneAndUpdate... move to login');
            req.login(user, function(err) {
                if (err) {
                    console.log('error with login');
                    res.status(400).send(err);
                } else {
                    console.log('all good send the user as the response');
                    // Remove sensitive data before login
                    user.password = undefined;
                    user.salt = undefined;
                    res.json(user);
                }
            });
        }
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};




/**
 * @api {get} /users List Fields
 * @apiName List of Users
 * @apiGroup Administrative Tools
 * @apiUse NotesFieldsVersion
 * @apiDescription Returns a list of users and their properties that are registered in TT.
 * @apiParam {String} query Query
 * @apiParam {Number} limit Limit
 * @apiParam {String} sort Sort
 * @apiParam {String} skip Skip
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {
 *      results: doc
 *  }
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 *     "message": "error of some kind"
 *  }
 */
exports.list = function(req, res) {
    try {
        if (
            coreutils.methodCop([
                req.query,
                req.query.limit,
                req.query.skip,
                req.query.sort
            ])
        ) {
            // init query string
            var usersQuery,
                results = {},
                searchCriteria;

            // if query isn't blank, use it. otherwise, create a blank query string
            if (coreutils.methodCop([req.query.query])) {
                usersQuery = decodeURIComponent(req.query.query);
            } else {
                usersQuery = '';
            }

            searchCriteria = {
                $or : [
                    {displayName: new RegExp(usersQuery, 'i')},
                    {username: new RegExp(usersQuery, 'i')},
                    {roles: new RegExp(usersQuery, 'i')},
                    {email: new RegExp(usersQuery, 'i')},
                    {phone: new RegExp(usersQuery, 'i')}
                ]
            };

            // if there's a filter that was submitted
            if (req.query.appFilter != '' && req.query.roleFilter != '') {
                searchCriteria['$and'] = [
                    { 'roles.name' : decodeURIComponent(req.query.roleFilter)},
                    { 'roles.appName' : decodeURIComponent(req.query.appFilter)}
                ]
            }

            async.parallel(
                [
                    // get roles aggregation
                    function (callback) {
                        User
                            .aggregate([
                                // Stage 1
                                {$match : searchCriteria},
                                // Stage 2
                                {
                                    $project: {
                                        _id : 0,
                                        displayName : 1,
                                        username : 1,
                                        roles : 1
                                    }
                                },
                                // Stage 3
                                {
                                    $unwind: '$roles'
                                },
                                // Stage 4
                                {
                                    $group: {
                                        _id : {
                                            appname : '$roles.appName',
                                            name : '$roles.name',
                                            id : '$roles.id'
                                        },
                                        count : {
                                            $sum : 1
                                        }
                                    }
                                },
                                // Stage 5
                                {
                                    $sort: {
                                        '_id.appname' : 1
                                    }
                                }
                            ])
                            .exec(
                                function (err, result) {
                                    if (err) {
                                        return res.status(400).send({
                                            message: logger.log("ERROR", __function, err, req, res)
                                        });
                                    } else {
                                        // console.log(result.length);
                                        results.aggs = {};
                                        results.aggs.count = result.length;
                                        results.aggs.results = result;
                                        // console.dir(returnResult);
                                        // res.status(200).jsonp(returnResult);
                                        callback(null, result);
                                    }
                                }
                            );
                    },
                    /* TODO : This one is going to take a little more parsing to be effective in the UI
                    // get groups aggregation
                    function (callback) {
                        User
                            .aggregate([
                                {$match: searchCriteria},
                                {$group: {_id: "$groups", count: { $sum: 1 }}},
                                {$sort: {displayName: 1}}
                            ])
                            .exec(
                                function (err, result) {
                                    if (err) {
                                        return res.status(400).send({
                                            message: logger.log("ERROR", __function, err, req, res)
                                        });
                                    } else {
                                        // console.log(result.length);
                                        results.aggs = {};
                                        results.aggs.count = result.length;
                                        results.aggs.results = result;
                                        // console.dir(returnResult);
                                        // res.status(200).jsonp(returnResult);
                                        callback(null, result);
                                    }
                                }
                            );
                    },
                    */
                    // get users count
                    function (callback) {
                        User
                            .count(searchCriteria)
                            .exec(function (err, count) {
                                if (err) {
                                    callback(err);
                                } else {
                                    results.count = count;
                                    callback(null, count);
                                }
                            });
                    },
                    // get users list
                    function (callback) {
                        User
                            .find(searchCriteria)
                            .sort(decodeURIComponent(req.query.sort))
                            .limit(decodeURIComponent(req.query.limit))
                            .skip(decodeURIComponent(req.query.skip))
                            .exec(function (err, users) {
                                if (err) {
                                    callback(err);
                                } else {
                                    results.users = users;
                                    callback(null, users);
                                }
                            });
                    }
                ],
                function (error, result) {
                    if (error) {
                        return res.status(400).send({
                            message: logger.log("ERROR", __function, err, req, res)
                        });
                    } else {
                        res.status(200).send(results);
                    }
                }
            );



        } else {
            logger.log("ERROR", __function, 'There was an error with the params when trying to get a list of users.', req, res);
            return res.status(400).send({message:'There was an error with the params when trying to get a list of users.'});
        }
    }
    catch (err) {
        logger.log("ERROR", __function, err, req, res);
        return res.status(400).send({message:err.message});
    }
};






exports.profile = function(req, res) {
    var query = { username: decodeURIComponent(req.username) };
    User.findOne(query).exec(function( err, profile ){
        if( err ){
            return res.status(400).send({
                message: logger.log("ERROR", __function, err, req, res)
            });
        }else{
            res.status(200).send( profile );
        }
    });
};