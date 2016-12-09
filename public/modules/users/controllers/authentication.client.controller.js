'use strict';

//This block of code checks for the browser version, and if not IE9, injects Angular Material
var ua = window.navigator.userAgent;
var msie = ua.indexOf ( "MSIE " );
var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
if (IEVersion <= 9){
	//var d = document.getElementById("upgradewarn");
	//d.className = d.className + "show";
}

var users = angular.module('users',[]);

users.controller('AuthenticationController',
	[
		'$scope',
		'$http',
		'$log',
		'$location',
		'$rootScope',
	function(
		$scope,
		$http,
		$log,
		$location,
		$rootScope) {

		//This block of code checks for the browser version, and if not IE9, injects Angular Material
		var ua = window.navigator.userAgent;
		//var $scope.showUA = true;
		console.dir(ua);
		var msie = ua.indexOf ( "MSIE " );
		var IEVersion =  parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
		if (IEVersion <= 9){
			$scope.reqUpgrade = true;
		};

		$scope.showError = false;
		//$scope.error = "a Big fat error";

        $scope.needSignin = function() {
            console.log('in needSignin');
            $scope.showSignup = false;
            $scope.greeting = "Sign in to TrakkTask";
        };

		$scope.needSignup = function() {
		    console.log('in needSignup');
		    $scope.showSignup = true;
		    //$scope.signupNot = true;
		    $scope.greeting = "Sign up for TrakkTask";
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

            if ($scope.passMatch(newUser.password, newUser.confirmPassword)){
                $http.post(
                    '/signup',
                    newUser
                ).success(function(response) {
                    // If successful we assign the response to the global user model
                    $rootScope.user = response;
                    console.dir($rootScope.user);
                    // And redirect to the index page
                    $location.path('/myTasks');
                    location.reload();

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
		    $http.post('/auth/signin', credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$rootScope.user = response;
                console.dir($rootScope.user);
                // And redirect to the index page
                $location.path('/myTasks');
                location.reload();

			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.forgotPassword = function(){
			alert('Use your TT Credentials, if you have forgotten your password, contact support, we are working on a way for you to dynamically reset your password. Thank you for your patience in our Beta release period.');

		}
	}
]);
