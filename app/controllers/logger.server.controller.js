/*******************************************************************************************
 This controller contains a callable function to
 define how standard messages will be logged in
 a Splunk friendly manner.

 EX:  logger.log("DEBUG", __function, req, 'Test Log Message');
    log("Error", __function,)
 NOTE:  To add extra key/value pairs that Splunk
 can capture, just add them separated by commas to
 the input message.  Each should start with ocl like
 oclUser to avoid Splunk keywords.

 EX:  var logMessage = "oclTranPhase=start" + ", " +
 "oclCall=icsNMS" + ", " +
 "oclTid=" + tid + ", " +
 "External Call Timer Started";
 logger.log("DEBUG", __function, req, logMessage);

 ***US185385: uncaught-errors.server.controller & errors.server.controller
    were moved into this controller so that we can use one log statement
    to insert into mongo and splunk. -dh

 *******************************************************************************************/
var log4js = require('log4js'),
    ttLogger = log4js.getLogger('ttLogs'),
    mongoose = require('mongoose'),
    request = require('superagent'),
    coreUtils = require('./core.server.controller'),
    envLoaded = require('../../config/env/'+ process.env.NODE_ENV);
/*
* Object used when storing error in mongo db
* */
var ErrorLog = mongoose.model('ErrorLog', {
 errorBody: String,
 user: Object,
 application: String,
 errorCode: String,
 reqBody: Object,
 received: {type: Date, default: Date.now()}
 });

exports.log = function(logLevel, oclFunction, logMessage, request, response) {

    if(request) {
        if (coreUtils.methodCop([request.user])) {
            if (coreUtils.methodCop([request.user.username])) {
                var usrName = request.user.username;
            } else {
                var usrName = 'no user name';
            }
        }
        if (process.env.NODE_ENV == 'local' &&
            logLevel.toUpperCase() != "ERROR" &&
            logLevel.toUpperCase() != "FATAL") {
                if(request.body.oclUuid) {
                    var message = 'oclUuid=' + request.body.oclUuid + ' ' + logMessage;
                } else {
                    var message = logMessage;
                }
        } else {
            var message =
                'oclUser=' + usrName + ', ' +
                'oclAppPath=' + request.path + ', ' +
                'oclFunction="' + oclFunction;

                if(request.body.oclUuid) {
                    message = message + 'oclUuid=' + ' ' +request.body.oclUuid + ' ' + logMessage;
                } else {
                    if(logMessage.message) {
                        message = message + ' ' + logMessage.message;
                    } else {
                        message = message + ' ' + logMessage;
                    }
                }
        }
    }

    if (logLevel.toUpperCase() == "ALL") {
        ttLogger.all(message);
    } else if (logLevel.toUpperCase() == "TRACE") {
        ttLogger.trace(message);
    } else if (logLevel.toUpperCase() == "DEBUG") {
        ttLogger.debug(message);
    } else if (logLevel.toUpperCase() == "INFO") {
        ttLogger.info(message);
    } else if (logLevel.toUpperCase() == "WARN") {
        ttLogger.warn(message);
    } else if (logLevel.toUpperCase() == "ERROR") {
        ttLogger.error(message);
        if(message) {
            getErrorMessageAndSaveToMongo(message,  request, response);
        } else {
            getErrorMessageAndSaveToMongo(logMessage,  request, response);
        }
    } else if (logLevel.toUpperCase() == "FATAL") {
        ttLogger.fatal(message);
    }

    return logMessage;
};

exports.writeClientLog = function (req,res) {
    //console.log("logger req " + JSON.stringify(req.body));
    if (req !== null && typeof req !== 'undefined' &&
        req.body !== null && typeof req.body !== 'undefined') {

        var logLocation = 'Client';
        if (req.body['ttClientController'] !== null && typeof req.body['ttClientController'] !== 'undefined') {
            logLocation = logLocation + " " + req.body['ttClientController'];
        }
        if (req.body['ttClientLineNumber'] !== null && typeof req.body['ttClientLineNumber'] !== 'undefined') {
            logLocation = logLocation + " " + req.body['ttClientLineNumber'];
        }

        var logMessage = 'Message: ';
        if (req.body['ttClientMessage'] !== null && typeof req.body['ttClientMessage'] !== 'undefined') {
            logMessage = logMessage + " " + req.body['ttClientMessage'];
        }
        if (req.body['message'] !== null && typeof req.body['message'] !== 'undefined') {
            logMessage = logMessage + " " + req.body['message'];
        }

        ttLogger.error("ERROR",logLocation, logMessage);

        res.status(200).send({message:'message has been logged'});
    } else {
        res.status(200).send({message:'message has not been logged due to missing req.body'});
    }
};

Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});

Object.defineProperty(global, '__function', {
    get: function() {
        return __stack[1];
    }
});

/***********************************************************
 To Change the loglevel use POSTMAN or a similar tool
 with x-www-form-urlencloded   logLevel/INFO  key/value pair
 ************************************************************/
exports.setLoggingLevel = function(req, res) {
    if (req.body.logLevel) {
        logLevel = req.body.logLevel;
        var log4js = require('log4js');
        if (logLevel.toUpperCase() == "ALL" ||
            logLevel.toUpperCase() == "TRACE" ||
            logLevel.toUpperCase() == "DEBUG" ||
            logLevel.toUpperCase() == "INFO" ||
            logLevel.toUpperCase() == "WARN" ||
            logLevel.toUpperCase() == "ERROR" ||
            logLevel.toUpperCase() == "FATAL") {
            log4js.setGlobalLogLevel(logLevel.toUpperCase());
            var ttLogger = log4js.getLogger('ttLogs');
            res.status(200).send({message: 'Logging level successfully changed to ' + ttLogger.level});
        } else {
            res.status(400).send({message: 'Please use a valid logLevel value (ALL, TRACE, DEBUG, INFO, WARN, ERROR, or FATAL'});
        }
    } else {
        res.status(400).send({message: 'Please add a x-www-form-urlencoded key/value pair for logLevel'});
    }
};

exports.getLoggingLevel = function(req, res) {
    var log4js = require('log4js');
    var ttLogger = log4js.getLogger('ttLogs');
    res.status(200).send({message:'Logging level is currently set to ' + ttLogger.level});
};


exports.updateLoglevelByNodeId = function (req, res) {
    var url = '';
    var form = {
        logLevel: req.params.logLevel
    };

    if(req.params.node == '1') {
        url = envLoaded.oclNode1Url + '/setLoggingLevel';
    } else {
        url = envLoaded.oclNode2Url + '/setLoggingLevel';
    }

    request.post(url)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(form)
        .end(function(error, response) {
            if(error){
                return res.status(400).send({
                    message: error.message
                })
            } else {
                return res.status(200).send(response.text);
            }
        })
}

exports.getLoggerLevelByNodeId = function(req, res) {
    var url = '';
    if(req.params.node == '1') {
        url = envLoaded.oclNode1Url + '/getLoggingLevel';
    } else {
        url = envLoaded.oclNode2Url + '/getLoggingLevel';
    }
    request.get(url)
        .set('Accept', 'application/json')
        .end(function(error,response){
            if(error) {
                return res.status(400).send({
                    message: error.message
                })
            } else {
                return res.status(200).send(response.text);
            }
        });
};


exports.getLogConsoleServerURL = function(req, res) {
    var url = "http://" + envLoaded.oclServicesUrl.host + ":" +
        envLoaded.oclServicesUrl.port +
        envLoaded.oclServicesUrl.path + 'log4jAdmin.jsp';
    return res.status(200).send({message:url});
};

/*
*
* */
var getErrorMessageAndSaveToMongo = function (err, req, res) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong. We have logged this issue and will correct';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    saveErrorToMongo(err, req, res);
};

var saveErrorToMongo = function (err, req, res) {
    var user = (req && req.user) ? req.user.username : 'no user';
    var response = (res) ? res : 'no response body';
    var error =  err ? err : 'no error body';
    var request = (req) ? req.body: 'no request body';
    var appPath = (req) ? req.path : 'no path identified';
    var errCode = (err) ? err.code : 'no error code';

    var errorLog = new ErrorLog({
        errorBody: error,
        reqBody: request,
        sent: response,
        user: user,
        application: appPath,
        errorCode: errCode
    });

    errorLog.save(function(error){
        if(error) {
            //console.log(error);
        }
    });
} ;
var getUniqueErrorMessage = function(err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

    } catch (ex) {
        output = 'Unique field already exists';
    }
    return output;
};


exports.ErrorLog = mongoose.model('ErrorLog',ErrorLog);


