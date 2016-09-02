'use strict';

var mongoose = require('mongoose');
var async = require('async'),
    request = require('superagent'),
    _ = require('lodash');

//vars to do database manipulation
var envLoaded = require('../../config/env/' + process.env.NODE_ENV);
// Connection URL
var url;
if (!envLoaded.db) {
    url = 'mongodb://' + envLoaded.user + ':' + envLoaded.pass + '@' + envLoaded.replset + envLoaded.dbname;
} else {
    url = envLoaded.db;
}

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


exports.index = function (req, res) {
    // console.log('called')
    /*  if (!mongoose.connections._hasOpened){
     console.log('connection is not open')
     res.render('error')
     } else {*/
    if (req.user) {
        res.render('index', {
            user: req.user || null,
            env: process.env.NODE_ENV,
            request: req
        });
    } else {
        res.render('index');
        //res.render('signin');
        //TODO: pass the requested URL on so that post login OCL can take them there in case it was a deep link

    }
    //  }

};
