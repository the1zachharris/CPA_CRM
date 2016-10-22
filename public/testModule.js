var test = angular.module('test',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);




test.factory('clientCalls', function($http,$log) {
    var taskMasterService = {
        getTasks: function(req){
            var promise = $http({
                method: 'GET',
                url: '/task/list',
                params : req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getClientTypes: function(req){
            var promise = $http({
                method: 'GET',
                url: '/clienttype/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getEmployees: function(req){
            var promise = $http({
                method: 'GET',
                url: '/employee/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getClients: function(req){
            var promise = $http({
                method: 'GET',
                url: '/client/list',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        clientSearch: function(req){
            var promise = $http({
                method: 'POST',
                url: '/client/search'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        clientAdvSearch: function(req){
            var promise = $http({
                method: 'POST',
                url: '/client/advsearch'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        newClient: function(req){
            var promise = $http({
                method: 'POST',
                url: '/client/create'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateClient: function(req){
            var promise = $http({
                method: 'POST',
                url: '/client/update'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteClient: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/client/delete/:clientid'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return taskMasterService;
});