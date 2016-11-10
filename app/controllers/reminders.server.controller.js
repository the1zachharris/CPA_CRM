'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ReminderModel = require('../models/reminders.server.model.js'),
    reminder = mongoose.model('reminder'),
    crypto = require('crypto');


/**
 * @api {post} /reminder/create
 * @apiName create
 * @apiGroup reminder
 *
 * @apiParam {Task} Task
 * @apiParam {Message} Message
 * @apiParam {Logic} Logic
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: reminder.id}
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

        var v = new reminder({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            Task: req.body.Task,
            Message: req.body.Message,
            Logic: req.body.Logic
        });

        v.save(function (err, reminder) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({success: true, id: reminder.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
};

/**
 * @api {get} /reminder
 * @apiName list
 * @apiGroup reminder
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {reminder}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    try {
        reminder.find().sort('-type').exec(function (err, reminder) {
            if (!reminder.length) {
                res.status(200).send({reminder: reminder})
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(reminder);
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
 * @api {get} /reminder
 * @apiName detail
 * @apiGroup reminder
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {reminder}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    try {
        reminder.find({type: req.params.type}).sort('-type').exec(function (err, reminder) {
            if (!reminder.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(reminder);
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
 * @api {post} /reminder
 * @apiName update
 * @apiGroup reminder
 *
 * @apiParam {id} id
 * @apiParam {updatedreminder} Updatereminder
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
        reminder.findOneAndUpdate(query, req.body.updatedreminder, {upsert: false}, function (err, doc) {
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
 * @api {delete} /reminder/:reminder
 * @apiName delete
 * @apiGroup reminder
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
    try {
        var id = req.params.id;
        var query = {id: id};
        reminder.remove(query, function (err, doc) {
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