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

// Seed Route
router.post('/seed/:app/:mode/:field',core.seed);
/*
 // example for seed applications
    '/seed/applications/updateappend/name'

*/

//other core routes
router.get('/version', core.version);
router.get('/releaseNotes', core.releaseNotes);

/*
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

/*
 * ClientType ROUTES
 * @type {exports|module.exports}
 */
var clientTypes = require('./controllers/clienttypes.server.controller.js');
router.get('/clienttype/list', clientTypes.listAll);
router.post('/clienttype/create', clientTypes.createIt);
router.post('/clienttype/update', clientTypes.updateIt);
router.get('/clienttype/detail/:id', clientTypes.detailIt);
router.delete('/clienttype/delete/:id', clientTypes.deleteIt);

/*
 * frequency ROUTES
 * @type {exports|module.exports}
 */
var frequency = require('./controllers/frequencys.server.controller.js');
router.get('/frequency/list', frequency.list);
router.get('/frequency/detail/:id', frequency.detail);
router.post('/frequency/create', frequency.create);
router.post('/frequency/update', frequency.update);
router.delete('/frequency/delete/:id', frequency.delete);

/*
 * employee ROUTES
 * @type {exports|module.exports}
 */
var employee = require('./controllers/employees.server.controller.js');
router.get('/employees/list', employee.list);
router.get('/employee/detail/:id', employee.detail);
router.post('/employee/create', employee.create);
router.post('/employee/update', employee.update);
router.delete('/employee/delete/:id', employee.delete);

/*
 * reminder ROUTES
 * @type {exports|module.exports}
 */
var reminder = require('./controllers/reminders.server.controller.js');
router.get('/reminder/list', reminder.list);
router.get('/reminder/detail/:id', reminder.detail);
router.post('/reminder/create', reminder.create);
router.post('/reminder/update', reminder.update);
router.delete('/reminder/delete/:id', reminder.delete);

/*
 * client ROUTES
 * @type {exports|module.exports}
 */
var client = require('./controllers/clients.server.controller.js');
router.get('/client/list', client.list);
router.get('/client/detail/:id', client.detail);
router.post('/client/create', client.create);
router.post('/client/update', client.update);
router.delete('/client/delete/:id', client.delete);
router.post('/client/search', client.search);
router.post('/client/assigntask', client.assigntask);
router.post('/client/removetask', client.removetask);

/*
 * clientTask ROUTES
 * @type {exports|module.exports}
 */
var clientTask = require('./controllers/clientTask.server.controller.js');
router.get('/clienttask/list', clientTask.list);
router.get('/clienttask/detail/:id', clientTask.detail);
router.post('/clienttask/create', clientTask.create);
router.post('/clienttask/update', clientTask.update);
router.delete('/clienttask/delete/:id', clientTask.delete);

/*
 * task ROUTES
 * @type {exports|module.exports}
 */
var task = require('./controllers/tasks.server.controller.js');
router.get('/task/list', task.list);
router.get('/task/detail/:id', task.detail);
router.post('/task/create', task.create);
router.post('/task/update', task.update);
router.delete('/task/delete/:id', task.delete);

module.exports = router;
