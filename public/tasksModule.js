var tasks = angular.module('tasks',[
    'angular-clipboard',
    'ngRoute',
    'ngMaterial',
    'oc.lazyLoad'
]);

tasks.config([
        '$routeProvider',
        function (
            $routeProvider
        ) {
            $routeProvider
                .when('/tasks',{
                    name: 'tasks',
                    templateUrl:'modules/clients/views/tasks.view.html',
                    label: 'tasks',
                    controller: 'tasksController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'tasksController',
                                files:[
                                    // Controllers
                                    'modules/clients/controllers/tasks.client.controller.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css',
                                    'modules/core/css/search.client.styles.css',
                                    'modules/clients/css/clients.client.styles.css',
                                    'modules/clients/css/client-search.client.style.css',
                                    'modules/clients/css/note.wizard.client.styles.css'
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
                .when('/clients/create/note/wizard',{
                    name: 'clients',
                    templateUrl:'modules/clients/views/note.wizard.client.view.html',
                    label: 'Create Note Wizard',
                    controller: 'clientCreateNoteWizardController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clientCreateNoteWizardController',
                                files:[
                                    // Controllers
                                    'modules/clients/controllers/note.wizard.client.controller.js',

                                    // Styles
                                    'modules/clients/css/note.wizard.client.styles.css'

                                    // Directives
                                    // 'modules/core/directives/tabset.client.directive.js'
                                ]});
                        }]
                    }
                })
                .when('/clients/monitor',{
                    name: 'Performance Health',
                    templateUrl: 'modules/clients/views/client-monitor.client.view.html',
                    label: 'clienting Monitor',
                    controller: 'clientingMonitorController',
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'clientingMonitorController',
                                files:[
                                    // Controllers
                                    'modules/clients/controllers/client-monitor.client.controller.js',
                                    'js/d3.js',
                                    'js/angular-charts.js',
                                    'js/jquery.js',

                                    // Directives
                                    'modules/core/directives/spinner.client.directive.js',
                                    'modules/clients/directives/scroller.client.directive.js',

                                    // Modules
                                    'js/angular-fullscreen.js',

                                    // Styles
                                    'modules/core/css/toggle.client.styles.css',
                                    'modules/core/css/spinner.client.styles.css',
                                    'modules/clients/css/client-monitor.client.styles.css'
                                ]});
                        }]
                    }
                })
                .when('/clients/fieldmanager',{
                    name: 'clients',
                    templateUrl : 'modules/clients/views/notes.fieldManager.client.view.html',
                    label : 'Field Manager',
                    controller : 'NotesFieldManagerController',
                    resolve : {
                        loadMyCtrl : ['$ocLazyLoad', function($ocLazyLoad){
                            return $ocLazyLoad.load({
                                name : 'NotesFieldManagerController',
                                files : [
                                    // Controllers
                                    'modules/clients/controllers/notes.fieldManager.client.controller.js',

                                    // Directives
                                    'js/nsPopover/nsPopover.css',
                                    'js/nsPopover/nsPopover.css.map',
                                    'js/nsPopover/nsPopover.js',

                                    // Styles
                                    'modules/clients/css/notes.fieldManager.client.styles.css',
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]
                            })
                        }]
                    }
                })
                .when('/clients/templatemanager/:templateID',{
                    name: 'clients',
                    templateUrl : 'modules/clients/views/notes.templateManager.client.view.html',
                    label : 'Field Manager',
                    controller : 'NotesTemplateManagerController',
                    resolve : {
                        loadMyCtrl : ['$ocLazyLoad', function($ocLazyLoad){
                            return $ocLazyLoad.load({
                                name : 'NotesTemplateManagerController',
                                files : [
                                    // Controllers
                                    'modules/clients/controllers/notes.templateManager.client.controller.js',

                                    // Directives
                                    'js/drag-and-drop-lists-1.4.0/angular-drag-and-drop-lists.css',
                                    'js/drag-and-drop-lists-1.4.0/angular-drag-and-drop-lists.js',
                                    'js/v-accordion-1.5.2/v-accordion.css',
                                    'js/v-accordion-1.5.2/v-accordion.js',
                                    'js/checklist-model.js',
                                    'js/nsPopover/nsPopover.css',
                                    'js/nsPopover/nsPopover.css.map',
                                    'js/nsPopover/nsPopover.js',

                                    // Styles
                                    'modules/clients/css/notes.templateManager.client.styles.css',
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]
                            })
                        }]
                    }
                })
                .when('/clients/templatemanager',{
                    name: 'clients',
                    templateUrl : 'modules/clients/views/notes.templateList.client.view.html',
                    label : 'Template Manager',
                    controller : 'NotesTemplateManagerController',
                    resolve : {
                        loadMyCtrl : ['$ocLazyLoad', function($ocLazyLoad){
                            return $ocLazyLoad.load({
                                name : 'NotesTemplateManagerController',
                                files : [
                                    // Controllers
                                    'modules/clients/controllers/notes.templateList.client.controller.js',

                                    // Directives
                                    'js/checklist-model.js',

                                    // Styles
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/clients/css/notes.templateList.client.styles.css',
                                    'modules/core/css/search.client.styles.css'
                                ]
                            })
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
                .when('/clients/subcase/:subcaseID',{
                    name: 'clients',
                    templateUrl:'modules/clients/views/client-subcase.client.view.html',
                    label:'Subcases',
                    controller: 'SubcaseController',
                    resolve:{
                        loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad){
                            return $ocLazyLoad.load({
                                name: 'SubcaseController',
                                files: [
                                    'modules/clients/controllers/client.subcase.client.controller.js',

                                    // Styles
                                    'modules/clients/css/clients.client.styles.css',
                                    'modules/clients/css/client-search.client.style.css',
                                    'modules/core/css/datagrids.client.styles.css',
                                    'modules/core/css/tabsets.client.styles.css'
                                ]
                            })
                        }]
                    }
                })
        }
    ]
);

console.log("in tasks module");


tasks.factory('taskCalls', function($http,$log) {
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
            // Return the promise to the controller
            return promise;
        },
        createTask: function(req){
            var promise = $http({
                method: 'POST',
                url: '/task/create',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        updateTask: function(req){
            var promise = $http({
                method: 'POST',
                url: '/task/update',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        deleteTask: function(req){
            var promise = $http({
                    method: 'DELETE',
                url: '/task/delete',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return taskMasterService;
});