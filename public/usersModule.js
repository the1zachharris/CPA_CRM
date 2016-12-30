'use strict';

var users = angular.module('users',
    [
        'ngMaterial',
        'ngMaterialDatePicker',
        'ui.bootstrap',
        'angularMoment',
        'ngRoute',
        'oc.lazyLoad'
    ]);

users.config(
    ['$routeProvider',
        '$controllerProvider',
        '$provide',
        function
            ($routeProvider,
             $ocLazyLoad) {
        $routeProvider
        /*
            .when('/manageusers',{
            name: 'Administrative Tools',
            templateUrl: 'modules/user/views/manage-users.client.view.html',
            controller: 'ManageUsersController',
            resolve: {
                loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ManageUsersController',
                        files:[
                            // controllers
                            'modules/user/controllers/manage-users.client.controller.js',

                            // Directives
                            'js/nsPopover/nsPopover.css',
                            'js/nsPopover/nsPopover.css.map',
                            'js/nsPopover/nsPopover.js',
                            'js/v-accordion-1.5.2/v-accordion.css',
                            'js/v-accordion-1.5.2/v-accordion.js',
                            'js/Angular-Paging/paging.min.js',

                            // styles
                            'modules/user/css/manage-users.client.styles.css',
                            'modules/core/css/datagrids.client.styles.css',
                            'modules/core/css/search.client.styles.css'
                        ]
                    });
                }]
            }
        })
        */
        .when('/',{
            name: 'login',
            templateUrl: '/modules/users/views/signin.client.view.html',
            label: 'Login',
            greeting: 'Please login below',
            controller: 'AuthenticationController'
        })
        .when('/login',{
            name: 'login',
            templateUrl: '/modules/users/views/signin.client.view.html',
            label: 'Login',
            greeting: 'Please login below',
            controller: 'AuthenticationController'
        })
        .when('/signup',{
            name: 'signup',
            templateUrl: '/modules/users/views/signup.client.view.html',
            label: 'Sign up',
            greeting: 'Sign up for TrakkTask',
            controller: 'AuthenticationController'
        })
        .when('/checkout',{
            name: 'checkout',
            templateUrl: '/modules/users/views/checkout.client.view.html',
            label: 'Checkout',
            greeting: 'Provide your billing information.',
            controller: 'AuthenticationController'
        })
        .when('/thankyou',{
            name: 'thankyou',
            templateUrl: '/modules/users/views/thankyou.client.view.html',
            label: 'Thank you',
            greeting: 'Your subscription has been created.',
            controller: 'AuthenticationController'
        })
}]);

users.factory('usersCalls', function($http,$log) {
    var usersService = {
        getUsers: function(req){
            var promise = $http({
                method: 'GET',
                url: '/users',
                params : req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getUser: function(req){
            var promise = $http({
                method: 'GET',
                url: '/userbyusername',
                params: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        saveUser: function(req){
            var promise = $http({
                method: 'POST',
                url: '/users',
                data: req
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        },
        getApps: function(req){
            var promise = $http({
                method: 'GET',
                url: '/applications'
            }).then(function (response) {
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return usersService;
});

//This block of code checks for the browser version, and if not IE9, injects Angular Material
var ua = window.navigator.userAgent;
var msie = ua.indexOf ( "MSIE " );
var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
if (IEVersion <= 9){
    //var d = document.getElementById("upgradewarn");
    //d.className = d.className + "show";
}

users.filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
            input.push(i);
        return input;
    };
});

users.controller('AuthenticationController',
    [
        '$scope',
        '$http',
        '$log',
        '$location',
        '$rootScope',
        'moment',
        '$route',
        '$routeParams',
        '$timeout',
        function(
            $scope,
            $http,
            $log,
            $location,
            $rootScope,
            moment,
            $route,
            $routeParams,
            $timeout) {

            //This block of code checks for the browser version, and if not IE9, injects Angular Material
            var ua = window.navigator.userAgent;
            //var $scope.showUA = true;
            //console.dir(ua);
            var msie = ua.indexOf ( "MSIE " );
            var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
            if (IEVersion <= 9){
                $scope.reqUpgrade = true;
            };

            $scope.today = new Date();

            $http.get('/provinces/US'
            ).success(function (states) {
                $scope.USStates = states;
                //console.dir($scope.USStates);
            });

            if (typeof $rootScope.newUser == 'undefined') {
                $rootScope.newUser = {};
            };
            console.log('$rootScope.newUser:' );
            console.dir($rootScope.newUser);

            $http.get('/subscriptions'
            ).success(function (response) {
                $scope.subscriptions = response;
                //console.dir($scope.subscriptions);
            });

            $scope.months = [
                '01',
                '02',
                '03',
                '04',
                '05',
                '06',
                '07',
                '08',
                '09',
                '10',
                '11',
                '12'];

            $scope.expYrStart = $scope.today.getFullYear();
            $scope.expYrEnd = $scope.today.getFullYear()+15;
            $scope.years = [];
            while ($scope.expYrStart < $scope.expYrEnd+1){
                $scope.years.push($scope.expYrStart++);
            };

            if (typeof $route.current !== 'undefined') {
                $scope.signupState = $route.current.name;
                console.log('we have a $route.current.name!');
                $scope.greeting = $route.current.greeting;
                console.log('state: ' + $scope.signupState + ' greeting: ' + $scope.greeting);

            } else {
                console.log('no routeParams');
                $scope.signupState = 'login';
                $scope.greeting = 'Please login below';
            };
            $scope.needSignup = function() {
                //console.log('in needSignup');
                $location.path('/signup');
                $scope.signupState = 'signup';
                $scope.showError = false;
                delete $scope.error;
                $scope.greeting = "Sign into TrakkTask";
            };

            $scope.needCheckout = function(message) {
                //console.log('in needCheckout');
                $location.path('/checkout');
                $scope.signupState = 'checkout';
                //$scope.signupNot = true;
                $scope.greeting = "Provide your billing information.";
                if (message){
                    $scope.greeting = message + " " + $scope.greeting;
                }
            };

            $scope.passMatch = function(pw1, pw2) {
                //console.log('in passMatch');
                if (pw1 === pw2) {
                    console.log('match');
                    $scope.showError = false;
                    delete $scope.error;
                    return true
                }  else {
                    console.log('no match');
                    $scope.showError = true;
                    $scope.error = "Passwords have to match";
                    return false
                }
            };

            $scope.signup = function(newUser) {
                //console.log('insignup');
                //console.dir(newUser);
                delete $scope.error;

                if ($scope.passMatch(newUser.password, newUser.confirmPassword)){

                    console.dir(newUser.subscription);
                    newUser.subscription.status = 'Pending';
                    newUser.ua = ua;
                    newUser.subscription.refId = newUser.subscription.id;
                    $rootScope.newUser.subscription = newUser.subscription;
                    //add the user to the database

                    $http.post(
                        '/signup',
                        newUser
                    ).success(function(response) {
                        // If successful we assign the response to the global user model
                        $rootScope.user = response.user;
                        console.dir($rootScope.user);
                        /*
                         //save this bit for after checkout
                         // And redirect to the index page
                         $location.path('/myTasks');
                         location.reload();
                         */
                        $scope.needCheckout();
                    }).error(function(response) {
                        $scope.error = response.message;
                    });



                } else {
                    var noSignup = "could not complete signup because passwords do not match";
                    //console.log(noSignup);
                    alert(noSignup);
                }
            };

            $scope.signin = function(credentials) {
                //console.log('in signin');
                delete $scope.error;
                $http.post('/auth/signin', credentials)
                    .success(function(response) {
                        // If successful we assign the response to the global user model
                        $rootScope.user = response;
                        //console.dir($rootScope.user);
                        // And redirect to the index page
                        $location.path('/myTasks');
                        location.reload();
                    })
                    .error(function(response) {
                        //console.log('error with signing you in!');
                        if (response.checkout) {
                            $rootScope.user = response.user;
                            //$scope.newUser = response.user;
                            if (typeof $rootScope.newUser.address != 'undefined') {
                                $rootScope.newUser.Address = $rootScope.newUser.address.address1;
                                $rootScope.newUser.City = $rootScope.newUser.address.city;
                                $rootScope.newUser.State = $rootScope.newUser.address.state;
                                $rootScope.newUser.Zip = $rootScope.newUser.address.postalCode;
                            };
                            $rootScope.newUser.ua = ua;
                            console.dir($rootScope.newUser);
                            //console.dir($rootScope.user);
                            $scope.needCheckout(response.message);
                        } else {
                            $scope.showError = true;
                            $scope.error = response.message;
                        }
                    });
            };

            $scope.checkout = function (newUser) {
                //console.log('in checkout');
                delete $scope.error;
                newUser.address = {
                    "address1": newUser.Address,
                    "city": newUser.City,
                    "state": newUser.State,
                    "postalCode": newUser.Zip,
                    //will need to change this if and when we go international
                    "country": "USA"
                };
                //console.dir(newUser);
                checkCard(newUser,
                    createSub(newUser,
                        function (passback) {
                            updateUser(
                                passback,
                                $scope.money()
                            )
                        }));
            };

            function createSub(newUser, callback) {
                var expMo = (newUser.expMo);
                expMo = expMo.toString();
                var expYr = (newUser.expYr);
                expYr = expYr.toString();
                var subExpDate = expYr +'-'+ expMo;
                newUser.subExpDate = subExpDate;
                //FIXME: add logic for start date to be + 1 month from today and do not use trial amount or trial occurances
                var myStart = moment().add(1, 'M');
                var myStart = moment(myStart).format('YYYY-MM-DD');
                //console.log(myStart);
                var subRequest = {
                    "ARBCreateSubscriptionRequest": {
                        "subscription": {
                            "name": newUser.subscription.description,
                            "paymentSchedule": {
                                "interval": {
                                    "length": newUser.subscription.interval,
                                    "unit": newUser.subscription.unit
                                },
                                "startDate": myStart,
                                "totalOccurrences": newUser.subscription.totalOccurrences
                                //"trialOccurrences": newUser.subscription.trialOccurrences
                            },
                            "amount": newUser.subscription.amount,
                            //"trialAmount": newUser.subscription.trialAmount,
                            "payment": {
                                "creditCard": {
                                    "cardNumber": newUser.cardNumber,
                                    "expirationDate": newUser.subExpDate
                                }
                            },
                            "billTo": {
                                "firstName": newUser.firstName,
                                "lastName": newUser.lastName,
                                //"email": newUser.email,
                                "company": newUser.companyName,
                                "address": newUser.Address,
                                "city": newUser.City,
                                "state": newUser.State,
                                "zip": newUser.Zip,
                                "country": "USA"
                            }
                        }
                    }
                };
                console.dir(subRequest);
                $http.post('/subscription/new', subRequest)
                    .success(function (sub) {
                        var subResponseCode = sub.messages.resultCode;
                        var subResponseMessageCode = sub.messages.message[0].code;
                        var subResponseMessageText = sub.messages.message[0].text;
                        if (subResponseCode == 'Ok'){
                            //console.log('all is good log them in now');
                            newUser.subscription.status = 'Active';
                            //console.log('this is my new User: ');
                            //console.dir(newUser);
                            callback(newUser);
                        } else {
                            //console.log('there was a problem creating the subscription');
                            $scope.showError = true;
                            $scope.error = subResponseMessageText;
                        }
                    })
                    .error(function (subError) {
                        $scope.showError = true;
                        $scope.error = subError.message;
                    })
            }

            function checkCard(newUser, callback) {

                var expMo = (newUser.expMo);
                expMo = expMo.toString();
                //if (expMo.length < 2) { expMo = '0' + expMo}
                var expYr = (newUser.expYr);
                expYr = expYr.toString().slice(2);
                var expDate = expMo +''+ expYr;
                newUser.expDate = expDate;
                // /authCard
                var transRequest = {
                    "createTransactionRequest": {
                        "transactionRequest": {
                            "transactionType": "authOnlyTransaction",
                            "amount": newUser.subscription.amount,
                            "payment": {
                                "creditCard": {
                                    "cardNumber": newUser.cardNumber,
                                    "expirationDate": newUser.expDate,
                                    "cardCode": newUser.cardCode
                                }
                            },
                            "billTo": {
                                "firstName": newUser.firstName,
                                "lastName": newUser.lastName,
                                //"email": newUser.email,
                                "company": newUser.companyName,
                                "address": newUser.Address,
                                "city": newUser.City,
                                "state": newUser.State,
                                "zip": newUser.Zip,
                                "country": "USA"
                            }
                        }
                    }
                };
                $http.post('/authCard', transRequest)
                    .success(function (auth) {
                        //console.log('transRequest no error');
                        var responseCode = auth.transactionResponse.responseCode;
                        if (responseCode == 1) {
                            //console.log('authCard passed');
                            callback;
                        } else {
                            //console.log('authCard failed');
                            $scope.showError = true;
                            $scope.error = auth.transactionResponse.errors[0].errorText;
                        }
                    })
                    .error(function (error) {
                        $scope.showError = true;
                        $scope.error = error.message;
                    })
            }

            function updateUser(newUser, callback) {
                console.log('in updateUser');
                console.dir(newUser);
                $http.post('/updateUser', newUser)
                    .success(function (money) {
                        //console.log('client signed up and updated');
                        //console.dir(money);
                        //$rootScope.user = money.user;
                        callback;
                    })
                    .error(function (error) {
                        $scope.showError = true;
                        $scope.error = error.message;
                    })
            };

            $scope.money = function () {
                console.log('money');
                //TODO: send them to Thank you page for 10 seconds - the comments below are my first attempt and failure
                //$location.path('/thankyou');
                //$timeout(function () {
                    // And redirect to the index page
                    $location.path('/myTasks');
                    location.reload();
                //}), 10000;

            };

            $scope.forgotPassword = function(){
                alert('Use your TT Credentials, if you have forgotten your password, contact support, we are working on a way for you to dynamically reset your password. Thank you for your patience in our Beta release period.');

            }
        }
    ]);