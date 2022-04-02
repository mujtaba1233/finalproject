vulusionApp.directive('pageSelect', function() {
      return {
        restrict: 'E',
        template: '<input type="text" class="select-page fz15" ng-model="inputPage" ng-change="selectPage(inputPage)">',
        link: function(scope, element, attrs) {
          scope.$watch('currentPage', function(c) {
            scope.inputPage = c;
          });
        }
      }
 }); 