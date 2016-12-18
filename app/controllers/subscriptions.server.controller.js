'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    subscriptionModel = require('../models/subscriptions.server.model.js'),
    subscription = mongoose.model('subscription'),
    ApiContracts = require('authorizenet').APIContracts,
    ApiControllers = require('authorizenet').APIControllers,
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
    console.dir(v);
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


function createsubscription(callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(envLoaded.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(envLoaded.transactionKey);

    var interval = new ApiContracts.PaymentScheduleType.Interval();
    interval.setLength(1);
    interval.setUnit(ApiContracts.ARBsubscriptionUnitEnum.MONTHS);

    var paymentScheduleType = new ApiContracts.PaymentScheduleType();
    paymentScheduleType.setInterval(interval);
    paymentScheduleType.setStartDate(utils.getDate());
    paymentScheduleType.setTotalOccurrences(5);
    paymentScheduleType.setTrialOccurrences(0);

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setExpirationDate('2038-12');
    creditCard.setCardNumber('4111111111111111');

    var payment = new ApiContracts.PaymentType();
    payment.setCreditCard(creditCard);

    var orderType = new ApiContracts.OrderType();
    orderType.setInvoiceNumber(utils.getRandomString('Inv:'));
    orderType.setDescription(utils.getRandomString('Description'));

    var customer = new ApiContracts.CustomerType();
    customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
    customer.setId(utils.getRandomString('Id'));
    customer.setEmail(utils.getRandomInt()+'@test.anet.net');
    customer.setPhoneNumber('1232122122');
    customer.setFaxNumber('1232122122');
    customer.setTaxId('911011011');

    var nameAndAddressType = new ApiContracts.NameAndAddressType();
    nameAndAddressType.setFirstName(utils.getRandomString('FName'));
    nameAndAddressType.setLastName(utils.getRandomString('LName'));
    nameAndAddressType.setCompany(utils.getRandomString('Company'));
    nameAndAddressType.setAddress(utils.getRandomString('Address'));
    nameAndAddressType.setCity(utils.getRandomString('City'));
    nameAndAddressType.setState(utils.getRandomString('State'));
    nameAndAddressType.setZip('98004');
    nameAndAddressType.setCountry('USA');

    var arbsubscription = new ApiContracts.ARBsubscriptionType();
    arbsubscription.setName(utils.getRandomString('Name'));
    arbsubscription.setPaymentSchedule(paymentScheduleType);
    arbsubscription.setAmount(utils.getRandomAmount());
    arbsubscription.setTrialAmount(utils.getRandomAmount());
    arbsubscription.setPayment(payment);
    arbsubscription.setOrder(orderType);
    arbsubscription.setCustomer(customer);
    arbsubscription.setBillTo(nameAndAddressType);
    arbsubscription.setShipTo(nameAndAddressType);

    var createRequest = new ApiContracts.ARBCreatesubscriptionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setsubscription(arbsubscription);

    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new ApiControllers.ARBCreatesubscriptionController(createRequest.getJSON());

    ctrl.execute(function(){

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.ARBCreatesubscriptionResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        if(response != null){
            if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                console.log('subscription Id : ' + response.getsubscriptionId());
                console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
                console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
            }
            else{
                console.log('Result Code: ' + response.getMessages().getResultCode());
                console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
            }
        }
        else{
            console.log('Null Response.');
        }



        callback(response);
    });
}

if (require.main === module) {
    createsubscription(function(){
        console.log('createsubscription call complete.');
    });
}

module.exports.createsubscription = createsubscription;