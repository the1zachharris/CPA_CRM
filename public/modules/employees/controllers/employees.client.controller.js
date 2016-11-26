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

        $scope.appheader = 'Employees';
        $scope.tab = undefined;

        var employees = "",
            newEmployee = '',
            updatedemployee = "",
            detailedemployee = {},
            deletedemployee = "";

        //Build the tabset to run the CRUD for employees
        $scope.employeesTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.employeesTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.employeesTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewEmployee(itemId);
        };

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'Employee',
            fields: [
                { label:'First Name', field: 'FirstName', required: true },
                { label: 'Last Name', field: 'LastName', required: true},
                { label:'Email', field: 'Email', required: true}
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'Employee',
            fields: [
                { label:'First Name', field: 'FirstName', required: true },
                { label: 'Last Name', field: 'LastName', required: true},
                { label:'Email', field: 'Email', required: true}
            ]
        };

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<md-button aria-label="Employee Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                        + '<i class="glyphicon glyphicon-pencil"></i>'
                        + '<md-tooltip>{{row.entity.type}} Detail</md-tooltip>'
                        + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    height: 30,
                    pinnable: false
                },
                { name:'First Name', field: 'FirstName' },
                { name: 'Last Name', field: 'LastName'},
                { name:'Email', field: 'Email'}
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
                    console.dir(employees);
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
        $scope.createItem = function (newemployee) {
            console.log(newemployee);
            employeeCalls.createEmployee({
                FirstName: newemployee.FirstName,
                LastName: newemployee.LastName,
                Email: newemployee.Email
            }).then(
                function (res) {
                    newEmployee = angular.copy(res.data);
                    $scope.newemployee = {};
                    $scope.getEmployees();
                    //TODO: add toast message to notify user the record has been created

                    //window.location.href ='#/employees';
                    $scope.removeTab('createTab');
                },
                function (err) {
                    $scope.badEmployee = 'Error creating employee: ' + JSON.stringify(err.data.message);
                    console.error('Error creating employee: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update employee
         * ===================================================================== */
        $scope.updateItem = function (detailedemployee) {
            employeeCalls.updateEmployee({
                id: detailedemployee.id,
                FirstName: detailedemployee.FirstName,
                LastName: detailedemployee.LastName,
                Email: detailedemployee.Email
            }).then(
                function (res) {
                    updatedemployee = angular.copy(res.data);
                    $scope.updatedemployee = updatedemployee;
                    $scope.getEmployees();
                    //TODO: add toast message to notify user the record has been updated

                    //window.location.href ='#/employees';
                    $scope.removeTab(detailedemployee.id);
                },
                function (err) {
                    console.error('Error updating employee: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view employee
         * ===================================================================== */
        $scope.viewEmployee = function (employeeId) {
            console.log(employeeId);
            employeeCalls.detailEmployee(employeeId).then(
                function (res) {
                    detailedemployee = angular.copy(res.data);
                    console.dir(deletedemployee);
                    $scope.employeesTabset[employeeId] = {
                        active: true,
                        label: detailedemployee.FirstName + ' ' + detailedemployee.LastName,
                        view: 'modules/core/views/edit-item.client.view.html',
                        item: detailedemployee
                    };
                },
                function (err) {
                    console.error('Error viewing employee: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a employee from Mongo database
         * ===================================================================== */
        $scope.deleteItem = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.FirstName + ' ' + item.LastName,
                body : 'Are you sure you want to delete the employee, \'' + item.FirstName + ' ' + item.LastName + '?\''
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
                    employeeCalls.deleteEmployee({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedemployee = angular.copy(res.data);
                            $scope.deletedemployee = deletedemployee;
                            $scope.getEmployees();
                            $scope.removeTab(item.id);
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

