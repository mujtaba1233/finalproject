var loginApp =
angular.module('loginApp', [
]);
loginApp.controller('forgotPassword', function CreateQuoteController($scope,$http,) {
    init = function(){
        email = '';
        if(window.location.pathname.split('/').length === 3){
            $scope.token = window.location.pathname.split('/')[2];
        }else {
            // console.log('Path-------------->',window.location.pathname);
        }
    }
    $scope.forgotPasswordForm = function(){
        email = $scope.email;
        $scope.disabled=true;
        $http.post(forgotPasswordUrl, { data: email }).then(function(response) {
            if(!response.data.status){
                showError(response.data.msg);
              
                // console.log(response.data.status);
            }else {
                showSuccess(response.data.msg);
               
            }
            $scope.email = '';
            $scope.disabled=false;
            // console.log(email);
            // console.log(response);

        });
      
    }
    function showError(error){
        alertify.error(error);
    }
    function showSuccess(msg){
        alertify.success(msg);
    }
    init();
});
