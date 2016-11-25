'use strict';
var clients = angular.module('clients',[
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


clients.controller('clientsController',[
    'clientCalls',
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
        clientCalls,
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

        $scope.appheader = 'Clients';
        $scope.tab = undefined;

        var clients = "",
            newclient = '',
            updatedclient = "",
            detailedclient = {},
            frequencies = "",
            deletedclient = "";

        //Build the tabset to run the CRUD for clients
        $scope.clientsTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.clientsTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.clientsTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewclient(itemId);
        };

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'client',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label: 'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: true},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: true}
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'client',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label: 'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: true},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: true}
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
                        '<md-button aria-label="Client Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
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
                { name: 'Type', field: 'Type'},
                { name:'Address', field: 'Address1' },
                { name:'Phone', field: 'Phone'},
                { name: 'Email', field: 'Email'}
            ],
            data : []
        };


        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.clients;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        /* =====================================================================
         * Get all clients from Mongo database
         * ===================================================================== */
        $scope.getClients = function () {

            clientCalls.getClients({}).then(
                function (res) {
                    clients = angular.copy(res.data);
                    $scope.clients = clients;
                    console.dir(clients);
                    $scope.gridOptions.data = clients;
                },
                function (err) {
                    console.error('Error getting clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new client
         * ===================================================================== */
        $scope.createItem = function (newclient) {
            console.log(newclient);
            clientCalls.newClient({
                Name: newclient.Name,
                Address1: newclient.Address1,
                Address2: newclient.Address2,
                City: newclient.City,
                StateProvince: newclient.StateProvince,
                PostalCode: newclient.PostalCode,
                Country: newclient.Country,
                Phone: newclient.Phone,
                Email: newclient.Email,
                ResponsibleEmployee: newclient.ResponsibleEmployee,
                Type: newclient.Type
            }).then(
                function (res) {
                    newclient = angular.copy(res.data);
                    $scope.newclient = {};
                    $scope.getClients();
                    //TODO: add toast message to notify user the record has been created

                    //window.location.href ='#/clients';
                    $scope.removeTab('createTab');
                },
                function (err) {
                    $scope.badclient = 'Error creating client: ' + JSON.stringify(err.data.message);
                    console.error('Error creating client: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update client
         * ===================================================================== */
        $scope.updateItem = function (detailedclient) {

            clientCalls.updateClient({
                id: detailedclient.id,
                Name: detailedclient.Name,
                Address1: detailedclient.Address1,
                Address2: detailedclient.Address2,
                City: detailedclient.City,
                StateProvince: detailedclient.StateProvince,
                PostalCode: detailedclient.PostalCode,
                Country: detailedclient.Country,
                Phone: detailedclient.Phone,
                Email: detailedclient.Email,
                ResponsibleEmployee: detailedclient.ResponsibleEmployee,
                Type: detailedclient.Type
            }).then(
                function (res) {
                    updatedclient = angular.copy(res.data);
                    $scope.updatedclient = updatedclient;
                    $scope.getClients();
                    //TODO: add toast message to notify user the record has been updated

                    //window.location.href ='#/clients';
                    $scope.removeTab(detailedclient.id);
                },
                function (err) {
                    console.error('Error updating client: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view client
         * ===================================================================== */
        $scope.viewclient = function (clientId) {
            console.log(clientId);
            clientCalls.detailclient(clientId).then(
                function (res) {
                    detailedclient = angular.copy(res.data);
                    console.dir(detailedclient);
                    $scope.clientsTabset[clientId] = {
                        active: true,
                        label: detailedclient.Name,
                        view: 'modules/core/views/edit-item.client.view.html',
                        item: detailedclient
                    };
                },
                function (err) {
                    console.error('Error viewing client: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a client from Mongo database
         * ===================================================================== */
        $scope.deleteItem = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.Name,
                body : 'Are you sure you want to delete the client, \'' + item.Name + '?\''
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
                    clientCalls.deleteClient({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedclient = angular.copy(res.data);
                            $scope.deletedclient = deletedclient;
                            $scope.getClients();
                            $scope.removeTab(item.id);
                        },
                        function (err) {
                            console.error('Error deleting client: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete client cancelled');
                }
            );
        };

        $scope.getFrequencies = function () {
            $scope.config = {
                optionLabel:'frequency'
            };
            clientCalls.getFrequencies({}).then(
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
