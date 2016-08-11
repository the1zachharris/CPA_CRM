'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    clientType = mongoose.model('clientType'),
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

        var v = new clientType({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            type: req.body.type
        });

        v.save(function (err, clientType) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                res.status(200).send({success: true, id: clientType.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
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
        clientTypes.find().sort('-name').exec(function (err, clientTypes) {
            if (!clientTypes.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    res.jsonp(clientTypes);
                }
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
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
        clientType.find().sort('-name').exec(function (err, clientType) {
            if (!clientType.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    res.jsonp(clientType);
                }
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

exports.delete = function (req, res) {
    try {
        var typeid = req.params.typeid;
        var query = {id: typeid};
        clientType.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                res.status(200).send({results: doc});
            }

        })
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};