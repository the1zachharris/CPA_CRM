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


employees.controller('employeesController',[
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
        employeeCalls,
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

        var employees = "",
            updatedemployee = "",
            detailedemployee = "",
            deletedemployee = "";

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name:'First Name', field: 'FirstName' },
                { name: 'Last Name', field: 'LastName'},
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
            $scope.gridOptions.data = $scope.employees;
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

            employeeCalls.getEmployees({}).then(
                function (res) {
                    employees = angular.copy(res.data);
                    $scope.employees = employees;
                    $scope.gridOptions.data = employees;
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
            employeeCalls.createEmployee({
                FirstName: newemployee.FirstName,
                LastName: newemployee.LastName,
                Email: newemployee.Email
            }).then(
                function (res) {
                    newemployee = angular.copy(res.data);
                    $scope.newemployee = {};
                    window.location.href ='#/employees';
                },
                function (err) {
                    console.error('Error creating employee: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update employee
         * ===================================================================== */
        $scope.updateEmployee = function (detailedemployee) {
            console.dir(detailedemployee);
            employeeCalls.updateEmployee({
                id: detailedemployee.id,
                FirstName: detailedemployee.FirstName,
                LastName: detailedemployee.LastName,
                Email: detailedemployee.Email
            }).then(
                function (res) {
                    updatedemployee = angular.copy(res.data);
                    $scope.updatedemployee = updatedemployee;
                    window.location.href ='#/employees';
                    console.dir(updatedemployee);
                },
                function (err) {
                    console.error('Error updating employee: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view task
         * ===================================================================== */
        $scope.viewEmployee = function () {

            employeeCalls.detailEmployee().then(
                function (res) {
                    detailedemployee = angular.copy(res.data);
                    $scope.detailedemployee = detailedemployee;
                    console.dir(detailedemployee);
                },
                function (err) {
                    console.error('Error viewing employee: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a task from Mongo database
         * ===================================================================== */
        $scope.deleteEmployee = function (detailedemployee) {

            $scope.modal = {
                title : 'Delete ' + detailedemployee.FirstName,
                body : 'Are you sure you want to delete this employee, \'' + detailedemployee.FirstName + '?\''
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
                    employeeCalls.deleteEmployee({
                        id: detailedemployee.id
                    }).then(
                        function (res) {
                            deletedemployee = angular.copy(res.data);
                            $scope.deletedemployee = deletedemployee;
                            window.location.href ='#/employees';
                        },
                        function (err) {
                            console.error('Error deleting employee: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete employee cancelled');
                }
            );
        };
    }
]);

/* ================================================================================
 Modal Controller
 * ================================================================================ */
employees.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        // $log.info('We are canceling...');
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function () {
        //$log.info('We are confirming...');
        $modalInstance.close('closed');
    };


});