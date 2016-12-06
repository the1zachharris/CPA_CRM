'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    TasksModel = require('../models/tasks.server.model.js'),
    task = mongoose.model('task'),
    crypto = require('crypto');


/**
 * @api {post} /task/create
 * @apiName create
 * @apiGroup task
 *
 * @apiParam {Name} Name
 * @apiParam {Number} Number
 * @apiParam {Frequency} Frequency
 * @apiParam {DueDate} DueDate
 * @apiParam {ExtendedDueDate} ExtendedDueDate
 * @apiParam {SecondExtendedDueDate} SecondExtendedDueDate
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

    var v = new task({
        id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
        Name: req.body.Name,
        Frequency: req.body.Frequency,
        DueDate: req.body.DueDate,
        ExtendedDueDate: req.body.ExtendedDueDate,
        SecondExtendedDueDate: req.body.SecondExtendedDueDate
    });

    v.save(function (err, task) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({success: true, id: task.id});
        }
    });
};

/**
 * @api {get} /task
 * @apiName list
 * @apiGroup task
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {task}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    task.find().sort('-type').exec(function (err, task) {
        if (!task.length) {
            res.status(200).send({tasks: task})
        } else {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(task);
            }
        }
    });
};

/**
 * @api {get} /task
 * @apiName detail
 * @apiGroup task
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {task}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    task.findOne({id: req.params.id}).exec(function (err, task) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            res.jsonp(task);
        }
    });
};

/**
 * @api {post} /task
 * @apiName update
 * @apiGroup task
 *
 * @apiParam {id} id
 * @apiParam {updatedtask} Updatetask
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
    task.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
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
 * @api {delete} /task/:task
 * @apiName delete
 * @apiGroup task
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
    task.remove(query, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
};