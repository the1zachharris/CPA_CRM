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
                    templateUrl:'modules/tasks/views/list.tasks.view.html',
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
                .when('/task/update/:taskid',{
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
        detailTask: function(){
            var promise = $http({
                method: 'GET',
                url: '/task/detail/' + $routeParams.taskid
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
        deleteTask: function(req){
            var promise = $http({
                method: 'DELETE',
                url: '/task/delete/' + $routeParams.taskid,
                params: req
            }).then(function (response) {
                return response;
            });
            return promise;
        }
    };
    return taskMasterService;
});