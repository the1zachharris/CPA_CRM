var clients = angular.module('clients',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);

clients.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/clients',{
                    name: 'clients',
                    templateUrl:'modules/clients/views/clients.view.html',
                    label: 'clients',
                    controller: 'clientsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clientsController',
                                files:[
                                    // Controllers
                                    'modules/clients/controllers/clients.client.controller.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css',
                                    'modules/clients/css/clients.client.styles.css',
                                    'modules/clients/css/client-search.client.style.css'
                                ]});
                        }]
                    }

                })
                .when('/clients/create',{
                    name: 'clients',
                    templateUrl:'modules/clients/views/create-clients.client.view.html',
                    label: 'Create client',
                    controller: 'clientCreateController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clientCreateController',
                                files:[
                                    'modules/clients/controllers/clients.create.client.controller.js',

                                    // Styles
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/clients/css/client-create.client.styles.css'
                                ]});
                        }]
                    }
                })

                .when('/clients/:clientID',{
                    name: 'clients',
                    templateUrl:'modules/clients/views/client.client.view.html',
                    label: 'clients',
                    controller: 'clientsController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clientsController',
                                files:[
                                    // Controllers
                                    'modules/clients/controllers/client.client.controller.js',

                                    // Styles
                                    'modules/clients/css/clients.client.styles.css',
                                    'modules/clients/css/client-search.client.style.css',
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]});
                        }]
                    }})
        }
    ]
);

var defaultTimeout = 10 * 1000;

clients.factory('clientCalls', function($http,$log, $routeParams) {
    console.log("in clientCalls factory");
    var clientsMasterService = {
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
            console.log('in getClients now');
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
                url: '/client/search',
                data: req
            }).then(function (response) {
                console.dir(response);
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
    return clientsMasterService;
});


// Get application settings from Mongo
clients.factory('clientsSettings', [
    '$http',
    'methodCop',
    function(
        $http,
        methodCop
    ) {
        return {
            get : function () {
                return $http({
                    method: 'GET',
                    url: '/applications/settings/clients'
                })
                    .then(
                        function (resp) {
                            if (methodCop.check([resp.data])) {
                                var settings = {
                                    name : resp.data.app[0].name // get name of app
                                };
                                angular.forEach(resp.data.app[0].settings, function (setting) {
                                    settings[setting.name] = setting.value; // get the settings for the app
                                });
                                return settings;
                            }
                        },
                        function (err) {
                            console.error('There was an error when trying to get clients settings: ' + err);
                            oclLog.log('error', 'There was an error when trying to get clients settings: ' + err);
                            return err;
                        }
                    );
            }
        }
    }
]);
