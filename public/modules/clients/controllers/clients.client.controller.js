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
                    console.dir(clients);
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
                    clients = angular.copy(res.data.results);
                    $scope.clients = clients;
                    $scope.gridOptions.data = clients;
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

        /*clientsSettings
            .get()
            .then(
                function (resp){
                    $scope.clientsSettings = resp;
                },
                function (err) {
                    console.error(err);
                }
            );*/

        // can the logged in user add notes?
        authorization.check(
            'clients',
            'Add Note',
            null,
            function (res,err) {
                if (err) {
                    console.error(err);
                } else {
                    $scope.canAddNote = res;
                }
            }
        );

        // check to see if user is authorized to make updates in Clients
        authorization.check(
            'clients',
            'Save Searches',
            null,
            function (res,err) {
                if (err) {
                    console.error(err);
                } else {
                    $scope.canSaveSearches = res;
                }
            }
        );

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

        $scope.gridOptions = {
            totalItems : 0,
            data : '',
            paginationPageSizes: [50, 100, 200],
            paginationPageSize: 50,
            useExternalPagination: true,
            columnDefs: [
                { name: 'Name', displayName: 'Name', solrName: 'Name', width: "5%", type: "number" },
                { name: 'Address', solrName: 'Address1', width: "5%"  },
                { name: 'Phone', solrName: 'Phone', width: "8%"  },
                { name: 'Email', solrName: 'Email', width: "8%"  },
                { name: 'Type', solrName: 'Type', width: "55%"  },
                { name: 'customer.customerName', solrName: 'CustomerName', displayName: 'Customer', width: "*"  },
                { name: 'createDate', solrName: 'CreationTime', width: "*", cellFilter: 'date:\'MM/dd/yyyy h:mm a\'', sort: {direction: 'desc', priority: 0}},
                {
                    name: 'actions',
                    displayName: '',
                    cellTemplate:
                    '<md-button aria-label="client Detail" class="md-mini" ng-click="grid.appScope.openItemTab(row.entity.clientId)" ng-disabled="grid.appScope.disabledDetailBtns[row.entity.clientId]">'
                    + '<i class="fa fa-info-circle"></i>'
                    + '<md-tooltip>client Detail</md-tooltip>'
                    + '</md-button>',
                    enableSorting: false,
                    width: "40",
                    resizable: false,
                    pinnable: false
                }
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

        function sortChanged(grid, sortColumns) {
            asvc.addStep('sortChanged');
            paginationOptions.sort = (sortColumns.length === 0) ? null : buildSortedColumnsSolrString(sortColumns);
            uiGridSearch()
                .then(function (data, err) {
                    if (err) {
                        // console.dir(err);
                        logError('There has been a problem searching clients, try again soon. ' + err.message);
                    } else {
                        if (
                            methodCop.check([data.message]) ||
                            !methodCop.check([data.matchedCount,data.clientList]) ||
                            (methodCop.check([data.status]) && data.status != 200)
                        ) {
                            var respMsg = data.message || data.text || data.response.text.replace(/<[^>]+>/gm, '') || data;
                            logError('There has been a problem searching clients: ' + respMsg);
                        }
                        else {
                            $scope.gridOptions.totalItems = data.matchedCount;
                            $scope.gridOptions.data = data.clientList;
                        }
                    }
                })
            ;
            // $scope.search.searchclients();
        }

        function buildSortedColumnsSolrString(sortColumns) {
            return _.map(sortColumns, function(col) {
                    return [col.colDef.solrName + ' ' + col.sort.direction];
                })
                .join(",");
        }

        function paginationChanged(newPage, pageSize) {
            asvc.addStep('paginationChanged');
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;
            // $scope.search.searchclients();
            uiGridSearch()
                .then(function (data, err) {
                    if (err) {
                        // console.dir(err);
                        logError('There has been a problem searching clients, try again soon. ' + err.message);
                    } else {
                        if (
                            methodCop.check([data.message]) ||
                            !methodCop.check([data.matchedCount,data.clientList]) ||
                            (methodCop.check([data.status]) && data.status != 200)
                        ) {
                            var respMsg = data.message || data.text || data.response.text.replace(/<[^>]+>/gm, '') || data;
                            logError('There has been a problem searching clients: ' + respMsg);
                        }

                        else {
                            $scope.gridOptions.totalItems = data.matchedCount;
                            $scope.gridOptions.data = data.clientList;
                        }
                    }
                })
            ;
        }

        function uiGridSearch(){
            asvc.addStep('uiGridSearch');
            var req = {
                method: 'POST',
                url: '/client/search',
                data: {
                    searchString: $scope.search.searchString,
                    rows: paginationOptions.pageSize,
                    start: (paginationOptions.pageNumber - 1) * paginationOptions.pageSize
                }
            };

            // console.log($scope.search.searchString);

            if (paginationOptions.sort) {
                req.data.sort = paginationOptions.sort
            }

            return $http(req)
                .then(
                    function(res) { // Success
                        if (methodCop.check([res.data.clientList])) {
                            if (res.data.clientList.length === 1) {
                                $scope.openItemTab(res.data.clientList[0].clientId);
                            }
                        }
                        return res.data;
                    },
                    function(err) { // Error
                        return err.data;
                    }
                );
        }

        // Build query string.
        function qs(key, value) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }

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


            // build our search to save prior to saving it
            buildSearchSave : function () {
                try {
                    // let's reset our newSavedSearch
                    this.newSavedSearch = { name : '', criteria : [], searchType : '' };

                    // set search type
                    this.newSavedSearch.searchType = this.currentType;

                    // if we're building a keyword search
                    if (!this.isAdvancedSearch && methodCop.check([this.keyword])) {
                        this.newSavedSearch.criteria.push({
                            field : 'keyword',
                            value : this.keyword
                        });
                    }

                    // otherwise, it's an advanced search
                    else if (this.isAdvancedSearch) {
                        for (var v in this.advFields) {
                            if (this.advFields[v] && this.advFields[v] != '') {
                                $scope.search.newSavedSearch.criteria.push({
                                    field : v,
                                    value : this.advFields[v]
                                })
                            }
                        }
                    }
                }
                catch (err) {
                    logError('There was an error building our search to save: ' + err.message);
                }
            },

            // delete saved search(es)
            deleteSearch : function (searchID) {
                try {
                    if (searchID == 'recent' || searchID == 'favorite') {
                        // we're not even going to make the call if there aren't any searches to delete
                        if ($scope.search.savedSearches[searchID] && $scope.search.savedSearches[searchID].length > 0) {
                            // corral our id's of searches to delete
                            var searchesToDelete = lodash.map($scope.search.savedSearches[searchID], 'id');

                            // then let's confirm that the user wants to delete
                            // if so, proceed to delete
                            $mdDialog
                                .show(
                                    $mdDialog
                                        .confirm()
                                        .title('Are you sure you want to delete all of your ' + searchID + ' searches?')
                                        .textContent('This cannot be undone.')
                                        .ariaLabel('delete searches')
                                        .ok('Yes')
                                        .cancel('No')
                                )
                                .then(
                                    function () {
                                        clientsSearchCalls.deleteSavedSearch(searchesToDelete).then(
                                            function (res) {
                                                $scope.search.savedSearches = res;
                                            },
                                            function (err) {
                                                logError('There was an error deleting a saved search: ' + err.message);
                                            }
                                        );
                                    },
                                    function () {
                                        console.log = 'Delete searches was cancelled.';
                                    }
                                )
                            ;
                        }
                    } else {
                        if (methodCop.check(searchID)) {

                            // let's get the rest of the data for our search
                            var ourSearch = lodash.find(this.savedSearches.favorite, { id : searchID });

                            // create our array of searhces to delete
                            var searchesToDelete = [];
                            searchesToDelete.push(searchID);

                            // then let's confirm that the user wants to delete
                            // if so, proceed to delete
                            $mdDialog
                                .show(
                                    $mdDialog
                                        .confirm()
                                        .title('Are you sure you want to delete your search named ' + ourSearch.name + '?')
                                        .textContent('This cannot be undone.')
                                        .ariaLabel('delete searches')
                                        .ok('Yes')
                                        .cancel('No')
                                )
                                .then(
                                    function () {
                                        clientsSearchCalls.deleteSavedSearch(searchesToDelete).then(
                                            function (res) {
                                                $scope.search.savedSearches = res;
                                            },
                                            function (err) {
                                                logError('There was an error deleting a saved search: ' + err.message);
                                            }
                                        );
                                    },
                                    function () {
                                        console.log = 'Delete search was cancelled.';
                                    }
                                )
                            ;

                        }
                    }
                }
                catch (err) {
                    logError('There was an error deleting a saved search: ' + err.message);
                }
            },

            executeSavedSearch : function (search) {
                try {

                    // if it's a keyword search, execute it
                    if (search.type == 'keyword') {
                        this.isAdvancedSearch = false;
                        this.keyword = search.criteria[0].value;
                        this.execCurrentSave = search;
                    }
                    // otherwise, populate our search criteria for an advanced search and execute it
                    else {
                        this.isAdvancedSearch = true;
                        angular.forEach(search.criteria, function (crit) {
                            // string to boolean workaround
                            if (
                                crit.value == 'true' ||
                                crit.value == 'TRUE' ||
                                crit.value == 'True'
                            ) {
                                $scope.search.searchCases = true;
                            } else if (
                                crit.value == 'false' ||
                                crit.value == 'FALSE' ||
                                crit.value == 'False'
                            ) {
                                $scope.search.searchCases = false;

                            } else {
                                $scope.search.advFields[crit.field] = crit.value;
                            }
                        });
                        this.execCurrentSave = search;
                    }

                    /*$mdSidenav('searchOptions').close()
                        .then(function () {
                            $scope.search.searchclients();
                        });*/

                }

                catch (err) {
                    logError('There was an error executing a saved search: ' + err.message);
                }
            },

            generateSearchString : function (finalCB) {
                // let's start with a blank search string
                $scope.search.searchString = '';

                async.parallel(
                    [
                        // set up date range
                        function (callback) {
                            try {
                                var fromTime,toTime;
                                // if full date range is set
                                if (methodCop.check([
                                        $scope.search.advFields.CreatedFrom,
                                        $scope.search.advFields.CreatedTo
                                    ])) {
                                    fromTime = moment($scope.search.advFields.CreatedFrom).toISOString();
                                    toTime = moment($scope.search.advFields.CreatedTo).toISOString();

                                    $scope.search.searchString += 'CreationTime=' + encodeURIComponent('[' + fromTime + ' TO ' + toTime + ']') + '&';
                                }
                                // if only date FROM is set
                                else if (
                                    methodCop.check([$scope.search.advFields.CreatedFrom]) &&
                                    !methodCop.check([$scope.search.advFields.CreatedTo])
                                ) {
                                    fromTime = moment($scope.search.advFields.CreatedFrom).toISOString();

                                    $scope.search.searchString += 'CreationTime=' + encodeURIComponent('[' + fromTime + ' TO *]') + '&';
                                }
                                // if only date TO is set
                                else if (
                                    !methodCop.check([$scope.search.advFields.CreatedFrom]) &&
                                    methodCop.check([$scope.search.advFields.CreatedTo])
                                ) {
                                    toTime = moment($scope.search.advFields.CreatedTo).toISOString();

                                    $scope.search.searchString += 'CreationTime=' + encodeURIComponent( '[* TO ' + toTime + ']') + '&';
                                }
                                // no errors, let's proceed to next function
                                callback(null);
                            }
                            catch (err) {
                                callback(err);
                            }
                        },
                        // set up other fields
                        function (callback) {
                            try {
                                var canSearch = false;
                                for (var a = 0; a < Object.keys($scope.search.advFields).length; a++) {

                                    // let's get and set our key and val for this iteration
                                    var objKey = Object.keys($scope.search.advFields)[a];
                                    var objVal = $scope.search.advFields[objKey];

                                    // if we have a value and it's not either of the dates
                                    if (
                                        methodCop.check([objVal]) &&
                                        objKey != 'CreatedFrom' &&
                                        objKey != 'CreatedTo' &&
                                        objKey != 'searchCases' &&
                                        objKey != 'searchSubcases'
                                    ) {
                                        if (typeof objVal === 'object') {
                                            $scope.search.searchString += qs(objKey, objVal.name); // TODO this is for the dropdown selector, rework it instead of doing this
                                        }
                                        else {
                                            $scope.search.searchString += qs(objKey, objVal);
                                        }
                                    }

                                    // if we have a search that has a value, we have a valid search
                                    if (methodCop.check([$scope.search.advFields[objKey]])) {
                                        canSearch = true;
                                    }

                                    // on last iteration
                                    if (
                                        a == Object.keys($scope.search.advFields).length - 1 &&
                                        canSearch
                                    ) {
                                        // no errors, let's proceed to search call
                                        callback(null);
                                    }
                                    // if we don't have valid search criteria
                                    else if (
                                        a == Object.keys($scope.search.advFields).length - 1 &&
                                        !canSearch
                                    ) {
                                        $scope.search.isSearching = false;
                                        return openDialog('You have invalid or incomplete search criteria. Please enter valid criteria to search for.');
                                    }
                                }
                            }
                            catch (err) {
                                callback(err);
                            }
                        }
                    ],
                    // callback after building query string
                    function (err,results) {
                        // if we have a callback set, let's call it
                        if (finalCB) {
                            if (err) {
                                finalCB(err);
                            } else {
                                finalCB(null);
                            }
                        }
                    }
                );
            },

            // returns a list of Responsible Employees from Mongo
            getResponsibleEmployee : function (caseTxt) {
                try {
                    if (!methodCop.check([caseTxt])) {
                        return clientsSearchCalls.getAllResponsibleEmployeeFromMongo()
                            .then(
                                function (resp) {
                                    return _.map(resp, function (elem) {
                                        return {name: elem.value};
                                    });
                                },
                                function (err) {
                                    logError('There was an error getting a list of Responsible Employees: ' + err.message);
                                }
                            );
                    } else {
                        return clientsSearchCalls.getResponsibleEmployeeFromMongo(caseTxt)
                            .then(
                                function (resp) {
                                    return _.map(resp, function (elem) {
                                        return {name: elem.value};
                                    });
                                },
                                function (err) {
                                    logError('There was an error getting a list of Responsible Employees: ' + err.message);
                                }
                            );
                    }
                }
                catch (err) {
                    logError('There was an error getting a list of Responsible Employees: ' + err.message);
                }
            },

            // get matching case subtypes after selecting a case type
            getCaseSubTypes : function (caseSubTxt) {
                try {
                    if (!methodCop.check([caseSubTxt]) && methodCop.check([this.caseType.name])) {
                        return clientsSearchCalls.getAllCaseSubTypesFromClarify(this.caseType.name)
                            .then(
                                function (resp) {
                                    return _.map(resp, function (elem) {
                                        return {name: elem.value};
                                    });
                                },
                                function (err) {
                                    logError('There was an error getting sub types for "' + caseSubTxt + '" case type:' + err.message);
                                }
                            );
                    } else if (!methodCop.check([this.caseType])) {
                        // do nothing... yet. we don't have a case type
                        // TODO : add some type of notice, probably an ng-message, that tells the user that a case type must be specified first
                    } else {
                        return clientsSearchCalls.getCaseSubTypesFromClarify(this.caseType.name, caseSubTxt)
                            .then(
                                function (resp) {
                                    return _.map(resp, function (elem) {
                                        return {name: elem.value};
                                    });
                                },
                                function (err) {
                                    logError('There was an error getting sub types for "' + caseSubTxt + '" case type:' + err.message);
                                }
                            );
                    }
                }
                catch (err) {
                    logError('There was an error getting sub types for "' + caseSubTxt + '" case type:' + err.message);
                }
            },


            // get saved searches for logged in user
            getSavedSearches : function () {
                try {
                    return clientsSearchCalls.getSavedSearches()
                        .then(
                            function (resp) {
                                $scope.search.savedSearches = resp;
                            },
                            function (err) {
                                logError('There was an error trying to get the saved searches for ' + $rootScope.username + ':' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to get the saved searches for ' + $rootScope.username + ':' + err.message);
                }
            },


            // get severity types
            getSeverityTypes : function () {
                try {
                    return clientsSearchCalls.getSeverityListFromClarify()
                        .then(
                            function (resp) {
                                $scope.search.severityTypes = _.map(resp, function (elem) {
                                    return {name: elem.value};
                                });
                            },
                            function (err) {
                                logError('There was an error getting sub types for "' + caseSubTxt + '" case type:' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error getting sub types for "' + caseSubTxt + '" case type:' + err.message);
                }
            },

            listUsers : function (srchtxt) {
                try {
                    return clientAssignCalls.listUsers({
                            name: encodeURIComponent(srchtxt)
                        })
                        .then(
                            function (resp) {
                                return resp;
                            },
                            function (err) {
                                logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                }
            },

            listWorkgroups : function (grp) {
                try {
                    return clientsSearchCalls.getWorkgroupsListFromClarify({group:grp})
                        .then(
                            function (resp) {
                                return resp;
                            },
                            function (err) {
                                logError('There was an error trying to get a list of workgroups: ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to get a list of workgroups: ' + err.message);
                }
            },


            // saves our search then updates our saved searches model
            saveSearch : function (type) {
                try {

                    // create our search that we want to save
                    var search = {
                        searchString : '',
                        searchType : this.isAdvancedSearch ? 'advanced' : 'keyword',
                        id : this.execCurrentSave.id ? this.execCurrentSave.id : null,
                        name : this.newSavedSearch.name ? this.newSavedSearch.name : null,
                        criteria : []
                    };

                    // if we're saving a favorite search, we need to make sure we have a name for it
                    if (type == 'favorite') {

                        // if the user hasn't named the search, tell them so via dialog
                        if (!methodCop.check([$scope.search.newSavedSearch.name])) {
                            return $mdDialog.show(
                                $mdDialog
                                    .alert()
                                    .parent(angular.element(document.querySelector('[clients]')))
                                    .title('Error')
                                    .content('Please provide a name for the search that you are trying to save.')
                                    .ariaLabel('Error Dialog')
                                    .ok('OK')
                                    .clickOutsideToClose(false)
                            );
                        }

                    }


                    // if this is a keyword search, set search string to the keyword and manually create criteria,
                    // otherwise, set it to the criteria in the save card. we'll also send the searchString just in case
                    if (!this.isAdvancedSearch) {
                        search.criteria = [{ field : 'keyword' , value : $scope.search.keyword }];
                        search.searchString = $scope.search.keyword;
                    } else {
                        this.generateSearchString();
                        this.buildSearchSave();
                        search.criteria = $scope.search.newSavedSearch.criteria;
                        search.searchString = $scope.search.searchString;
                    }

                    clientsSearchCalls.saveSearch(type,search)
                        .then(
                            function (resp) {
                                $scope.search.savedSearches = resp;
                                $scope.search.saveCurrentSearch = false; // hide save search card
                                $scope.search.resetSearchSaveParams();
                            },
                            function (err) {
                                logError('There was an error trying to save a search: ' + err.message);
                            }
                        );


                }

                catch (err) {
                    logError('There was an error trying to save a search: ' + err.message);
                }
            },

            // execute client search
            searchclients : function() {
                asvc.addStep('searchclients');
                this.searchString = '';
                this.isSearching = true;
                this.currentType = this.newType; // set current search type

                // re-select the first tab
                $scope.tabData.selectedIndex = 0;

                // handle our fields that are searchaheads
                this.setOriginator();
                this.setCaseOwner();
                this.setSubcaseOwner();
                this.setCaseType();
                this.setCaseSubtype();

                async.series([

                        // set up search string
                        function (callback) {

                            // keyword search
                            if (!$scope.search.isAdvancedSearch) {
                                // need to check if we have a search term
                                if (methodCop.check([$scope.search.keyword])) {
                                    $scope.search.searchString += $scope.search.keyword;
                                    callback(null);
                                }
                                // we don't have a valid keyword... let's tell the user
                                else {
                                    $mdDialog.hide();
                                    $scope.search.isSearching = false;
                                    return openDialog('The keyword you have entered is invalid. Please enter a valid keyword to search for.');
                                }
                            }

                            // advanced search
                            else {
                                $scope.search.searchCases = $scope.search.advFields.searchCases;
                                $scope.search.searchSubcases = $scope.search.advFields.searchSubcases;
                                $scope.search.generateSearchString(callback);
                            }
                        }
                    ],

                    // callback after search string has been prepped
                    function (err,results) {
                        if (err) {
                            $scope.search.isSearching = false;
                            logError('There was an error trying to begin a client search: ' + err.message);
                        } else {
                            // execute search
                            uiGridSearch()
                                .then(function (data, err) {
                                    $scope.search.isSearching = false;
                                    if (err) {
                                        logError('There has been a problem searching clients, try again soon. ' + err.message);
                                    } else {
                                        if (
                                            methodCop.check([data.message]) ||
                                            !methodCop.check([data.matchedCount,data.clientList]) ||
                                            (methodCop.check([data.status]) && data.status != 200)
                                        ) {
                                            var respMsg = data.message || data.text || data.response.text.replace(/<[^>]+>/gm, '') || data;
                                            logError('There has been a problem searching clients: ' + respMsg);
                                        }

                                        else {
                                            $scope.gridOptions.totalItems = data.matchedCount;
                                            $scope.gridOptions.data = data.clientList;

                                            // let's update our saved recent searches
                                            $scope.search.saveSearch('recent');
                                        }
                                    }
                                });
                        }
                    });
            }, // end of searchclients()

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

            // reset the advanced search fields
            resetSearchSaveParams : function() {
                try {
                    this.saveCurrentSearch = false;
                    this.newSavedSearch = {name: '', criteria: [], searchType: ''};
                }
                catch (err) {
                    logError('There was an error trying reset the search parameters for the search to save: ' + err.message);
                }
            },

            setCaseOwner : function () {
                // we need to extract the clarify name from the user
                if (this.caseOwner != '' && this.caseOwner) {
                    this.advFields.CaseOnlyOwner = this.caseOwner.clarifyName;
                }
            },

            setCaseType : function () {
                // we need to extract the case type value
                if (this.caseType != '' && this.caseType) {
                    this.advFields.CaseType = this.caseType.name;
                }
            },

            setCaseSubtype : function () {
                // we need to extract the case subtype value
                if (this.caseSubtype != '' && this.caseSubtype) {
                    this.advFields.SubType = this.caseSubtype.name;
                }
            },

            setOriginator : function () {
                // we need to extract the ntlogin name from the originator
                if (this.originator != '' && this.originator) {
                    this.advFields.OriginatorNTLogin = this.originator.ntLogin;
                }
            },

            setSubcaseOwner : function () {
                // we need to extract the clarify name from the subcase owner data
                if (this.subcaseOwner != '' && this.subcaseOwner) {
                    this.advFields.SubcaseOwner = this.subcaseOwner.ntLogin;
                }
            },

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

            // reveal search options sidenav
            /*toggleSearchOptions: function () {

                 $mdSidenav('searchOptions')
                 .toggle()
                 .then(function () {
                 // can't find a place to put this at the moment,
                 // but we need to clear out the search save data, and clearing it after a toggle seems to work for now
                 if (!$scope.search.sideNavOpen) {
                 $scope.search.newSavedSearch = {name: '', criteria: [], searchType: ''};
                 }
                 $scope.search.getSavedSearches();
                 });

                this.saveCurrentSearch = false;
                this.sideNavOpen = !this.sideNavOpen;
            },*/

            // toggle save search
            toggleSearchSave : function () {
                this.saveCurrentSearch = !this.saveCurrentSearch;
                if (this.saveCurrentSearch) {
                    // build save parameters
                    this.buildSearchSave();
                } else {
                    // clear save parameters
                    this.resetSearchSaveParams();
                }
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



        // we need to have a workaround for detecting when the sidenav is closed
        /*$scope.$watch(
            function() { return $mdSidenav('searchOptions').isOpen(); },
            function(newValue, oldValue) {
                if (!newValue) {
                    // clear search save parameters
                    $scope.search.resetSearchSaveParams();
                } else {
                    // get the latest edition of our saved searches
                    $scope.search.getSavedSearches();
                }
            }
        );*/


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





        /* client Functions
         =====================================================================================- BEGIN */

        $scope.getclient = function(clientId, callbackFunction) {
            if(clientId.indexOf('-') >= 0){
                var req = {
                    method: 'POST',
                    url: '/clients/getSubcase',
                    headers: {
                        accept: 'application/json'
                    },
                    data:{clientId: clientId}
                };
            } else {
                var req = {
                    method: 'POST',
                    url: '/clients/getclientById',
                    headers: {
                        accept: 'application/json'
                    },
                    data:{clientId: clientId}
                };
            }
            $http(req).success(function(resp){
                callbackFunction(resp);
            }).error(function(error_resp){
                console.log('Error: ' + error_resp);
            });
        };

        $scope.getActivityLog = function(clientId,tabId) {
            try {
                var req = {
                    method: 'POST',
                    url: '/clients/getActivityLog',
                    headers: {
                        accept: 'application/json'
                    },
                    data: {clientId: clientId}
                };
                $http(req).success(function (data) {
                    var activityLogList = data.activityLogList ? data.activityLogList : data.activityLogEntry;
                    $scope.tabs[tabId].activityLog.data = activityLogList;

                    // reformat date to a readable format
                    angular.forEach($scope.tabs[tabId].activityLog.data, function (logVal, logKey) {
                        logVal.createDate = moment(logVal.createDate).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                    });

                }).error(function (error_resp) {
                    logError('There was an error trying to get the Activity Log for ' + clientId + ': ' + error_resp);
                });
            }
            catch (err) {
                logError('There was an error trying to get the Activity Log for ' + clientId + ': ' + err.message);
            }
        };

        /*Get Activity Log*/
        $scope.getSubcaseActivityLog = function(clientId,tabId) {
            $http.post('/clients/getSubcaseActivityLog',{
                    id:clientId
                })
                .success(function(data){
                    var activityLogList = data.activityLogList ? data.activityLogList : data.activityLogEntry;
                    $scope.tabs[tabId].activityLog.data = activityLogList;

                    // reformat date to a readable format
                    angular.forEach($scope.tabs[tabId].activityLog.data, function (logVal, logKey) {
                        logVal.createDate = moment(logVal.createDate).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                    });
                })
                .error(function(err){
                    console.log('Error:' + error_resp);
                })

        };


        /**************************************
         * client Assign
         **************************************/
        $scope.assign = {
            assignUser : function (id) {
                try {
                    clientAssignCalls.assignclient({
                            id : id,
                            targetUser : $scope.assign[id].userToAssign.clarifyName
                        })
                        .then(
                            function (resp) {
                                // if everything went well
                                if (resp.status == 200) {
                                    $scope.assign[id].hasChanged = false;
                                    $mdToast.show({
                                        autoWrap: false,
                                        controller: 'ToastCtrl',
                                        template : '<md-toast class="md-toast success">client ' + id + ' has been assigned to ' + $scope.assign[id].userToAssign.fullName + '.</md-toast>',
                                        hideDelay: 5000
                                    });
                                }
                                // we received an error from the server
                                else {
                                    logError('There was an error trying to assign client ' + id + ' to ' + $scope.assign[id].userToAssign.clarifyName + ': ' + resp.data.message);
                                }

                            },
                            // there was an error trying to make the request
                            function (err) {
                                logError('There was an error trying to assign client ' + id + ' to ' + $scope.assign[id].userToAssign.clarifyName + ': ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to assign client ' + id + ' to ' + $scope.assign[id].userToAssign.clarifyName + ': ' + err.message);
                }
            },
            searchUsers : function (id) {
                try {
                    return clientAssignCalls.listUsers({
                            name: encodeURIComponent($scope.assign[id].userSearchTxt)
                        })
                        .then(
                            function (resp) {
                                return resp;
                            },
                            function (err) {
                                logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                }
            },
            selectUser : function (id,user) {
                try {
                    if (methodCop.check([id,user])) {
                        if ($scope.assign[id].originalUser.clarifyName != user.clarifyName) {
                            $scope.assign[id].userToAssign.clarifyName = user.clarifyName;
                            $scope.assign[id].userToAssign.ntLogin = user.ntLogin;
                            $scope.assign[id].userToAssign.fullName = user.fullName;
                            console.log('client we are trying to assign: ' + id, '; User we are trying to assign client to: ' + user.clarifyName);
                            $scope.assign[id].hasChanged = true;
                        }
                    } else {
                        console.error('We either do not have a client id [' + id + '] nor a user [' + user + '] yet.');
                    }
                }
                catch (err) {
                    logError('There was an error trying to select a user to assign client ' + id + ': ' + err.message);
                }
            },
            cancelChange : function (id) {
                try {
                    $scope.assign[id].hasChanged = false;
                    // reset name to original value
                    if (methodCop.check([$scope.assign[id].originalUser])) {
                        $scope.assign[id].userToAssign = angular.copy($scope.assign[id].originalUser);
                        $scope.assign[id].userSearchTxt = $scope.assign[id].originalUser.fullName;
                    } else {
                        $scope.assign[id].userToAssign = {
                            ntLogin : '',
                            fullName : ''
                        };
                        $scope.assign[id].userSearchTxt = '';
                    }
                }
                catch (err) {
                    logError('There was an error trying to select a user to assign client ' + id + ': ' + err.message);
                }
            }
        };


        /**************************************
         * client Dispatch
         **************************************/
        $scope.dispatch = {
            dispatchToQueue : function (id) {
                try {
                    clientAssignCalls.dispatchclient({
                            id : id,
                            targetQueue : $scope.dispatch[id].queueToDispatch.title
                        })
                        .then(
                            function (resp) {
                                // if everything went well
                                if (resp.status == 200) {
                                    $scope.dispatch[id].hasChanged = false;
                                    $mdToast.show({
                                        autoWrap: false,
                                        controller: 'ToastCtrl',
                                        template : '<md-toast class="md-toast success">client ' + id + ' has been dispatched to ' + $scope.dispatch[id].queueToDispatch.title + '.</md-toast>',
                                        hideDelay: 5000
                                    });
                                }
                                // we received an error from the server
                                else {
                                    logError('There was an error trying to dispatch client ' + id + ' to ' + $scope.dispatch[id].queueToDispatch.title + ': ' + resp.data.message);
                                }

                            },
                            // there was an error trying to make the request
                            function (err) {
                                logError('There was an error trying to dispatch client ' + id + ' to ' + $scope.dispatch[id].queueToDispatch.title + ': ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to dispatch client ' + id + ' to ' + $scope.dispatch[id].queueToDispatch.title + ': ' + err.message);
                }
            },
            searchQueues : function (id) {
                try {
                    return clientAssignCalls.listQueues({
                            title: encodeURIComponent($scope.dispatch[id].queueSearchTxt)
                        })
                        .then(
                            function (resp) {
                                return resp;
                            },
                            function (err) {
                                logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                            }
                        );
                }
                catch (err) {
                    logError('There was an error trying to search for users to assign to client ' + id + ': ' + err.message);
                }
            },
            selectQueue : function (id,queue) {
                try {
                    if (methodCop.check([id,queue])) {
                        if ($scope.dispatch[id].queueToDispatch.title != queue.title) {
                            console.log('client we are trying to dispatch: ' + id, '; Queue we are trying to dispatch client to: ' + queue.title);
                            $scope.dispatch[id].queueToDispatch.title = queue.title;
                            // $scope.dispatch[id].queueToDispatchDesc = queue.description;
                            $scope.dispatch[id].hasChanged = true;
                        }
                    }
                    /*
                     else {
                     console.error('We either do not have a client id [' + id + '] nor a queue name [' + queue + '] yet.');
                     }
                     */
                }
                catch (err) {
                    logError('There was an error trying to select a queue to dispatch client ' + id + ': ' + err.message);
                }
            },
            cancelChange : function (id) {
                try {
                    // reset queue name to original value
                    if (methodCop.check([$scope.assign[id].originalQueue])) {
                        $scope.dispatch[id].queueToDispatch = angular.copy($scope.dispatch[id].originalQueue);
                        $scope.dispatch[id].queueSearchTxt = $scope.assign[id].originalQueue;
                    } else {
                        $scope.dispatch[id].queueToDispatch = '';
                        $scope.dispatch[id].queueSearchTxt = '';
                    }

                    $scope.dispatch[id].hasChanged = false;
                }
                catch (err) {
                    logError('There was an error trying to cancel dispatch changes to client ' + id + ': ' + err.message);
                }
            }
        };



        /* client Functions
         =====================================================================================- END */


        /* Note Functions
         =====================================================================================- BEGIN */

        $scope.getNotes = function(clientId,tabId){
            $scope.notesLoading = true;
            $http.post('/clients/notes',{
                    clientId: clientId
                })
                .success(function(data){
                    $scope.notesLoading = false;

                    if (!angular.isArray(data.note) || !angular.isArray(data.noteList)){
                        var notes = data.noteList ? data.noteList : data.note;
                        $scope.tabs[tabId].caseHistory.data = [notes];
                    }
                    if(tabId !== undefined){
                        $scope.tabs[tabId].caseHistory.data = notes;
                    } else {
                        $scope.tab.caseHistory.data = notes;
                    }

                    // reformat date to a readable format
                    angular.forEach($scope.tabs[tabId].caseHistory.data, function (noteVal, noteKey) {
                        noteVal.createDate = moment(noteVal.createDate).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                    });

                })
                .error(function(err){
                    //if no notes are found swallow exception
                    if(err.message != 'Not Found'){
                        $scope.error = err;
                    } else {
                        $scope.error = '';
                    }
                })
        };

        /*Get Subcase Notes*/
        $scope.getSubcaseNotes = function(clientId,tabId) {
            $http.post('/clients/getSubcaseNotes',{
                    id:clientId
                })
                .success(function(data){
                    if (!angular.isArray(data.note) || !angular.isArray(data.noteList)){
                        var notes = data.noteList ? data.noteList : data.note;
                        $scope.tabs[tabId].caseHistory.data = [notes];
                    }
                    if(tabId !== undefined){
                        $scope.tabs[tabId].caseHistory.data = notes;
                    } else {
                        $scope.tab.caseHistory.data = notes;
                    }

                    // reformat date to a readable format
                    angular.forEach($scope.tabs[tabId].caseHistory.data, function (noteVal, noteKey) {
                        noteVal.createDate = moment(noteVal.createDate).format('MM/DD/YYYY HH:MM:SS.SSSS Z');
                    });
                })
                .error(function(err){
                    //if no notes are found swallow exception
                    if(err.message != 'Not Found'){
                        $scope.error = err;
                    } else {
                        $scope.error = '';
                    }
                })
        };

        //clear any errors styles if any note data  is entered
        $scope.onTextAreaChange = function(type){
            if(type === 'int'){
                $scope.internalNoteTextAreaStyle = '';
            } else {
                $scope.externalNoteTextAreaStyle = '';
            }
        };

        function noteIsValid(type,tab) {
            if (type==='int'){
                if(angular.isDefined(tab.newInternalNote) && tab.newInternalNote.length > 0){
                    return true;
                } else {
                    $scope.internalNoteTextAreaStyle = 'border-color:red;';
                    return false;
                }
            } else {
                if(angular.isDefined(tab.newExternalNote) && tab.newExternalNote.length > 0){
                    return true;
                } else {
                    $scope.externalNoteTextAreaStyle = 'border-color:red;';
                    return false;
                }
            }
        }


        $scope.addNote = function(type,tab,whichTab){
            if(!noteIsValid(type,tab)) {
                return;
            }

            var newNote;
            if (type==='int'){
                newNote = tab.newInternalNote
            } else {
                newNote = tab.newExternalNote
            }


            $http.post('/clients/addNote/clients/Update',{
                    intOrExt: type,
                    newNote: newNote,
                    client: tab.clientId
                })
                .success(function(d){
                    if (type ==='int'){
                        if(whichTab !== undefined){
                            $scope.tabs[whichTab].newInternalNote = '';
                        } else {
                            $scope.tab.newInternalNote = '';
                        }
                    } else {
                        if(whichTab !== undefined){
                            $scope.tabs[whichTab].newExternalNote = '';
                        } else {
                            $scope.tab.newExternalNote = '';
                        }
                    }
                    $scope.getNotes(tab.clientId, whichTab);
                    //Refresh Activity Log after new note is added
                    $scope.getActivityLog(tab.clientId,whichTab);
                })
                .error(function(err){
                    $scope.error = err;
                })
        };

        $scope.showAddNote = function(condition){
            if(condition === 'Closed') {
                return false;
            } else {
                if($scope.canAddNote) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        /* Note Functions
         =====================================================================================- END */




        $scope.onSlaTypeChange = function(tab,index) {
            if(index > -1) {
                $scope.tabs[tab].slaIndex = index;
            }
        };


        $scope.onZoneToggleClick = function( showZone ){
            $scope.showZoneToggle = !showZone;
            if(!$scope.showZoneToggle){
                angular.element('#caseSection').css('margin-top','90px');
            } else {
                angular.element('#caseSection').css('margin-top','250px');
            }
        };





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


        $scope.openNotesWizard = function (tab,IntExt) {
            $scope.tabs[tab].showNoteWizard = true;
            /* not using but leaving this for reference
             this is the modal that displayed the notes wiz
             var templateInfo = {
             group : tempGroup,
             name : tempName
             };
             $mdDialog
             .show({
             controller: NotesTemplateDialogController(
             $scope,
             $mdDialog,
             $sce,
             methodCop,
             oclLog,
             templateInfo
             ),
             // scope: $scope.$new(),
             templateUrl: 'addNoteWizard',
             parent: angular.element(document.querySelector('[clients]')),
             clickOutsideToClose: false
             })
             .then(
             function () {
             // finish note
             },
             function () {
             // cancel note
             }
             );
             */
        };


        $scope.closeNotesWizard = function (tab) {
            $scope.tabs[tab].showNoteWizard = false;
        };

        // handle success with add note via Note Wiz; update notes and activity for detail and close Note Wiz
        $scope.addNoteWithWizardSuccess = function (clientId,tab) {
            $scope.getNotes(clientId,tab);
            if (clientId.indexOf('-') > -1) {
                $scope.getSubcaseActivityLog(clientId,tab);
            } else {
                $scope.getActivityLog(clientId,tab);
            }
            $scope.closeNotesWizard(tab);
        };

        // handle error if there was one while trying to add a note via Note Wiz
        $scope.addNoteWithWizardError = function (error,tab) {
            logError('There was an error trying to add a note for client ' + tabValue.clientId + '. Submit an email to DL-OCLFeedback@Level3.com with a description of the issue and the steps you performed to get the error.')
        };











        /* clients Init Calls --
         Some things that we need to run to init the search UI
         =====================================================================================- BEGIN */

        // may not need to do this ... may be best to just get the searches after opening the sidenav
        // $scope.search.getSavedSearches(); // get the saved searches for the logged in user


        /* clients Init Calls
         =====================================================================================- BEGIN */





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
