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
    '$filter',
    '$modal',
    '$log',
    function (
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
        $filter,
        $modal,
        $log
    ) {

        $scope.appheader = 'tasks';
        $scope.tab = undefined;

        var tasks = "",
            newTask = '',
            updatedtask = "",
            detailedtask = "",
            deletedtask = "";

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'Task',
            fields: [
              { label:'Name', field: 'Name', required: true },
              { label: 'Number', field: 'Number', required: true},
              { label:'Frequency', field: 'Frequency', required: true},
              { label:'Due Date', field: 'DueDate', required: true},
              { label:'Extended Due Date', field: 'ExtendedDueDate', required: false},
              { label:'Second Extended Due Date', field: 'SecondExtendedDueDate', required: false}
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'Task',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label: 'Number', field: 'Number', required: true},
                { label:'Frequency', field: 'Frequency', required: true},
                { label:'Due Date', field: 'DueDate', required: true},
                { label:'Extended Due Date', field: 'ExtendedDueDate', required: false},
                { label:'Second Extended Due Date', field: 'SecondExtendedDueDate', required: false}
            ]
        };

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
                    window.location.href ='#/tasks';
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
                id: detailedtask.id,
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
                    window.location.href ='#/tasks';
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
                    $scope.myItem = detailedtask;
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
        $scope.deleteTask = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.name,
                body : 'Are you sure you want to delete the task, \'' + item.name + '?\''
            };
            console.log('in deleteTask');
            console.dir(item);
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
                    taskCalls.deleteTask({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedtask = angular.copy(res.data);
                            console.dir(detailedtask);
                            $scope.deletedtask = deletedtask;
                            window.location.href ='#/tasks';
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