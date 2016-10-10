/* =============================================================================================
 * this is a full-pane progress spinner that you can use to indicate 'processing, loading, etc.'
 * ============================================================================================= */

angular.module('opsConsoleLite').directive('spinner', function() {
    return {
        restrict : 'E',
        replace: true,
        scope : {
            show : '=show',
            text : '=text'
        },
        template :
        '<div class="spinner full-pane" ng-show="show">' +
        '<div class="well">' +
        '<i class="fa fa-circle-o-notch fa-spin fa-3x"></i>' +
        '<span>{{text}}</span>' +
        '</div>' +
        '</div>'
    };
});