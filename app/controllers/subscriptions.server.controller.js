'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    http = require('http'),
    request = require('superagent'),
    subscriptionModel = require('../models/subscriptions.server.model.js'),
    subscription = mongoose.model('subscription'),
    envLoaded = require('../../config/env/' + process.env.NODE_ENV);

//var utils = require('../utils.js');
//var constants = require('../constants.js');

/**
 * Create a subscription
 */
/**
 * @apiUse subscriptionVersion
 * @api {post} /subscriptions/:myApp/:myPerm Create subscription
 * @apiDescription Create an subscription within the TT framework 
 * @apiName Create
 * @apiGroup subscriptions
 * @apiParam {String} myApp  Mandatory Name of application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 * @apiPermission subscription Create
 * @apiSuccess {String} id id of the newly created subscription.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "message": "error of some kind"
 *     }
 * @apiUse subscriptionCreateExample
 */

exports.create = function(req, res) {
    // used to create ID
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();

    var v = new subscription({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        name: req.body.name,
        description: req.body.description,
        paymentSchedule: req.body.paymentSchedule,
        unit: req.body.unit,
        length: req.body.length,
        totalOccurrences: req.body.totalOccurrences,
        trialOccurrences: req.body.trialOccurrences,
        amount: req.body.amount,
        interval: req.body.interval,
        trialAmount: req.body.trialAmount
    });
    //console.dir(v);
    v.save(function(err,sub) {
        if (err) {
            return res.status(400).send({
                message : err
            });
        } else {
            //Audit.create(req.user,'Create subscription', req.body,'subscriptions', req.method ,res.body);
            res.status(200).send({success:true,id:sub.id});
        }
    });
};

/**
 * @apiUse subscriptionVersion
 * @api {get} /subscription/:subscriptionId Get subscription
 * @apiDescription Get the details for an subscription
 * @apiName Read
 * @apiGroup subscriptions
 * @apiParam {String} subscriptionId  Mandatory id for the subscription you want details on
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "app": "the full document/subscription"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */

exports.read = function(req, res) {
    var subscriptionId = req.params.subscriptionId;
    var query = subscription.findOne({id: subscriptionId});
    query.exec(function(err,sub){
        if (err){
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send(sub);
        }
    });
};


/**
 * @apiUse subscriptionVersion
 * @api {post} /subscriptions/update/:myApp/:myPerm Update subscription
 * @apiDescription Update an subscription within the TT framework with menus and security params
 * @apiName Update
 * @apiGroup subscriptions
 * @apiParam {String} myApp  Mandatory Name of application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 * @apiPermission subscription Update
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "results": "the full updated document/subscription"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 * @apiUse subscriptionUpdateExample
 */

exports.update = function(req, res) {
    var query = {_id: req.body.updatedApp.id};
    subscription.findOneAndUpdate(query,req.body.updatedApp,{upsert:false},function(err,doc){
        if (err){
            return res.status(400).send({
                message: err
            });
        } else{
            //Audit.create(req.user,'Edit subscription',req.body,req.url,req.method,doc);
            res.status(200).send({results: doc});
        }
    });

};

/**
 * @apiUse subscriptionVersion
 * @api {delete} /subscription/:subscriptionId/:myApp/:myPerm Delete subscription
 * @apiDescription Delete an subscription
 * @apiName Delete
 * @apiGroup subscriptions
 * @apiParam {String} subscriptionId  Mandatory id for the subscription you want to delete
 * @apiPermission subscription Delete
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "results": "Mongo response of remove request"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */

exports.delete = function(req, res) {
    var subscriptionId = req.params.subscriptionId;
    var query = {id: subscriptionId};
    subscription.remove(query,function(err,doc) {
        if (err){
            return res.status(400).send({
                message: err
            });
        } else{
            //Audit.create(req.user, 'Delete subscription', req.body, req.url, req.method, res);
            res.status(200).send({results: doc});
        }

    })
};

/**
 * @apiUse subscriptionVersion
 * @api {get} /subscriptions/:myApp/:myPerm Get all subscriptions
 * @apiDescription Get a complete list of all the subscriptions
 * @apiName List
 * @apiGroup subscriptions
 * @apiParam {String} myApp  Mandatory Name of application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       ["array of all subscriptions as json docs"]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */


exports.list = function(req, res) {
    subscription.find().sort('-created').exec(function(err, subscriptions) {
        if (!subscriptions.length){
//			exports.seedsubscriptions();
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(subscriptions);
            }
        }
    });
};

exports.newSub = function (req, res) {
    var myRequest = req.body;
    var current_date = (new Date());
    var random = Math.random().toString();
    var refId = crypto.createHash('sha1').update(current_date + random).digest('hex').substring(0,19);
    var mySubscription = myRequest.ARBCreateSubscriptionRequest.subscription;
    console.log('mySubscription');
    console.dir(mySubscription);
    myRequest.ARBCreateSubscriptionRequest = {merchantAuthentication:
        {
            name: envLoaded.AuthNet.endpoint.sandbox.apiLoginKey,
            transactionKey: envLoaded.AuthNet.endpoint.sandbox.transactionKey
        },
        refId: refId,
        subscription: mySubscription
    };
    console.log('myRequest');
    console.dir(myRequest);
    request.post(envLoaded.AuthNet.endpoint.sandbox.url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'json')
        .type('json')
        .send(myRequest)
        .end(function (response) {
            console.log('in response');
            //console.log(response);
            console.log(response.rawResponse);
            var stringReponse = JSON.stringify(response.rawResponse);
            console.log('stringResponse: ' + stringReponse);
            var parsedResponse = JSON.parse(stringReponse);
            console.dir(parsedResponse);
            //var resultCode = parsedResponse.messages.resultCode;
            //console.log(resultCode);
            if (response.statusCode == 200) {
                res.status(200).send(response.rawResponse);
            } else {
                res.status(400).send(response);
            }

        });
};

exports.authCard = function (req, res) {
    var myRequest = req.body;
    var current_date = (new Date());
    var random = Math.random().toString();
    var refId = crypto.createHash('sha1').update(current_date + random).digest('hex').substring(0,19);
    var myAuth = myRequest.createTransactionRequest.transactionRequest;
    console.log('myAuth');
    console.dir(myAuth);
    myRequest.createTransactionRequest = {merchantAuthentication:
        {
            name: envLoaded.AuthNet.endpoint.sandbox.apiLoginKey,
            transactionKey: envLoaded.AuthNet.endpoint.sandbox.transactionKey
        },
        refId: refId,
        transactionRequest: myAuth
    };
    console.log('myRequest');
    console.dir(myRequest);
    request.post(envLoaded.AuthNet.endpoint.sandbox.url)
        .set('Content-Type', 'application/json')
        .set('Accept', 'json')
        .type('json')
        .send(myRequest)
        .end(function (response) {
            console.log('in response');
            //console.log(response);
            console.log(response.rawResponse);
            var stringReponse = JSON.stringify(response.rawResponse);
            console.log('stringResponse: ' + stringReponse);
            var parsedResponse = JSON.parse(stringReponse);
            console.dir(parsedResponse);
            //var resultCode = parsedResponse.messages.resultCode;
            //console.log(resultCode);
            if (response.statusCode == 200) {
                res.status(200).send(response.rawResponse);
            } else {
                res.status(400).send(response);
            }

        });
};