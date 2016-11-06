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
    function tasksController(
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
        uiGridConstants
    ) {

        $scope.appheader = 'tasks';
        $scope.tab = undefined;
        console.log("in task controller");

        var tasks = "",
            newTask = "",
            updatedtask = "",
            detailedtask = "",
            deletedtask = "";
        $scope.myVar = 'test data';
        $scope.badTask = false;
        //TODO: implement more inclusive filter like this example: http://plnkr.co/edit/cTxLLI84kXy9HR2JekbX?p=preview
        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name:'Name', field: 'Name' },
                { name: 'Number', field: 'Number'},
                { name:'Frequency', field: 'Frequency' },
                { name:'Due Date', field: 'DueDate'},
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<a ng-href="#/task/update/{{row.entity.id}}"  aria-label="Task Detail" class="md-mini"><i class="fa fa-info-circle"></i></a>',
                    enableSorting: false,
                    width: "60",
                    resizable: false,
                    pinnable: false
                }
            ],
            data : []
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
        $scope.createTask = function (newtask) {
            console.log(newtask);
            taskCalls.createTask({
                Name: newtask.Name,
                Number: newtask.Number,
                Frequency: newtask.Frequency,
                DueDate: newtask.DueDate,
                ExtendedDueDate: newtask.ExtendedDueDate,
                SecondExtendedDueDate: newtask.SecondExtendedDueDate
            }).then(
                function (res) {
                    newTask = angular.copy(res.data);
                    $scope.newtask = {};
                    //$scope.newtask.Name = "";
                    console.dir($scope.newtask);
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
        $scope.updateTask = function (detailedtask) {

            taskCalls.updateTask({
                taskid: detailedtask.id,
                Name: detailedtask.Name,
                Number: detailedtask.Number,
                Frequency: detailedtask.Frequency,
                DueDate: detailedtask.DueDate,
                ExtendedDueDate: detailedtask.ExtendedDueDate,
                SecondExtendedDueDate: detailedtask.SecondExtendedDueDate
            }).then(
                function (res) {
                    updatedtask = angular.copy(res.data);
                    $scope.updatedtask = updatedtask;
                },
                function (err) {
                    console.error('Error updating task: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view task
         * ===================================================================== */
        $scope.viewTask = function () {

            taskCalls.detailTask().then(
                function (res) {
                    detailedtask = angular.copy(res.data);
                    $scope.detailedtask = detailedtask;
                    console.dir(detailedtask);
                },
                function (err) {
                    console.error('Error viewing task: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a task from Mongo database
         * ===================================================================== */
        $scope.deleteTask = function () {

            taskCalls.deleteTask({}).then(
                function (res) {
                    deletedtask = angular.copy(res.data);
                    $scope.deletedtask = deletedtask;
                },
                function (err) {
                    console.error('Error deleting task: ' + err.message);
                }
            );
        };
    }
]);

