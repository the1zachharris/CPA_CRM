'use strict';
var tasks = angular.module('tasks',[
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


tasks.controller('tasksController',[
    '$filter',
    'taskCalls',
    '$scope',
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
        $filter,
        taskCalls,
        $scope,
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

        $scope.appheader = 'Tasks';
        $scope.tab = undefined;

        var tasks = "",
            newTask = '',
            updatedtask = "",
            detailedtask = {},
            frequencies = "",
            deletedtask = "";

        //Build the tabset to run the CRUD for tasks
        $scope.tasksTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.tasksTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.tasksTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewTask(itemId);
        };

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'Task',
            fields: [
              { label:'Name', field: 'Name', required: true },
              { label: 'Number', field: 'Number', required: true},
              { label:'Due Date', field: 'DueDate', required: true},
              { label:'Extended Due Date', field: 'ExtendedDueDate', required: false},
              { label:'Second Extended Due Date', field: 'SecondExtendedDueDate', required: false},
              { label:'Frequency', field: 'Frequency', required: true}
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'Task',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label: 'Number', field: 'Number', required: true},
                { label:'Due Date', field: 'DueDate', required: true},
                { label:'Extended Due Date', field: 'ExtendedDueDate', required: false},
                { label:'Second Extended Due Date', field: 'SecondExtendedDueDate', required: false},
                { label:'Frequency', field: 'Frequency', required: true}
            ]
        };

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<md-button aria-label="Task Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                        + '<i class="glyphicon glyphicon-pencil"></i>'
                        + '<md-tooltip>{{row.entity.Name}} Detail</md-tooltip>'
                        + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    height: 30,
                    pinnable: false
                },
                { name:'Name', field: 'Name' },
                { name: 'Number', field: 'Number'},
                { name:'Frequency', field: 'Frequency' },
                { name:'Due Date', field: 'DueDate'}
            ],
            data : []
        };


        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.tasks;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        /* =====================================================================
         * Get all tasks from Mongo database
         * ===================================================================== */
        $scope.getTasks = function () {

            taskCalls.getTasks({}).then(
                function (res) {
                    tasks = angular.copy(res.data);
                    $scope.tasks = tasks;
                    console.dir(tasks);
                    $scope.gridOptions.data = tasks;
                },
                function (err) {
                    console.error('Error getting tasks: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new task
         * ===================================================================== */
        $scope.createItem = function (newtask) {
            console.log(newtask);
            taskCalls.createTask({
                Name: newtask.Name,
                Number: newtask.Number,
                DueDate: newtask.DueDate,
                ExtendedDueDate: newtask.ExtendedDueDate,
                SecondExtendedDueDate: newtask.SecondExtendedDueDate,
                Frequency: newtask.Frequency
            }).then(
                function (res) {
                    newTask = angular.copy(res.data);
                    $scope.newtask = {};
                    $scope.getTasks();
                    //TODO: add toast message to notify user the record has been created

                    //window.location.href ='#/tasks';
                    $scope.removeTab('createTab');
                },
                function (err) {
                    $scope.badTask = 'Error creating task: ' + JSON.stringify(err.data.message);
                    console.error('Error creating task: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update task
         * ===================================================================== */
        $scope.updateItem = function (detailedtask) {
            console.dir(detailedtask);
            taskCalls.updateTask({
                id: detailedtask.id,
                Name: detailedtask.Name,
                Number: detailedtask.Number,
                Frequency: detailedtask.Frequency.frequency,
                DueDate: detailedtask.DueDate,
                ExtendedDueDate: detailedtask.ExtendedDueDate,
                SecondExtendedDueDate: detailedtask.SecondExtendedDueDate
            }).then(
                function (res) {
                    updatedtask = angular.copy(res.data);
                    $scope.updatedtask = updatedtask;
                    $scope.getTasks();
                    //TODO: add toast message to notify user the record has been updated

                    //window.location.href ='#/tasks';
                    $scope.removeTab(detailedtask.id);
                },
                function (err) {
                    console.error('Error updating task: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view task
         * ===================================================================== */
        $scope.viewTask = function (taskId) {

            taskCalls.detailTask(taskId).then(
                function (res) {
                    detailedtask = angular.copy(res.data);
                    $scope.tasksTabset[taskId] = {
                        active: true,
                        label: detailedtask.Number,
                        view: 'modules/core/views/edit-item.client.view.html',
                        item: detailedtask
                    };
                },
                function (err) {
                    console.error('Error viewing task: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a task from Mongo database
         * ===================================================================== */
        $scope.deleteItem = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.Name,
                body : 'Are you sure you want to delete the task, \'' + item.Name + '?\''
            };
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'appModal',
                controller: 'ModalInstanceCtrl',
                scope: $scope,
                size: 'md'
                // resolve: {}
            });
            modalInstance.result.then(
                function () {
                    console.dir(item);
                    taskCalls.deleteTask({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedtask = angular.copy(res.data);
                            $scope.deletedtask = deletedtask;
                            $scope.getTasks();
                            $scope.removeTab(item.id);
                        },
                        function (err) {
                            console.error('Error deleting task: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete task cancelled');
                }
            );
        };

        $scope.getFrequencies = function () {
            taskCalls.getFrequencies({}).then(
                function (res) {
                    frequencies = angular.copy(res.data);
                    $scope.frequencies = frequencies;
                    console.dir(frequencies);
                },
                function (err) {
                    console.error('Error getting Frequencies: ' + err.message);
                }
            );
        };
    }
]);

/* ================================================================================
 Modal Controller
 * ================================================================================ */
tasks.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        // $log.info('We are canceling...');
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function () {
        //$log.info('We are confirming...');
        $modalInstance.close('closed');
    };


});