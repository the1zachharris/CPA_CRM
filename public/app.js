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
        //return boo;
    };
});

myApp.controller('MainController', function($scope) {

    var person = {
        firstName: "Logan",
        lastName: "Something",
        imageSrc: "http://static.srcdn.com/slir/w437-h273-q90-c437:273/wp-content/uploads/Tom-Hardy-Wolverine-Header-by-Bosslogic.jpg"

    };

    $scope.text = "Hello Angular!";
    $scope.person = person;
    console.dir(person);
});