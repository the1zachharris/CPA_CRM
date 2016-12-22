'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ProvinceModel = require('../models/provinces.server.model.js'),
    province = mongoose.model('province'),
    crypto = require('crypto');


/**
 * @api {post} /province/create
 * @apiName create
 * @apiGroup province
 *
 * @apiParam {Task} Task
 * @apiParam {Message} Message
 * @apiParam {Logic} Logic
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: province.id}
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

        var v = new province({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            Task: req.body.Task,
            Message: req.body.Message,
            Logic: req.body.Logic
        });

        v.save(function (err, province) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({success: true, id: province.id});
            }
        });
};

/**
 * @api {get} /province
 * @apiName list
 * @apiGroup province
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {province}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
        province.find().sort('country').exec(function (err, province) {
            if (!province.length) {
                res.status(200).send({province: province})
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(province);
                }
            }
        });
};

/**
 * @api {get} /provinces
 * @apiName list
 * @apiGroup province
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {provinces}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.getProvinces = function (req, res) {
    province.find({country: req.params.country}).sort('name').exec(function (err, provinces) {
        if (!province.length) {
            res.status(200).send({provinces: provinces})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(provinces);
            }
        }
    });
};

/**
 * @api {get} /province
 * @apiName detail
 * @apiGroup province
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {province}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
        province.find({type: req.params.type}).sort('-type').exec(function (err, province) {
            if (!province.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(province);
                }
            }
        });
};

/**
 * @api {post} /province
 * @apiName update
 * @apiGroup province
 *
 * @apiParam {id} id
 * @apiParam {updatedprovince} Updateprovince
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
        var query = {id: req.body.typeid};
        province.findOneAndUpdate(query, req.body.updatedprovince, {upsert: false}, function (err, doc) {
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
 * @api {delete} /province/:province
 * @apiName delete
 * @apiGroup province
 *
 * @apiParam {id} id
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
        province.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({results: doc});
            }

        })
};