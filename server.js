'use strict';

var express = require('express'),
    app = express(),
    path = require('path'),
    debug = require('debug')('TrakkTask'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    passport = require('passport'),
    swig = require('swig'),
    http = require('http'),
    https = require('https'),
    cookieParser = require('cookie-parser'),
    mongoStore = require('connect-mongo')({session: session}),
    compression = require('compression'),
    log4js = require('log4js');

app.use(compression()); //use compression
log4js.configure('log4jsConfig.json');
//log4js.replaceConsole(CPA_CRMLogger);

var isAuth = false;

if (!process.env.NODE_ENV){
    process.env.NODE_ENV = 'local';
}
//load the appropriate environment configuration file
var envLoaded = require('./config/env/'+ process.env.NODE_ENV);

log4js.setGlobalLogLevel(envLoaded.defaultLoggingLevel);

if (envLoaded.user){
    var db = mongoose.connect('mongodb://'+ envLoaded.user + ':' + envLoaded.pass + '@' + envLoaded.replset + envLoaded.dbname, function(err){
        if (err){
            console.log('Can not reach Mongo database');
            console.log(err);
        }
    });
} else{
    db = mongoose.connect(envLoaded.db + envLoaded.dbname, function(err){
        if (err) {
            console.log('Can not reach Mongo database');
            console.log(err);
        }
    });
};

if (isAuth) {
    console.log('authenicated');
} else {
    console.log('not authenicated');
};


app.use(cookieParser());

//Commenting this out to test performance improvements
app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: 'MEAN',

    store: new mongoStore({
        mongooseConnection: mongoose.connection,
        collection:'sessions'
    })
}));



app.set('view engine', 'html');
app.set('view options', {
    layout: false
});
app.engine('html', swig.renderFile);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

app.set('view cache', false);
//Initialize the passport security components
app.use(passport.initialize());
app.use(passport.session());
// To disable Swig's cache
swig.setDefaults({ cache: false });



//Route configuration
var routes = require('./app/server.routes.js');
app.use('/',routes);

var server = app.listen(envLoaded.port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('TrakkTask listening at port:'+ port);
});

// catch 404 and forward to error handler
//Update: Changed 404 from ERROR to INFO due to these errors spamming the
//error logs in the mongo db - dh
app.use(function(req, res, next) {
    var err = new Error('Not Found' + req.path);
    console.log(err);
    //CPA_CRMLogger.log("INFO", __function, err, req, res);
    err.status = 404;
    next(err);
});

// error handlers

app.use(function(err, req, res, next) {
    console.log(err);
    //CPA_CRMLogger.log("ERROR", __function, err, req, res);
    res.status(err.status || 500).send({message: err.message});
    console.log(err);
});

module.exports = app;
