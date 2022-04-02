vulusionApp.controller('EndUserController', function EndUserController(CommonService,LookupService,EndUserService,$rootScope,$scope, $timeout, $http) {
    var endUser = function() {
        CommonService.authenticateUser().then(function(response){
            $scope.res = response
                this.firstName = "",
                this.lastName = "",
                this.emailAddress = "",
                this.companyName = "",
                this.phoneNumber = "",
                this.isHide = 0,
                this.createdBy = response.id
                // this.BillingAddress1 = "",
                // this.BillingAddress2 = "",
                // this.City = "",
                // this.PostalCode = ""
                // this.State = "",
                // this.Country = "",
                // this.CustomerDiscount = "",
                // this.active = true,
        });
    };
    
    init = async function(){
        $rootScope.logout = CommonService.logout;
        $scope.itemsByPage = 8;
        $scope.update = false;
        $scope.cloned = false;
        $scope.endUser = await new endUser();
        $timeout(() => {
			$scope.$apply()
		})
         $scope.endUser.isHide = 0,
         $scope.endUser.createdBy = $scope.res.id
        CommonService.showLoader();
        EndUserService.getEndUser().then(async function(response) {
            CommonService.hideLoader();
            $scope.endUsers = response.data;
            $scope.records = response.data;
            $scope.selectedOptions = await Object.keys($scope.endUsers[0])
            return $scope.selectedOptions

        }, function(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving end users");
        });
        // CommonService.showLoader();
        // LookupService.getCountries().then(function (response) {
        //     CommonService.hideLoader();
        //     // console.log(response)
        //     $scope.countries = response.data
        //     // $scope.filteredCountries = $scope.countries.filter(country => {
        //     //     return country.code != 'CU' && country.code != 'IR' && country.code != 'KP' && country.code != 'US'   
        //     // })
        // }, function (error) {
        //     CommonService.hideLoader();
        //     CommonService.showError("Error while retrieving country names");
        // })
        // console.log("sdssd")
    }
    $scope.cloneEndUser = function(endUserID){
        $scope.update = false;
        $scope.cloned = true;
        EndUserService.getEndUserRecord(endUserID).then(function (response) {
        let endUser = response.data
        // console.log(customer)
        // if(customer[0].Active == true){
        //     customer[0].Active = true;
        // }else {
        //     customer[0].Active = false;
        // }
        if(endUser[0].isHide == true){
            endUser[0].isHide = true;
        }else {
            endUser[0].isHide = false;
        }
        $scope.endUser = endUser[0];
         
        }, function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving country names");
        })
        
    }
    PhoneFormat = function (event) {
		var x = event.keyCode;
		// console.log(x)
		if (!(x >= 48 && x <= 57)) {
			if (x != 43 && x!=120 && x!=88 && x!=32 && x!=46 && x!=45 && x!=43 && x!=40 && x!=41) {
				event.preventDefault();
			}
		}
	}

    $scope.stickToPhoneFormat = function () {
		var x = $scope.endUser.phoneNumber
		$scope.endUser.phoneNumber = ''
		x = x.split('');
		x.forEach(number => {
			var z = number.charCodeAt()
			if (!(z >= 48 && z <= 57)) {
				if (z != 43 && z != 120 && z != 88 && z != 32 && z != 46 && z != 45 && z != 43 && z != 40 && z != 41) {
					// event.preventDefault();
					 
				}
				else{
					$scope.endUser.phoneNumber=	$scope.endUser.phoneNumber + number
				}
			}
			else{
				$scope.endUser.phoneNumber=	$scope.endUser.phoneNumber + number
			}

		});
	}

    $scope.updateEndUser = function(endUser){
        // console.log(customer)
        // if(customer.Active == true){
        //     customer.Active = true;
        // }else {
        //     customer.Active = false;
        // }
        console.log(endUser,"inupdateEndUser")
        if(endUser.isHide == true){
            endUser.isHide = true;
        }else {
            endUser.isHide = false;
        }
        $scope.endUser = endUser;
        $scope.update = true;
    }
    $scope.updateEndUserRecord = function(){
        // if($scope.customer.FirstName == ""){
        //     return CommonService.showError("First Name is required.");
        // }
        // if($scope.customer.LastName == ""){
        //     return CommonService.showError("Last Name is required.");
        // }
        if($scope.endUser.emailAddress == ""){
            return CommonService.showError("Email Address is required.");
        }
        // if($scope.customer.CompanyName == ""){
        //     return CommonService.showError("Company Name is required.");
        // }
        // if($scope.customer.BillingAddress1 == ""){
        //     return CommonService.showError("Billing Address 1 is required.");
        // }
        // if($scope.customer.City == ""){
        //     return CommonService.showError("City Name is required.");
        // }
        // if($scope.customer.PostalCode == ""){
        //     return CommonService.showError("Postal Code is required.");
        // }
        // if($scope.customer.State == ""){
        //     return CommonService.showError("State is required.");
        // }
        // if($scope.customer.Country == ""){
        //     return CommonService.showError("Country is required.");
        // }
        // return console.log($scope.customer)
        CommonService.showLoader();
        EndUserService.updateEndUserRecord({data: $scope.endUser}).then(function(response) {
            console.log(response)
            CommonService.hideLoader();
            CommonService.showSuccess("End User Updated.");
        }, function(response) {
            CommonService.showError("Error while updating End User");
        });
    }
    zipFormat = function (event) {
		var entry = event.key
		// console.log(event)
		var format = /^\w+([\s-_]\w+)*$/;
		if(!(entry.match(format)) && event.keyCode != 45 && event.keyCode != 32){
			event.preventDefault(); 	
		}
    };
    PhoneFormat = function (event) {
		var x = event.keyCode;
		// console.log(x)
		if(!(x >= 48 && x <= 57)){
			if(x != 43 && x!=120 && x!=88 && x!=32 && x!=46 && x!=45 && x!=43 && x!=40 && x!=41){
				event.preventDefault();  
			}
		}
	}
    $scope.cancelUpdate = function(){
        $scope.cloned = false;
        $scope.update = false;
        $scope.endUser = new endUser();
    }
    $scope.saveEndUser= function(){
        // return console.log($scope.customer)
        // if($scope.customer.FirstName == undefined){
        //     return CommonService.showError("First Name is required.");
        // }
        // if($scope.customer.LastName == undefined){
        //     return CommonService.showError("Last Name is required.");
        // }
        if($scope.endUser.emailAddress === undefined){
            return CommonService.showError("Email Address is required.");
        }
        // if($scope.customer.CompanyName == undefined){
        //     return CommonService.showError("Company Name is required.");
        // }
        // if($scope.customer.BillingAddress1 == undefined){
        //     return CommonService.showError("Billing Address 1 is required.");
        // }
        // if($scope.customer.City == undefined){
        //     return CommonService.showError("City Name is required.");
        // }
        // if($scope.customer.PostalCode == undefined){
        //     return CommonService.showError("Postal Code is required.");
        // }
        // if($scope.customer.State == undefined){
        //     return CommonService.showError("State is required.");
        // }
        // if($scope.customer.Country == null){
        //     return CommonService.showError("Country is required.");
        // }
        CommonService.showLoader();
        postEndUser();
    }
    function postEndUser(){
        // console.log($scope.endUser,"end User in POst")
        EndUserService.save({ data: $scope.endUser }).then(function(response) {
            if(response.data.error){
                CommonService.hideLoader();
                if(response.data.error.toString().indexOf("for key 'email'") !== -1){
                    CommonService.showError("Email already exist!");

                }else {
                    CommonService.showError("Error while adding user!");
                }
            }else {
                CommonService.hideLoader();
                if(response.data.status === 202){
                    CommonService.showError(response.data.message);   
                }
                if(response.data.status === 200){
                    $scope.endUsers.push($scope.endUser)
                    CommonService.showSuccess(response.data.message);   
                }
                // if (!$scope.update) {
                //     $scope.user.id = response.data.insertId
                //     $scope.users.push($scope.user);  
                //     $scope.user = new user();
                // }else {
                //     $scope.update = false;
                //     $scope.user = new user();
                // }
            }
            //  console.log(response);
        });
    }
    init();
});
