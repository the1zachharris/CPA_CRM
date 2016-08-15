'use strict';

//the required core things that Ops Console needs in order to set up the routes
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();


/************************************************************************************************
 * LOGGING ROUTES
 * @type {exports|module.exports}
 */
var clientTypes = require('./controllers/clientTypes.server.controller.js');
router.post('/create',clientTypes.createClientType);
router.post('/update',clientTypes.updateClientType);
router.get('/list', clientTypes.listClientType);
router.get('/detail', clientTypes.detailClientType);
router.delete('/delete', clientTypes.deleteClientType);

