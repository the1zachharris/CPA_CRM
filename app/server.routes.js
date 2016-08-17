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

/************************************************************************************************
 * frequency ROUTES
 * @type {exports|module.exports}
 */

var frequency = require('./controllers/frequencys.server.controller.js');
router.get('/frequency/list', frequency.list);
router.get('/frequency/detail/:frequency', frequency.detail);
router.post('/frequency/create', frequency.create);
router.post('/frequency/update', frequency.update);
router.delete('/frequency/delete/:frequencyid', frequency.delete);

/************************************************************************************************
 * employee ROUTES
 * @type {exports|module.exports}
 */

var employee = require('./controllers/employees.server.controller.js');
router.get('/employee/list', employee.list);
router.get('/employee/detail/:FirstName', employee.detail);
router.post('/employee/create', employee.create);
router.post('/employee/update', employee.update);
router.delete('/employee/delete/:employeeid', employee.delete);

module.exports = router;
