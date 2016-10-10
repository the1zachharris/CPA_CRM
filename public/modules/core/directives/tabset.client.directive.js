/* =============================================================================================
 * this a re-usable tab pane that you can use
 * ============================================================================================= */

angular.module('opsConsoleLite').directive('ocltabs', function() {
    return {
        restrict : 'E',
        replace: true,
        scope : {
            tabs : '=tabs'
        },
        template :
            '<md-tabs md-dynamic-height md-border-bottom md-selected="selectedTab">' +
                '<md-tab ng-repeat="tab in tabs" disabled="tab.disabled">' +
                    '<md-tab-label>{{tab.label}}</md-tab-label>' +
                    '<md-tab-body>' +
                        '<md-card class="md-padding">' +
                            '<md-card-content class="md-padding">' +
                                '<h3 class="md-display-2"><span>{{tab.label}}</span></h3>' +
                                '<div layout-gt-sm="row">' +
                                    '<div layout-gt-sm="column" flex-gt-sm="25">' +

                                    '</div>' +
                                '</div>' +
                            '</md-card-content>' +
                        '</md-card>' +
                        '<div layout-gt-sm="row">' +
                            '<md-button aria-label="next" ng-click="nextTab()" disabled="">' +
                                'Next <i class="fa fa-2x fa-arrow-circle-right"></i>' +
                            '</md-button>' +
                        '</div>' +
                    '</md-tab-body>' +
                '</md-tab>' +
            '</md-tabs>'
    };
});