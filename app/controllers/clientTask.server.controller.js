'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ClientModel = require('../models/clientTaskTask.server.model.js'),
    clientTaskTask = mongoose.model('clientTaskTask'),
    crypto = require('crypto');


/**
 * @api {post} /clientTaskTask/create
 * @apiName create
 * @apiGroup clientTaskTask
 *
 * @apiParam {clientid} clientid
 * @apiParam {Address1} Address1
 * @apiParam {Address2} Address2
 * @apiParam {City} City
 * @apiParam {StateProvince} StateProvince
 * @apiParam {PostalCode} PostalCode
 * @apiParam {Country} Country
 * @apiParam {Phone} Phone
 * @apiParam {Email} Email
 * @apiParam {Contacts} Contacts
 * @apiParam {ResponsibleEmployee} ResponsibleEmployee
 * @apiParam {Type} Type
 * @apiParam {DateCreated} DateCreated
 * @apiParam {DateUpdated} DateUpdated
 * @apiParam {Tasks} Tasks
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: frequency.id}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.create = function (req, res) {
    // used to create ID
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();

    var v = new clientTask({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        clientid: req.body.clientid,
        Address1: req.body.Address1,
        Address2: req.body.Address2,
        City: req.body.City,
        StateProvince: req.body.StateProvince,
        PostalCode: req.body.PostalCode,
        Country: req.body.Country,
        Phone: req.body.Phone,
        Email: req.body.Email,
        Contacts: req.body.Contacts,
        ResponsibleEmployee: req.body.ResponsibleEmployee,
        Type: req.body.Type,
        DateCreated: current_date,
        DateUpdated: req.body.DateUpdated,
        Tasks: req.body.Tasks

    });

    v.save(function (err, clientTask) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: clientTask.id});
        }
    });
};

/**
 * @api {get} /clientTask
 * @apiName list
 * @apiGroup clientTask
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {clientTask}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    clientTask.find().sort('-type').exec(function (err, clientTasks) {
        if (!clientTask.length) {
            res.status(200).send({clientTasks: clientTasks})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(clientTasks);
            }
        }
    });
};

/**
 * @api {get} /clientTask
 * @apiName detail
 * @apiGroup clientTask
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {clientTask}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    clientTask.find({id: req.params.id}).sort('-type').exec(function (err, clientTask) {
        if (!clientTask) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(clientTask);
            }
        }
    });
};

/**
 * @api {post} /clientTask
 * @apiName update
 * @apiGroup clientTask
 *
 * @apiParam {clientTaskid} clientTaskid
 * @apiParam {updatedclientTask} UpdateclientTask
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.update = function (req, res) {
    var query = {id: req.body.id};
    clientTask.findOneAndUpdate(query, req.body.updatedclientTask, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }
    });
};

/**
 * @api {delete} /clientTask/:clientTask
 * @apiName delete
 * @apiGroup clientTask
 *
 * @apiParam {clientTaskid} clientTaskid
 *
 * @apiSuccessExample Success-Response:
 * 200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.delete = function (req, res) {
    var id = req.params.id;
    var query = {id: id};
    clientTask.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};

/**
 * @api {search} /clientTask/:clientTask
 * @apiName search
 * @apiGroup clientTask
 *
 * @apiParam {keyword} keyword
 *
 * @apiSuccessExample Success-Response:
 * 200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
*  "message": "error of some kind"
*     }
 */
exports.search = function (req, res) {
    var keyword = req.body.keyword;
    console.log(keyword);
    var query = {$text: {$search: keyword}};
    clientTask.find(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};
