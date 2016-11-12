/* ================================================================================================
 Controller for Header
 ================================================================================================ */

app
    .controller('HeaderController', [
        '$scope',
        '$window',
        '$modal',
        '$timeout',
        //'authorization',
        'FeedbackService',
        HeaderController
    ]);

function HeaderController(
    $scope,
    $window,
    $modal,
    $timeout,
    //authorization,
    feedbackService
) {


    $scope.isCollapsed = false;

    $scope.page = 'tasks';

    $scope.toggleCollapsibleMenu = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        asvc.addStep('toggleCollapsibleMenu');
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
        $scope.isCollapsed = false;
    });

    $scope.emailTTfeedback = function () {
        document.location.href = feedbackService.mailToUrl($scope);
        asvc.addStep('emailTTfeedback');
    };

    $scope.navTo = function (page) {
        console.log('navTo: ');
        console.log(page);
        //TODO: add navigation action here to move between tabs

    };

    $scope.openModal = function (size) {
        $modal.open({
            animation: true,
            templateUrl: 'aboutModal',
            controller: ['$scope', '$modalInstance', 'FeedbackService', AboutModalController],
            scope: $scope,
            size: size
        });
    };

    var originatorEv;

    // The user menu widget
    $scope.user = {
        openMenu : function ($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        },
        logout : function () {
            $window.open('/auth/signout', "_self");
        }
    };

    //catching $mdMenuOpen event emitted from angular-material.js
    $scope.$on('$mdMenuOpen', function() {
        $timeout(function () {
            //getting menu content container from html
            var widget = angular.element(document.querySelectorAll('.widget'));
            // Using parent() method to get parent wrapper with .md-open-menu-container class and adding custom class.
            widget.parent().addClass('widget-content');
        });
    });

}

function AboutModalController($scope, $modalInstance, feedbackService) {
    $scope.emailTTfeedback = function () {
        document.location.href = feedbackService.mailToUrl($scope);
        $scope.close();
    };

    $scope.roles = formattedRoles($scope.user.roles);

    $scope.close = function () {
        $modalInstance.dismiss();
    };
}

