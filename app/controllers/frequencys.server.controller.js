'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    FrequencyModel = require('../models/frequencys.server.model.js'),
    Frequency = mongoose.model('Frequency'),
    crypto = require('crypto');


/**
 * @api {post} /frequency/create
 * @apiName create
 * @apiGroup frequency
 *
 * @apiParam {frequency} frequency
 * @apiParam {pattern} pattern
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

        var v = new Frequency({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            frequency: req.body.frequency,
            pattern: req.body.pattern
        });

        v.save(function (err, frequency) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({success: true, id: frequency.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
};

/**
 * @api {get} /frequency
 * @apiName list
 * @apiGroup frequency
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {frequency}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    try {
        Frequency.find().sort('-type').exec(function (err, frequency) {
            if (!frequency.length) {
                res.status(200).send({frequency: frequency})
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(frequency);
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
 * @api {get} /frequency
 * @apiName detail
 * @apiGroup frequency
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {frequency}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    try {
        Frequency.find({type: req.params.type}).sort('-type').exec(function (err, frequency) {
            if (!frequency.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(frequency);
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
 * @api {post} /frequency
 * @apiName update
 * @apiGroup frequency
 *
 * @apiParam {frequencyid} frequencyid
 * @apiParam {updatedfrequency} Updatefrequency
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
        Frequency.findOneAndUpdate(query, req.body.updatedfrequency, {upsert: false}, function (err, doc) {
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
 * @api {delete} /frequency/:frequency
 * @apiName delete
 * @apiGroup frequency
 *
 * @apiParam {frequencyid} frequencyid
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
        var frequencyid = req.params.frequencyid;
        var query = {id: frequencyid};
        Frequency.remove(query, function (err, doc) {
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