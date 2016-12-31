'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    TasksModel = require('../models/tasks.server.model.js'),
    userDbConn = require('../../config/user.connection.db.config'),
    //task = mongoose.model('task'),
    taskSeeds = require('../seeds/tasks.js'),
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
//for user database
    userDbConn.userDBConnection(req.user.database, function (userdb) {
        var task = userdb.model('task');
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
                    message: err
                });
            } else {
                res.status(200).send({success: true, id: task.id});
            }
        });
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
    userDbConn.userDBConnection(req.user.database, function (userdb) {
        var task = userdb.model('task');
        task.find().sort('-type').exec(function (err, task) {
            if (!task.length) {
                res.status(200).send({tasks: task})
            } else {
                if (err) {
                    return res.status(400).send({
                        message: err
                    });
                } else {
                    res.jsonp(task);
                }
            }
        });
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
    userDbConn.userDBConnection(req.user.database, function (userdb) {
        var task = userdb.model('task');
        task.findOne({id: req.params.id}).exec(function (err, task) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.jsonp(task);
            }
        });
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
    userDbConn.userDBConnection(req.user.database, function (userdb) {
        var task = userdb.model('task');
        task.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.status(200).send({results: doc});
            }
        });
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
    userDbConn.userDBConnection(req.user.database, function (userdb) {
        var task = userdb.model('task');
        task.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: err
                });
            } else {
                res.status(200).send({results: doc});
            }

        })
    });
};

/**
 * @api {post} /task
 * @apiName seed
 * @apiGroup task
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
exports.seed = function (req, res) {
    var foo = taskSeeds.seed(400, 0, function (err, res) {
        if (err) {
            console.dir(err);
        } else {
            //fulfill(res);
            var myseeds = res;
            console.dir(myseeds);
            console.log('myseeds.length: ' + myseeds.length);

             userDbConn.userDBConnection(req.user.database, function (userdb) {
             for (var i = 0; i < myseeds.length; i++) {
                 var currentSeed = myseeds[i];
                 console.log(i + '. currentseed: ');
                 console.dir(currentSeed);
                 var query = {Name: currentSeed.Name};

                 var task = userdb.model('task');
                     task.findOneAndUpdate(query, currentSeed, {upsert: true}, function (err, doc) {
                         if (err) {
                            console.dir(err);
                         } else {
                            console.log(i + ' seed added/updated')
                         }
                     });

                 }
             });
        }
    });
    res.status(200).send({success: true});
};