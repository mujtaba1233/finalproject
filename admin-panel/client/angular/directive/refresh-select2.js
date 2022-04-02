vulusionApp.directive('select2Custom2', function($timeout) {
  return {
      restrict: 'AC',
      link: function(scope, element, attrs) {
          $timeout(function() {
              element.show();
              $(element).select2({placeholder: "Select a Table"});
              $(".js-example-placeholder-single").select2({
                placeholder: "Select a Table",
                allowClear: false
            });
          }); 
         
      }
  };
})