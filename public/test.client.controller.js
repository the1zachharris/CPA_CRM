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
    ){
        /* =====================================================================
         * Get user get spec'd user from database
         * ===================================================================== */
        $scope.getUser = function (user) {

            usersCalls.getUser({
                username: encodeURIComponent(user.username)
            }).then(
                function (res) {
                    user = angular.copy(res.data);

                    user.rolesByApp = lodash.chain(user.roles)
                        .groupBy("appName")
                        .pairs()
                        .map(function (currentItem) {
                            return lodash.object(lodash.zip(["name", "roles"], currentItem));
                        })
                        .value();

                    // add trackers for role switches in flyout menu in UI
                    $scope.setRolesForUser(user);

                    // reformat date to readable value
                    user.created = moment(user.created).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                    user.loginTime = moment(user.loginTime).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                },
                function (err) {
                    console.error('Error getting user details: ' + err.message);
                    oclLog.log('error', 'Error getting user details: ' + err.message);
                }
            );
        }

    }
    ]
        );


