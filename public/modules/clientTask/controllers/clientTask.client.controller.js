'use strict';
var clienttasks = angular.module('clienttasks',[
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.exporter',
    'ui.grid.resizeColumns',
    'ui.grid.cellNav',
    'ui.grid.autoResize',
    'ngAnimate',
    'ngLodash',
    'ngMaterial',
    'ngMaterialDatePicker',
    'ui.bootstrap',
    'gm.typeaheadDropdown'
]);


clienttasks.controller('clientTasksController',[
    'clientCalls',
    '$scope',
    '$http',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    '$sce',
    'lodash',
    'methodCop',
    'uiGridConstants',
    '$filter',
    '$modal',
    '$log',
    'moment',
    function (
        clientCalls,
        $scope,
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce,
        lodash,
        methodCop,
        uiGridConstants,
        $filter,
        $modal,
        $log,
        moment
    ) {
        var updatedclientTask = "",
            newClientTask = "",
            nowString = moment().toString(),
            now = moment(),
            newDate = moment().toString();
        $scope.frequencyLogic = function (status, clientTask) {

            if (clientTask.taskFrequency == "Annual" && status == "Complete") {
                clientCalls.updateClientTask({
                    id: clientTask.id,
                    taskStatus: status,
                    taskCompletedDate: nowString
                }).then(
                    function (res) {
                        updatedclientTask = angular.copy(res.data);
                        $scope.updatedclientTask = updatedclientTask;
                        $scope.createClientTask(updatedclient);
                    },
                    function (err) {
                        console.error('Error marking client task complete: ' + err.message);
                    }
                );
            }
        };

        $scope.createClientTask = function (Task) {
            var dueDate = moment(Task.taskDueDate);
            if (dueDate.diff(now) < 0) {
                if (Task.taskFrequency == "Annual" || Task.taskFrequency == "AnnualEOM") {
                    newDate = moment().add(1, 'y').toString();
                }
                else if (Task.taskFrequency == "Daily") {
                    newDate = moment().add(1, 'd').toString();
                }
                else if (Task.taskFrequency == "Weekly") {
                    newDate = moment().add(1, 'w').toString();
                }
                else if (Task.taskFrequency == "Quarterly" || Task.taskFrequency == "QuarterlyEOM") {
                    newDate = moment().add(1, 'Q').toString();
                }
                else if (Task.taskFrequency == "Monthly" || Task.taskFrequency == "MonthlyEOM") {
                    newDate = moment().add(1, 'M').toString();
                }
                else if (Task.taskFrequency == "Semi-Annual") {
                    newDate = moment().add(6, 'M').toString();
                }
            }
            else {
                newDate = Task.taskDueDate
            }
            clientCalls.createClientTask({
                clientid: Task.clientid,
                clientName: Task.clientName,
                taskid: Task.taskid,
                taskName: Task.taskName,
                taskDueDate: newDate,
                taskExtendedDueDate: Task.taskExtendedDueDate,
                taskStatus: "New",
                taskCompletedDate: null,
                taskCreatedDate: nowString,
                taskExtendedDate: Task.taskExtendedDate,
                taskReceivedDate: null,
                taskEmployeeid: Task.taskEmployeeid,
                taskFrequency: Task.taskFrequency
            }).then(
                function (res) {
                    newClientTask = angular.copy(res.data);
                },
                function (err) {
                    $scope.badclient = 'Error creating client task: ' + JSON.stringify(err.data.message);
                    console.error('Error creating client task: ' + JSON.stringify(err.data.message));
                }
            );
        };
    }
]);