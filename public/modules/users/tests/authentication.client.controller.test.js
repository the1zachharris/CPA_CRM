/**
 * Created by ehartmannu0212760 on 6/23/2015.
 */

describe('Authentication Controller', function() {
    // Load the module with MainController
    beforeEach(module('users'));

    var ctrl, scope,httpMock,routeParams;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope,$httpBackend) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        // Create the controller
        ctrl = $controller('AuthenticationController', {
            $scope: scope
        });
    }));
    it('The controller should be injected and defined',function(){
        expect(ctrl).toBeDefined();

    });





});