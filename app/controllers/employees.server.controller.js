'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    EmployeeModel = require('../models/employees.server.model.js'),
    employee = mongoose.model('employee'),
    crypto = require('crypto');


/**
 * @api {post} /employee/create
 * @apiName create
 * @apiGroup employee
 *
 * @apiParam {FirstName} FirstName
 * @apiParam {LastName} LastName
 * @apiParam {Email} Email
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

        var v = new employee({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            FirstName: req.body.FirstName,
            LastName: req.body.LastName,
            displayName: req.body.FirstName + ' ' + req.body.LastName,
            Email: req.body.Email,
            DateCreated: current_date
        });

        v.save(function (err, employee) {
            if (err) {
                return res.status(400).send({
                    message:  err
                });
            } else {
                res.status(200).send({success: true, id: employee.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message:  err
        });
    }
};

/**
 * @api {get} /employee
 * @apiName list
 * @apiGroup employee
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
        employee.find().sort('-type').exec(function (err, employee) {
            if (!employee.length) {
                res.status(200).send({employee: employee})
            } else {
                if (err) {
                    return res.status(400).send({
                        message:  err
                    });
                } else {
                    res.jsonp(employee);
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
 * @api {get} /employee
 * @apiName detail
 * @apiGroup employee
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {employee}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.detail = function (req, res) {
    employee.findOne({id: req.params.id}).exec(function (err, employee) {
        if (err) {
            return res.status(400).send({
                message:  err
            });
        } else {
            res.jsonp(employee);
        }
    });
};

/**
 * @api {post} /employee
 * @apiName update
 * @apiGroup employee
 *
 * @apiParam {employeeid} employeeid
 * @apiParam {updatedemployee} Updateemployee
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
        employee.findOneAndUpdate(query, req.body, {upsert: false}, function (err, doc) {
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
 * @api {delete} /employee/:employee
 * @apiName delete
 * @apiGroup employee
 *
 * @apiParam {employeeid} employeeid
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
        employee.remove(query, function (err, doc) {
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