'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

console.log('in server.routes now');

    /************************************************************************************************
     * ClientType ROUTES
     * @type {exports|module.exports}
     */

var clientTypes = require('./controllers/clienttypes.server.controller.js');
router.get('/clienttype/list', clientTypes.listAll);
router.post('/clienttype/create', clientTypes.createIt);
router.post('/clienttype/update', clientTypes.updateIt);
router.get('/clienttype/detail/:type', clientTypes.detailIt);
router.delete('/clienttype/:typeid', clientTypes.deleteIt);

var frequency = require('./controllers/frequencys.server.controller.js');
router.get('/frequency/list', frequency.list);
router.get('/frequency/detail/:type', frequency.detail);
router.post('/frequency/create', frequency.create);
router.post('/frequency/update', frequency.update);
router.delete('/frequency/:typeid', frequency.delete);

module.exports = router;
