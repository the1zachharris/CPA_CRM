
describe('Application controller', function() {
    var isIE9orLess = false;
    // Load the module with MainController
    beforeEach(module('opsConsoleLite'));

    var ctrl, scope,httpMock,routeParams;
    var isIE9orLess = false;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope,$httpBackend,$routeParams) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        routeParams = $routeParams;
        // Create the controller
        ctrl = $controller('ApplicationsController', {
            $scope: scope
        });
    }));
    it("The controller should be injected and defined",function(){
        expect(ctrl).toBeDefined();

    });

    it('$scope.findOne() should retreive an application', function() {
        var sampleApplication =  {app:[{
            name:'test app',
            roles: []
        }]};
       // console.log(sampleApplication)

        // Set the URL parameter
        routeParams.applicationId ='525a8422f6d0f87f0e407a33';
        // Set GET response
        httpMock.expectGET('/application/'+ routeParams.applicationId).respond(sampleApplication);

        scope.findOne();
        httpMock.flush();

        expect(scope.application).toEqual(sampleApplication.app[0]);
    });

    it('$scope.find() should find a list of applications', function() {
        var sampleApplication =  [{app:{
            name:'test app',
            roles: []
        }}];

        // Set GET response
        httpMock.expectGET('/applications').respond(sampleApplication);
        scope.find();

        httpMock.flush();
        // Test scope value
        expect(scope.applications).toEqual(sampleApplication);
    });

    it('$scope.addApplication() should create an application', function() {
        var sampleApplication =  {app:{
            name:'test app',
            roles: []
        }};

        // Set GET response
        httpMock.expectPOST('/applications').respond(sampleApplication);
        scope.addApplication();

        httpMock.flush();
        // Test scope value
        expect(scope.dataRec).toEqual(sampleApplication);
    });

    it('$scope.goBackToOne() should work correctly', function() {
        scope.appAdded = true;
        scope.hideApp = true;
        scope.goBackToOne();

        expect(scope.appAdded).toBe(false);
        expect(scope.hideApp).toBe(false)
    });


    it('$scope.addRole() and removeRole() should work correctly', function() {
        //add a new role
        scope.addRole('testRole');
        expect(scope.application.allRoles.length).toEqual(1);
        expect(scope.showRolesAdded).toBe(true);

        //now remove the role
        scope.removeRole(0);
        expect(scope.application.allRoles.length).toEqual(0);

    });

    it('$scope.update() should update an application', function() {
        scope.application = {};
        scope.application.roles = [];
        var sampleApplication =  {app:{
            name:'test app',
            roles: [],
            allRoles: []
        }};

        // Set GET response
        httpMock.expectPOST('/applications/update').respond(sampleApplication);
        scope.update();

        httpMock.flush();
        // Test scope value
        expect(scope.dataRec).toEqual(sampleApplication);
    });

    it('$scope.deleteApp() should delete an application', function() {
        scope.application = {};
        scope.application._id = '525a8422f6d0f87f0e407a33';

        var sampleApplication =  {app:{
            name:'test app',
            roles: [],
            allRoles: []
        }};

        // Set GET response
        httpMock.expectDELETE('/applications/'+ scope.application._id).respond(sampleApplication);
        scope.deleteApp();

        httpMock.flush();
        // Test scope value
        expect(scope.dataRec).toEqual(sampleApplication);
    });


});