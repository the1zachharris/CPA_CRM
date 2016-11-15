'use strict';

var applications = angular.module('applications',[
    'ngAnimate',
    'ui.bootstrap'
]);
    applications.controller('ApplicationsController',['$scope','$location','$http','$routeParams','$timeout','$modal','$log','methodCop',
        function($scope,$location,$http,$routeParams,$timeout,$modal,$log,methodCop) {

            /*
            authorization.check('Applications','Read',true);

            // check for Create permission
            authorization.check(
                'Applications',
                'Create',
                null,
                function (res,err) {
                    if (err) {
                        console.error(err);
                    } else {
                        $scope.canCreate = res;
                    }
                }
            );

            // check for Update permission
            authorization.check(
                'Applications',
                'Update',
                null,
                function (res,err) {
                    if (err) {
                        console.error(err);
                    } else {
                        $scope.canUpdate = res;
                    }
                }
            );

            // check for Update permission
            authorization.check(
                'Applications',
                'Delete',
                null,
                function (res,err) {
                    if (err) {
                        console.error(err);
                    } else {
                        $scope.canDelete = res;
                    }
                }
            );
            */

            $scope.permsAdded = [];
            $scope.application = {};
            $scope.application.allRoles = [];
            $scope.application.allPerms = [];
            $scope.application.menuItems = [];
            $scope.application.allMenuItems = [];

            $scope.application.ready = false;

            $scope.permAdded = false; // a permission hasn't been added yet
            $scope.menuAdded = false; // a menu item hasn't been added yet



            $scope.tabs = {
                tab1: {
                    dead: false,
                    active: true,
                    view: 'myHTMLfile.html'
                },
                tab2: {
                    dead: true,
                    active: false
                },
                tab3: {
                    dead: true,
                    active: false
                },
                tab4: {
                    dead: true,
                    active: false
                },
                tab5: {
                    dead: true,
                    active: false
                }
            };






            $scope.modal = {}; // object to hold the title and body for modal content


            $scope.goToTab = function (tab) {
                angular.forEach($scope.tabs, function(value,key) {
                    if (tab === key) {
                        $scope.tabs[key].active = true;
                    } else {
                        $scope.tabs[key].active = false;
                    }
                });
            };





            /* ================================================================================
               Details
             * ================================================================================ */

            $scope.checkName = function(){
                $http.post('/checkApp',{
                    appName : $scope.application.name,
                    myApp : 'Applications',
                    myPerm : 'Create'
                })
                    .success(function(data){
                        if (data.results === null){
                            $scope.tabs.tab2.dead = false;
                            $scope.goToTab('tab2');
                        } else {
                            $scope.modal = {
                                title : 'Error',
                                body : 'An application with the name \'' + $scope.application.name + '\' already exists. Please choose another name.'
                            };
                            $scope.openModal('sm');
                        }

                    })
                    .error(function(err){
                        $scope.modal = {
                            title : 'Error',
                            body : 'There was an issue communicating with the server. Please try again soon.'
                        };
                        $scope.openModal('sm');
                    })
            };






            /* ================================================================================
               Roles
             * ================================================================================ */

            $scope.checkRole = function(newRole){
                $scope.dup = false;
                $scope.application.newRole = newRole;
                if ($scope.application.newRole) {
                    if ($scope.application.allRoles) {
                        //do loop to check for duplicates
                        angular.forEach($scope.application.allRoles, function (value) {
                            if (angular.lowercase(value.name) === angular.lowercase(newRole)) {
                                $scope.dup = true;
                            }
                        });
                        $scope.addRole(newRole);//end loop
                        $scope.tabs.tab3.dead = false;
                    } else {
                        //Add the role if it is the first object in the array
                        $scope.addRole(newRole);
                        $scope.tabs.tab3.dead = false;
                    }
                } else {
                    // console.dir($scope.application.newRole);
                    // $scope.error = 'Please enter a value for the role';
                    $scope.modal = {
                        title : 'Error',
                        body : 'Please enter a value for the role.'
                    };
                    $scope.openModal('sm');
                }
            };


            //took out perms:[]
            $scope.addRole = function(newRole){
                if (!$scope.dup){
                    var newRoleId = Math.random().toString();
                    $scope.application.allRoles.push({
                        name: newRole,
                        id:  CryptoJS.SHA1(newRoleId).toString()
                    });
                    $scope.application.newRole = '';
                    $scope.showRolesAdded = true;
                    $scope.error = '';
                } else {
                    $scope.modal = {
                        title : 'Error',
                        body : 'There is a role that already exists with that name. Please choose another.'
                    };
                    $scope.openModal('sm');
                }

            };


            $scope.removeRole = function(role){
                $scope.error = '';
                $scope.application.allRoles.splice(role, 1);
            };










            /* ================================================================================
               Permissions
             * ================================================================================ */

            $scope.checkPerm = function(newPerm){
                $scope.dup = false;
                if (newPerm) {
                    if ($scope.application.allPerms) {
                        //do loop to check for duplicates
                        angular.forEach($scope.application.allPerms, function (value) {
                            if (angular.lowercase(value.name) === angular.lowercase(newPerm)) {
                                $scope.dup = true;
                            }
                        });
                        $scope.addPerm(newPerm);//end loop
                    } else {
                        //Add the role if it is the first object in the array
                        $scope.addPerm(newPerm);
                    }
                } else {
                    $scope.modal = {
                        title : 'Error',
                        body : 'Please enter a value for the permission.'
                    };
                    $scope.openModal('sm');
                }
            };

            $scope.addPerm = function(newPerm){
              if (!$scope.dup){
                  $scope.application.allPerms.push({name:newPerm});
                  $scope.application.newPerm = '';
                  $scope.showButtons = true;
                  $scope.showChecks = true;
                  $scope.error = '';
                  $scope.permAdded = true; // show permissions matrix
                  $scope.tabs.tab4.dead = false;
              } else {
                  $scope.modal = {
                      title : 'Error',
                      body : 'There is a permission that already exists with that name. Please choose another.'
                  };
                  $scope.openModal('sm');
              }
            };

            $scope.goToPerms = function(){
                if ($scope.application.allRoles.length === 0){
                    $scope.modal = {
                        title : 'Error',
                        body : 'You must enter at least one role into your application.'
                    };
                    $scope.openModal('sm');
                } else {
                    if ($scope.newRole){
                        $scope.modal = {
                            title : 'Error',
                            body : 'Please submit your role or clear out the field.'
                        };
                    } else {
                        $scope.error = '';
                        $scope.appAdded = false;
                        $scope.roleAdded = true;
                    }

                }
            };

            $scope.removePerm = function(perm){
                $scope.error = '';
                $scope.application.allPerms.splice(perm,1);
            };


            $scope.checkAll = function(role){
                //see if they are all checked (permissions on a role)
                var toCheck = angular.element(document.getElementsByClassName(role.replace(' ','')));
                if (!$scope.allChecked){
                    $scope.allChecked = true;
                    angular.forEach(toCheck,function(elem){
                        elem.checked = 'checked';
                    })

                } else {
                    $scope.allChecked = false;
                    angular.forEach(toCheck,function(elem){
                        elem.checked = '';
                    })
                }
            };



            /* ================================================================================
               Settings
             * ================================================================================ */

            // add setting to settings array if does not already exist
            $scope.addSetting = function () {
                try {
                    // make sure we have settings property
                    if (methodCop.check([
                        $scope.application.settings
                    ])) {
                        // check if proposed entry is valid
                        if (methodCop.check([$scope.application.newSettingName])) {
                            // check if any settings exist
                            if ($scope.application.settings.length > 0) {
                                // if so, loop through them to find any that match the one we want to add
                                for (
                                    var s = 0;
                                    s < $scope.application.settings.length;
                                    s++
                                ) {
                                    // if a name exists, show modal and end loop
                                    if ($scope.application.settings[s].name === $scope.application.newSettingName) {
                                        $scope.modal = {
                                            title: 'Error',
                                            body: 'That setting already exists. Please enter a name for your setting that does not exist.'
                                        };
                                        $scope.openModal2('sm');
                                        break;
                                    }

                                    // if at the end of the loop, and no duplicate exists, add it
                                    else if (s === $scope.application.settings.length - 1) {
                                        $scope.application.settings.push({
                                            name: $scope.application.newSettingName,
                                            value: $scope.application.newSettingValue,
                                            info: $scope.application.newSettingInfo
                                        });
                                        break;
                                    }
                                }
                            } else {
                                $scope.application.settings.push({
                                    name: $scope.application.newSettingName,
                                    value: $scope.application.newSettingValue,
                                    info: $scope.application.newSettingInfo
                                })
                            }
                        } else {
                            $scope.modal = {
                                title: 'Error',
                                body: 'That is an invalid name for your setting. Please enter a valid name for your setting that does not exist.'
                            };
                            $scope.openModal2('sm');
                        }
                    } else {
                        console.error('Could not find the settings for this application: ' + err.message);
                        console.log('error','Could not find the settings for this application: ' + err.message);
                        $scope.modal = {
                            title: 'Error',
                            body: 'Could not modify the settings for this application.'
                        };
                        $scope.openModal2('sm');
                    }
                }

                catch (err) {
                    console.error('There was an error trying to add a setting to an application: ' + err.message);
                    console.log('error','There was an error trying to add a setting to an application: ' + err.message);
                    $scope.modal = {
                        title: 'Error',
                        body: 'There was an error trying to add that setting.'
                    };
                    $scope.openModal2('sm');
                }
            };

            // remove setting from list
            $scope.removeSetting = function (index) {
                try {
                    $scope.application.settings.splice(index, 1);
                }

                catch (err) {
                    console.log('error','There was an error trying to delete a setting from an application: ' + err.message);
                    $scope.modal = {
                        title: 'Error',
                        body: 'There was an error trying to delete that setting.'
                    };
                    $scope.openModal2('sm');
                }
            };









            /* ================================================================================
               Menu Items
             * ================================================================================ */

            $scope.checkMenuItem = function(newMenuItem,newMenuIcon,newMenuLoc){
                $scope.dup = false;
                if (newMenuItem) {
                    if ($scope.application.allMenuItems) {
                        //do loop to check for duplicates
                        angular.forEach($scope.application.allMenuItems, function (value) {
                            if (angular.lowercase(value.name) === angular.lowercase(newMenuItem)) {
                                $scope.dup = true;
                            }
                        });
                        $scope.addMenuItem(newMenuItem,newMenuIcon,newMenuLoc);//end loop
                    } else {
                        //Add the role if it is the first object in the array
                        $scope.addMenuItem(newMenuItem,newMenuIcon,newMenuLoc);
                    }
                } else {
                    $scope.modal = {
                        title : 'Error',
                        body : 'Please enter a value for the menu item.'
                    };
                    $scope.openModal('sm');
                }
            };

            $scope.addMenuItem = function(item,icon,loc){
                if (!$scope.dup){
                    var newMenuId = Math.random().toString();
                    $scope.application.allMenuItems.push({
                        name : item,
                        id:  CryptoJS.SHA1(newMenuId).toString(),
                        icon : icon,
                        location : loc
                    });
                    $scope.application.newMenuItem = '';
                    $scope.application.newMenuIcon = '';
                    $scope.application.newMenuLoc = '';
                    $scope.showButtons = true;
                    $scope.showChecks = true;
                    $scope.menuAdded = true; // show menu matrix
                    $scope.application.ready = true;
                } else {
                    $scope.modal = {
                        title : 'Error',
                        body : 'There is already a menu item with that name. Please choose another.'
                    };
                    $scope.openModal('sm');
                }
            };

            $scope.goToMenuItems = function(){
                if ($scope.application.allRoles.length === 0){
                    $scope.error = 'You must enter some roles first';
                } else {
                    if ($scope.newRole){
                        $scope.modal = {
                            title : 'Error',
                            body : 'Please submit your role or clear out the field.'
                        };
                        $scope.openModal('sm');
                    } else {
                        $scope.error = '';
                        $scope.appAdded = false;
                        $scope.roleAdded = true;
                    }

                }
            };

            $scope.removeMenuItem = function(menuitem){
                $scope.error = '';
                $scope.application.allMenuItems.splice(menuitem,1);
            };

            $scope.removeMenuItemPerms = function(menuitemindex){
                $scope.application.allMenuItems[menuitemindex].perm = '';
            };




            $scope.addApplication = function(){
                //if ($scope.canCreate) {
                    $scope.appSend = {
                        application: $scope.application.name,
                        icon: $scope.application.icon,
                        itpkmid: $scope.itpkmid,
                        allRoles: $scope.application.allRoles,
                        allPerms: $scope.application.allPerms, // contains menu items with permissions
                        allMenuItems: $scope.application.allMenuItems,
                        description: $scope.application.description,
                        roles:[]
                    };

                    angular.forEach($scope.application.allRoles,function(role){
                        $scope.appSend.roles.push({
                            name : role.name,
                            id : role.id,
                            perms : []
                        });
                    });

                    /*
                     angular.forEach($scope.application.allMenuItems,function(item){
                     $scope.appSend.menuItems.push({
                     menuItem : item.name,
                     menuIcon : item.icon,
                     menuLoc : item.loc,
                     perm : {
                     name : item.perm,
                     permID : item.perm
                     }
                     });
                     });
                     */

                    var objIt;
                    //This is where it loops over each role
                    angular.forEach($scope.application.allRoles,function(obj,key,value){
                        objIt = key;
                        var thisRole =  angular.element(document.getElementsByClassName(obj.name.replace(' ','')));
                        //for each role check to see if elm is checked
                        (function () {
                            angular.forEach(thisRole,function(elm){
                                //if elm is checked then add the permission to the roles vs. all roles with the permissions for that role under it
                                if (elm.checked){
                                    //push to the roles array
                                    $scope.appSend.roles[objIt].perms.push({
                                        name : elm.getAttribute('data-perm'),
                                        id : elm.getAttribute('data-roleid'),
                                        menuItems : []
                                    });
                                }
                            });
                        })();
                        (function () {
                            // loop over each menu item to get attached perm
                            angular.forEach($scope.application.allMenuItems, function (obj,key,val) {
                                var menuItem = obj;
                                if (typeof menuItem.perm !== 'undefined'){ // if perm is set on the menu item
                                    // loop through each checked perm and compare with perm attached to meny item
                                    // if they match added the menu item to appsend > roles > perms > menuitems
                                    angular.forEach($scope.appSend.roles[objIt].perms, function (v,k) {
                                        // $log.info(v.name + ':' + menuItem.perm);
                                        if (v.name === menuItem.perm) {
                                            v.menuItems.push(menuItem);
                                        }
                                    });
                                }
                            });
                        })();
                    });

                    $http.post('/applications',{newApp:$scope.appSend})
                        .success(function(data){
                            $scope.dataRec = data;
                            // console.log(data);
                            $scope.tabs.tab1.dead = $scope.tabs.tab2.dead = $scope.tabs.tab3.dead = $scope.tabs.tab4.dead = true;
                            $scope.tabs.tab5.dead = false;
                            $scope.tabs.tab5.active = true;

                        })
                        .error(function(err){
                            $scope.modal = {
                                title : 'Error',
                                body : 'There was an error communicating with the server. Please try again.'
                            };
                            $scope.openModal('sm');
                        });
            /*
            } else {
                    $scope.modal = {
                        title : 'Error',
                        icon : 'exclamation-triangle',
                        body : 'You are not authorized to perform this function.'
                    };
                    $scope.openModal('sm');
                }
            */
            };

            $scope.find = function(){
                $http.get('/applications')
                    .success(function(data){
                        if (!data.length){
                            $scope.applications = false;
                        } else {
                            $scope.applications = data
                        }
                    })
                    .error(function(err){
                        $scope.error = err;
                    })
            };

            $scope.findOne = function(){
                $scope.application = '';
                $http.get('/application/'+  $routeParams.applicationId)
                .success(function(data){
                    $scope.application = data.app[0];
                    // console.dir($scope.application);
                    $timeout(function(){
                      $scope.populateChecked();
                    },500)
                })
                .error(function(err){
                  window.location.href ='#/applications';
                  $scope.fail = true;
                 $scope.error = err.message
                })
            };




            //permissions on a role
            $scope.populateChecked = function(){
                angular.forEach($scope.application.roles,function(obj,key,value){
                    angular.forEach(obj.perms,function(pObj,pKey,pValue){
                        var  elmName = obj.name.replace(' ','') + ' ' + pObj.name.replace(' ','');
                        var elm = angular.element(document.getElementsByClassName(elmName));
                        elm[0].checked= 'checked';
                    })
                });
            };

            $scope.update = function(){
                //if ($scope.canUpdate) {
                    delete $scope.application.roles;
                    $scope.application.roles = [];
                    $scope.application.roles.push($scope.application.allRoles);
                    $scope.application.roles = $scope.application.roles[0];
                    /*
                     var objIt;
                     angular.forEach($scope.application.allRoles,function(obj,key,value){
                     obj.perms = [];
                     objIt = key;
                     var thisRole =  angular.element(document.getElementsByClassName(obj.name.replace(' ','')));
                     //permissions on a role
                     angular.forEach(thisRole,function(elm){
                     if (elm.checked){
                     $scope.application.roles[objIt].perms.push({name:elm.getAttribute('data-perm')});
                     }
                     });
                     });
                     */
                    var objIt;
                    //This is where it loops over each role
                    angular.forEach($scope.application.allRoles,function(obj,key,value){
                        obj.perms = [];
                        objIt = key;
                        var thisRole =  angular.element(document.getElementsByClassName(obj.name.replace(' ','')));
                        //for each role check to see if elm is checked
                        (function () {
                            angular.forEach(thisRole,function(elm){
                                //if elm is checked then add the permission to the roles vs. all roles with the permissions for that role under it
                                if (elm.checked){
                                    //push to the roles array
                                    $scope.application.roles[objIt].perms.push({
                                        name : elm.getAttribute('data-perm'),
                                        menuItems : []
                                    });
                                }
                            });
                        })();
                        (function () {
                            // loop over each menu item to get attached perm
                            angular.forEach($scope.application.allMenuItems, function (obj,key,val) {
                                var menuItem = obj;
                                if (typeof menuItem.perm !== 'undefined'){ // if perm is set on the menu item
                                    // loop through each checked perm and compare with perm attached to menu item
                                    // if they match added the menu item to applicaton > roles > perms > menuitems
                                    angular.forEach($scope.application.roles[objIt].perms, function (v,k) {
                                        // $log.debug(v.name + ':' + menuItem.perm);
                                        // $log.info(v);
                                        if (v.name === menuItem.perm) {
                                            v.menuItems.push(menuItem);
                                            /*
                                             if (typeof v.menuItems === 'undefined') {
                                             v.menuItems = [];
                                             v.menuItems.push(menuItem);
                                             } else {
                                             v.menuItems.push(menuItem);
                                             }
                                             */
                                        }
                                    });
                                }
                            });
                        })();
                    });

            $http.post('/applications/update',{updatedApp:$scope.application})
                        .success(function(data){
                            $scope.dataRec = data;
                            window.location.href ='#/applications';
                        })
                        .error(function(err){
                            $scope.error = err.message;
                        });
                /*
                } else {
                    $scope.modal = {
                        title : 'Error',
                        icon : 'exclamation-triangle',
                        body : 'You are not authorized to perform this function.'
                    };
                    $scope.openModal('sm');
                }
                */
            };

            $scope.deleteApp = function(){
                //if ($scope.canDelete) {
                    $scope.modal = {
                        title : 'Delete ' + $scope.application.name,
                        body : 'Are you sure you want to delete the application, \'' + $scope.application.name + '?\''
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
                            $scope.forRealDeleteApp();
                        },
                        function () {
                            // $log.info('Modal dismissed at: ' + new Date());
                            $log.info('Delete App cancelled');
                        }
                    );
            /*
            } else {
                    $scope.modal = {
                        title : 'Error',
                        icon : 'exclamation-triangle',
                        body : 'You are not authorized to perform this function.'
                    };
                    $scope.openModal('sm');
                }
            */
            };

            $scope.forRealDeleteApp = function(){
                $http.delete('/applications/manage/'+$scope.application._id)
                    .success(function(data){
                        window.location.href ='#/applications';
                        $scope.dataRec = data;
                    })
                    .error(function(err){
                        $scope.error = err.message;
                        $log.error('There was an error deleting the app: ' + err.message);
                        $scope.modal = {
                            title : 'Error',
                            body : 'There is an error deleting the application. Please try again.'
                        };
                        $scope.openModal('sm');
                    })
            };

            $scope.cancelCreate = function(){
                $scope.application = '';
                $scope.backToAppsList();
            };





            $scope.backToAppsList = function () {
                window.location.href = '#/applications';
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

            $scope.openModal2 = function (size) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'appModal2',
                    controller: 'ModalInstanceCtrl',
                    scope: $scope,
                    size: size
                    // resolve: {}
                });
            };



        }
    ]);

    /* ================================================================================
       Modal Controller
     * ================================================================================ */
    applications.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

        $scope.cancel = function () {
            // $log.info('We are canceling...');
            $modalInstance.dismiss('cancel');
        };
        $scope.confirm = function () {
            //$log.info('We are confirming...');
            $modalInstance.close($scope.forRealDeleteApp());
        };


    });