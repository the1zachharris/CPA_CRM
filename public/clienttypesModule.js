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
                    templateUrl:'modules/clienttypes/views/home.clienttypes.client.view.html',
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
                    templateUrl:'modules/core/views/create-item.client.view.html',
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
                    templateUrl:'modules/core/views/edit-item.client.view.html',
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
        getClientTypes: function(req){
            var promise = $http({
                method: 'GET',
                url: '/clienttype/list',
                params : req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        detailClientType: function(itemid){
            var promise = $http({
                method: 'GET',
                url: '/clienttype/detail/' + itemid
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        createClientType: function(req){
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
        updateClientType: function(req){
            var promise = $http({
                method: 'POST',
                url: '/clienttype/update',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        deleteClientType: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/clienttype/delete/' + req.id,
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return clienttypeMasterService;
});