'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ClientModel = require('../models/clientTask.server.model.js'),
    clientTask = mongoose.model('clientTask'),
    crypto = require('crypto');


/**
 * @api {post} /clientTaskTask/create
 * @apiName create
 * @apiGroup clientTaskTask
 *
 * @apiParam {clientid} clientid
 * @apiParam {clientName} clientName
 * @apiParam {taskid} taskid
 * @apiParam {taskName} taskName
 * @apiParam {taskDueDate} taskDueDate
 * @apiParam {taskExtendedDueDate} taskExtendedDueDate
 * @apiParam {taskStatus} taskStatus
 * @apiParam {taskCompletedDate} taskCompletedDate
 * @apiParam {taskCreatedDate} taskCreatedDate
 * @apiParam {taskExtendedDate} taskExtendedDate
 * @apiParam {taskReceivedDate} taskReceivedDate
 * @apiParam {taskEmployeeName} taskEmployeeName
 * @apiParam {taskEmployeeid} taskEmployeeid
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
        clientName: req.body.clientName,
        taskid: req.body.taskid,
        taskName: req.body.taskName,
        taskDueDate: req.body.taskDueDate,
        taskExtendedDueDate: req.body.taskExtendedDueDate,
        taskStatus: req.body.taskStatus,
        taskCompletedDate: req.body.taskCompletedDate,
        taskCreatedDate: current_date,
        taskExtendedDate: req.body.taskExtendedDate,
        taskReceivedDate: req.body.taskReceivedDate,
        taskEmployeeName: req.body.taskEmployeeName,
        taskEmployeeid: req.body.taskEmployeeid,
        DateCreated: current_date,
        DateUpdated: req.body.DateUpdated,
        taskFrequency: req.body.taskFrequency
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
    clientTask.findOne({id: req.params.id}).exec(function (err, clientTask) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.jsonp(clientTask);
            }
    });
};

/**
 * @api {search} /client/:client
 * @apiName search
 * @apiGroup client
 *
 * @apiParam {taskid} taskid
 *
 * @apiSuccessExample Success-Response:
 * 200 OK
 *  {results: doc}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
 *  "message": "error of some kind"
 *  }
 */
exports.search = function (req, res) {

    var searchQuery = req.body.query,
        limit = req.body.limit,
        skip = req.body.skip,
        sort = req.body.sort,
        limitSearch = 0,
        and = req.body.and,
        or = req.body.or,
        filter = req.body.filter;
    /* a sample query that we know works in mongo
    {$and: [
        {taskid: '10b0972fcafa7d4a0189a8cb3919786523d8d3e2'},
        {clientid: '1b70c4906261f9097bd7d2e497d443a709efc618'},
        {taskStatus: {$not: {$eq: 'Complete'}}}
    ]}
    +++++ sample POSTMAN ++++++++
     {"query":"searchText",
     "limit":"25",
     "limitsearch":"0",
     "exactsearch":false,
     "skip":0,
     "and": [
     {"taskid": "foo99"},
     {"clientid": "freebo007"},
     {"taskStatus":
     {"$not": {"$eq": "Complete"}}}
     ],
     "sort":{"taskName":1}
     }
    */


    var itemDeepSearch = clientTask
        .find({
            $and : and
        })
        .limit(limit)
        .skip(skip)
        .sort(sort);

    itemDeepSearch.exec(function (err, doc) {
        if (err) {
            console.dir(err);
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send({results: doc});
        }

    })
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
    console.dir(req.body);
    var query = {id: req.body.id};
    clientTask.findOneAndUpdate(query, req.body, {upsert: true}, function (err, doc) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.status(200).send(doc);
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