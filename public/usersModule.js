
var users = angular.module('users',[]);
users.config(['$routeProvider', '$controllerProvider', '$provide', function ($routeProvider, $ocLazyLoad) {
    $routeProvider
        .when('/manageusers',{
            name: 'Administrative Tools',
            templateUrl: 'modules/user/views/manage-users.client.view.html',
            controller: 'ManageUsersController',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ManageUsersController',
                        files:[
                            // controllers
                            'modules/user/controllers/manage-users.client.controller.js',

                            // Directives
                            'js/nsPopover/nsPopover.css',
                            'js/nsPopover/nsPopover.css.map',
                            'js/nsPopover/nsPopover.js',
                            'js/v-accordion-1.5.2/v-accordion.css',
                            'js/v-accordion-1.5.2/v-accordion.js',
                            'js/Angular-Paging/paging.min.js',

                            // styles
                            'modules/user/css/manage-users.client.styles.css',
                            'modules/core/css/datagrids.client.styles.css',
                            'modules/core/css/search.client.styles.css'
                        ]
                    });
                }]
            }
        })
}]);

users.factory('usersCalls', function($http,$log) {
    var usersService = {
        getUsers: function(req){
            var promise = $http({
                method: 'GET',
                url: '/users',
                params : req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getUser: function(req){
            var promise = $http({
                method: 'GET',
                url: '/userbyusername',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        saveUser: function(req){
            var promise = $http({
                method: 'POST',
                url: '/users',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getApps: function(req){
            var promise = $http({
                method: 'GET',
                url: '/applications'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return usersService;
});

