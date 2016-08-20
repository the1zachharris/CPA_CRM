'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ClientModel = require('../models/clients.server.model.js'),
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
    try {
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
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
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
    try {
        client.find().sort('-type').exec(function (err, client) {
            if (!client.length) {
                res.status(200).send({employee: client})
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
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
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
    try {
        client.find({type: req.params.type}).sort('-type').exec(function (err, client) {
            if (!client.length) {
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
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
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
    try {
        var query = {id: req.body.typeid};
        client.findOneAndUpdate(query, req.body.updatedclient, {upsert: false}, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({results: doc});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
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
    try {
        var clientid = req.params.clientid;
        var query = {id: clientid};
        client.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({results: doc});
            }

        })
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
};