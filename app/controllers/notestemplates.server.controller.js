'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    logger = require('./logger.server.controller'),
    coreUtils = require('./core.server.controller.js'),
    notetemplateModel = require('../models/notestemplates.server.model.js'),
    noteGroupModel = require('../models/notegroups.server.model.js'),
    crypto = require('crypto'),
    Notestemplate = mongoose.model('Notestemplate'),
    NoteGroups = mongoose.model('NoteGroups'),
    Audit = require('./audits.server.controller'),
    AuditModel = mongoose.model('Audit'),
    glProductsLookupModel = require("../models/glproductslookup.server.model.js"),
    glProductsLookup = mongoose.model('GlProductsLookup'),
    salt = 'OpsConsoleLite',
    async = require('async'),
    _ = require('lodash'),
    Notesfield = mongoose.model('Notesfields'),
    kmController = require('./km.server.controller'),
    serviceOrderController = require('./notestemplate.serviceorder.server.controller'),
    ticketsController = require('./tickets.server.controller');


/**
 * @api {post} /notestemplate/create
 * @apiName create
 * @apiGroup notestemplates
 *
 * @apiParam {name} Name
 * @apiParam {tabs} Tabs
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {success: true, id: template.id}
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

        var v = new Notestemplate({
            id: crypto.createHash('sha1').update(current_date + random).digest('hex'),
            name: req.body.name,
            type: req.body.type,
            tabs: req.body.tabs,
            noteGroup: req.body.noteGroup
        });

        v.save(function (err, template) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                Audit.create(req.user, 'Create Note Template', req.body, 'Notestemplates', req.method, res.body);
                res.status(200).send({success: true, id: template.id});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

/**
 * @api {post} /notestemplate
 * @apiName update
 * @apiGroup notestemplates
 *
 * @apiParam {templateid} Templateid
 * @apiParam {updatedtemplate} Updatetemplate
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
        var query = {id: req.body.templateid};
        Notestemplate.findOneAndUpdate(query, req.body.updatedtemplate, {upsert: false}, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                Audit.create(req.user, 'Edit Note template', req.body, req.url, req.method, doc);
                res.status(200).send({results: doc});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

/**
 * @api {delete} /notestemplate/:templateid
 * @apiName delete
 * @apiGroup notestemplates
 *
 * @apiParam {templateid} Templateid
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
        var templateid = req.params.templateid;
        var query = {id: templateid};
        Notestemplate.remove(query, function (err, doc) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                Audit.create(req.user, 'Delete Note field', req.body, req.url, req.method, res);
                res.status(200).send({results: doc});
            }

        })
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};


/**
 * @api {get} /notestemplate/:templateid
 * @apiName read
 * @apiGroup notestemplates
 *
 * @apiParam {templateId} TemplateId
 *
 * @apiSuccessExample Success-Response:
 *200 OK
 * {template: template}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.read = function (req, res) {
    try {
        var templateid = req.params.templateid;
        var query = Notestemplate.findOne({id: templateid});
        query.exec(function (err, template) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                res.status(200).send({template: template});
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

/**
 * @api {get} /notestemplates
 * @apiName list
 * @apiGroup notestemplates
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 * {templates}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }
 */
exports.list = function (req, res) {
    try {
        Notestemplate.find().sort('-name').exec(function (err, templates) {
            if (!templates.length) {
                res.status(200).send()
            } else {
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    res.jsonp(templates);
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
 * @api {get} /notestemplates/names/:notegroup
 * @apiName listTemplateIdsAndNames
 * @apiGroup notestemplates
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {templates}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }

 */
exports.listTemplateIdsAndNames = function (req, res) {
    try {
        Notestemplate.find({"noteGroup" : req.params.notegroup}, 'id name').sort('name').exec(function (err, templates) {
            if (!templates.length) {
                res.status(200).send("no template list found")
            } else {
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    res.jsonp(templates);
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
 * @api {get} /notestemplates/notegroups
 * @apiName listTemplateIdsAndNames
 * @apiGroup notestemplates
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {templates}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 *  {
* "message": "error of some kind"
*     }

 */
exports.listTemplateNoteGroups = function (req, res) {
    try {
        NoteGroups.find({}).exec(function (err, noteGroups) {
            if (err) {
                return res.status(400).send({
                    message: logger.log("ERROR", __function, err, req, res)
                });
            } else {
                res.jsonp(noteGroups);
            }
        });
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

/**
 * @api {get} /notestemplate/complete/:templateId
 * @apiName readWithFieldDetails
 * @apiGroup notestemplates
 *
 * @apiParam {templateId} TemplateId
 *
 * @apiSuccessExample Success-Response:
 *  200 OK
 *  {template: template}
 *
 * @apiErrorExample Error-Response:
 *  400 Bad Request
 * {
* "message": "error of some kind"
*     }
 */
//TODO:  NEED to call groups based on ORDER, then call fields by ORDER
exports.readWithFieldDetails = function (req, res) {
    try {
        if (req !== null && req.params !== null && typeof req.params !== 'undefined' &&
            req.params.templateId !== null && req.params.templageId != 'undefined') {
            var templateId = req.params.templateId;
            var query = Notestemplate.findOne({id: templateId});
            query.exec(function (err, response) {
                if (err) {
                    return res.status(400).send({
                        message: logger.log("ERROR", __function, err, req, res)
                    });
                } else {
                    var template = JSON.parse(JSON.stringify(response));

                    //ensure tabs and groups are in the correct order
                    template.tabs = _.sortBy(template.tabs, 'order');
                    template.tabs.groups = _.sortBy(template.tabs.groups, 'order');

                    // use async eachSeries to iterate through each tab to get associated groups
                    async.eachSeries(template.tabs, function (tab, tabCallBack) {
                        // use async eachSeries to iterate through each group and get associated fields
                        async.eachSeries(tab.groups, function (group, groupCallBack) {
                            // use async eachSeries to iterate through each field and preserve order
                            var fieldIndex = 0;
                            async.eachSeries(group.fields, function (field, fieldCallBack) {
                                if (field !== null && typeof field !== 'undefined' &&
                                    field.id !== null && typeof field.id !== 'undefined') {
                                    Notesfield.find({id: field.id}).exec(function (err, myField) {
                                        if (err) {
                                            logger.log("ERROR", __function, err, req);
                                            fieldCallBack(err);
                                        } else {
                                            if (myField !== null && field !== null &&
                                                typeof field !== 'undefined' &&
                                                typeof field.order !== 'undefined') {
                                                // get order which is from original template object
                                                var order = field.order;
                                                var requiredField = field.requiredField;
                                                // add order to new field object
                                                // skip invalid fields that are in the template
                                                if (!_.isEmpty(myField) && myField[0] !== null) {
                                                    var myNewField = JSON.parse(JSON.stringify(myField[0]));
                                                    myNewField.order = order;
                                                    myNewField.requiredField = requiredField;
                                                    // save field data to field array.  NOTE:  had to use index to get fields
                                                    // array to actually take update vs using field object from async iteration
                                                    _.extend(group.fields[fieldIndex], myNewField);
                                                } else {
                                                    // remove invalid entry from Template and log issue
                                                    delete group.fields[fieldIndex];
                                                    logger.log("ERROR", __function,
                                                        "Template " + templateId + " references invalid field " + field.id, req, res)
                                                }
                                                fieldIndex++;
                                            }
                                            fieldCallBack(null);
                                        }
                                    });
                                } else {
                                    fieldIndex++;
                                    fieldCallBack(null);
                                }
                            }, function () {
                                groupCallBack(null);
                            });
                        }, function () {
                            // this function runs after all groups in the tab are finished processing
                            tabCallBack(null);
                        })
                    }, function () {
                        // this function runs after all tabs have been processed
                        logger.log("DEBUG", __function, "Final Template with Field Details or " + templateId + " = " + JSON.stringify(template), req, res)
                        res.status(200).send({template: template});
                    });
                }
            });
        } else {
            return res.status(400).send({
                message: logger.log("ERROR", __function, "Required input parameters not found", req, res)
            });
        }
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

exports.getExternalData = function (req, res) {
    try {
        if (coreUtils.methodCop([req, req.body,
                req.body.field,
                req.user.username,
                req.body.formModel,
                req.body.formModel.serviceOrderId])) {

            if (req.body.field.name === 'serviceOrderId') {
                var serviceOrderId = req.body.formModel.serviceOrderId;
                var formModel = req.body.formModel;
                var userName = req.user.username;
                serviceOrderController.getServiceOrderDetails(serviceOrderId, userName, formModel, function (err, updatedFormModel) {
                    if (err) {
                        return res.status(400).send({
                            message: logger.log("ERROR", __function, err, req, res)
                        });
                    } else {
                        res.status(200).send(updatedFormModel);
                    }
                });
            } else {
                res.status(200).send(formModel);
            }
        }
        else {
            return res.status(400).send({
                message: logger.log("ERROR", __function, 'Could not load external data. Missing Order ID', req, res)
            });
        }
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};

exports.getTypeAheadData = function (req, res) {
    try {
        if (coreUtils.methodCop([req, req.body,
                req.body.field,
                req.body.searchString])) {

            // this allows support of different TypeAhead fields calling different services
            if (req.body.field.name === 'deviceTypeahead') {
                req.body.searchType = 'keyword';
                req.body.rows = 100;
                req.body.start = 0;
                req.body.caseSearch = false;
                req.body.subCaseSearch = false;
                ticketsController.searchTickets( req, res );
            } else {
                res.status(200).send({});  // gracefully return
            }
        }
        else {
            return res.status(200).send({});  // gracefully return
        }
    } catch (err) {
        return res.status(400).send({
            message: logger.log("ERROR", __function, err, req, res)
        });
    }
};