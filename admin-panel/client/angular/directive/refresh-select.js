vulusionApp.directive('select2Custom', function($timeout) {
  return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
          $timeout(function() {
              element.show();
              $(element).select2({placeholder: "Select a Country"});
              $(".js-example-placeholder-single").select2({
                placeholder: "Select a state",
                allowClear: false
            });
          }); 
         
      }
  };
})

