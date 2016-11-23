var tasks = angular.module('tasks',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad']);

tasks.config([
        '$routeProvider',
    '$provide',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/tasks',{
                    name: 'tasks',
                    templateUrl:'modules/tasks/views/home.tasks.client.view.html',
                    label: 'tasks',
                    controller: 'tasksController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tasksController',
                                files:[
                                    // Controllers
                                    'modules/tasks/controllers/tasks.client.controller.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]});
                        }]
                    }

                })
                .when('/tasks/create',{
                    name: 'tasks',
                    templateUrl:'modules/tasks/views/create-tasks.client.view.html',
                    label: 'Create tasks',
                    controller: 'tasksController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tasksController',
                                files:[
                                    'modules/tasks/controllers/tasks.client.controller.js'

                                    // Styles

                                ]});
                        }]
                    }
                })
                .when('/task/update/:id',{
                    name: 'tasks',
                    templateUrl:'modules/tasks/views/edit-task.client.view.html',
                    label: 'Update tasks',
                    controller: 'tasksController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tasksController',
                                files:[
                                    'modules/tasks/controllers/tasks.client.controller.js'

                                    // Styles

                                ]});
                        }]
                    }
                })

        }
    ]
);

tasks.factory('taskCalls', function($http,$log, $routeParams) {
    console.log("in taskCalls factory");
    var taskMasterService = {
        getTasks: function(req){
            var promise = $http({
                method: 'GET',
                url: '/task/list',
                params : req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        detailTask: function(taskId){
            var promise = $http({
                method: 'GET',
                url: '/task/detail/' + taskId
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        createTask: function(req){
            console.dir(req);
            var promise = $http({
                method: 'POST',
                url: '/task/create',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        updateTask: function(req){
            var promise = $http({
                method: 'POST',
                url: '/task/update',
                data: req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        getFrequencies: function(req){
            var promise = $http({
                method: 'GET',
                url: '/frequency/list',
                params : req
            }).then(function (response) {
                return response;
            });
            return promise;
        },
        deleteTask: function(req){
            console.dir(req);
            var promise = $http({
                method: 'DELETE',
                url: '/task/delete/' + req.id,
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return taskMasterService;
});