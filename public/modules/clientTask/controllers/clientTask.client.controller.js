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
    /*'$http',
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
    '$log',*/
    function (
        clientCalls,
        $scope
        /*$http,
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
        $log*/
    ) {
        var updatedClientTask = "",
            newClientTask = "",
            now = moment(),
            newDate = now;
        $scope.markComplete = function (clientTask) {
            clientCalls.updateClientTask({
                id: clientTask.id,
                clientid: clientTask.clientid,
                clientName: clientTask.clientName,
                taskid: clientTask.taskid,
                taskName: clientTask.taskName,
                taskDueDate: clientTask.taskDueDate,
                taskExtendedDueDate: clientTask.taskExtendedDueDate,
                taskStatus: "Complete",
                taskCompletedDate: now,
                taskCreatedDate: clientTask.taskCreatedDate,
                taskExtendedDate: clientTask.taskExtendedDate,
                taskReceivedDate: clientTask.taskReceivedDate,
                taskEmployeeid: clientTask.taskEmployeeid,
                taskFrequency: clientTask.taskFrequency
            }).then(
                function (res) {
                    updatedClientTask = angular.copy(res.data);
                    $scope.updatedClientTask = updatedClientTask;
                    $scope.setDate(updatedClientTask);
                },
                function (err) {
                    console.error('Error marking client task complete: ' + err.message);
                }
            );
        };

        $scope.setDate = function (Task) {
            console.dir(Task);
            var dueDate = moment(Task.taskDueDate);
            if (dueDate.diff(now) < 0) {
                if (Task.taskFrequency == "Annual" || Task.taskFrequency == "AnnualEOM") {
                    newDate = moment().add(1, 'y');
                    console.log(newDate);
                }
                else if (Task.taskFrequency == "Daily") {
                    newDate = moment().add(1, 'd');
                }
                else if (Task.taskFrequency == "Bi-Weekly") {
                    newDate = moment().add(2, 'w');
                }
                else if (Task.taskFrequency == "Weekly") {
                    newDate = moment().add(1, 'w');
                }
                else if (Task.taskFrequency == "Quarterly" || Task.taskFrequency == "QuarterlyEOM") {
                    newDate = moment().add(1, 'Q');
                }
                else if (Task.taskFrequency == "Monthly" || Task.taskFrequency == "MonthlyEOM") {
                    newDate = moment().add(1, 'M');
                }
                else if (Task.taskFrequency == "Semi-Annual") {
                    newDate = moment().add(6, 'M');
                }
                else if (Task.taskFrequency == "One-Time") {
                    return Task
                }
            }
            else {
                newDate = Task.taskDueDate;
                console.log(newDate);
            }
            console.log(newDate);
            $scope.createClientTask(Task, newDate);
        };

        $scope.createClientTask = function (Task, newDate) {
            clientCalls.createClientTask({
                clientid: Task.clientid,
                clientName: Task.clientName,
                taskid: Task.taskid,
                taskName: Task.taskName,
                taskDueDate: newDate,
                taskExtendedDueDate: Task.taskExtendedDueDate,
                taskStatus: "New",
                taskExtendedDate: Task.taskExtendedDate,
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
        }
    }
]);