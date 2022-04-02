// const emailService = require("../lib")
vulusionApp.controller('CustomersController', function CustomersController(CommonService,ModalService,LookupService,CustomersService,$rootScope,$scope, $http) {
    var customer = function() {
        CommonService.authenticateUser().then(function(response){
                this.FirstName = "",
                this.LastName = "",
                this.EmailAddress = "",
                this.CompanyName = "",
                this.BillingAddress1 = "",
                this.BillingAddress2 = "",
                this.City = "",
                this.PostalCode = ""
                this.State = "",
                this.Country = "",
                this.PhoneNumber = "",
                this.CustomerDiscount = "",
                this.active = true,
                this.hide = false
        });
    };
    
    init = function(){
        $rootScope.logout = CommonService.logout;
        $scope.itemsByPage = 8;
        $scope.update = false;
        $scope.cloned = false;
        $scope.customer = new customer();
        CommonService.showLoader();
        CustomersService.getCustomers().then(async function(response) {
            CommonService.hideLoader();
            $scope.customers = response.data;
            $scope.selectedOptions = await Object.keys($scope.customers[0])
            return $scope.selectedOptions

        }, function(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving customers");
        });
        CommonService.showLoader();
        LookupService.getCountries().then(function (response) {
            CommonService.hideLoader();
            // console.log(response)
            $scope.countries = response.data
            // $scope.filteredCountries = $scope.countries.filter(country => {
            //     return country.code != 'CU' && country.code != 'IR' && country.code != 'KP' && country.code != 'US'   
            // })
        }, function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving country names");
        })
        // console.log("sdssd")
    }
    $scope.cloneCustomer = function(customerID){
        // return console.log(customerEmail)
        $scope.update = false;
        $scope.cloned = true;
        CustomersService.getCustomerRecord(customerID).then(function (response) {
            let customer = response.data
            // console.log(customer)
        if(customer[0].Active == true){
            customer[0].Active = true;
        }else {
            customer[0].Active = false;
        }
        if(customer[0].hide == true){
            customer[0].hide = true;
        }else {
            customer[0].hide = false;
        }
        $scope.customer = customer[0];
         
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
		var x = $scope.customer.PhoneNumber
		$scope.customer.PhoneNumber = ''
		x = x.split('');
		x.forEach(number => {
			var z = number.charCodeAt()
			if (!(z >= 48 && z <= 57)) {
				if (z != 43 && z != 120 && z != 88 && z != 32 && z != 46 && z != 45 && z != 43 && z != 40 && z != 41) {
					// event.preventDefault();
					 
				}
				else{
					$scope.customer.PhoneNumber=	$scope.customer.PhoneNumber + number
				}
			}
			else{
				$scope.customer.PhoneNumber=	$scope.customer.PhoneNumber + number
			}

		});
	}

    $scope.updateCustomer = function(customer){
        // console.log(customer)
        if(customer.Active == true){
            customer.Active = true;
        }else {
            customer.Active = false;
        }
        if(customer.hide == true){
            customer.hide = true;
        }else {
            customer.hide = false;
        }
        $scope.customer = customer;
        $scope.update = true;
    }
    $scope.updateCustomerRecord = function(){
        if($scope.customer.FirstName == ""){
            return CommonService.showError("First Name is required.");
        }
        if($scope.customer.LastName == ""){
            return CommonService.showError("Last Name is required.");
        }
        if($scope.customer.EmailAddress == ""){
            return CommonService.showError("Email Address is required.");
        }
        if($scope.customer.CompanyName == ""){
            return CommonService.showError("Company Name is required.");
        }
        if($scope.customer.BillingAddress1 == ""){
            return CommonService.showError("Billing Address 1 is required.");
        }
        if($scope.customer.City == ""){
            return CommonService.showError("City Name is required.");
        }
        // if($scope.customer.PostalCode == ""){
        //     return CommonService.showError("Postal Code is required.");
        // }
        // if($scope.customer.State == ""){
        //     return CommonService.showError("State is required.");
        // }
        if($scope.customer.Country == ""){
            return CommonService.showError("Country is required.");
        }
        // return console.log($scope.customer)
        CommonService.showLoader();
        CustomersService.updateCustomerRecord({data: $scope.customer}).then(function(response) {
            // console.log(response)
            CommonService.hideLoader();
            CommonService.showSuccess("Customer Updated.");
        }, function(response) {
            CommonService.showError("Error while updateding customers");
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
        $scope.customer = new customer();
    }
    $scope.saveCustomer= function(){
        // return console.log($scope.customer)
        if($scope.customer.FirstName == undefined){
            return CommonService.showError("First Name is required.");
        }
        if($scope.customer.LastName == undefined){
            return CommonService.showError("Last Name is required.");
        }
        if($scope.customer.EmailAddress == undefined){
            return CommonService.showError("Email Address is required.");
        }
        if($scope.customer.CompanyName == undefined){
            return CommonService.showError("Company Name is required.");
        }
        if($scope.customer.BillingAddress1 == undefined){
            return CommonService.showError("Billing Address 1 is required.");
        }
        if($scope.customer.City == undefined){
            return CommonService.showError("City Name is required.");
        }
        // if($scope.customer.PostalCode == undefined){
        //     return CommonService.showError("Postal Code is required.");
        // }
        // if($scope.customer.State == undefined){
        //     return CommonService.showError("State is required.");
        // }
        if($scope.customer.Country == null){
            return CommonService.showError("Country is required.");
        }
        CommonService.showLoader();
        postCustomer();
    }
    function postCustomer(){
        // return console.log($scope.customer)
        CustomersService.save({ data: $scope.customer }).then(function(response) {
            if(response.data.error){
                CommonService.hideLoader();
                if(response.data.error.toString().indexOf("for key 'email'") !== -1){
                    CommonService.showError("Email already exist!");
                }else {
                    CommonService.showError("Error while adding user!");
                }
                console.log(response.data.error);
            }else {
                CommonService.hideLoader();
                if(response.data.status === 202){
                    CommonService.showError(response.data.message);   
                }
                if(response.data.status === 200){
                    $scope.customers.push($scope.customer)
                    CommonService.showSuccess(response.data.message);   
                }
                if (!$scope.update) {

                    $scope.customer.id = response.data.insertId
                    $scope.customers.push($scope.customers);
                    $scope.customer = new customer();
                }else {
                    $scope.update = false;
                    $scope.customer = new customer();
                }
            }
            // console.log(response);
        });
    }
    $scope.passwordReset = async function (email,customer) {
        try {
            const result = await CustomersService.updateCustomerToken(customer)
            console.log(result)
            if(!result.data.status){
                if(result.data.code === 407){
                    $scope.passwordResetModal(result.data.result)
                }
                else{
                    CommonService.showError(result.data.message);
                }
            }
            else{
                $scope.passwordResetModal(result.data.result)
            }
        } catch (error) {
            console.log(error)
        }
       
    };
    $scope.passwordResetModal = function (customer) {
		$('.modal-backdrop').show();
		ModalService.showModal({
			templateUrl: "template/customer-password-modal.ejs",
			controller: "PasswordResetModal",
			inputs: {
				customer:customer
			}
		}).then(function (modal) {
			modal.element.modal({
				backdrop: 'static',
				keyboard: false
			});
			modal.close.then(function (response) {
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
                if(!response.status){
                    CommonService.showError(response.message)
                }
                else if(response.status){
                    CommonService.showSuccess(response.message)
                }
                else{}
			});
		});
	}
    init();
});
