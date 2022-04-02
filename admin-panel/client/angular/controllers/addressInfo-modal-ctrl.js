vulusionApp.controller('AddressInfo', function AddressInfo(CustomerService,CommonService,LookupService,$cookies,$rootScope,$scope, $http,customer,type,close) {

    init = function(){
        CommonService.authenticateUser().then(function(){
            $rootScope.logout = CommonService.logout;
            // console.log('selected Customer',customer,type);
            if(customer){
                // console.log(customer);
                delete customer.CustomerID;
                $scope.customer = customer;
                $scope.type = type;
                $scope.heading = ""
                $scope.emailAdressDisable = true
                if(type === "orderShippingAddress" || type === "shippingAddress"){
                    $scope.emailAdressDisable = false
                    if($scope.customer.EmailAddress !== "undefined" && $scope.customer.EmailAddress !== null && $scope.customer.EmailAddress){
                        $scope.heading = "Edit Shipping Information"

                    }else{
                        $scope.heading = "Add Shipping Information"
                    }
                }
                if(type === "billingAddress" || type === "orderBillingAddress"){
                    if($scope.customer.EmailAddress !== "undefined" && $scope.customer.EmailAddress !== null && $scope.customer.EmailAddress){
                        $scope.heading = "Edit Billing Information"

                    }else{
                        $scope.heading = "Add Billing Information"
                    }
                }
                
            }
            LookupService.getCountries().then(function (response) {
				CommonService.hideLoader();
                $scope.countries = response.data
                // $scope.filteredCountries = $scope.countries.filter(country => {
                //     return country.code != 'CU' && country.code != 'IR' && country.code != 'KP'  
                // })
			}, function (error) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving country names");
			})
        });
    }

    $scope.save = function(){
        $scope.close($scope.customer);
    }

    $scope.close = function(obj){
     close(obj);
    }
    

    init();
});
