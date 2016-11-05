var applications = angular.module('applications',['ngRoute','oc.lazyLoad']);
    applications.config(['$routeProvider',
        '$controllerProvider',
        '$provide',
        function (
            $routeProvider,
            $ocLazyLoad
        ) {
        $routeProvider
            .when('/applications/create', {
                name: 'Applications',
                templateUrl: 'modules/applications/views/create-application.client.view.html',
                controller: 'ApplicationsController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'ApplicationsController',
                            files:[
                                // Controllers
                                'modules/applications/controllers/applications.client.controller.js',

                                // Modules
                                '',

                                // Styles
                                'css/ui-iconpicker.min.css',
                                'modules/applications/css/app-create.client.styles.css'
                            ]});
                    }]
                }
            })
            .when('/applications/:applicationId', {
                name: 'Applications',
                templateUrl: 'modules/applications/views/view-application.client.view.html',
                controller: 'ApplicationsController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                                name: 'ApplicationsController',
                                files:[
                                    // Controllers
                                    'modules/applications/controllers/applications.client.controller.js',

                                    // Styles
                                    'modules/applications/css/app-manage.client.styles.css'
                                ]}
                        );
                    }]
                }
            })
            .when('/applications/:applicationId/edit', {
                name: 'Applications',
                templateUrl: 'modules/applications/views/edit-application.client.view.html',
                controller: 'ApplicationsController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                                name: 'ApplicationsController',
                                files:[
                                    'modules/applications/controllers/applications.client.controller.js'
                                ]}
                        );
                    }]
                }
            })
            .when('/applications',{
                name: 'Applications',
                templateUrl:'modules/applications/views/list-applications.client.view.html',
                controller: 'ApplicationsController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                                name: 'ApplicationsController',
                                files:[
                                    'modules/applications/controllers/applications.client.controller.js'
                                ]}
                        );
                    }]
                }
            })
    }]);
