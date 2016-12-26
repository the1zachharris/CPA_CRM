'use strict';

//This block of code checks for the browser version, and if not IE9, injects Angular Material
var ua = window.navigator.userAgent;
var msie = ua.indexOf ( "MSIE " );
var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
if (IEVersion <= 9){
	//var d = document.getElementById("upgradewarn");
	//d.className = d.className + "show";
}

var users = angular.module('users',
    [
        'ngMaterial',
        'ngMaterialDatePicker',
        'ui.bootstrap',
        'angularMoment'
    ]);

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
	function(
		$scope,
		$http,
		$log,
		$location,
		$rootScope,
        moment) {

		//This block of code checks for the browser version, and if not IE9, injects Angular Material
		var ua = window.navigator.userAgent;
		//var $scope.showUA = true;
		console.dir(ua);
		var msie = ua.indexOf ( "MSIE " );
		var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
		if (IEVersion <= 9){
			$scope.reqUpgrade = true;
		};

        $scope.today = new Date();

		$http.get('/provinces/US'
        ).success(function (states) {
           $scope.USStates = states;
           console.dir($scope.USStates);
        });

		$scope.newUser = {};

		$http.get('/subscriptions'
		).success(function (response) {
			$scope.subscriptions = response;
			console.dir($scope.subscriptions);
        });

		$scope.showError = false;
		//$scope.error = "a Big fat error";

        $scope.signupState = 'login';
        $scope.greeting = 'Please login below';
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
        $scope.years = [
            $scope.today.getFullYear(),
            $scope.today.getFullYear()+1,
            $scope.today.getFullYear()+2,
            $scope.today.getFullYear()+3,
            $scope.today.getFullYear()+4,
            $scope.today.getFullYear()+5,
            $scope.today.getFullYear()+6,
            $scope.today.getFullYear()+7,
            $scope.today.getFullYear()+8,
            $scope.today.getFullYear()+9,
            $scope.today.getFullYear()+10,
            $scope.today.getFullYear()+11,
            $scope.today.getFullYear()+12,
            $scope.today.getFullYear()+13,
            $scope.today.getFullYear()+14,
            $scope.today.getFullYear()+15
        ];

        $scope.needSignin = function() {
            console.log('in needSignin');
            $scope.signupState = 'login';
            $scope.greeting = "Sign up for TrakkTask";
        };

		$scope.needSignup = function() {
		    console.log('in needSignup');
            $scope.signupState = 'signup';
            $scope.showError = false;
            delete $scope.error;
		    $scope.greeting = "Sign into TrakkTask";
        };

        $scope.needCheckout = function(message) {
            console.log('in needCheckout');
            $scope.signupState = 'checkout';
            //$scope.signupNot = true;
            $scope.greeting = "Provide your billing information.";
            if (message){
            	$scope.greeting = message + " " + $scope.greeting;
			}
        };

		$scope.passMatch = function(pw1, pw2) {
		  console.log('in passMatch');
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
			console.log('insignup');
		    console.dir(newUser);
            delete $scope.error;

            if ($scope.passMatch(newUser.password, newUser.confirmPassword)){

                console.dir(newUser.subscription);
                    newUser.subscription.status = 'Pending';
                    newUser.ua = ua;
                    newUser.subscription.refId = newUser.subscription.id;
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
                console.log(noSignup);
                alert(noSignup);
            }
		};

		$scope.signin = function(credentials) {
			console.log('in signin');
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
                        $scope.newUser = response.user;
                        if (typeof $scope.newUser.address != 'undefined') {
                            $scope.newUser.Address = $scope.newUser.address.address1;
                            $scope.newUser.City = $scope.newUser.address.city;
                            $scope.newUser.State = $scope.newUser.address.state;
                            $scope.newUser.Zip = $scope.newUser.address.postalCode;
                        };
                        $scope.newUser.ua = ua;
                        console.dir($scope.newUser);
                        console.dir($rootScope.user);
                        $scope.needCheckout(response.message);
					} else {
                        $scope.showError = true;
                        $scope.error = response.message;
					}
				});
		};

		$scope.checkout = function (newUser) {
            console.log('in checkout');
            delete $scope.error;
            newUser.address = {
                "address1": newUser.Address,
                "city": newUser.City,
                "state": newUser.State,
                "postalCode": newUser.Zip,
                //will need to change this if and when we go international
                "country": "USA"
            };
            console.dir(newUser);
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
            /*
             //error sample
             {
             "refId": "f0517b8ed80250c5438",
             "messages": {
             "resultCode": "Error",
             "message": [
             {
             "code": "E00012",
             "text": "You have submitted a duplicate of Subscription 4330299. A duplicate subscription will not be created."
             }
             ]
             }
             }
             //success sample
             {
             "subscriptionId": "4331178",
             "profile": {
             "customerProfileId": "1808394980",
             "customerPaymentProfileId": "1803253949"
             },
             "refId": "16b1f0b05f3d3e27f9c",
             "messages": {
             "resultCode": "Ok",
             "message": [
             {
             "code": "I00001",
             "text": "Successful."
             }
             ]
             }
             }
             */
		    // /subscription/new

            /*
             {
                 "ARBCreateSubscriptionRequest": {
                     "subscription": {
                         "name": "Testing subscription",
                         "paymentSchedule": {
                             "interval": {
                                 "length": "1",
                                 "unit": "months"
                             },
                         "startDate": "2016-12-25",
                         "totalOccurrences": "12",
                         "trialOccurrences": "1"
                     },
                     "amount": "18.22",
                     "trialAmount": "13.01",
                     "payment": {
                         "creditCard": {
                             "cardNumber": "4111111111111111",
                             "expirationDate": "2020-12"
                         }
                     },
                     "billTo": {
                         "firstName": "happty",
                         "lastName": "Glen"
                        }
                     }
                 }
             }
             */
            var expMo = (newUser.expMo);
            expMo = expMo.toString();
            var expYr = (newUser.expYr);
            expYr = expYr.toString();
            var subExpDate = expYr +'-'+ expMo;
            newUser.subExpDate = subExpDate;
            //FIXME: add logic for start date to be + 1 month from today and do not use trial amount or trial occurances
            var myStart = moment().add(1, 'M');
            var myStart = moment(myStart).format('YYYY-MM-DD');
            console.log(myStart);
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
                        console.log('all is good log them in now');
                        newUser.subscription.status = 'Active';
                        console.log('this is my new User: ');
                        console.dir(newUser);
                        callback(newUser);
                    } else {
                        console.log('there was a problem creating the subscription');
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
                    console.log('transRequest no error');
                    var responseCode = auth.transactionResponse.responseCode;
                    if (responseCode == 1) {
                        console.log('authCard passed');
                        callback;
                    } else {
                        console.log('authCard failed');
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

            $http.post('/updateUser', newUser)
            .success(function (money) {
                console.log('client signed up and updated');
                console.dir(money);
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
            // And redirect to the index page
            $location.path('/myTasks');
            location.reload();
        };

		$scope.forgotPassword = function(){
			alert('Use your TT Credentials, if you have forgotten your password, contact support, we are working on a way for you to dynamically reset your password. Thank you for your patience in our Beta release period.');

		}
	}
]);
