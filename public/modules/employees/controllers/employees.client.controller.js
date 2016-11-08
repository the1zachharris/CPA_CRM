'use strict';
var employees = angular.module('employees',[
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


tasks.controller('employeesController',[
    'employeeCalls',
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

        $scope.appheader = 'employees';
        $scope.tab = undefined;

        var tasks = "",
            newTask = "",
            updatedtask = "",
            detailedtask = "",
            deletedtask = "";

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name:'First Name', field: 'FirstName' },
                { name: 'Last Name', field: 'LastName'},
                { name:'Username', field: 'Username' },
                { name:'Email', field: 'Email'},
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<a ng-href="#/employee/update/{{row.entity.id}}"  aria-label="Employees Detail" class="md-mini"><i class="fa fa-info-circle"></i></a>',
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
         * Get all employees from Mongo database
         * ===================================================================== */
        $scope.getEmployees = function () {

            taskCalls.getEmployees({}).then(
                function (res) {
                    tasks = angular.copy(res.data);
                    $scope.tasks = tasks;
                    $scope.gridOptions.data = tasks;
                },
                function (err) {
                    console.error('Error getting employees: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new employee
         * ===================================================================== */
        $scope.createEmployee = function (newemployee) {
            taskCalls.createEmployee({
                FirstName: newemployee.FirstName,
                LastName: newemployee.LastName,
                Email: newemployee.Email
            }).then(
                function (res) {
                    newemployee = angular.copy(res.data);
                    $scope.newemployee = {};
                    window.location.href ='#/tasks';
                },
                function (err) {
                    $scope.badTask = 'Error creating employee: ' + JSON.stringify(err.data.message);
                    console.error('Error creating employee: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update employee
         * ===================================================================== */
        $scope.updateTask = function (detailedemployee) {

            taskCalls.updateTask({
                employeeid: detailedemployee.id,
                FirstName: detailedemployee.FirstName,
                LastName: detailedemployee.LastName,
                Username: detailedemployee.Username,
                DueDate: detailedemployee.DueDate,
                ExtendedDueDate: detailedemployee.ExtendedDueDate,
                SecondExtendedDueDate: detailedemployee.SecondExtendedDueDate
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
        $scope.deleteTask = function (detailedtask) {

            $scope.modal = {
                title : 'Delete ' + detailedtask.name,
                body : 'Are you sure you want to delete the task, \'' + detailedtask.name + '?\''
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
                    taskCalls.deleteTask({
                        taskid: detailedtask.id
                    }).then(
                        function (res) {
                            deletedtask = angular.copy(res.data);
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
                    $log.info('Delete App cancelled');
                }
            );
        };







        $scope.deleteApp = function(){
            //if ($scope.canDelete) {
            $scope.modal = {
                title : 'Delete ' + $scope.application.name,
                body : 'Are you sure you want to delete the application, \'' + $scope.application.name + '?\''
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
                    $scope.forRealDeleteApp();
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete App cancelled');
                }
            );
            /*
             } else {
             $scope.modal = {
             title : 'Error',
             icon : 'exclamation-triangle',
             body : 'You are not authorized to perform this function.'
             };
             $scope.openModal('sm');
             }
             */
        };

        $scope.forRealDeleteApp = function(){
            $http.delete('/applications/manage/'+$scope.application.id)
                .success(function(data){
                    window.location.href ='#/applications';
                    $scope.dataRec = data;
                })
                .error(function(err){
                    $scope.error = err.message;
                    $log.error('There was an error deleting the app: ' + err.message);
                    $scope.modal = {
                        title : 'Error',
                        body : 'There is an error deleting the application. Please try again.'
                    };
                    $scope.openModal('sm');
                })
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