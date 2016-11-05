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
    '$scope',
    '$http',
    '$mdDialog',
    '$mdSidenav',
    '$mdToast',
    '$rootScope',
    '$routeParams',
    '$sce',
    'clientCalls',
    'authorization',
    'lodash',
    'methodCop',
    'uiGridConstants',
    function(
        $scope,
        $http,
        $mdDialog,
        $mdSidenav,
        $mdToast,
        $rootScope,
        $routeParams,
        $sce,
        clientCalls,
        authorization,
        lodash,
        methodCop,
        uiGridConstants,
        asvc
    ) {

        $scope.appheader = 'clients';
        $scope.tab = undefined;

        var tasks = "foo",
            clientTypes = "",
            employees = "",
            client = "",
            keyword = "",
            Name = "",
            Address1 = "",
            Address2 = "",
            City = "",
            StateProvince = "",
            PostalCode = "",
            Country = "",
            Phone = "",
            Email = "",
            Contacts = "",
            ResponsibleEmployee = "",
            Type = "",
            Tasks = "";
        $scope.myVar = 'test data';
        /* =====================================================================
         * Get all tasks from Mongo database
         * ===================================================================== */
        $scope.getTasks = function () {

            clientCalls.getTasks({
            }).then(
                function (res) {
                    tasks = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting tasks: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all client types from Mongo database
         * ===================================================================== */
        $scope.getClientTypes = function () {

            clientCalls.getClientTypes({
            }).then(
                function (res) {
                    clientTypes = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting client types: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all employees from Mongo database
         * ===================================================================== */
        $scope.getEmployees = function () {

            clientCalls.getEmployees().then(
                function (res) {
                    employees = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error getting employees: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * Get all clients from Mongo database
         * ===================================================================== */
        $scope.listClients = function () {
            console.log('inside listClients');
            console.dir(clientCalls.getClients);
            clientCalls.getClients().then(
                function (res) {
                    clients = angular.copy(res.data);
                    $scope.clients = clients;
                    $scope.gridOptions.data = clients;
                    //console.log('clients:');
                    //console.dir($scope.clients);
                    //console.log('gridOptions.data: ');
                    //console.dir($scope.gridOptions.data);
                },
                function (err) {
                    console.error('Error getting clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * search the clients in the Mongo database
         * ===================================================================== */
        $scope.clientSearch = function (keyword) {
            this.isSearching = true;

            // re-select the first tab
            $scope.tabData.selectedIndex = 0;

            clientCalls.clientSearch({
                keyword: keyword
            }).then(
                function (res) {
                    clients = angular.copy(res.data);
                    $scope.clients = clients;
                    $scope.gridOptions.data = clients;
                    console.log('clients:');
                    console.dir($scope.clients);
                    console.log('gridOptions.data: ');
                    console.dir($scope.gridOptions.data);
                },
                function (err) {
                    console.error('Error searching clients: ' + err.message);
                }
            );
        };
        /* =====================================================================
         * create new client
         * ===================================================================== */
        $scope.newClient = function () {

            clientCalls.newClient({
                Name: Name,
                Address1: Address1,
                Address2: Address2,
                City: City,
                StateProvince: StateProvince,
                PostalCode: PostalCode,
                Country: Country,
                Phone: Phone,
                Email: Email,
                Contacts: Contacts,
                ResponsibleEmployee: ResponsibleEmployee,
                Type: Type,
                Tasks: Tasks
            }).then(
                function (res) {
                    client = angular.copy(res.data);
                },
                function (err) {
                    console.error('Error searching clients: ' + err.message);
                }
            );
        };

        /* Tab handling */
        $scope.tabs = {
            '0' : {
                active : true,
                clientName : 'Results',
                results : [],
                status : {
                    display : false
                }
            }
        };

        $scope.removeTab = function (index) {
            try {
                delete $scope.tabs[index];
            }
            catch (err) {
                logError('There was an error trying to close a tab: ' + err.message);
            }
        };

        /* Tab Detail Functions */

        $scope.openNewTab = function(id) {
            if(id) {
                var win = window.open(window.location.href + '/' + id, '_blank');
                win.focus();
            }
        };

        $scope.copyToClipboard = function(clipped){
            var textToCopy = window.location.href.indexOf(clipped) > -1 ? window.location.href : window.location.href + '/' + clipped;
            if (navigator.appName ==='Microsoft Internet Explorer'){
                window.clipboardData.setData('Text', textToCopy);
            } else { //Chrome etc.
                var hiddenElement = document.createElement('textarea');
                hiddenElement.innerText = textToCopy;
                document.body.appendChild(hiddenElement);
                hiddenElement.select();
                document.execCommand('copy',false,null)
            }
        };

        $scope.sendMail = function (id,title) {
            var location = window.location.href.indexOf(id) > -1 ? window.location.href : window.location.href + '/' + id;
            location = location.replace("#", "%23");
            title = title.replace("#", "%23");
            document.location.href = "mailto:?subject=" + id + " : " + title + "&body=" + location;
        };


        $scope.tabData = {
            selectedIndex : 0,
            clientName : "",
            clientType : ""
        };


        /* Tab handling
         =====================================================================================- BEGIN */
        $scope.tabs = {
            '0' : {
                active : true,
                clientId : 'Results',
                results : [],
                status : {
                    display : false
                }
            }
        };

        //
        $scope.sla = [];

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 50,
            sort: null
        };
        /*
        $scope.gridOptions = {
            totalItems : 0,
            data : [],
            paginationPageSizes: [50, 100, 200],
            paginationPageSize: 50,
            useExternalPagination: true,
            columnDefs: [
                { name: 'Name', displayName: 'Name', width: "5%", field: "Name" },
                { name: 'Address', field: 'Address1', width: "5%"  },
                { name: 'Phone', field: 'Phone', width: "8%"  },
                { name: 'Email', field: 'Email', width: "8%"  },
                { name: 'Type', field: 'Type', width: "55%"  },
                { name: 'customer.customerName', solrName: 'CustomerName', displayName: 'Customer', width: "*"  },
                { name: 'createDate', field: 'DateCreated', cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', sort: {direction: 'desc', priority: 0}}
            ],
            useExternalSorting: true,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, sortChanged);
                gridApi.pagination.on.paginationChanged($scope, paginationChanged);
            },
            enableGridMenu: true,
            enableSelectAll: true,
            enableHorizontalScrollbar: 0,
            rowTemplate : '<div ng-dblclick="grid.appScope.openItemTab(row.entity.clientId)" layout-gt-sm="row">' +
            '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell layout="row" layout-align="start center"></div>' +
            '</div>'
        };
        */

        $scope.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            columnDefs: [
                { name:'Name', field: 'Name' },
                { name: 'Type', field: 'Type'},
                { name:'Address', field: 'Address1' },
                { name:'Phone', field: 'Phone'},
                { name:'Email', field: 'Email', enableCellEdit:false}
            ],
            data : []
        };


        $scope.search = {

            caseType : '', // container for selected case type in searchahead
            caseTypes : [],
            caseTypeText : '',
            caseSubTypes : [],
            caseSubTypeText : '',
            caseSubtype : '', // container for selected case subtype in searchahead
            caseOwner : '', // container for selected owner in searchahead
            caseOwnerText : '', // text for owner searchahead
            currentType : 'keyword',
            editSearches : false, // whether to display search edit buttons
            execCurrentSave : {},
            isAdvancedSearch : false, // tracker for showing keyword vs. advanced search
            isSearching : false,
            keyword : '',
            newSavedSearch : { name : '', criteria : [], searchType : '' }, // container for new saved search data
            newType : 'keyword',
            originator : '', // container for selected originator in searchahead
            originatorText : '', // text for originator searchahead
            origWorkgroupText : '', // text for originator workgroup searchahead
            ownWorkgroupText : '', // text for owner workgroup searchahead
            saveCurrentSearch : false, // whether to display save search
            savedSearches : {}, // object for housing our saved searches
            searchCases : true, // default for keyword search
            searchSubcases : true,
            searchString : '',
            severityTypes : [],
            sideNavOpen : false,
            subcaseOwner : '', // container for selected owner in searchahead
            subcaseOwnerText : '', // text for owner searchahead

            advFields : {
                Name : '',
                Address1 : '',
                Address2 : '',
                City : '',
                StateProvince : '',
                PostalCode : '',
                Country : '',
                Phone : '',
                Email : '',
                Contacts : '',
                ResponsibleEmployee : '',
                Type : '',
                Tasks : ''
            },

            // Language
            language : {
                Name : 'Name',
                Address1 : 'Address 1',
                Address2 : 'Address 2',
                City : 'City',
                StateProvince : 'State/Province',
                PostalCode : 'Postal Code',
                Country : 'Country',
                Phone : 'Phone',
                Email : 'Emali',
                Contacts : 'Contacts',
                ResponsibleEmployee : 'Responsible Employee',
                Type : 'Type',
                Tasks : 'Tasks'
            },


            // reset the advanced search fields
            reset : function() {
                try {
                    angular.forEach($scope.search.advFields, function (advVal,advKey) {
                        $scope.search.advFields[advKey] = '';
                        if (advKey == 'searchCases' || advKey == 'searchSubcases') {
                            $scope.search.advFields[advKey] = true;
                        }
                    });
                    $scope.search.caseTypeText = '';
                    $scope.search.caseSubTypeText = '';
                    $scope.search.caseOwnerText = ''; // text for owner searchahead
                    $scope.search.subcaseOwnerText = ''; // text for owner searchahead
                    $scope.search.originatorText = ''; // text for originator searchahead
                    $scope.search.ownWorkgroupText = ''; // text for owner workgroup searchahead
                    $scope.search.origWorkgroupText = ''; // text for originator workgroup searchahead
                    // $scope.advSearchForm.$setPristine(); <-- Angular not seeing the form for some reason
                }
                catch (err) {
                    logError('There was an error trying reset the search parameters: ' + err.message);
                }
            }, // end of resetSearch()



            // toggle keyword vs. advanced search
            toggleAdvancedSearch : function () {
                this.isAdvancedSearch = !this.isAdvancedSearch;
                this.newType = (!this.isAdvancedSearch) ? 'keyword' : 'advanced';

                // need to reset case and subcase search just in case
                if (!this.isAdvancedSearch) {
                    $scope.search.caseSearch = true;
                    $scope.search.subCaseSearch = true;
                }
            },

            // toggle search editing
            toggleEditSearches : function () {
                this.editSearches = !this.editSearches;
            },


            // unset case or subcase fields when they are toggled
            // so that the values in the fields aren't submitted with the search submission
            unsetCasesAndSubcaseFields : function () {
                if (!this.advFields.searchCases) {
                    this.advFields.CustomerId = '';
                }
                if (!this.advFields.searchSubcases) {
                    this.advFields.SubcaseTitle = '';
                    this.advFields.SubcaseOwner = '';
                    this.subcaseOwner = '';
                    this.subcaseOwnerText = '';
                }
            }

        }; // end of search obj



        $scope.removeTab = function (index) {
            try {
                // event.preventDefault();
                // event.stopPropagation();
                delete $scope.tabs[index];
            }
            catch (err) {
                logError('There was an error trying to close a tab: ' + err.message);
            }
        };

        $scope.openItemTab = function (clientId) {
            asvc.addStep('openItemTab');
            try {

                // create object for tracking disabled detail buttons if it doesn't exist
                if (!methodCop.check([$scope.disabledDetailBtns])) {
                    $scope.disabledDetailBtns = {};
                }

                // disable detail button to prevent multiple tabs being opened from multiple clicks
                $scope.disabledDetailBtns[clientId] = true;

                if (
                    Object.keys($scope.tabs).length == 1 || // if Results tab is only tab, OR
                    !methodCop.check([lodash.findKey($scope.tabs, { clientId : clientId })]) // if clientId doesn't exist
                ) {
                    $scope.getclient(clientId, function (client) {
                        if (client) {
                            var tabId = Object.keys($scope.tabs).length;

                            $scope.tabs[tabId] = client;
                            $scope.tab = client;

                            // console.dir(client);

                            // is this a subcase? we'll hide stuff that we don't get for subcases such as SLA, Ebonding
                            clientId.indexOf('-') > -1 ? $scope.tabs[tabId].isSubcase = true : $scope.tabs[tabId].isSubcase = false;

                            $scope.tabs[tabId].showActivityLogPane = true;
                            $scope.tabs[tabId].showCaseDetailsPane = true;
                            $scope.tabs[tabId].showCaseHistoryPane = true;
                            $scope.tabs[tabId].showCloseCaseDetailsPane = false;
                            $scope.tabs[tabId].showContactDetailsPane = false;
                            $scope.tabs[tabId].showCustomerDetailsPane = false;
                            $scope.tabs[tabId].showEbondingDetailsPane = false;
                            $scope.tabs[tabId].showNetworkOutagePane = false;
                            $scope.tabs[tabId].showPremiseDetailsPane = false;
                            $scope.tabs[tabId].showSlaDetailsPane = false;
                            $scope.tabs[tabId].showServiceDetailsPane = false;
                            $scope.tabs[tabId].showUserDetailsPane = false;
                            $scope.tabs[tabId].showVoiceDataDetailsPane = false;
                            $scope.tabs[tabId].showNoteWizard = false;

                            $scope.tabs[tabId].slaIndex = 0;

                            // UI Grid properties for Case History
                            $scope.tabs[tabId].caseHistory = {
                                enableSorting: true,
                                columnDefs: [
                                    {name: 'Note Type', field: 'noteType', width: '5%'},
                                    {name: 'Note Source', field: 'noteSource', width: '10%'},
                                    {name: 'Note Text', field: 'noteText', width: '60%'},
                                    {name: 'Created By', field: 'creatorId', width: '10%'},
                                    {name: 'Created Date/Time', field: 'createDate', width: '15%'}
                                ],
                                data: client.notes,
                                enableGridMenu: true,
                                enableSelectAll: true,
                                enableHorizontalScrollbar: 0,
                                exporterCsvFilename: clientId + '-Case_History.csv',
                                exporterMenuPdf: false,
                                // exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                                onRegisterApi: function (gridApi) {
                                    $scope.gridApi = gridApi;
                                }
                            };

                            // UI Grid properties for Activity Log
                            $scope.tabs[tabId].activityLog = {
                                enableSorting: true,
                                columnDefs: [
                                    {name: 'User', field: 'userName', width: '10%'},
                                    {name: 'Action', field: 'action', width: '5%'},
                                    {name: 'Information', field: 'information', width: '70%'}
                                ],
                                data: client.activityLogEntries ? client.activityLogEntries : client.activityLogs,
                                enableGridMenu: true,
                                enableSelectAll: true,
                                enableHorizontalScrollbar: 0,
                                exporterCsvFilename: clientId + '-Activity_Log.csv',
                                exporterMenuPdf: false,
                                // exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                                onRegisterApi: function (gridApi) {
                                    $scope.gridApi = gridApi;
                                }
                            };

                            // Date for entries in Activity Log for Subcases may come in as 'date' and not 'createDate'
                            if ($scope.tabs[tabId].activityLog.data[0]) {
                                $scope.tabs[tabId].activityLog.data[0].createDate ?
                                    $scope.tabs[tabId].activityLog.columnDefs.push({name: 'Created Date/Time', field: 'createDate', width: '15%'}) :
                                    $scope.tabs[tabId].activityLog.columnDefs.push({name: 'Created Date/Time', field: 'date', width: '15%'});
                            }

                            //Checks to see if client is subcase
                            if (methodCop.check([clientId])) {
                                if (clientId.indexOf('-') >= 0) {
                                    $scope.tabs[tabId].clientId = client.subcaseId;
                                    $scope.tabs[tabId].title = client.subcaseTitle;
                                    $scope.tabs[tabId].createDate = client.creationDate;
                                    $scope.tabs[tabId].subTypeDetail = client.parentCase.subTypeDetail;
                                    $scope.tabs[tabId].subType = client.parentCase.subType;
                                }
                            }

                            // create Assign properties in assign object
                            $scope.assign[clientId] = {
                                hasChanged : false
                            };

                            // create Dispatch properties in dispatch object
                            $scope.dispatch[clientId] = {
                                hasChanged : false,
                                queueToDispatch : client.queueName || ''
                            };

                            if (methodCop.check([client.owner])) {
                                $scope.assign[clientId].originalUser = angular.copy(client.owner);
                                $scope.assign[clientId].userToAssign = angular.copy(client.owner);
                                $scope.assign[clientId].queueSearchTxt = client.owner.fullName;
                            } else {
                                $scope.dispatch[clientId].originalUser = {
                                    clarifyName : '',
                                    ntLogin : '',
                                    fullName : ''
                                };
                                $scope.dispatch[clientId].userToAssign = {
                                    clarifyName : '',
                                    ntLogin : '',
                                    fullName : ''
                                };
                            }

                            if (methodCop.check([client.queueName])) {
                                $scope.dispatch[clientId].originalQueue = {
                                    title : client.queueName
                                };
                                $scope.dispatch[clientId].queueToDispatch = {
                                    title : client.queueName
                                };
                                $scope.dispatch[clientId].queueSearchTxt = client.queueName;
                                $scope.dispatch[clientId].noDispatch = true;
                            } else {
                                $scope.dispatch[clientId].originalQueue = {
                                    title : ''
                                };
                                $scope.dispatch[clientId].queueToDispatch = {
                                    title : ''
                                };
                                $scope.dispatch[clientId].queueSearchTxt = '';
                            }

                            // re-enable detail button in search grid
                            $scope.disabledDetailBtns[clientId] = false;
                        }
                    });
                } else {
                    // console.log('go to this tab', lodash.findKey($scope.tabs, { clientId : clientId }));
                    $scope.tabData.selectedIndex = lodash.findKey($scope.tabs, { clientId : clientId });
                    // re-enable detail button in search grid
                    $scope.disabledDetailBtns[clientId] = false;
                }
            }
            catch (err) {
                logError('There was an error trying to open a tab for ' + clientId + ': ' + err.message);
            }
        };

        /* Tab Detail Functions
         =====================================================================================- BEGIN */

        $scope.openNewTab = function(id) {
            if(id) {
                var win = window.open(window.location.href + '/' + id, '_blank');
                win.focus();
            }
        };

        $scope.copyToClipboard = function(clipped){
            var textToCopy = window.location.href.indexOf(clipped) > -1 ? window.location.href : window.location.href + '/' + clipped;
            if (navigator.appName ==='Microsoft Internet Explorer'){
                window.clipboardData.setData('Text', textToCopy);
            } else { //Chrome etc.
                var hiddenElement = document.createElement('textarea');
                hiddenElement.innerText = textToCopy;
                document.body.appendChild(hiddenElement);
                hiddenElement.select();
                document.execCommand('copy',false,null)
            }
        };

        $scope.sendMail = function (id,title) {
            var location = window.location.href.indexOf(id) > -1 ? window.location.href : window.location.href + '/' + id;
            location = location.replace("#", "%23");
            title = title.replace("#", "%23");
            document.location.href = "mailto:?subject=" + id + " : " + title + "&body=" + location;
        };
        /* Tab Detail Functions
         =====================================================================================- END */


        // Open Deep-Linked client
        // if there is a client ID in the route, let's load it.
        $scope.openclientLink = function () {
            try {
                if (methodCop.check([$routeParams.clientID])) {
                    $scope.openItemTab($routeParams.clientID);
                }
            }
            catch (err) {
                logError('There was an error trying to open the details for client ' + $routeParams.clientId + ': ' + err.message);
            }
        };

        function logError(logMessage, userMessage) {
            console.error(logMessage);
            oclLog.log('error', logMessage);
            $mdDialog.hide();
            $mdDialog.show(
                $mdDialog
                    .alert()
                    .parent(angular.element(document.querySelector('body#OCL')))
                    .title('Error')
                    .content((userMessage || logMessage) + ' - If the error persists submit an email to DL-OCLFeedback@Level3.com that describes your error and the steps you took to see the error.')
                    .ariaLabel('Error Dialog')
                    .ok('OK')
                    .clickOutsideToClose(false)
            );
        }

        function openDialog(message) {
            $mdDialog.hide();
            $mdDialog.show(
                $mdDialog
                    .alert()
                    .parent(angular.element(document.querySelector('body#OCL')))
                    .title('Error')
                    .content(message)
                    .ariaLabel('Error Dialog')
                    .ok('OK')
                    .clickOutsideToClose(false)
            );
        }





    }
]).directive('notesWizard', function(){
    return {
        restrict: 'E',
        scope: {
            templateGroup : '@',
            templateName : '@',
            detailclientId : '@',
            detailTab : '@',
            detailNoteType : '@',
            detailOnSuccess : '&',
            detailOnError : '&'
        },
        templateUrl: './modules/clients/views/note.wizard.client.view.html',
        controller: 'clientCreateNoteWizardController'
    };
});



/* ================================================================================
 * mdToast Controller
 * ================================================================================ */
clients.controller('ToastCtrl', function($scope, $mdToast) {
    $scope.closeToast = function() {
        $mdToast.hide();
    };
});
