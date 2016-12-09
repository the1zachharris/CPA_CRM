'use strict';

var users = angular.module('users',[
    'bw.paging',
    'ngAnimate',
    'ngLodash',
    'ngMaterial',
    'nsPopover',
    'vAccordion'
]);
    users.controller( 'ManageUsersController', [
        '$scope',
        '$rootScope',
        '$location',
        '$log',
        '$http',
        '$modal',
        '$mdDialog',
        'authorization',
        'lodash',
        'methodCop',
        'ngToast',
        'oclLog',
        'usersCalls',
        function(
            $scope,
            $rootScope,
            $location,
            $log,
            $http,
            $modal,
            $mdDialog,
            authorization,
            lodash,
            methodCop,
            ngToast,
            oclLog,
            usersCalls
        ) {

            // user needs to be able to admin Users. if not, we'll redirect them to safety
            try {
                authorization.check('Administrative Tools','User to Role',true);
            }
            catch (err) {
                // log error to Splunk
                oclLog.log('error','There was an error when trying to check for authorization to use OCL-User Manager: ' + err.message);
                console.error('There was an error when trying to check for authorization to use OCL-User Manager: ', err.message);

                // let's redirect the user because we can't determine if they have access or not
                $location.path = '/#/unauthorized';
            }

            // init vars
            var user;

            $scope.userSelected = false;
            $scope.usersQuery = ''; // default search query
            $scope.appAgg = '';
            $scope.roleAgg = '';
            $scope.usersQuerySkip = 0;
            $scope.usersQuerySort = 'displayName'; // default sort by display name

            // for paging
            $scope.currentPage = 1;
            $scope.pageForQuery = 1;
            $scope.pageStartCount = 0;
            $scope.pageEndCount = 0;
            $scope.paginationMax = 7;
            $scope.usersQueryLimit = 25; // default value for users query limit
            $scope.usersQueryPageMax = [25,50,100,200]; // used for limiting users query

            $scope.searchInProgress = true;





            /* =====================================================================
             * Get applications list from database
             * ===================================================================== */
            $scope.getAppList = function () {
                try {
                    usersCalls.getApps({
                        method: 'GET',
                        url: '/applications'
                    }).then(
                        function (res) {
                            /*
                            angular.forEach(data, function (app) {
                                // app.open = false;
                                 angular.forEach(app.roles, function( rol ){
                                 rol.roleID = rol.id;
                                 rol.appName = app.name;
                                 });
                            });
                            */
                            $scope.authority = res.data;
                        },
                        function (err) {
                            $scope.error = 'Error getting applications, ' + err.message;
                            $mdDialog.show(
                                $mdDialog
                                    .alert()
                                    .parent(angular.element(document.querySelector('body#OCL')))
                                    .title('Error')
                                    .content('There was an error getting a list of applications from the server. Try refreshing your browser window. If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                                    .ariaLabel('Error Dialog')
                                    .ok('OK')
                                    .clickOutsideToClose(false)
                            );
                        }
                    );
                }
                catch (err) {
                    oclLog.log('error','Could not get field types and field validator types when initializing the field manager: ' + err.message);
                    console.error(err.message);
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .parent(angular.element(document.querySelector('body#OCL')))
                            .title('Error')
                            .content('There was an error getting applications from the server. Try refreshing your browser window. If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                            .ariaLabel('Error Dialog')
                            .ok('OK')
                            .clickOutsideToClose(false)
                    );
                }
            };



            /* =====================================================================
             * Get user list from database
             * ===================================================================== */
            $scope.getUserList = function (query,appFilter,roleFilter) {
                try {
                    //reset results list
                    $scope.usrs = [];

                    $scope.searchInProgress = true;

                    // init GET param vars
                    var queryString,queryAppFilter,queryRoleFilter,pageForQuery;

                    // check if we have a specific query
                    if (methodCop.check([query])) {
                        queryString = query;
                    } else {
                        queryString = '';
                    }

                    // check if we have filters to use
                    if (methodCop.check([appFilter,roleFilter])) {
                        $scope.appAgg = queryAppFilter = appFilter;
                        $scope.roleAgg = queryRoleFilter = roleFilter;
                    } else {
                        queryAppFilter = '';
                        queryRoleFilter = '';
                    }

                    usersCalls.getUsers({
                        query: encodeURIComponent(queryString),
                        limit: encodeURIComponent($scope.usersQueryLimit),
                        skip: encodeURIComponent($scope.usersQueryLimit * ($scope.pageForQuery - 1)),
                        sort: encodeURIComponent($scope.usersQuerySort),
                        appFilter: encodeURIComponent(queryAppFilter),
                        roleFilter: encodeURIComponent(queryRoleFilter)
                    }).then(
                        function (res) {
                            $scope.usrs = angular.copy(res.data);

                            // do any formatting as needed
                            angular.forEach($scope.usrs.users, function (userValue,userKey) {
                                // group together roles by app
                                userValue.rolesByApp = lodash.chain(userValue.roles)
                                    .groupBy("appName")
                                    .pairs()
                                    .map(function(currentItem) {
                                        return lodash.object(lodash.zip(["name", "roles"], currentItem));
                                    })
                                    .value();

                                // add trackers for role switches in flyout menu in UI
                                $scope.setRolesForUser(userValue);

                                // delete userValue.roles;

                                // reformat date to readable value
                                userValue.created = moment(userValue.created).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                                userValue.loginTime = moment(userValue.loginTime).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                            });

                            $scope.searchInProgress = false;

                            // update paging counts
                            $scope.pageStartCount = ($scope.pageForQuery - 1) * parseInt($scope.usersQueryLimit) + 1;
                            $scope.pageEndCount = Math.min(
                                ((parseInt($scope.pageStartCount) + parseInt($scope.usersQueryLimit)) - 1),
                                parseInt($scope.usrs.count)
                            );
                            $scope.currentPage = $scope.pageForQuery;

                        },
                        function (err) {
                            $scope.searchInProgress = false;
                            oclLog.log('error','Error getting users: ' + err.message);
                            $scope.error = 'Error getting users, ' + err.message;
                            $mdDialog.show(
                                $mdDialog
                                    .alert()
                                    .parent(angular.element(document.querySelector('body#OCL')))
                                    .title('Error')
                                    .content('There was an error getting a list of users from the server. Try refreshing your browser window. If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                                    .ariaLabel('Error Dialog')
                                    .ok('OK')
                                    .clickOutsideToClose(false)
                            );
                        }
                    );

                }
                catch (err) {
                    $scope.searchInProgress = false;
                    console.error('Error getting users: ' + err.message);
                    oclLog.log('error','Error getting users: ' + err.message);
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .parent(angular.element(document.querySelector('body#OCL')))
                            .title('Error')
                            .content('There was an error getting a list of users from the server. Try refreshing your browser window. If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                            .ariaLabel('Error Dialog')
                            .ok('OK')
                            .clickOutsideToClose(false)
                    );
                }
            };




            /* =====================================================================
             * Pagination helpers
             * ===================================================================== */
            $scope.changePage = function (page) {
                try {
                    $scope.pageForQuery = page;
                    $scope.getUserList();
                }
                catch (err) {
                    console.error('There was an error trying to change pages: ' + err.message);
                    oclLog.log('error','There was an error trying to change pages: ' + err.message);
                }
            };





            /* =====================================================================
             * Reset search
             * ===================================================================== */
            $scope.resetSearch = function () {
                try {
                    $scope.usersQuery = '';

                    // perform new search
                    $scope.getUserList();
                }
                catch (err) {
                    $scope.searchInProgress = false;
                    console.error('Error resetting search: ' + err.message);
                    oclLog.log('error','Error resetting search: ' + err.message);
                }
            };




            /* =====================================================================
             * Get user get spec'd user from database
             * ===================================================================== */
            $scope.getUser = function (user) {
                try {
                    usersCalls.getUser({
                        username: encodeURIComponent(user.username)
                    }).then(
                        function (res) {
                            user = angular.copy(res.data);

                            user.rolesByApp = lodash.chain(user.roles)
                                .groupBy("appName")
                                .pairs()
                                .map(function (currentItem) {
                                    return lodash.object(lodash.zip(["name", "roles"], currentItem));
                                })
                                .value();

                            // add trackers for role switches in flyout menu in UI
                            $scope.setRolesForUser(user);

                            // reformat date to readable value
                            user.created = moment(user.created).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                            user.loginTime = moment(user.loginTime).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                        },
                        function (err) {
                            console.error('Error getting user details: ' + err.message);
                            oclLog.log('error', 'Error getting user details: ' + err.message);
                        }
                    );
                }
                catch (err) {
                    console.error('Error getting user details: ' + err.message);
                    oclLog.log('error', 'Error getting user details: ' + err.message);
                }
            };







            /* =====================================================================
             * Save user -- triggered every time a role is changed
             * ===================================================================== */
            $scope.saveUser = function(user){
                try {

                    user.roles = []; // reset the existing roles for the user

                    // then for each app inside our user

                    angular.forEach(user.roleStats, function (appVal,appKey) {
                        angular.forEach(appVal, function (roleVal,roleKey) {
                            // if this role in this loop is enabled,
                            if (roleVal.hasRole) {
                                // now that we have drilled down into our app>role,
                                // we need to find the same in $scope.authority which has ALL roles and perms
                                angular.forEach($scope.authority, function (aV,aK) {
                                    // for each role in app
                                    angular.forEach(aV.roles, function (rV,rK) {
                                        // then if the ID for this role is the same as the ID
                                        // push it into our roles array
                                        if (rV.id == roleVal.id) {
                                            user.roles.push({
                                                id : rV.id,
                                                name : rV.name,
                                                appName : aV.name,
                                                perms : rV.perms
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });

                    // remove dates for update since we changed the format
                    delete user.created;
                    delete user.loginTime;

                    usersCalls.saveUser({
                        updatedUser: user
                    }).then(  // Save user's updated roles, but their menu is still outdated
                        function (res) {
                            $scope.getUser(user); // refresh our user data
                            ngToast.create({
                                className: 'success',
                                content: ' The roles for <strong>' + user.displayName + '</strong> have been saved.'
                            });
                        },
                        function (err) {
                            $scope.getUser(user); // refresh our user data
                            $mdDialog.show(
                                $mdDialog
                                    .alert()
                                    .parent(angular.element(document.querySelector('body#OCL')))
                                    .title('Error')
                                    .content('There was an error saving changes to the user, "' + user.displayName + '". If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                                    .ariaLabel('Error Dialog')
                                    .ok('OK')
                                    .clickOutsideToClose(false)
                            );
                        }
                    );
                }
                catch (err) {
                    oclLog.log('error','Could not save user changes: ' + err.message);
                    console.error('Could not save user changes: ' + err.message);
                    $mdDialog.show(
                        $mdDialog
                            .alert()
                            .parent(angular.element(document.querySelector('body#OCL')))
                            .title('Error')
                            .content('There was an error saving changes to the user, "' + user.displayName + '". If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                            .ariaLabel('Error Dialog')
                            .ok('OK')
                            .clickOutsideToClose(false)
                    );
                }

            };










            ////////////////////////////////////
            $scope.setRolesForUser = function( usr ){
                try {
                    async.whilst(
                        function () { return typeof $scope.authority === 'undefined'; },
                        function (callback) {
                            setTimeout(function () {
                                callback(null, $scope.authority);
                            }, 100);
                        },
                        function (err, res) {
                            // copy over all roles to use for toggle tracking
                            angular.forEach($scope.authority, function (app) {

                                // if role property isn't set, let's set it
                                if (!methodCop.check([usr.roleStats])) {
                                    usr.roleStats = {};
                                }

                                // create app property
                                usr.roleStats[app.name] = {};

                                // add roles for the app and initially set role to false
                                angular.forEach(app.roles, function (roleValue, roleKey) {
                                    usr.roleStats[app.name][roleValue.name] = {
                                        id: roleValue.id,
                                        hasRole: false
                                    };
                                });
                            });

                            // now let's set the roles
                            if (methodCop.check([usr.roles])) {
                                // if the user has roles, let's add the ones they don't have and set the toggle var
                                if (usr.roles.length > 0) {
                                    // loop through all the current user's roles
                                    angular.forEach(usr.roles, function (uR) {
                                        // if application currently exists... there are some users that have legacy apps/roles
                                        if (methodCop.check([usr.roleStats[uR.appName]])) {
                                            usr.roleStats[uR.appName][uR.name].hasRole = true;
                                        }
                                    });
                                }
                            } else {
                                console.error('There was an error with the roles property for user ' + usr.username);
                                oclLog.log('error', 'There was an error with the roles property for user ' + usr.username);
                                // usr.roles = []; // Selected user currently doesn't have any roles.
                            }
                        }
                    );
                }
                catch (err) {
                    console.error('There was an error trying to parse the roles for user ' + usr.username + ': ' + err.message);
                    oclLog.log('error','There was an error with the roles property for user ' + usr.username + ': ' + err.message);
                }
            };




            /* ================================================================================
             Modal
             * ================================================================================ */
            $scope.openModal = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'appModal',
                    controller: 'ModalInstanceCtrl',
                    scope: $scope,
                    size: size
                    // resolve: {}
                });

                /*
                 modalInstance.result.then(function (selectedItem) {
                 $scope.selected = selectedItem;
                 }, function () {
                 $log.info('Modal dismissed at: ' + new Date());
                 });
                 */
            };

        }
    ]);

    /* ================================================================================
     Modal Controller
     * ================================================================================ */
    users.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

        $scope.cancel = function () {
            // $log.info('We are canceling...');
            $modalInstance.dismiss('cancel');
        };
        $scope.confirm = function () {
            //$log.info('We are confirming...');
            $modalInstance.close();
        };


    });
