'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ClientModel = require('../models/clients.server.model.js'),
    //TODO: Add DB specification to all model references to hit the correct DB
    client = mongoose.model('client'),
    crypto = require('crypto');


/**
 * @api {post} /client/create
 * @apiName create
 * @apiGroup client
 *
 * @apiParam {Name} Name
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

    var v = new client({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        Name: req.body.Name,
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

    v.save(function (err, client) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: client.id});
        }
    });
};

/**
 * @api {get} /client
 * @apiName list
 * @apiGroup client
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {client}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    client.find().sort('-type').exec(function (err, clients) {
        if (!client.length) {
            res.status(200).send({clients: clients})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(clients);
            }
        }
    });
};

/**
 * @api {get} /client
 * @apiName detail
 * @apiGroup client
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {client}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    client.findOne({id: req.params.id}).sort('-type').exec(function (err, client) {
        if (!client) {
            res.status(200).send()
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(client);
            }
        }
    });
};

/**
 * @api {post} /client
 * @apiName update
 * @apiGroup client
 *
 * @apiParam {clientid} clientid
 * @apiParam {updatedclient} Updateclient
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
    client.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {delete} /client/:client
 * @apiName delete
 * @apiGroup client
 *
 * @apiParam {clientid} clientid
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
    var query = {id: req.params.id};
    client.remove(query, function (err, doc) {
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
 * @api {search} /client/:client
 * @apiName search
 * @apiGroup client
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
    client.find(query, function (err, doc) {
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
 * @api {post} /client
 * @apiName assign task
 * @apiGroup client
 *
 * @apiParam {clientid} clientid
 * @apiParam {task} task
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
exports.assigntask = function (req, res) {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var query = {id: req.body.client.id};
    var newTask = req.body.task;
    newTask.taskClientId = crypto.createHash('sha1').update(current_date + random).digest('hex');
    client.findOneAndUpdate(query, { $push: { Tasks: newTask }}, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.status(200).send({taskClientId: newTask.taskClientId});
        }
    });
};

/**
 * @api {post} /client
 * @apiName remove task
 * @apiGroup client
 *
 * @apiParam {clientid} clientid
 * @apiParam {task} task
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
exports.removetask = function (req, res) {
    var query = {id: req.body.client.id};
    client.findOneAndUpdate(query, { $pull: { Tasks: {taskClientId: req.body.taskClientid}}}, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }
    });
};