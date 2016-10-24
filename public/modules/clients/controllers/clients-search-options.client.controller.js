/* ================================================================================
 * Search Options Controller
 * ================================================================================ */

'use strict';

angular
    .module('ticketsSearchOptions', [
        'ngAnimate',
        'ngMaterial'
    ])
    .controller('SearchOptionsController',
        function (
            $scope,
            $mdSidenav
        ) {
            $scope.close = function () {
                $mdSidenav('searchOptions').close()
                    .then(function () {
                        console.debug("close RIGHT is done");
                    });
            };
        }
    )
;