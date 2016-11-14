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
            updatedclienttype = "",
            detailedclienttype = "",
            deletedclienttype = "";

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name:'Type', field: 'type' },
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<a ng-href="#/clienttypes/update/{{row.entity.id}}"  aria-label="clienttypes Detail" class="md-mini"><i class="fa fa-info-circle"></i></a>',
                    enableSorting: false,
                    width: "60",
                    resizable: false,
                    pinnable: false
                }
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
        $scope.getClienttypes = function () {

            clienttypeCalls.getClienttypes({}).then(
                function (res) {
                    clienttypes = angular.copy(res.data);
                    $scope.clienttypes = clienttypes;
                    $scope.gridOptions.data = clienttypes;
                },
                function (err) {
                    console.error('Error getting Client Types: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new Client Type
         * ===================================================================== */
        $scope.createClienttype = function (newclienttype) {
            clienttypeCalls.createClienttype({
                type: newclienttype.type
            }).then(
                function (res) {
                    newclienttype = angular.copy(res.data);
                    $scope.newclienttype = {};
                    window.location.href ='#/clienttypes';
                },
                function (err) {
                    console.error('Error creating Client Type: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update Client Type
         * ===================================================================== */
        $scope.updateClienttype = function (detailedclienttype) {
            clienttypeCalls.updateClienttype({
                id: detailedclienttype.id,
                type: detailedclienttype.type
            }).then(
                function (res) {
                    updatedclienttype = angular.copy(res.data);
                    $scope.updatedclienttype = updatedclienttype;
                    window.location.href ='#/clienttypes';
                    console.dir(updatedclienttype);
                },
                function (err) {
                    console.error('Error updating Client Type: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view a Client Type
         * ===================================================================== */
        $scope.viewClienttype = function () {

            clienttypeCalls.detailClienttype().then(
                function (res) {
                    detailedclienttype = angular.copy(res.data);
                    $scope.detailedclienttype = detailedclienttype;
                    console.dir(detailedclienttype);
                },
                function (err) {
                    console.error('Error viewing Client Type: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a Client Type from Mongo database
         * ===================================================================== */
        $scope.deleteClienttype = function (detailedclienttype) {

            $scope.modal = {
                title : 'Delete ' + detailedclienttype.type,
                body : 'Are you sure you want to delete Client Type, \'' + detailedclienttype.type + '?\''
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
                    clienttypeCalls.deleteClienttype({
                        id: detailedclienttype.id,
                        type: detailedclienttype.type
                    }).then(
                        function (res) {
                            deletedclienttype = angular.copy(res.data);
                            $scope.deletedclienttype = deletedclienttype;
                            window.location.href ='#/clienttypes';
                        },
                        function (err) {
                            console.error('Error deleting Client Type: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete Client Type cancelled');
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