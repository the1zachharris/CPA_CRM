'use strict';

//the required core things that Ops Console needs in order to set up the routes
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

module.exports = function (app) {

    /************************************************************************************************
     * LOGGING ROUTES
     * @type {exports|module.exports}
     */
    var clientTypes = require('./controllers/clientTypes.server.controller.js');
    router.post('/clienttype/create', clientTypes.createClientType);
    router.post('/clienttype/update', clientTypes.updateClientType);
    router.get('/clienttype/list', clientTypes.listClientType);
    router.get('/clienttype/detail/:typeid', clientTypes.detailClientType);
    router.delete('/clienttype/:typeid', clientTypes.deleteClientType);
};

};
//module.exports = router;
