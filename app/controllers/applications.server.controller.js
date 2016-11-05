'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	appModel = require('../models/applications.server.model.js'),
	Application = mongoose.model('Application');

/**
 * Create a Application
 */
/**
 * @apiUse ApplicationVersion
 * @api {post} /applications/:myApp/:myPerm Create Application
 * @apiDescription Create an application within the OCL framework with menus and security params
 * @apiName Create
 * @apiGroup Applications
 * @apiParam {String} myApp  Mandatory Name of Application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 * @apiPermission Application Create
 * @apiSuccess {String} id id of the newly created Application.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "message": "error of some kind"
 *     }
 * @apiUse ApplicationCreateExample
 */

exports.create = function(req, res) {
	var v = new Application({
		name: req.body.newApp.application,
		description: req.body.newApp.description,
		roles: req.body.newApp.roles,
		allRoles: req.body.newApp.allRoles,
		allPerms: req.body.newApp.allPerms,
		itpkmid: req.body.newApp.itpkmid,
		icon: req.body.newApp.icon,
        allMenuItems: req.body.newApp.allMenuItems,
        user: req.user.username
	});

	v.save(function(err,app) {
		if (err) {
			return res.status(400).send({
				message : logger.log("ERROR", __function, err, req, res)
			});
		} else {
			//Audit.create(req.user,'Create Application', req.body,'applications', req.method ,res.body);
			res.status(200).send({success:true,id:app._id});
		}
	});
};

/**
 * @apiUse ApplicationVersion
 * @api {get} /application/:applicationId Get Application
 * @apiDescription Get the details for an application
 * @apiName Read
 * @apiGroup Applications
 * @apiParam {String} applicationId  Mandatory id for the application you want details on
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "app": "the full document/application"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */

exports.read = function(req, res) {
	var applicationId = req.params.applicationId;
	var query = Application.where({_id: applicationId});
	query.exec(function(err,apps){
		if (err){
			return res.status(400).send({
				message: err
			});
		} else {
			res.status(200).send({app: apps});
		}
	});
};

/**
 * @apiUse ApplicationVersion
 * @api {get} /applications/settings/:application Get Application
 * @apiDescription Get the settings for an application
 * @apiName Settings
 * @apiGroup Applications
 * @apiParam {String} application  Mandatory application name for the application you want settings on
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "name": "the name of the application"
 *       "settings": {
 *       	"settingKey" : "settingValue"
 *       }
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */

exports.getSettings = function(req, res) {
	var appName = decodeURIComponent(req.params.appName);
	var query = Application.find({name: appName},{name:1,settings:1,_id:0});
	query.exec(function(err,apps){
		if (err){
			return res.status(400).send({
				message: err
			});
		} else {
			res.status(200).send({app: apps});
		}
	});
};

/**
 * @apiUse ApplicationVersion
 * @api {post} /applications/update/:myApp/:myPerm Update Application
 * @apiDescription Update an application within the OCL framework with menus and security params
 * @apiName Update
 * @apiGroup Applications
 * @apiParam {String} myApp  Mandatory Name of Application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 * @apiPermission Application Update
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "results": "the full updated document/application"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 * @apiUse ApplicationUpdateExample
 */

exports.update = function(req, res) {
	var query = {_id: req.body.updatedApp._id};
	Application.findOneAndUpdate(query,req.body.updatedApp,{upsert:false},function(err,doc){
		if (err){
			return res.status(400).send({
				message: err
			});
		} else{
			//Audit.create(req.user,'Edit Application',req.body,req.url,req.method,doc);
				res.status(200).send({results: doc});
		}
	});

};

/**
 * @apiUse ApplicationVersion
 * @api {delete} /application/:applicationId/:myApp/:myPerm Delete Application
 * @apiDescription Delete an application
 * @apiName Delete
 * @apiGroup Applications
 * @apiParam {String} applicationId  Mandatory id for the application you want to delete
 * @apiPermission Application Delete
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       "results": "Mongo response of remove request"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */

exports.delete = function(req, res) {
	var applicationId = req.params.applicationId;
	var query = {_id: applicationId};
	Application.remove(query,function(err,doc) {
		if (err){
			return res.status(400).send({
				message: err
			});
		} else{
			//Audit.create(req.user, 'Delete Application', req.body, req.url, req.method, res);
			res.status(200).send({results: doc});
		}

	})
};

/**
 * @apiUse ApplicationVersion
 * @api {get} /applications/:myApp/:myPerm Get all applications
 * @apiDescription Get a complete list of all the applications
 * @apiName List
 * @apiGroup Applications
 * @apiParam {String} myApp  Mandatory Name of Application required via security.
 * @apiParam {String} myPerm  Mandatory Name of Permission required via security.
 *
 * @apiSuccessExample Success-Response:
 *     200 OK
 *     {
 *       ["array of all applications as json docs"]
 *     }
 *
 * @apiErrorExample Error-Response:
 *     400 Bad Request
 *     {
 *       "message": "error of some kind"
 *     }
 */


exports.list = function(req, res) {
	Application.find().sort('-created').exec(function(err, applications) {
		if (!applications.length){
//			exports.seedApplications();
			res.status(200).send()
		} else {
			if (err) {
				return res.status(400).send({
					message: err
				});
			} else {
				res.jsonp(applications);
			}
		}
	});
};

exports.checkName = function(req,res){
	var query = {name:req.body.appName};
	Application.findOne(query,function(err,doc){
		if (err){
			return res.status(400).send({
				message: err
			})
		} else {
			res.status(200).send({results: doc});
		}
	})
};

exports.hasAuthorization = function(req, res, next) {
	if (req.application.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
