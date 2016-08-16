'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ClienttypeModel = require('../models/clienttypes.server.model.js'),
    Clienttype = mongoose.model('Clienttype'),
    crypto = require('crypto');


/**
 * @api {post} /clientType/create
 * @apiName create
 * @apiGroup clientType
 *
 * @apiParam {type} type
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: clientType.id}
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

        var v = new Clienttype({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            type: req.body.type
        });

        v.save(function (err, clienttype) {
            if (err) {
                return res.status(400).send({
                    message: "ERROR" + err
                });
            } else {
                res.status(200).send({success: true, id: clienttype.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: "ERROR" + err
        });
    }
};

/**
 * @api {get} /clientType
 * @apiName list
 * @apiGroup clientType
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {clientTypes}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    try {
        Clienttype.find().sort('-type').exec(function (err, clientTypes) {
            if (!clientTypes.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message: "ERROR" + err
                    });
                } else {
                    res.jsonp(clientTypes);
                }
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: "ERROR" + err
        });
    }
};

/**
 * @api {get} /clientType
 * @apiName detail
 * @apiGroup clientType
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {clientType}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    try {
        Clienttype.find({type: req.body.type}).sort('-type').exec(function (err, clientType) {
            if (!clientType.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message: "ERROR" + err
                    });
                } else {
                    res.jsonp(clientType);
                }
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: "ERROR" + err
        });
    }
};

/**
 * @api {post} /clientType
 * @apiName update
 * @apiGroup clientType
 *
 * @apiParam {typeid} typeid
 * @apiParam {updatedtype} Updatetype
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
        Clienttype.findOneAndUpdate(query, req.body.updatedtype, {upsert: false}, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: "ERROR" + err
                });
            } else {
                res.status(200).send({results: doc});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: "ERROR" + err
        });
    }
};

/**
 * @api {delete} /clientType/:clientType
 * @apiName delete
 * @apiGroup clientType
 *
 * @apiParam {typeid} typeid
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
        var typeid = req.params.typeid;
        var query = {id: typeid};
        Clienttype.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: "ERROR" + err
                });
            } else {
                res.status(200).send({results: doc});
            }

        })
    } catch (err) {
        return res.status(400).send({
            message: "ERROR" + err
        });
    }
};
