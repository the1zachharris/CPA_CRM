var employees = angular.module('employees',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad']);

employees.config([
        '$routeProvider',
        '$provide',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/employees',{
                    name: 'employees',
                    templateUrl:'modules/employees/views/home.employees.client.view.html',
                    label: 'employees',
                    controller: 'employeesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'employeesController',
                                files:[
                                    // Controllers
                                    'modules/employees/controllers/employees.client.controller.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]
                            });
                        }]
                    }
                })
                .when('/employees/create',{
                    name: 'employees',
                    templateUrl:'modules/core/views/create-item.client.view.html',
                    label: 'Create employees',
                    controller: 'employeesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'employeesController',
                                files:[
                                    'modules/employees/controllers/employees.client.controller.js'

                                    // Styles

                                ]
                            });
                        }]
                    }
                })
                .when('/employee/update/:id',{
                    name: 'employees',
                    templateUrl:'modules/core/views/edit-item.client.view.html',
                    label: 'Update employees',
                    controller: 'employeesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'employeesController',
                                files:[
                                    'modules/employees/controllers/employees.client.controller.js'

                                    // Styles

                                ]
                            });
                        }]
                    }
                })

        }
    ]
);

employees.factory('employeeCalls', function($http,$log, $routeParams) {
    console.log("in employeeCalls factory");
    var employeesMasterService = {
        getEmployees: function(req){
            var promise = $http({
                method: 'GET',
                url: '/employees/list',
                params : req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        detailEmployee: function(itemid){
            var promise = $http({
                method: 'GET',
                url: '/employee/detail/' + itemid
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        createEmployee: function(req){
            var promise = $http({
                method: 'POST',
                url: '/employee/create',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        updateEmployee: function(req){
            var promise = $http({
                method: 'POST',
                url: '/employee/update',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        deleteEmployee: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/employee/delete/' + req.id,
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return employeesMasterService;
});