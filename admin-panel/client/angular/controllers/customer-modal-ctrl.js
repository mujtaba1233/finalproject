vulusionApp.controller('CustomerController', function CustomerController(CustomerService,EndUserService,CommonService,LookupService,$cookies,$rootScope,$scope, $http,customer,type,close) {

    init = function(){
        CommonService.authenticateUser().then(function(){
            $rootScope.logout = CommonService.logout;
            $scope.type = type
            $scope.endUser = {}
            $scope.customer = {}
            if(type === "endUser"){
                if(customer){
                    delete customer.id;
                    $scope.endUser = customer;
                }
            }
            else{
                if(customer){
                    delete customer.CustomerID;
                    $scope.customer = customer;
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
    $scope.close = function(obj){
        close(obj);
    }
    $scope.saveCustomer = function(){
        // console.log("save customer");
        if($scope.type === "endUser"){
            postEndUser();

        }else{
            if(!$scope.customer.CustomerDiscount){
                delete $scope.customer.CustomerDiscount
            }
            if(!$scope.customer.Country){
                CommonService.showError("Country is required");
                return
                
            }
            postCustomer();

        }
        

    }
    async function postEndUser(){
        CommonService.showLoader();
        // console.log($scope.endUser)
        // return
        const response = await EndUserService.save({data:$scope.endUser})
        if(response.data.error){
            CommonService.hideLoader();
            if(response.data.error.toString().indexOf("for key 'email'") !== -1){
                CommonService.showError("Email already exist!");
            }else {
                CommonService.showError("Error while adding end user!");
            }
            console.log(response.data.error);
        }else {
            CommonService.hideLoader();
            if (response.data.status == 200) {
                CommonService.showSuccess("Success!");
                $scope.endUser.id = response.data.data.insertId
                $scope.close({'new':true,data:$scope.endUser});
            }else if(response.data.status == 202) {
                CommonService.showError(response.data.message);
                // console.log('old customer',$scope.customer);
                // console.log('already exist',response);
                $scope.close({'new':false,data:response.data.endUser});
            }else {
                CommonService.showError('Unknown status!');
                console.log('unknown status code in success',response);
            }
        }
    }
    function postCustomer(){
        console.log($scope.customer)

        // return
        CommonService.showLoader();

        CustomerService.save($scope.customer).then(function(response){
            if(response.data.error){
                CommonService.hideLoader();
                if(response.data.error.toString().indexOf("for key 'email'") !== -1){
                    CommonService.showError("Email already exist!");
                }else {
                    CommonService.showError("Error while adding customer!");
                }
                console.log(response.data.error);
            }else {
                CommonService.hideLoader();
                if (response.data.status == 200) {
                    CommonService.showSuccess("Success!");
                    $scope.customer.CustomerID = response.data.data.insertId
                    $scope.close({'new':true,data:$scope.customer});
                }else if(response.data.status == 202) {
                    CommonService.showError(response.data.message);
                    // console.log('old customer',$scope.customer);
                    // console.log('already exist',response);
                    $scope.close({'new':false,data:response.data.customer});
                }else {
                    CommonService.showError('Unknown status!');
                    console.log('unknown status code in success',response);
                }
            }
            // console.log(response);
        },function(response){
            CommonService.hideLoader();
            CommonService.showError('Error while adding customer');
        })
    }

    init();
});
