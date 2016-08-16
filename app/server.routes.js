'use strict';

//the required core things that Ops Console needs in order to set up the routes
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = function (app) {

    var router = express.Router();

    /************************************************************************************************
     * ClientType ROUTES
     * @type {exports|module.exports}
     */
    var clientTypes = require('../app/controllers/clienttypes.server.controller.js');
    router.get('/foo/it', clientTypes.fooIt);
    router.post('/clienttype/create', clientTypes.createIt);
    router.post('/clienttype/update', clientTypes.updateIt);
    router.get('/clienttype/list', clientTypes.listAll);
    router.get('/clienttype/detail/:typeid', clientTypes.detailIt);
    router.delete('/clienttype/:typeid', clientTypes.deleteIt);
};

//module.exports = router;
