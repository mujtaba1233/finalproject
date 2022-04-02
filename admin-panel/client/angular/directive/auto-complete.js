vulusionApp.directive('autoComplete', [
  '$timeout', function($timeout) {
    return function(scope, element, attrs) {
      var auto;
      auto = function() {
        $timeout((function() {
          if (!scope[attrs.uiItems]) {
            auto();
          } else {
            element.autocomplete({
              source: [scope[attrs.uiItems]]
            });
          }
        }), 5);
      };
      return auto();
    };
  }
]);
