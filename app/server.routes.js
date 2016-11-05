'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    core = require('./controllers/core.server.controller.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

console.log('in server.routes now');

router.get('/',core.index);

/************************************************************************************************
 * APPLICATION ROUTES
 * @type {exports|module.exports}
 */
var applications = require('./controllers/applications.server.controller.js');
router.get('/applications', applications.list);
router.get('/applications/settings/:appName', applications.getSettings);
router.post('/applications', applications.create);
router.get('/application/:applicationId',applications.read);
router.post('/applications/update', applications.update);
router.delete('/applications/:applicationId', applications.delete);
router.post('/checkApp',applications.checkName);

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

/************************************************************************************************
 * reminder ROUTES
 * @type {exports|module.exports}
 */
var reminder = require('./controllers/reminders.server.controller.js');
router.get('/reminder/list', reminder.list);
router.get('/reminder/detail/:Task', reminder.detail);
router.post('/reminder/create', reminder.create);
router.post('/reminder/update', reminder.update);
router.delete('/reminder/delete/:reminderid', reminder.delete);

/************************************************************************************************
 * client ROUTES
 * @type {exports|module.exports}
 */
var client = require('./controllers/clients.server.controller.js');
router.get('/client/list', client.list);
router.get('/client/detail/:Name', client.detail);
router.post('/client/create', client.create);
router.post('/client/update', client.update);
router.delete('/client/delete/:clientid', client.delete);
router.post('/client/search', client.search);

/************************************************************************************************
 * task ROUTES
 * @type {exports|module.exports}
 */
var task = require('./controllers/tasks.server.controller.js');
router.get('/task/list', task.list);
router.get('/task/detail/:Name', task.detail);
router.post('/task/create', task.create);
router.post('/task/update', task.update);
router.delete('/task/delete/:taskid', task.delete);

module.exports = router;
