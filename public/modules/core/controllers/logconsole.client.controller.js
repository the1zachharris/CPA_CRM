'use strict';

angular.module('logConsole', ['ngAnimate','ngRoute'])
    .controller('LogConsoleController', ['$scope', '$http', function ($scope, $http) {

        //for drop down..'value' is based on the current log level
        $scope.log = {
            "type": "select",
            "name": "logLevel",
            "value": "",
            "values": ["ERROR", "DEBUG", "INFO", "WARN", "FATAL", "TRACE", "OFF"]
        };

        //set default tab index to 1
        this.tab = 1;

        //default client console to node 1
        $scope.node = {
            selected: '1'
        }

        this.setTab = function (tabId) {
            this.tab = tabId;
        };


        this.isSet = function (tabId) {
            return this.tab === tabId;
        };

        //default tab is the client log console screen
        $scope.initTabs = function () {
            this.tab
        };


        $scope.initClientLogConsole = function () {
            //load node 1 on init
            getNodeOneLogLevel();
        };


        $scope.toggleNodes = function (node) {
            if (node == '1') {
                getNodeOneLogLevel();
            } else {
                getNodeTwoLogLevel();
            }
        };

        function getNodeTwoLogLevel() {
            clearMessages();
            //Get Current Debug Level from Node 2
            var req = {
                method: 'GET',
                url: '/getLoggerLevelByNodeId/' + '2',
                headers: {
                    accept: 'application/json'
                }
            };

            $http(req).success(function (resp) {
                if (resp.message) {
                    updateView(resp.message);
                }
            }).error(function (err) {
                $scope.showClientErrorMessage = err;
            });

        };

        function getNodeOneLogLevel() {
            clearMessages()

            //Get Current Debug Level from Node 1
            var req = {
                method: 'GET',
                url: '/getLoggerLevelByNodeId/' + '1',
                headers: {
                    accept: 'application/json'
                }
            };
            $http(req).success(function (resp) {
                if (resp.message) {
                    updateView(resp.message);
                }
            }).error(function (err) {
                $scope.showClientErrorMessage = err;
            });
        }

        function updateView(message) {
            //display current log level
            $scope.log.logLevel = message;

            //Set Drop Down to match response message
            if (message.indexOf('ERROR') > -1) {
                $scope.log.value = 'ERROR';
            }
            if (message.indexOf('DEBUG') > -1) {
                $scope.log.value = 'DEBUG';
            }
            if (message.indexOf('INFO') > -1) {
                $scope.log.value = 'INFO';
            }
            if (message.indexOf('WARN') > -1) {
                $scope.log.value = 'WARN';
            }
            if (message.indexOf('FATAL') > -1) {
                $scope.log.value = 'FATAL';
            }
            if (message.indexOf('TRACE') > -1) {
                $scope.log.value = 'TRACE';
            }
            if (message.indexOf('OFF') > -1) {
                $scope.log.value = 'OFF'
            }
        };

        //pass back selected log level to node and update
        $scope.updateLogLevel = function (logLevelSelected) {
            var req = {
                method: 'GET',
                url: '/updateLoglevelByNodeId/' + logLevelSelected + '/' +  $scope.node.selected,
                headers: {
                    accept: 'application/json'
                }
            };

            $http(req).success(function (resp) {
                $scope.updateResponseMessage = resp.message;
                //initialize the screen
                updateView(resp.message);
                $scope.updateResponseMessage = resp.message;
            }).error(function (err) {
                $scope.showClientErrorMessage = err;
            });
        };

        //Make call to Node to get the correct env url
        $scope.initServerLogConsole = function () {
            var req = {
                method: 'GET',
                url: '/getLogConsoleServerURL',
                headers: {
                    accept: 'application/json'
                },
            };

            $http(req).success(function (resp) {
                document.getElementById('serverLogConsoleIframe').setAttribute('src', resp.message);
            }).error(function (err) {
                $scope.showServerErrorMessage = err;
            });
        }

        function clearMessages() {
            //clear any messages
            $scope.updateResponseMessage = null;
            $scope.errorMessage = null;
        }

    }]); //end controller