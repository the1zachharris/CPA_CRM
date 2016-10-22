'use strict';
var clients = angular.module('clients',[
   // 'taskMaster',
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


test.controller('MainController',[
    '$scope',
    '$http',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    '$sce',
    'authorization',
    'lodash',
    'methodCop',
    'uiGridConstants',
    'oclLog',
    'clientAssignCalls',
    'clientsSearchCalls',
    'clientsSettings',
    'AnalyticsService',
    function(
        $scope,
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce,
        authorization,
        lodash,
        methodCop,
        uiGridConstants,
        oclLog,
        clientAssignCalls,
        clientsSearchCalls,
        clientsSettings,
        asvc
    ){
    var tasks = "foo",
        clientTypes = "",
        employees = "",
        client = "",
        keyword = "",
        Name = "",
        Address1 = "",
        Address2 = "",
        City = "",
        StateProvince = "",
        PostalCode = "",
        Country = "",
        Phone = "",
        Email = "",
        Contacts = "",
        ResponsibleEmployee = "",
        Type = "",
        Tasks = "";
        /* =====================================================================
         * Get all tasks from Mongo database
         * ===================================================================== */
        $scope.getTasks = function () {

            clientCalls.getTasks({
            }).then(
                function (res) {
                    tasks = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting tasks: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all client types from Mongo database
         * ===================================================================== */
        $scope.getClientTypes = function () {

            clientCalls.getClientTypes({
            }).then(
                function (res) {
                    clientTypes = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting client types: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all employees from Mongo database
         * ===================================================================== */
        $scope.getEmployees = function () {

            clientCalls.getEmployees({
            }).then(
                function (res) {
                    employees = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting employees: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all clients from Mongo database
         * ===================================================================== */
        $scope.getClients = function () {

            clientCalls.getClients({
            }).then(
                function (res) {
                    employees = angular.copy(res.data);
                    console.dir(employees);
                },
                function (err) {
                    console.error('Error getting clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * search the clients through the Mongo database
         * ===================================================================== */
        $scope.clientSearch = function () {

            clientCalls.clientSearch({
                keyword: keyword
            }).then(
                function (res) {
                    client = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error searching clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new client
         * ===================================================================== */
        $scope.newClient = function () {

            clientCalls.newClient({
                Name: Name,
                Address1: Address1,
                Address2: Address2,
                City: City,
                StateProvince: StateProvince,
                PostalCode: PostalCode,
                Country: Country,
                Phone: Phone,
                Email: Email,
                Contacts: Contacts,
                ResponsibleEmployee: ResponsibleEmployee,
                Type: Type,
                Tasks: Tasks
            }).then(
                function (res) {
                    client = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error searching clients: ' + err.message);
                }
            );
        };

    }
    ]
        );



