var clienttypes = angular.module('clienttypes',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad']);

clienttypes.config([
        '$routeProvider',
        '$provide',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/clienttypes',{
                    name: 'clienttypes',
                    templateUrl:'modules/clienttypes/views/list-clienttypes.client.view.html',
                    label: 'clienttypes',
                    controller: 'clienttypesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clienttypesController',
                                files:[
                                    // Controllers
                                    'modules/clienttypes/controllers/clienttypes.client.controller.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]});
                        }]
                    }

                })
                .when('/clienttypes/create',{
                    name: 'clienttypes',
                    templateUrl:'modules/clienttypes/views/create-clienttypes.client.view.html',
                    label: 'Create clienttypes',
                    controller: 'clienttypesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clienttypesController',
                                files:[
                                    'modules/clienttypes/controllers/clienttypes.client.controller.js'

                                    // Styles

                                ]});
                        }]
                    }
                })
                .when('/clienttypes/update/:id',{
                    name: 'clienttypes',
                    templateUrl:'modules/clienttypes/views/edit-clienttypes.client.view.html',
                    label: 'Update clienttypes',
                    controller: 'clienttypesController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clienttypesController',
                                files:[
                                    'modules/clienttypes/controllers/clienttypes.client.controller.js'

                                    // Styles

                                ]});
                        }]
                    }
                })

        }
    ]
);

clienttypes.factory('clienttypeCalls', function($http,$log, $routeParams) {
    console.log("in clienttypeCalls factory");
    var clienttypeMasterService = {
        getClienttypes: function(req){
            var promise = $http({
                method: 'GET',
                url: '/clienttype/list',
                params : req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        detailClienttype: function(){
            var promise = $http({
                method: 'GET',
                url: '/clienttype/detail/' + $routeParams.id
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        createClienttype: function(req){
            console.dir(req);
            var promise = $http({
                method: 'POST',
                url: '/clienttype/create',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        updateClienttype: function(req){
            var promise = $http({
                method: 'POST',
                url: '/clienttype/update',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        deleteClienttype: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/clienttype/delete/' + $routeParams.id,
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return clienttypeMasterService;
});