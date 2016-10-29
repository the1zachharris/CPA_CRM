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
    function(
        taskCalls,
        $scope,
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce

    ) {

        $scope.appheader = 'tasks';
        $scope.tab = undefined;
        console.log("in task controller");

        var tasks = "",
            Name = "",
            Number = "",
            Frequency = "",
            DueDate = "",
            ExtendedDueDate = "",
            SecondExtendedDueDate = "",
            newTask = "",
            updatedtask = "",
            deletedtask = "";
        $scope.myVar = 'test data';
        /* =====================================================================
         * Get all tasks from Mongo database
         * ===================================================================== */
        $scope.getTasks = function () {

            taskCalls.getTasks({}).then(
                function (res) {
                    tasks = angular.copy(res.data);
                    $scope.tasks = tasks;
                    console.dir(tasks)
                },
                function (err) {
                    console.error('Error getting tasks: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new task
         * ===================================================================== */
        $scope.createTask = function () {

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
                    $scope.newTask = newTask;
                },
                function (err) {
                    console.error('Error creating task: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * update task
         * ===================================================================== */
        $scope.updateTask = function () {

            taskCalls.updateTask({
                Name: Name,
                Number: Number,
                Frequency: Frequency,
                DueDate: DueDate,
                ExtendedDueDate: ExtendedDueDate,
                SecondExtendedDueDate: SecondExtendedDueDate
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