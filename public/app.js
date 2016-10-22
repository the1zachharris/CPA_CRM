var myApp = angular.module('jacksApp', []);

myApp.controller('mainController', function($scope) {

    //This block of code checks for the browser version, and if not IE9, injects Angular Material
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );
    var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
    console.dir(ua);

    $scope.foo = function () {
        var boo = {
            animation: true,
            templateUrl: 'appModal',
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: 1
        };
        return boo;
    };
});