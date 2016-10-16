'use strict';
var test = angular.module('test',[
    'taskMaster',
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


test.controller('testController',[
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
    ){}]);


