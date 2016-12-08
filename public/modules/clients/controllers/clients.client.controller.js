'use strict';
var clients = angular.module('clients',[
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


clients.controller('clientsController',[
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
        $log
    ) {

        $scope.appheader = 'Clients';
        $scope.tab = undefined;

        var clients = "",
            newClient = '',
            updatedclient = "",
            detailedclient = {},
            clienttypes = "",
            employees = "",
            deletedclient = "",
            deletedClientTask = "";

        //Build the tabset to run the CRUD for clients
        $scope.clientsTabset = {
            resultsTab : {
                active: true,
                label: 'Results',
                view: 'modules/core/views/grid.results.view.html'
            }
        };

        /* Tab Detail Functions */

        $scope.removeTab = function (index) {
            try {
                delete $scope.clientsTabset[index];
            }
            catch (err) {
                console.log('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openNewTab = function(tabKey, tabValue) {
            $scope.clientsTabset[tabKey] = tabValue;
        };

        $scope.openNewItemTab = function(itemId) {
            $scope.viewclient(itemId);
        };

        $scope.myFieldset = {
            newitem : {},
            actionName: 'Create',
            collectionName: 'client',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label:'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: false},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: true}
          ]
        };

        $scope.myUpdateFieldset = {
            myItem : {},
            actionName: 'Update',
            collectionName: 'client',
            fields: [
                { label:'Name', field: 'Name', required: true },
                { label:'Type', field: 'Type', required: true},
                { label:'Address 1', field: 'Address1', required: false},
                { label:'Address 2', field: 'Address2', required: false},
                { label:'City', field: 'City', required: false},
                { label:'State / Province', field: 'StateProvince', required: false},
                { label:'Postal Code', field: 'PostalCode', required: false},
                { label:'Country', field: 'Country', required: false},
                { label:'Phone', field: 'Phone', required: false},
                { label:'Email', field: 'Email', required: false},
                { label:'Responsible Employee', field: 'ResponsibleEmployee', required: true}
            ]
        };

        $scope.gridOptions = {
            enableSorting: true,
            columnDefs: [
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                        '<md-button aria-label="Client Detail" class="btn btn-default" ng-click="grid.appScope.openNewItemTab(row.entity.id)">'
                        + '<i class="glyphicon glyphicon-pencil"></i>'
                        + '<md-tooltip>{{row.entity.Name}} Detail</md-tooltip>'
                        + '</md-button>',
                    enableSorting: false,
                    resizable: false,
                    width: 50,
                    height: 30,
                    pinnable: false
                },
                { name:'Name', field: 'Name'},
                { name: 'Type', field: 'Type'},
                { name:'Address', field: 'Address1'},
                { name:'Phone', field: 'Phone'},
                { name: 'Email', field: 'Email'}
            ],
            data : []
        };


        $scope.refreshData = function (keyword) {
            $scope.gridOptions.data = $scope.clients;
            while (keyword) {
                var oSearchArray = keyword.split(' ');
                $scope.gridOptions.data = $filter('filter')($scope.gridOptions.data, oSearchArray[0], undefined);
                oSearchArray.shift();
                keyword = (oSearchArray.length !== 0) ? oSearchArray.join(' ') : '';
            }
        };

        $scope.addTask  = function (task, clientid, clientName) {
          task = {
              task: task.task,
              employee: task.employee,
              dateAssigned: moment()
          };
          var fullTask = {
              client: {id: clientid},
              task: task};
          //Assign the task to the client
          clientCalls.assignTask(fullTask).then(
                function (res) {
                    console.dir(res);
                    //upon success, create the corresponding clientTask
                    clientCalls.createClientTask(
                        {
                            clientid: clientid,
                            taskid:task.task.id,
                            taskName:task.task.Name,
                            taskDueDate:task.task.DueDate,
                            taskExtendedDueDate:task.task.ExtendedDueDate,
                            taskSecondExtendedDueDate:task.task.SecondExtendedDueDate,
                            taskFrequency:task.task.Frequency,
                            taskStatus:"New",
                            taskEmployeeName:task.employee.FirstName,
                            taskEmployeeid:task.employee.id,
                            clientName:clientName
                        }
                    );
                    fullTask.task.taskClientId = res.data.taskClientId;
                    console.log('after res: ');
                    console.dir(fullTask);
                    $scope.clientsTabset[clientid].item.Tasks.push(fullTask.task);
                    $scope.$emit("refreshClientTasks", {});
                },
                function (err) {
                    console.error(err);
                }
            );

        };

        $scope.searchClientTasks = function (clientid, taskid) {
            var searchObj = {"query":"searchText",
                "limit":25,
                "limitsearch":0,
                "exactsearch":false,
                "skip":0,
                "and": [
                    {"taskid": "taskid"},
                    {"clientid": "clientid"},
                    {"taskStatus":
                    {"$not": {"$eq": "Complete"}}}
                ],
                "sort":{"taskName":1}
            };
            clientCalls.searchClientTasks(searchObj).then(
                function(res) {
                    clientTask = angular.copy(res.data);
                    $scope.clientTask = clientTask;
                },
                function (err) {
                    console.error(err);
                }
            )
        };

        $scope.removeTask = function (client, taskClientid, task) {
            console.log('888888');
            console.dir(taskClientid);
            var taskToRemove = {"client" : client, "taskClientid" : taskClientid};
            console.dir(taskToRemove);
            clientCalls.removeTask(taskToRemove).then(
                function (res) {
                    console.dir(res);
                },
                function (err) {
                    console.error(err);
                }
            );
            $scope.modal = {
                title : 'Delete Client Task' + client.taskName,
                body : 'Do you also want to delete \'' + client.taskName + '\' uncompleted Client Task?'
            };
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'appModal',
                controller: 'ModalInstanceCtrl',
                scope: $scope,
                size: 'md'
                // resolve: {}
            });
            modalInstance.result.then(
                function () {
                    $scope.searchClientTasks(client.id, task.id).then(
                        function(res) {
                            clientCalls.deleteClientTask({
                                id: res.id
                            }).then(
                                function (res) {
                                    deletedClientTask = angular.copy(res.data);
                                    $scope.deletedClientTask = deletedClientTask;
                                    $scope.getClients();
                                    $scope.createToast(deletedClientTask.taskName, "deleted", "danger");
                                },
                                function (err) {
                                    console.error('Error deleting client: ' + err.message);
                                }
                            );
                        },
                        function(err) {
                            console.error(err);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete client cancelled');
                }
            );

        };

        /* =====================================================================
         * Get all clients from Mongo database
         * ===================================================================== */
        $scope.getClients = function () {

            clientCalls.getClients({}).then(
                function (res) {
                    clients = angular.copy(res.data);
                    $scope.clients = clients;
                    console.dir(clients);
                    $scope.gridOptions.data = clients;
                },
                function (err) {
                    console.error('Error getting clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new client
         * ===================================================================== */
        $scope.createItem = function (newclient) {
            console.log(newclient);
            clientCalls.newClient({
                Name: newclient.Name,
                Address1: newclient.Address1,
                Address2: newclient.Address2,
                City: newclient.City,
                StateProvince: newclient.StateProvince,
                PostalCode: newclient.PostalCode,
                Country: newclient.Country,
                Phone: newclient.Phone,
                Email: newclient.Email,
                ResponsibleEmployee: newclient.ResponsibleEmployee.FirstName + newclient.ResponsibleEmployee.LastName,
                Type: newclient.Type.type
            }).then(
                function (res) {
                    newClient = angular.copy(res.data);
                    $scope.getClients();

                    //window.location.href ='#/clients';
                    $scope.removeTab('createTab');
                    $scope.createToast(newclient.Name, "created", "success");
                },
                function (err) {
                    $scope.badclient = 'Error creating client: ' + JSON.stringify(err.data.message);
                    console.error('Error creating client: ' + JSON.stringify(err.data.message));
                }
            );
        };


        /* =====================================================================
         * update client
         * ===================================================================== */
        $scope.updateItem = function (detailedclient) {
            console.log('detailedClient: ');
            console.dir(detailedclient);
            clientCalls.updateClient({
                id: detailedclient.id,
                Name: detailedclient.Name,
                Address1: detailedclient.Address1,
                Address2: detailedclient.Address2,
                City: detailedclient.City,
                StateProvince: detailedclient.StateProvince,
                PostalCode: detailedclient.PostalCode,
                Country: detailedclient.Country,
                Phone: detailedclient.Phone,
                Email: detailedclient.Email,
                ResponsibleEmployee: detailedclient.ResponsibleEmployee.displayName,
                Type: detailedclient.Type.type
            }).then(
                function (res) {
                    updatedclient = angular.copy(res.data);
                    $scope.updatedclient = updatedclient;
                    $scope.getClients();

                    //window.location.href ='#/clients';
                    $scope.removeTab(detailedclient.id);
                    $scope.createToast(detailedclient.Name, "updated", "success");
                },
                function (err) {
                    console.error('Error updating client: ' + err.message);
                }
            );
        };


        /* =====================================================================
         * view client
         * ===================================================================== */
        $scope.viewclient = function (clientId) {
            clientCalls.detailclient(clientId).then(
                function (res) {
                    detailedclient = angular.copy(res.data);
                    console.dir(detailedclient);
                    $scope.clientsTabset[clientId] = {
                        active: true,
                        label: detailedclient.Name,
                        view: 'modules/clients/views/edit-item.client.view.html',
                        item: detailedclient
                    };
                },
                function (err) {
                    console.error('Error viewing client: ' + err.message);
                }
            );
        };

        /* =====================================================================
         * Delete a client from Mongo database
         * ===================================================================== */
        $scope.deleteItem = function (item) {

            $scope.modal = {
                title : 'Delete ' + item.Name,
                body : 'Are you sure you want to delete the client, \'' + item.Name + '?\''
            };
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'appModal',
                controller: 'ModalInstanceCtrl',
                scope: $scope,
                size: 'md'
                // resolve: {}
            });
            modalInstance.result.then(
                function () {
                    console.dir(item);
                    clientCalls.deleteClient({
                        id: item.id
                    }).then(
                        function (res) {
                            deletedclient = angular.copy(res.data);
                            $scope.deletedclient = deletedclient;
                            $scope.getClients();
                            $scope.removeTab(item.id);
                            $scope.createToast(item.Name, "deleted", "danger");
                        },
                        function (err) {
                            console.error('Error deleting client: ' + err.message);
                        }
                    );
                },
                function () {
                    // $log.info('Modal dismissed at: ' + new Date());
                    $log.info('Delete client cancelled');
                }
            );
        };

        $scope.getClientTypes = function () {
            clientCalls.getClientTypes({}).then(
                function (res) {
                    clienttypes = angular.copy(res.data);
                    $scope.clienttypes = clienttypes;
                    console.dir(clienttypes);
                },
                function (err) {
                    console.error('Error getting Frequencies: ' + err.message);
                }
            );
        };

        $scope.getEmployees = function () {
            clientCalls.getEmployees({}).then(
                function (res) {
                    employees = angular.copy(res.data);
                    $scope.employees = employees;
                },
                function (err) {
                    console.error('Error getting Employees: ' + err.message);
                }
            );
        };

        $scope.getTasks = function () {
            clientCalls.getTasks({}).then(
                function (res) {
                    tasks = angular.copy(res.data);
                    $scope.tasks = tasks;
                },
                function (err) {
                    console.error('Error getting Tasks: ' + err.message);
                }
            );
        };
    }
]);
