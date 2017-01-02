'use strict';
var clienttasks = angular.module('clienttasks',[
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.exporter',
    'ui.grid.resizeColumns',
    'ui.grid.cellNav',
    'ui.grid.autoResize',
    'ngAnimate',
    'ngLodash',
    'ngMaterial',
    'ngMaterialDatePicker',
    'ui.bootstrap',
    'gm.typeaheadDropdown'
]);


clienttasks.controller('clientTasksController',[
    'clientCalls',
    '$scope',
    '$filter',
    '$http',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    '$sce',
    'lodash',
    'methodCop',
    'uiGridConstants',
    '$modal',
    '$log',
    function (
        clientCalls,
        $scope,
        $filter,
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce,
        lodash,
        methodCop,
        uiGridConstants,
        $modal,
        $log
    ) {

        $scope.appheader = 'Client Tasks';
        $scope.tab = undefined;


        var updatedClientTask = "",
            newClientTask = "",
            now = moment(),
            //newDate = now,
            clientTasks = "",
            detailedClientTask = "";

        //Build the tabset to run the CRUD for clients
        $scope.clientTasksTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.clientTasksTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.clientTasksTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewClientTask(itemId);
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'View',
            collectionName: 'Client Task',
            fields: [
                { label:'Client Name', field: 'clientName'},
                { label:'Task Name', field: 'taskName'},
                { label:'Due Date', field: 'taskDueDate'},
                { label:'Extended Due Date', field: 'taskExtendedDueDate'},
                { label:'2nd Extended Due Date', field: 'taskSecondExtendedDueDate'},
                { label:'Status', field: 'taskStatus'},
                { label:'Completed Date', field: 'taskCompletedDate'},
                { label:'Extended Date', field: 'taskExtendedDate'},
                { label:'Received Date', field: 'taskReceivedDate'},
                { label:'Employee', field: 'taskEmployeeName'},
                { label:'Frequency', field: 'taskFrequency'}
            ]
        };

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                {
                    name: 'actions',
                    displayName: 'Detail',
                    cellTemplate:
                    '<md-button aria-label="Client Task Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                    + '<i class="glyphicon glyphicon-pencil"></i>'
                    + '<md-tooltip>{{row.entity.clientName}} Detail</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 65,
                    height: 30,
                    pinnable: false
                },
                {
                    name: 'complete',
                    displayName: 'Complete',
                    cellTemplate:
                    '<md-button aria-label="Mark Complete" class="btn btn-default" ng-click="grid.appScope.markComplete(row.entity)" ng-if="row.entity.taskStatus != \'Complete\'">'
                    + '<i class="glyphicon glyphicon-check"></i>'
                    + '<md-tooltip>{{row.entity.clientName}} Complete</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 85,
                    height: 30,
                    pinnable: false
                },
                {
                    name: 'receive',
                    displayName: 'Receive',
                    cellTemplate:
                    '<md-button aria-label="Mark Received" class="btn btn-default" ng-click="grid.appScope.markReceived(row.entity)" ng-if="row.entity.taskStatus != \'Complete\' && ! row.entity.taskReceivedDate">'
                    + '<i class="glyphicon glyphicon-open-file"></i>'
                    + '<md-tooltip>{{row.entity.clientName}} Received</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 85,
                    height: 30,
                    pinnable: false
                },
                {
                    name: 'extended',
                    displayName: 'Extended',
                    cellTemplate:
                    '<md-button aria-label="Mark Extended" class="btn btn-default" ng-click="grid.appScope.markExtended(row.entity)" ng-if="row.entity.taskStatus != \'Complete\' && row.entity.taskDueDate != row.entity.taskExtendedDueDate && row.entity.taskExtendedDueDate != null">'
                    + '<i class="glyphicon glyphicon-time"></i>'
                    + '<md-tooltip>{{row.entity.clientName}} Extended</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 85,
                    height: 30,
                    pinnable: false
                },
                { name:'Client Name', field: 'clientName'},
                { name: 'Task Name', field: 'taskName'},
                { name:'Due Date', field: 'taskDueDate', cellFilter: 'date:\'MM/dd/yyyy\''},
                { name:'Status', field: 'taskStatus'},
                { name: 'Employee Name', field: 'taskEmployeeName'},
                { name: 'Frequency', field: 'taskFrequency'}
            ],
            data : []
        };


        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.clientTasks;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        $scope.refreshGrid = function () {
            $scope.getClientTasks()
        };

        $scope.$on("refreshClientTasks", function () {
           $scope.getClientTasks()
        });

        $scope.getClientTasks = function () {
            console.log("in getClientTasks");
            clientCalls.getClientTasks({}).then(
                function (res) {
                    clientTasks = angular.copy(res.data);
                    $scope.clientTasks = clientTasks;
                    console.dir(clientTasks);
                    $scope.gridOptions.data = clientTasks;
                },
                function (err) {
                    console.error('Error getting clientTasks: ' + err.message);
                }
            );
        };

        $scope.viewClientTask = function (clientTaskid) {
            clientCalls.detailClientTask(clientTaskid).then(
                function (res) {
                    detailedClientTask = angular.copy(res.data);
                    $scope.clientTasksTabset[clientTaskid] = {
                        active: true,
                        label: detailedClientTask.taskName,
                        view: 'modules/clientTask/views/view-item.client.view.html',
                        item: detailedClientTask
                    };
                },
                function (err) {
                    console.error('Error viewing task: ' + err.message);
                }
            );
        };

        $scope.markComplete = function (clientTask) {
            var task = {
                DueDate: clientTask.taskOrgDueDate,
                ExtendedDueDate: clientTask.taskExtendedDueDate,
                Frequency: clientTask.taskFrequency,
                Status: "Complete"
            };
            clientCalls.updateClientTask({
                id: clientTask.id,
                clientid: clientTask.clientid,
                clientName: clientTask.clientName,
                taskid: clientTask.taskid,
                taskName: clientTask.taskName,
                taskOrgDueDate: clientTask.taskOrgDueDate,
                taskDueDate: clientTask.taskDueDate,
                taskExtendedDueDate: clientTask.taskExtendedDueDate,
                taskStatus: "Complete",
                taskCompletedDate: now,
                taskCreatedDate: clientTask.taskCreatedDate,
                taskExtendedDate: clientTask.taskExtendedDate,
                taskReceivedDate: clientTask.taskReceivedDate,
                taskEmployeeName: clientTask.taskEmployeeName,
                taskEmployeeid: clientTask.taskEmployeeid,
                taskFrequency: clientTask.taskFrequency
            }).then(
                function (res) {
                    updatedClientTask = angular.copy(res.data);
                    $scope.updatedClientTask = updatedClientTask;
                    $scope.createClientTask(clientTask, task);
                    $scope.removeTab(clientTask.id);
                    $scope.createToast(clientTask.taskName, "Completed", "success");
                    $scope.getClientTasks()
                },
                function (err) {
                    console.error('Error marking client task complete: ' + err.message);
                }
            );
        };

        $scope.markReceived = function (clientTask) {
            clientCalls.updateClientTask({
                id: clientTask.id,
                clientid: clientTask.clientid,
                clientName: clientTask.clientName,
                taskid: clientTask.taskid,
                taskName: clientTask.taskName,
                taskOrgDueDate: clientTask.taskOrgDueDate,
                taskDueDate: clientTask.taskDueDate,
                taskExtendedDueDate: clientTask.taskExtendedDueDate,
                taskStatus: "Received",
                taskCompletedDate: clientTask.taskCompletedDate,
                taskCreatedDate: clientTask.taskCreatedDate,
                taskExtendedDate: clientTask.taskExtendedDate,
                taskReceivedDate: now,
                taskEmployeeName: clientTask.taskEmployeeName,
                taskEmployeeid: clientTask.taskEmployeeid,
                taskFrequency: clientTask.taskFrequency
            }).then(
                function (res) {
                    updatedClientTask = angular.copy(res.data);
                    $scope.updatedClientTask = updatedClientTask;
                    $scope.removeTab(clientTask.id);
                    $scope.createToast(clientTask.taskName, "Received", "success");
                    $scope.getClientTasks()
                },
                function (err) {
                    console.error('Error marking client task received: ' + err.message);
                }
            )
        };

        $scope.markExtended = function (clientTask) {
            clientCalls.updateClientTask({
                id: clientTask.id,
                clientid: clientTask.clientid,
                clientName: clientTask.clientName,
                taskid: clientTask.taskid,
                taskName: clientTask.taskName,
                taskOrgDueDate: clientTask.DueDate,
                taskDueDate: clientTask.taskExtendedDueDate,
                taskExtendedDueDate: clientTask.taskExtendedDueDate,
                taskStatus: "Extended",
                taskCompletedDate: clientTask.taskCompletedDate,
                taskCreatedDate: clientTask.taskCreatedDate,
                taskExtendedDate: now,
                taskEmployeeName: clientTask.taskEmployeeName,
                taskEmployeeid: clientTask.taskEmployeeid,
                taskFrequency: clientTask.taskFrequency
            }).then(
                function (res) {
                    updatedClientTask = angular.copy(res.data);
                    $scope.updatedClientTask = updatedClientTask;
                    $scope.removeTab(clientTask.id);
                    $scope.createToast(clientTask.taskName, "Extended", "success");
                    $scope.getClientTasks()
                },
                function (err) {
                    console.error('Error marking client task extended: ' + err.message);
                }
            )
        };

        $scope.createClientTask = function (clientTask, task) {
            $scope.task = $scope.setDate(task);
            clientCalls.createClientTask({
                clientid: clientTask.clientid,
                clientName: clientTask.clientName,
                taskid: clientTask.taskid,
                taskName: clientTask.taskName,
                taskOrgDueDate: $scope.task.dueDate,
                taskDueDate: $scope.task.dueDate,
                taskExtendedDueDate: $scope.task.extendedDueDate,
                taskStatus: "New",
                taskExtendedDate: clientTask.taskExtendedDate,
                taskEmployeeName: clientTask.taskEmployeeName,
                taskEmployeeid: clientTask.taskEmployeeid,
                taskFrequency: clientTask.taskFrequency
            }).then(
                function (res) {
                    newClientTask = angular.copy(res.data);
                },
                function (err) {
                    $scope.badclient = 'Error creating client task: ' + JSON.stringify(err.data.message);
                    console.error('Error creating client task: ' + JSON.stringify(err.data.message));
                }
            )

        }
    }
]);