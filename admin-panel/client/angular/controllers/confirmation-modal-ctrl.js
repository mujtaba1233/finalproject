vulusionApp.controller('ConfirmationController', function ConfirmationController(CustomerService,CommonService,LookupService,$rootScope,$scope,close,oldTax,newTax) {

    init = function(){
        CommonService.authenticateUser().then(function(){
            $rootScope.logout = CommonService.logout;
            $scope.oldTax = oldTax,
            $scope.newTax = newTax
        });
    }
    $scope.close = function(confirm){
        close(confirm);
    }
    $scope.doWeContinue = function(confirm){
        $scope.close(confirm)
    }

    init();
});
