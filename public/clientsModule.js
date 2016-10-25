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

var defaultTimeout = 10 * 1000;
console.log("in clients module");


clients.factory('clientCalls', function($http,$log) {
    console.log("in clientCalls factory");
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
    return taskMasterService;
});

clients.factory('notegroupCalls', function($http,$log) {
    var myNoteGroupService = {
        list: function() {
            var promise = $http({
                url: '/notegroups/list',
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function (error) {
                    $log.error(error);
                    return error;
                }
            );
            return promise;
        },
        createnotegroup: function(req){
            var promise = $http({
                url: '/notegroup/create',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            return promise;
        }

    };
    return myNoteGroupService;
});


clients.factory('clientsSearchCalls', function($http) {
    var somethingCalls = {
        deleteSavedSearch : function(searches) {
            var promise = $http({
                method: 'POST',
                url: '/clients/deleteSavedSearch',
                data : {
                    searches : searches
                }
            }).then(
                function (response) {
                    return response.data.searches;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getAllCaseTypesFromClarify : function(caseTxt) {
            var promise = $http({
                method: 'GET',
                url: '/clarifyLists/getAllCaseTypes',
                params : {
                    caseType : encodeURIComponent(caseTxt)
                }
            }).then(
                function (response) {
                    return response.data.values;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getCaseTypesFromClarify : function(caseTxt) {
            var promise = $http({
                method: 'GET',
                url: '/clarifyLists/getCaseTypes',
                params : {
                    caseType : encodeURIComponent(caseTxt)
                }
            }).then(
                function (response) {
                    return response.data.values;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getAllCaseSubTypesFromClarify: function(caseTypeTxt) {
            var promise = $http({
                method: 'GET',
                url: '/clarifyLists/getAllCaseSubTypes',
                params: {
                    caseType: encodeURIComponent(caseTypeTxt)
                }
            }).then(
                function (response) {
                    return response.data.values;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getCaseSubTypesFromClarify: function(caseTypeTxt,caseSubTypeTxt) {
            var promise = $http({
                method: 'GET',
                url: '/clarifyLists/getCaseSubTypes',
                params: {
                    caseType: encodeURIComponent(caseTypeTxt),
                    caseSubType : encodeURIComponent(caseSubTypeTxt)
                }
            }).then(
                function (response) {
                    return response.data.values;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getSavedSearches : function (req) {
            var promise = $http({
                method: 'GET',
                url: '/clients/getSavedSearches',
                params : req
            }).then(
                function (response) {
                    return response.data.searches;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getSeverityListFromClarify: function() {
            var promise = $http({
                method: 'GET',
                url: '/clarifyLists/getSeverityList'
            }).then(
                function (response) {
                    return response.data.values;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        },
        getWorkgroupsListFromClarify: function(req) {
            var promise = $http({
                url: '/clients/getWorkgroupsList',
                method: 'GET',
                params : req,
                timeout: defaultTimeout
            }).then(
                function (resp) {
                    return resp.data.workgroups;
                },
                function (err) {
                    return err;
                }
            );
            return promise;
        },
        saveSearch : function (type,criteria) {
            var promise = $http({
                method: 'POST',
                url: '/clients/saveSearch',
                data: {
                    type : type,
                    search : criteria
                },
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response.data.searches;
                },
                function (error) {
                    return error;
                }
            );
            return promise;
        }
    };
    return somethingCalls;
});

clients.factory('fieldCalls', function($http,$log) {
    var myFieldService = {
        list: function() {
            var promise = $http({
                url: '/notesfields',
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function (error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        read: function(fieldid){
            var promise = $http({
                url: '/notesfield/' + fieldid,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        checkname: function(name){
            var promise = $http({
                url: '/notesfield/name/' + name,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        query: function(req){
            var promise = $http({
                url: '/notesfields',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        notesfieldnames: function(req){
            var promise = $http({
                url: '/notesfieldnames',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        notesfieldsordered: function(req){
            var promise = $http({
                url: '/notesfieldsordered',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        deletefield: function(fieldid){
            var promise = $http({
                url: '/notesfield/' + fieldid,
                method: 'DELETE',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        updatefield: function(req){
            var promise = $http({
                url: '/notesfield/update',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        createfield: function(req){
            var promise = $http({
                url: '/notesfield/create',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        }
    };
    return myFieldService;
});


clients.factory('templateCalls', function($http,$log) {
    var myTemplateService = {
        list: function() {
            var promise = $http({
                url: '/notestemplates',
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function (error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        read: function(templateid){
            var promise = $http({
                url: '/notestemplate/' + templateid,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        templatenames: function(req){
            var promise = $http({
                url: '/notestemplates/names',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        completetemplate: function(templateid){
            var promise = $http({
                url: '/notestemplate/complete/' + templateid,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        deletetemplate: function(templateid){
            var promise = $http({
                url: '/notestemplate/' + templateid,
                method: 'DELETE',
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        updatetemplate: function(req){
            var promise = $http({
                url: '/notestemplate',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        },
        createtemplate: function(req){
            var promise = $http({
                url: '/notestemplate/create',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function(error) {
                    $log.error(error);
                    return error;
                }
            );
            // Return the promise to the controller
            return promise;
        }
    };
    return myTemplateService;
});


clients.factory('clientAssignCalls', function($http) {
    var clientAssignCallsService = {
        listUsers: function(req) {
            var promise = $http({
                url: '/clients/getMatchedUsers',
                params : req,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (resp) {
                    return resp.data.users;
                },
                function (err) {
                    return err;
                }
            );
            return promise;
        },
        listQueues: function(req) {
            var promise = $http({
                url: '/clients/getMatchedQueues',
                params : req,
                method: 'GET',
                timeout: defaultTimeout
            }).then(
                function (resp) {
                    return resp.data.queues;
                },
                function (err) {
                    return err;
                }
            );
            return promise;
        },
        assignclient: function(req){
            var promise = $http({
                url: '/clients/assignclient',
                method: 'GET',
                params: req,
                timeout: defaultTimeout
            }).then(
                function (resp) {
                    return resp;
                },
                function(err) {
                    return err;
                }
            );
            return promise;
        },
        dispatchclient: function(req){
            var promise = $http({
                url: '/clients/dispatchclient',
                method: 'GET',
                params: req,
                timeout: defaultTimeout
            }).then(
                function (resp) {
                    return resp;
                },
                function(err) {
                    return err;
                }
            );
            return promise;
        }
    };
    return clientAssignCallsService;
});

clients.factory('legacyUXcalls', function($http,$log) {
    var myLegacyUX = {
        createLegacyUx: function() {
            var promise = $http({
                url: '/legacyux/create',
                method: 'POST',
                data: req,
                timeout: defaultTimeout
            }).then(
                function (response) {
                    return response;
                },
                function (error) {
                    $log.error(error);
                    return error;
                }
            );
            return promise;
        }
    };
    return myNoteGroupService;
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
