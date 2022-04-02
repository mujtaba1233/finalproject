vulusionApp.controller('PasswordResetModal', function PasswordResetModal(CustomersService,CommonService,LookupService,$cookies,$rootScope,$scope, $http,customer,close) {

    init = function(){
        CommonService.authenticateUser().then(function(){
            $rootScope.logout = CommonService.logout;
            if(customer.email){
                $scope.customer = {
                    email:customer.email,
                    token:customer.token,
                    password:""
                }
            }else{
                $scope.customer = {
                    email:customer.EmailAddress,
                    token:customer.token,
                    password:"",
                    id: customer.CustomerID
                }
            }
            $scope.error = false
            $scope.password = ""
        });
    }
    $scope.close = function(obj){
        close(obj);
    }

    $scope.removePassword = function (params) {
        $scope.error = false
    }

    $scope.ResetPassword = async function(){
        if($scope.customer.password){
            if ($scope.customer.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)) {
                CommonService.showLoader();
                const response = await CustomersService.updateCustomerPassword($scope.customer)
                CommonService.hideLoader();
                if(response.data.status){
                    CommonService.showSuccess(response.data.message);
                    close(response.data)
                }
                else{
                    CommonService.showError(response.data.message);
                    close(response.data)
                }
            }
            else{
                $scope.error =true
            }
        }
    }
    
    init();
});
