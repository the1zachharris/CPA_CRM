angular.module('gm.typeaheadDropdown', ['ui.bootstrap'])
.directive('typeaheadDropdown', function() {
    return {
        template: '<div><div ng-if=!options>Loading options...</div><div ng-if=options class=dropdown dropdown><div class=input-group><input typeahead-editable="false" class=form-control style=break-word:normal placeholder="" ng-model=$parent.model[config.modelLabel] typeahead="op as op[config.optionLabel] for op in options | filter:$viewValue | limitTo:8" typeahead-on-select="onSelect($item, $model, $label)" ng-required="required"> <span class=input-group-btn><button class="btn btn-default dropdown-toggle" dropdown-toggle><span class=caret></span></button></span></div><ul class=dropdown-menu role=menu style=max-height:200px;overflow-y:auto><li ng-repeat="op in options"><a href ng-click=onSelect(op)>{{op[config.optionLabel]}}</a></li></ul></div></div>',
        scope: {
            model:'=ngModel',
            getOptions:'&options',
            config:'=?',
            required:'=?ngRequired'
        },
        replace:true,
        controller: ['$scope', '$q', function($scope, $q) {
            $scope.config = angular.extend({
                modelLabel:"name",
                optionLabel:"name"
            }, $scope.config);

            $q.when($scope.getOptions())
                .then(function(options) {
                    $scope.options = options;
                });

            $scope.onSelect = function($item, $model, $label) {
                if(!$scope.model)
                    $scope.model = {};
                angular.extend($scope.model, $item);
                $scope.model[$scope.config.modelLabel] = $item[$scope.config.optionLabel];
            }
        }]
    }
});