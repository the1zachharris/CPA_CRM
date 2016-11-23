'use strict';
var clienttypes = angular.module('clienttypes',[
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


clienttypes.controller('clienttypesController',[
    'clienttypeCalls',
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
        clienttypeCalls,
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

        $scope.appheader = 'Client Types';
        $scope.tab = undefined;

        var clienttypes = "",
            newClientType = '',
            updatedclienttype = "",
            detailedclienttype = {},
            deletedclienttype = "";

        //Build the tabset to run the CRUD for clienttypes
        $scope.clienttypesTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.clienttypesTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.clienttypesTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewClientType(itemId);
        };

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'Client Type',
            fields: [
              { label:'Type', field: 'type', required: true }
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'Client Type',
            fields: [
                { label:'Type', field: 'type', required: true }
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
                        '<md-button aria-label="Client Type Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                        + '<i class="glyphicon glyphicon-pencil"></i>'
                        + '<md-tooltip>{{row.entity.type}} Detail</md-tooltip>'
                        + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    height: 30,
                    pinnable: false
                },
                { name:'Type', field: 'type' }
            ],
            data : []
        };


        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.clienttypes;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        /* =====================================================================
         * Get all clienttypes from Mongo database
         * ===================================================================== */
        $scope.getclientTypes = function () {

            clienttypeCalls.getClientTypes({}).then(
                function (res) {
                    clienttypes = angular.copy(res.data);
                    $scope.clienttypes = clienttypes;
                    console.dir(clienttypes);
                    $scope.gridOptions.data = clienttypes;
                },
                function (err) {
                    console.error('Error getting clienttypes: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new clienttype
         * ===================================================================== */
        $scope.createItem = function (newclienttype) {
            console.log(newclienttype);
            clienttypeCalls.createClientType({
                type: newclienttype.type
            }).then(
                function (res) {
                    newClientType = angular.copy(res.data);
                    $scope.newclienttype = {};
                    $scope.getclientTypes();
                    //TODO: add toast message to notify user the record has been created

                    //window.location.href ='#/clienttypes';
                    $scope.removeTab('createTab');
                },
                function (err) {
                    $scope.badClientType = 'Error creating clienttype: ' + JSON.stringify(err.data.message);
                    console.error('Error creating clienttype: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update clienttype
         * ===================================================================== */
        $scope.updateItem = function (detailedclienttype) {
            clienttypeCalls.updateClientType({
                id: detailedclienttype.id,
                type: detailedclienttype.type
            }).then(
                function (res) {
                    updatedclienttype = angular.copy(res.data);
                    $scope.updatedclienttype = updatedclienttype;
                    $scope.getclientTypes();
                    //TODO: add toast message to notify user the record has been updated

                    //window.location.href ='#/clienttypes';
                    $scope.removeTab(detailedclienttype.id);
                },
                function (err) {
                    console.error('Error updating clienttype: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view clienttype
         * ===================================================================== */
        $scope.viewClientType = function (clienttypeId) {

            clienttypeCalls.detailClientType(clienttypeId).then(
                function (res) {
                    detailedclienttype = angular.copy(res.data);
                    $scope.clienttypesTabset[clienttypeId] = {
                        active: true,
                        label: detailedclienttype.type,
                        view: 'modules/core/views/edit-item.client.view.html',
                        item: detailedclienttype
                    };
                },
                function (err) {
                    console.error('Error viewing clienttype: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a clienttype from Mongo database
         * ===================================================================== */
        $scope.deleteItem = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.type,
                body : 'Are you sure you want to delete the clienttype, \'' + item.type + '?\''
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
                    clienttypeCalls.deleteClientType({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedclienttype = angular.copy(res.data);
                            $scope.deletedclienttype = deletedclienttype;
                            $scope.getclientTypes();
                            $scope.removeTab(item.id);
                        },
                        function (err) {
                            console.error('Error deleting clienttype: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete clienttype cancelled');
                }
            );
        };
    }
]);

/* ================================================================================
 Modal Controller
 * ================================================================================ */
clienttypes.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        // $log.info('We are canceling...');
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function () {
        //$log.info('We are confirming...');
        $modalInstance.close('closed');
    };


});