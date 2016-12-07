'use strict';

//window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {

    //console.dir(errorObj);

    /*var msg = {
        TrakkTaskClientController : function(){ var app = url.split('/'); return app[app.length-1]},
        TrakkTaskClientLineNumber : lineNumber,
        TrakkTaskClientColumn : column,
        TrakkTaskClientMessage : errorMsg,
        TrakkTaskClientErrorObj : errorObj
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log('status logged to the server: ' + xhttp.responseText);
        }
    };*/
    //xhttp.open("POST", "/log");
    //xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //xhttp.send(JSON.stringify(msg));
//};

//var app = angular.module('opsConsoleLite', [
var app = angular.module('TrakkTask', [
    // Angular Plugins
    'ngRoute',
    'ngIdle',
    'oc.lazyLoad',
    'ui.bootstrap',
    'ngToast',
    'ngLodash',
    'ngAnimate',
    'ngMaterial',
    // 'ui.grid',
    'xeditable',

    // TrakkTask Application Modules
    'applications',
    'clients',
    'tasks',
    'employees',
    'clienttypes'
]);


app.config(['$routeProvider', '$controllerProvider', '$provide', function ($routeProvider, $ocLazyLoad) {
        $routeProvider
            .when('/myTasks',{
                templateUrl:'modules/core/views/masterTabset.view.html',
                controller: 'MainController',
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MainController',
                            files:[
                                // Controllers
                                'modules/clientTask/controllers/clientTask.client.controller.js',
                                'modules/clients/controllers/clients.client.controller.js',
                                'modules/tasks/controllers/tasks.client.controller.js',
                                'modules/clienttypes/controllers/clienttypes.client.controller.js',
                                'modules/employees/controllers/employees.client.controller.js',

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
            .otherwise({
                redirectTo: '/'
            });

    }])

    .config(['IdleProvider', function(IdleProvider) {
        IdleProvider.idle(43200); // 12 hours
        IdleProvider.timeout(120); // 2 minute warning
        IdleProvider.interrupt('keydown mousedown mousewheel DOMMouseScroll');
    }])

    .controller('TimeoutCtrl', function($scope, Idle, Keepalive, $modal){
        $scope.countdown = 120;

        function closeModals() {
            if ($scope.warning) {
                $scope.warning.close();
                $scope.warning = null;
            }

            if ($scope.timedout) {
                $scope.timedout.close();
                $scope.timedout = null;
            }
        }

        $scope.$on('IdleStart', function() {
            closeModals();
            $scope.warning = $modal.open({ templateUrl: 'warning-dialog.html', windowClass: 'modal-danger' });
        });

        $scope.$on('IdleEnd', function() {
            closeModals();
        });

        $scope.$on('IdleTimeout', function() {
            window.location.href = '/auth/signout';
        });
    })

    .config(['ngToastProvider', function(ngToastProvider) {
        ngToastProvider.configure({
            animation: 'slide', // or 'fade'
            verticalPosition: 'bottom',
            horizontalPosition: 'left'
        });
    }]);

app.run(function(editableOptions,$http,$log,$rootScope,Idle,AnalyticsService){
    Idle.watch();
    editableOptions.theme = 'bs3';
    $http.get('/version')
        .then(function(res) {
            $rootScope.version = res.data.version;
            $rootScope.nodeVersion = res.data.nodeVersion;
            $rootScope.gitBranch = res.data.gitBranch;
            $rootScope.gitCommit = res.data.gitCommit;
        });
    $rootScope.userAgent = window.navigator.userAgent;
    $rootScope.ua = new UAParser().getResult();

});


app.controller('MainController', function (
    $scope,
    $ocLazyLoad,
    $rootScope,
    $http,
    $location,
    $modal,
    $log,
    $route,
    ngToast,
    authorization,
    $mdToast,
    $sce
) {

    //Build the tabset to run the navigation
    $scope.masterTabset = {
        tasksTab : {
            active: false,
            label: 'Tasks',
            view: 'modules/tasks/views/home.tasks.client.view.html',
            tabs: {}
        },
        clientTypeTab : {
            active: false,
            label: 'Client Types',
            view: 'modules/clienttypes/views/home.clienttypes.client.view.html',
            tabs: {}
        },
        employeesTab : {
            active: false,
            label: 'Employees',
            view: 'modules/employees/views/home.employees.client.view.html',
            tabs: {}
        },
        clientsTab : {
            active: true,
            label: 'Clients',
            view: 'modules/clients/views/home.clients.client.view.html',
            tabs: {}
        },
        clientTasksTab : {
            active: false,
            label: 'Client Tasks',
            view: 'modules/clientTask/views/home.clientTask.client.view.html',
            tabs: {}
        }
    };

    //This block of code checks for the browser version, and if not IE9, injects Angular Material
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );
    var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
    if (IEVersion > 9){
        angular.module('TrakkTask').requires.push('ngMaterial');
    }

    $scope.openModal = function (size) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'appModal',
            controller: 'ModalInstanceCtrl',
            scope: $scope,
            size: size
            // resolve: {}
        });
    };

    if ($location.path() === '/unauthorized') {
        $scope.modal = {
            title : 'Error',
            icon : 'hand-paper-o',
            body : 'You are not authorized to access this resource.'
        };
        $scope.openModal('sm');
    }

    $scope.nowDate = new Date();
    $scope.foo = "some string";

    // show toast indicating success
    $scope.createToast = function(item, action, myclass) {
        console.log("in create toast function");
        $scope.toast = ngToast.create({
            className: myclass,
            compileContent: true,
            content: $sce.trustAsHtml('<i class="fa fa-thumbs-o-up"></i><br>' + item + ' was successfully ' + action + '.'),
            dismissButton: true,
            dismissButtonHtml: '<md-button class="md-raised">OK</md-button>',
            dismissOnClick: true,
            dismissOnTimeout: true,
            timeout: 3 * 1000
        });
    };

    async.whilst(
        function () { return typeof $rootScope.user === 'undefined';},
        function (callback) {
            setTimeout(function () {
                callback(null, $rootScope.user);
            }, 500);
        },
        function (error,result) {
            angular.forEach($rootScope.user.auditHistory,function(key,value){
                key.actionTime =  new Date(key.actionTime);
                key.diffDate =	(($scope.nowDate.getTime() - key.actionTime.getTime())/1000)/60;

                switch (true){
                    case (key.diffDate < 100):
                        key.interval = 'minutes';
                        break;
                    case (key.diffDate >= 100 && key.diffDate < 1440):
                        key.diffDate = key.diffDate / 60;
                        key.interval = 'hours';
                        break;
                    case (key.diffDate >= 1440):
                        key.diffDate = key.diffDate / 1440;
                        key.interval = 'days';
                        break;
                }
            });
            $scope.aHistory = $rootScope.user.auditHistory;
            $scope.roles = $rootScope.user.roles;
            $scope.TrakkTaskMenu = $rootScope.TrakkTaskMenu;
        }
    );
});


// authorization service
app.factory(
    'authorization',
    function (
        $http,
        $rootScope,
        methodCop,
        TrakkTaskLog
    ) {
        try {
            var authService = {
                check: function (myApp,myPerm,redirect,endCallback) {

                    try {
                        if (methodCop.check([
                                async,
                                myApp,
                                myPerm
                            ])) {
                            async.whilst(
                                function () {
                                    return typeof $rootScope.user === 'undefined';
                                },
                                function (callback) {
                                    setTimeout(function () {
                                        callback(null, $rootScope.user);
                                    }, 250);
                                },
                                function (err, res) {
                                    $http({
                                        method: 'GET',
                                        url: '/isclientauthorized',
                                        params: {
                                            app: encodeURIComponent(myApp),
                                            perm: encodeURIComponent(myPerm)
                                        }
                                    }).then(
                                        function (res) {
                                            console.info($rootScope.user.username + ' has authorization for ' + myApp + " in the app " + myPerm);
                                            if (methodCop.check([endCallback])) {
                                                if (methodCop.check([res])) {
                                                    endCallback(true);
                                                } else {
                                                    console.error('error', 'There was an error with the response while trying to check authorization: ' + res);
                                                    TrakkTaskLog.log('error', 'There was an error with the response while trying to check authorization: ' + res);
                                                    endCallback(null,'There was an error with the response when checking for authorization: ' + res);
                                                }
                                            } else {
                                                console.info('There was an error with the callback or there was no callback specified when checking for authorization.');
                                            }
                                        },
                                        function (rej) {
                                            // if we need to redirect, we'll do so
                                            if (redirect) {
                                                console.warn($rootScope.user.username + ' DOES NOT have authorization for ' + myApp + ':' + myPerm + '. We are redirecting them to safety.');
                                                window.location = '/#/unauthorized';
                                            }
                                            // no redirect, we need to use the callback
                                            else {
                                                console.warn($rootScope.user.username + ' DOES NOT have authorization for ' + myApp + ':' + myPerm + '.');
                                                if (methodCop.check([endCallback])) {
                                                    if (methodCop.check([rej])) {
                                                        endCallback(false);
                                                    } else {
                                                        console.error('error', 'There was an error with the response while trying to check authorization: ' + rej);
                                                        TrakkTaskLog.log('error', 'There was an error with the response while trying to check authorization: ' + rej);
                                                        endCallback(null,'The check for authorization was rejected while trying to check authorization: ' + rej);
                                                    }
                                                } else {
                                                    console.error('There was an error with the callback or a callback was not specified when checking for authorization.');
                                                }
                                            }
                                        }
                                    );
                                }
                            );
                        } else {
                            authService.check(myApp, myPerm, redirect, callback);
                        }
                    }
                    catch (err) {
                        console.error('error','There was an error while trying to check for authorization: ' + err.message);
                        TrakkTaskLog.log('error','There was an error while trying to check for authorization: ' + err.message);
                    }
                }
            }
        }

        catch (err) {
            console.error('error','There was an error while trying to initialize the authorization service: ' + err.message);
            TrakkTaskLog.log('error','There was an error while trying to initialize the authorization service: ' + err.message);
        }
        return authService;
    }
);

// server logging service
app.factory('TrakkTaskLog', ['$http', '$log', function ($http, $log) {
    this.error = function(message) {
        this.log('ERROR', message);
    };

    this.log = function (type, message) {
        $http({
            method: 'POST',
            url: '/log',
            data : {
                type : type,
                message : message
            }
        });
    };

    return this;
}]);


// null and undefined checking service
app.factory('methodCop', function ($http) {
    this.check = function (requiredItemsArray, callback) {
        try {
            for (var r = 0; r < requiredItemsArray.length; r++) {
                // with or without callback, if there is a null or undefined, return false
                if (
                    ((requiredItemsArray[r] == null || typeof requiredItemsArray[r] === 'undefined' || requiredItemsArray[r] === '') && callback) ||
                    ((requiredItemsArray[r] == null || typeof requiredItemsArray[r] === 'undefined' || requiredItemsArray[r] === '') && !callback)
                ) {
                    return false;
                }
                // no callback, last item without failure
                else if (
                    r == requiredItemsArray.length - 1 &&
                    requiredItemsArray[r] != null &&
                    typeof requiredItemsArray[r] !== 'undefined' &&
                    requiredItemsArray[r] !== '' &&
                    !callback
                ) {
                    return true;
                }
                // with callback, last item without failure
                else if (
                    r == requiredItemsArray.length - 1 &&
                    requiredItemsArray[r] != null &&
                    typeof requiredItemsArray[r] !== 'undefined' &&
                    requiredItemsArray[r] !== '' &&
                    callback
                ) {
                    callback();
                }
            }
        }
        catch (err) {
            $http({
                method: 'POST',
                url: '/log',
                data : {
                    type : type,
                    message : err.message
                }
            });
            return err.message;
        }
    };
    return this;
});

app.factory('FeedbackService', ['$window', function($window) {
    var service = {};

    service.mailToUrl = function(data) {
        var subject = data.subject || 'Ops Console Lite Feedback';
        var body = '\n\n--' // Some space for the user to type
            + '\nVersion: v' + data.version
            + (data.gitBranch ? '\nGit: ' + data.gitBranch + '::' + data.gitCommit : '')
            + '\nUser: ' + data.userFullName + ' (' + data.username + ')'
            + '\nRoles: ' + formattedRoles(data.roles)
            + '\nBrowser: ' + data.ua.browser.name + ' v' + data.ua.browser.version + ' on ' + data.ua.os.name + ' ' + data.ua.os.version
            + '\nServer: ' + $window.location.hostname;

        var feedbackUrl = 'mailto:askMaud@trakktask.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

        return feedbackUrl;
    };

    return service;
}]);

app.factory('AnalyticsService', ['$http', '$rootScope', 'methodCop', 'TrakkTaskLog', function($http, $rootScope, methodCop, TrakkTaskLog) {
    var service = {};

    function waitForUser(fn) {
        async.whilst(
            function () { return typeof $rootScope.user === 'undefined';},
            function (callback) {
                setTimeout(function () { callback(null, $rootScope.user); }, 250);
            },
            fn
        );
    }

    service.createAnalytic = function(route, userAgent, user) {
        waitForUser(function() {
            try {
                $http.post('/analytic/create', {
                        route: route || $rootScope.currentRoute,
                        userAgent: userAgent || $rootScope.userAgent,
                        user: user || userSummary($rootScope.user)
                    })
                    .then(
                        function (res) {
                            $rootScope.currentAnalyticId = res.data.id;
                        },
                        function (res) {
                            TrakkTaskLog.log('error', 'There was an error calling the Create Analytic service: ' + res);
                        }
                    )
            }
            catch (err) {
                TrakkTaskLog.log('error', 'There was an error calling the Create Analytic service: ' + res);
            }
        });
    };

    service.addStep = function(functionName) {
        try {
            if (methodCop.check([ functionName ])) {
                $http.post('/analytic/addStep', {
                        id: $rootScope.currentAnalyticId,
                        step: {calledFunction: functionName}
                    })
                    .then(
                        function () { console.log($rootScope.currentAnalyticId, "wrote step", arguments); },
                        function (res) {
                            TrakkTaskLog.log('error', 'There was an error calling the Analytic Add Step service: ' + res);
                        }
                    )
            }
            else {
                TrakkTaskLog.log('error', 'Function name was not provided to the Analytic Add Step service: ' + res);
            }
        }
        catch (err) {
            TrakkTaskLog.log('error', 'There was an error calling the Analytic Add Step service: ' + res);
        }
    };

    return service;
}]);

/* ================================================================================================
 Controller for Header
 ================================================================================================ */

app.controller('HeaderController', ['$scope', '$modal', 'FeedbackService', HeaderController]);

function HeaderController($scope, $modal, feedbackService) {
    $scope.isCollapsed = false;

    $scope.toggleCollapsibleMenu = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        asvc.addStep('toggleCollapsibleMenu');
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
        $scope.isCollapsed = false;
    });

    $scope.emailTrakkTaskFeedback = function () {
        document.location.href = feedbackService.mailToUrl($scope);
        asvc.addStep('emailTrakkTaskFeedback');
    };

    $scope.openModal = function (size) {
        $modal.open({
            animation: true,
            templateUrl: 'aboutModal',
            controller: ['$scope', '$modalInstance', 'FeedbackService', AboutModalController],
            scope: $scope,
            size: size
        });
    };
}

function AboutModalController($scope, $modalInstance, feedbackService) {
    $scope.emailTrakkTaskFeedback = function () {
        document.location.href = feedbackService.mailToUrl($scope);
        $scope.close();
    };

    $scope.roles = formattedRoles($scope.user.roles);

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}

function formattedRoles(roles) {
    return '[' + _.map(roles, function(role) { return role.appName + ': ' + role.name; }).join('] [') + ']';
}

/* ================================================================================================
 Controller for Main Menu
 ================================================================================================ */

app.controller('MenuController', [
    '$scope',
    '$rootScope',
    '$route',
    '$http',
    '$log',
    '$location',

    function(
        $scope,
        $rootScope,
        $route,
        $http,
        $log,
        $location
    ) {
        //TODO: add a function that can use this sort of thing that will run everytime any other function is called
        // and also capture anytime the path changes as a new record for auditing
        var ua = window.navigator.userAgent;

        $scope.isCollapsed = false;

        $scope.toggleCollapsibleMenu = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        // Collapsing the menu after navigation
        $scope.$on('$stateChangeSuccess', function() {
            $scope.isCollapsed = false;
        });

        // gets current route name to use in menu
        $scope.currentRouteName = $route.current.$$route.name;

        $scope.openPage = function (pageName) {
            console.log(pageName);
            $location.path(pageName.replace(/#/, ''));
        };

        // reveals the main menu and opens the drawer
        $scope.showMainMenu = function(e) {
            var elMenu = angular.element( document.querySelector( 'nav.mainmenu' ));
            var elMenuAct = angular.element( document.querySelector( 'nav.mainmenu span.expander i' ));
            var elContainer = angular.element( document.querySelector( 'body > div.content.container-fluid' ));

            elMenu.toggleClass('show');
            elMenuAct.toggleClass('fa-backward');
            elMenuAct.toggleClass('fa-forward');
            elContainer.toggleClass('menuopen');

            // $scope.leftVisible = true;
            e.stopPropagation();
        };

        // load TrakkTaskMenu once it becomes available
        async.whilst(
            function () { return typeof $rootScope.TrakkTaskMenu === 'undefined';},
            function (callback) {
                setTimeout(function () {
                    callback(null, $rootScope.TrakkTaskMenu);
                }, 500);
            },
            function (error,result) {
                $scope.TrakkTaskMenu = $rootScope.TrakkTaskMenu;
                angular.forEach($scope.TrakkTaskMenu, function (mV,mK) {
                    if ($scope.currentRouteName == mV.name) {
                        mV.open = true;
                    } else {
                        mV.open = false;
                    }
                });
            }
        );

    }
]);



/* ================================================================================
 Modal Controller for home/dashboard
 * ================================================================================ */
app.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        // $log.info('We are canceling...');
        $modalInstance.dismiss('cancel');
    };
    $scope.confirm = function () {
        //$log.info('We are confirming...');
        $modalInstance.close();
    };

});

app.config(['ngToastProvider', function(ngToastProvider) {
    ngToastProvider.configure({
        animation: 'slide', // or 'fade'
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
    });
}]);

/* MD Theming and Color Customizations ================================================ */
app.config(function ($mdThemingProvider) {


    $mdThemingProvider.definePalette('TrakkTaskMDPalette', {
        '50': 'D1EEFF',
        '100': 'B2D7ED',
        '200': '7BBCE0',
        '300': 'DBB726', // warn, accent
        '400': 'FFF799', // accent
        '500': '3EA1DA',
        '600': '3EA1DA', // buttons-primary
        '700': 'ccc',
        '800': 'DBB726', // warn accent
        '900': '213164',
        'A100': 'C90449', // warn
        'A200': 'ccc',
        'A400': 'ccc',
        'A700': 'ccc',

        // whether, by default, text (contrast) on this palette should be dark or light
        'contrastDefaultColor': 'light',

        //hues which contrast should be 'dark' by default
        'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100'],

        // could also specify this if default was 'dark'
        'contrastLightColors': undefined
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('TrakkTaskMDPalette')
        .accentPalette('red');

    /*
     $mdThemingProvider.theme('default')
     .primaryPalette('blue')
     .accentPalette('red');
     */

});

function userSummary(user) {
    return {
        "displayName" : user.displayName,
        "username" : user.username,
        "groups" : user.groups,
        "roles" : user.roles,
        "email" : user.email,
        "lastName" : user.lastName,
        "firstName" : user.firstName,
        "department" : user.department
    };
}
