var test = angular.module('test',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);

test.config([
    '$routeProvider',
    function (
        $routeProvider
    ) {
        $routeProvider
            .when('/test', {
                name: 'test',
                templateUrl: 'views/test.view.html',
                label: 'test',
                controller: 'testController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'testController',
                            files: [
                                // Controllers
                                'test.client.controller.js',

                                // Styles
                                'modules/core/css/datagrids.client.styles.css',
                                'modules/core/css/tabsets.client.styles.css',
                                'modules/core/css/search.client.styles.css',
                                'modules/clients/css/clients.client.styles.css',
                                'modules/clients/css/client-search.client.style.css',
                                'modules/clients/css/note.wizard.client.styles.css'
                            ]
                        });
                    }]
                }

            })
    }]);


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