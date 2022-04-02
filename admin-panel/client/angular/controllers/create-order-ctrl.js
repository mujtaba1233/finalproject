vulusionApp.controller('AddOrderController', function AddOrderController(PaymentService,UserService, ModalService, PackagingBoxService,EndUserService, PackagingService, $timeout, ModalService, CommonService, LookupService, CustomerService, ProductService, TaxExemptionService, $rootScope, $scope, $http) {
	init = function () {
		CommonService.authenticateUser().then(function (response) {
			$scope.updated = false;
			$scope.currentUser = response;
			$rootScope.logout = CommonService.logout;
			$scope.taxExempt = false
			$scope.ccValid = true
			$scope.cvcValid = true
			$scope.expValid = true
			$scope.paymentMode = false
			$scope.order = {}
			$scope.selected = {
				customer: {},
				endUser:{}
			}
			$scope.serialNO = ""
			// $scope.order.insuranceValue =0
			$scope.taxTotal = 0
			$scope.card = {
				number: '',
				cvc: '',
				expiry: ''
			}
			$scope.parcels = []
			$scope.calculated = false;
			$scope.parcels.push({
				length: 0,
				width: 0,
				height: 0,
				weight: 0
			})
			$scope.shippingMethods = []
			// $scope.shippingMethodIdForPackages =
			CommonService.showLoader();
			getShippingMethods()
			$scope.isCalculateShipping = false;
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


			CommonService.showLoader();
			CustomerService.getCustomers().then(function (response) {
				$scope.getProducts();
				CommonService.hideLoader();
				$scope.customers = response.data;
				// console.log($scope.customers)
				// $scope.customers.splice($scope.customers.findIndex(e => e.hide === "1"), 1);
			}, function errorCallback(response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving customers");
			});
			UserService.list().then(function (response) {
				$scope.users = response.data;
			}, function errorCallback(response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving users");
			});
			EndUserService.getEndUser().then(function (response) {
				CommonService.hideLoader();
				$scope.endUsers = response.data;
				// console.log($scope.endUsers,"getEndUsers")
			}, function errorCallback(response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving end users");
			});

			$scope.addCustomerBtn = true;
			if (window.location.search && window.location.search.indexOf('quote') > -1) {
				
				
				$scope.QuoteNo = window.location.search.split('?')[1].split('=')[1];
				$scope.mode = "Save";
				$scope.isNew = true;
				// console.log($scope.mode)
				genrateOrderHash();
			} else if (window.location.search && window.location.search.indexOf('clone') > -1) {
				$scope.selected = {
					customer: {},
					endUser: {}
				}
				$scope.OrderID = parseInt(window.location.search.split('?')[1].split('=')[1]);
				$scope.isNew = true;
				$scope.isClone = true;
				genrateOrderHash();
				$scope.mode = "Clone";
				changeOrderStatus();
				if ($scope.OrderID){
					getAllOrderSerials($scope.OrderID)
					getAlloctedSerials($scope.OrderID)

				}
			} else if (window.location.search && window.location.search.indexOf('update') > -1) {
				$scope.selected = {
					customer: {},
					endUser:{}
				}
				$scope.isNew = false;
				$scope.isClone = false;
				genrateOrderHash();
				$scope.order.OrderID = window.location.search.split('?')[1].split('=')[1];
				$scope.mode = "Update";
				if ($scope.order.OrderID){
					getAllOrderSerials($scope.OrderID)
					getAlloctedSerials($scope.OrderID)

				}
				// getOrder();
			} else if (window.location.search && window.location.search.indexOf('serial') > -1) {
				$scope.selected = {
					customer: {},
					endUser:{}
				}
				$scope.isNew = false;
				genrateOrderHash();
				// $scope.order.OrderID = window.location.search.split('?')[1].split('=')[1];
				$scope.SerialNo = window.location.search.split('?')[1].split('=')[1];
				$scope.mode = "Update";
				if ($scope.OrderID){
					getAllOrderSerials($scope.OrderID)
					getAlloctedSerials($scope.OrderID)

				}
				// getOrder();
			} else {
				$scope.isNew = true;
				$scope.isClone = true;
				genrateOrderHash();
				$scope.order.OrderDetails.push(new InvoiceRow());
				$scope.mode = "Save";
				// console.log('sdsd')
			}
			if ($scope.OrderID){
				getAllOrderSerials($scope.OrderID)
				getAlloctedSerials($scope.OrderID)

			}
			getPackagingBox()
			if (!$scope.isNew)
				getOrderTrack($scope.OrderID)
		});
	}
	const randomString = () => {
		return Math.random().toString(36).substring(6);
	}
	$scope.addCustomer = async function (type) {
		console.log(type)
		let orderBillingInfo = {}
		let orderShippingInfo = {}
		let customer = {}
		let endUser = {}
		
		if(type === "endUser"){
			try {
				endUser = $scope.endUsers.filter((elem) => {
					return elem.id == $scope.order.endUserId
				})
				console.log(endUser)
			} catch (error) {
				console.log(error)
			}
		}
		else{
			try {
				customer = $scope.customers.filter((elem) => {
					return elem.CustomerID == $scope.order.CustomerID
				})
			} catch (error) {
				console.log(error)
			}
		}
		if (type === "endUser") {
			
			
		}
		else if (type === "orderBillingAddress") {
			if ($scope.order && ($scope.order.BillingAddress1 || $scope.order.BillingAddress2 || $scope.order.BillingCity || $scope.order.BillingCountry || $scope.order.BillingFirstName || $scope.order.BillingLastName
				|| $scope.order.BillingPhoneNumber || $scope.order.BillingPostalCode || $scope.order.BillingState)) {
				orderBillingInfo = {
					BillingAddress1: $scope.order.BillingAddress1?$scope.order.BillingAddress1:'',
					BillingAddress2: $scope.order.BillingAddress2?$scope.order.BillingAddress2:'',
					City: $scope.order.BillingCity?$scope.order.BillingCity:'',
					CompanyName: $scope.order.BillingCompanyName ? $scope.order.BillingCompanyName : '',
					Country: $scope.order.BillingCountry ? $scope.order.BillingCountry : '',
					EmailAddress: $scope.order.EmailAddress ? $scope.order.EmailAddress : $scope.EmailAddress,
					FirstName: $scope.order.BillingFirstName ? $scope.order.BillingFirstName : '',
					LastName: $scope.order.BillingLastName ?  $scope.order.BillingLastName : '',
					PhoneNumber: $scope.order.BillingPhoneNumber ? $scope.order.BillingPhoneNumber : '',
					PostalCode: $scope.order.BillingPostalCode ? $scope.order.BillingPostalCode : '',
					State: $scope.order.BillingState ? $scope.order.BillingState : '',
				}
				// console.log(orderBillingInfo, "orderBillingInforderBillingInfo")
			}
			else {
				orderBillingInfo = {
					BillingAddress1: '',
					BillingAddress2: '',
					City: '',
					CompanyName: '',
					Country: '',
					FirstName: '',
					LastName: '',
					PhoneNumber: '',
					PostalCode: '',
					State: '',
				}
			}


		}
		else if (type === "orderShippingAddress") {
			if ($scope.order && ($scope.order.ShipEmailAddress || $scope.order.ShipAddress1 || $scope.order.ShipAddress2 || $scope.order.ShipCity || $scope.order.ShipCompanyName || $scope.order.ShipCountry
				 || $scope.order.ShipFirstName || $scope.order.ShipLastName || $scope.order.ShipPhoneNumber || $scope.order.ShipPostalCode || $scope.order.ShipState)) {
				orderShippingInfo = {
					ShippingAddress1: $scope.order.ShipAddress1 ? $scope.order.ShipAddress1 : '',
					ShippingAddress2: $scope.order.ShipAddress2?$scope.order.ShipAddress2:'',
					City: $scope.order.ShipCity?$scope.order.ShipCity:'',
					CompanyName: $scope.order.ShipCompanyName ? $scope.order.ShipCompanyName : '',
					Country: $scope.order.ShipCountry?$scope.order.ShipCountry:'',
					EmailAddress: $scope.order.ShipEmailAddress ?$scope.order.ShipEmailAddress :($scope.order.EmailAddress ? $scope.order.EmailAddress : $scope.EmailAddress),
					FirstName: $scope.order.ShipFirstName? $scope.order.ShipFirstName:'',
					LastName: $scope.order.ShipLastName?$scope.order.ShipLastName:'',
					PhoneNumber: $scope.order.ShipPhoneNumber?$scope.order.ShipPhoneNumber:'',
					PostalCode: $scope.order.ShipPostalCode?$scope.order.ShipPostalCode:'',
					State: $scope.order.ShipState?$scope.order.ShipState:'',
				}
				// console.log(orderShippingInfo, "orderShippingAddress")
			}
			else {
				orderShippingInfo = {
					ShippingAddress1: '',
					ShippingAddress2: '',
					City: '',
					CompanyName: '',
					Country: '',
					FirstName: '',
					LastName: '',
					PhoneNumber: '',
					PostalCode: '',
					State: ''
				}
			}
		}else { }
		$('.modal-backdrop').show();
		console.log(type)
		ModalService.showModal({
			templateUrl: type === "customer" || type === "endUser" ? "template/customer-form.ejs" : "template/addressInfo-form.ejs",
			controller: type === "customer" || type === "endUser" ? "CustomerController" : "AddressInfo",
			inputs: {
				customer: type === "customer" ? angular.copy(customer[0]) : (type === "orderShippingAddress" ? orderShippingInfo : (type==="endUser" ? angular.copy(endUser[0]) : orderBillingInfo)),
				type: type
			}
		}).then(function (modal) {
			modal.element.modal({
				backdrop: 'static',
				keyboard: false
			});
			modal.close.then(function (response) {
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
				if (response !== undefined) {
					if (type === "customer") {
						console.log(response,type,"customer")

						if (response.new == true) {
							$scope.customers.unshift(response.data);
							// $scope.selected = {
							// 	item: $scope.customers[0]
							// };
						} else {
							// $scope.selected = {
							// 	item: response.data
							// };
						}
						$scope.customerListner(JSON.parse(JSON.stringify(response.data)))
					}
					else if(type === "endUser"){
						if (response.new == true) {
							$scope.endUsers.unshift(JSON.parse(JSON.stringify(response.data)));
						}else{

						}
						$scope.endUserListner(JSON.parse(JSON.stringify(response.data)))
					}
					else if (type === 'orderBillingAddress') {
						$scope.order.BillingAddress1 = response.BillingAddress1
						$scope.order.CustomerID = customer[0].CustomerID
						$scope.order.BillingAddress2 = response.BillingAddress2
						$scope.order.BillingCity = response.City
						$scope.order.BillingCompanyName = response.CompanyName
						$scope.order.BillingCountry = response.Country
						// $scope.order.EmailAddress = response.EmailAddress
						$scope.order.BillingFirstName = response.FirstName
						$scope.order.BillingLastName = response.LastName
						$scope.order.BillingPhoneNumber = response.PhoneNumber
						$scope.order.BillingPostalCode = response.PostalCode
						$scope.order.BillingState = response.State
					} 
					else if (type === 'orderShippingAddress') {
						$scope.order.ShipAddress1 = response.ShippingAddress1
						$scope.order.ShipAddress2 = response.ShippingAddress2
						$scope.order.CustomerID = customer[0].CustomerID
						$scope.order.ShipCity = response.City
						$scope.order.ShipCompanyName = response.CompanyName
						$scope.order.ShipCountry = response.Country
						$scope.order.ShipEmailAddress = response.EmailAddress 
						$scope.order.ShipFirstName = response.FirstName
						$scope.order.ShipLastName = response.LastName
						$scope.order.ShipPhoneNumber = response.PhoneNumber
						$scope.order.ShipPostalCode = response.PostalCode
						$scope.order.ShipState = response.State
						console.log($scope.order.ShipFirstName,customer)
						$scope.getTaxRate();
					}
					// $timeout(function () 
						// response.CustomerID = customer.CustomerID
						// $scope.customerListner(response)
					// });
				} else {
					console.log('modal closed only');
				}
			});
		});
	}
	// $scope.addCustomer = async function (type) {
	// 	let orderBillingInfo = {}
	// 	let orderShippingInfo = {}
	// 	let customer = {}
	// 	try {
	// 		customer = await $scope.customers.filter((elem) => {
	// 			return elem.CustomerID == $scope.order.CustomerID
	// 		})
	// 	} catch (error) {
	// 		console.log(error)
	// 	}
		
	// 	if (type === "customer") {
			
	// 		// console.log(customer,"CustomerCustomer")
	// 	}
	// 	else if (type === "orderBillingAddress") {
	// 		if ($scope.order && ($scope.order.BillingAddress1 || $scope.order.BillingAddress2 || $scope.order.BillingCity || $scope.order.BillingCountry || $scope.order.BillingFirstName || $scope.order.BillingLastName
	// 			|| $scope.order.BillingPhoneNumber || $scope.order.BillingPostalCode || $scope.order.BillingState)) {
	// 			orderBillingInfo = {
	// 				BillingAddress1: $scope.order.BillingAddress1?$scope.order.BillingAddress1:'',
	// 				BillingAddress2: $scope.order.BillingAddress2?$scope.order.BillingAddress2:'',
	// 				City: $scope.order.BillingCity?$scope.order.BillingCity:'',
	// 				CompanyName: $scope.order.BillingCompanyName ? $scope.order.BillingCompanyName : '',
	// 				Country: $scope.order.BillingCountry ? $scope.order.BillingCountry : '',
	// 				EmailAddress: $scope.order.EmailAddress ? $scope.order.EmailAddress : $scope.EmailAddress,
	// 				FirstName: $scope.order.BillingFirstName ? $scope.order.BillingFirstName : '',
	// 				LastName: $scope.order.BillingLastName ?  $scope.order.BillingLastName : '',
	// 				PhoneNumber: $scope.order.BillingPhoneNumber ? $scope.order.BillingPhoneNumber : '',
	// 				PostalCode: $scope.order.BillingPostalCode ? $scope.order.BillingPostalCode : '',
	// 				State: $scope.order.BillingState ? $scope.order.BillingState : '',
	// 			}
	// 			// console.log(orderBillingInfo, "orderBillingInforderBillingInfo")
	// 		}
	// 		else {
	// 			orderBillingInfo = {
	// 				BillingAddress1: '',
	// 				BillingAddress2: '',
	// 				City: '',
	// 				CompanyName: '',
	// 				Country: '',
	// 				FirstName: '',
	// 				LastName: '',
	// 				PhoneNumber: '',
	// 				PostalCode: '',
	// 				State: '',
	// 			}
	// 		}


	// 	}
	// 	else if (type === "orderShippingAddress") {
	// 		if ($scope.order && ($scope.order.ShipEmailAddress || $scope.order.ShipAddress1 || $scope.order.ShipAddress2 || $scope.order.ShipCity || $scope.order.ShipCompanyName || $scope.order.ShipCountry
	// 			 || $scope.order.ShipFirstName || $scope.order.ShipLastName || $scope.order.ShipPhoneNumber || $scope.order.ShipPostalCode || $scope.order.ShipState)) {
	// 			orderShippingInfo = {
	// 				ShippingAddress1: $scope.order.ShipAddress1 ? $scope.order.ShipAddress1 : '',
	// 				ShippingAddress2: $scope.order.ShipAddress2?$scope.order.ShipAddress2:'',
	// 				City: $scope.order.ShipCity?$scope.order.ShipCity:'',
	// 				CompanyName: $scope.order.ShipCompanyName ? $scope.order.ShipCompanyName : '',
	// 				Country: $scope.order.ShipCountry?$scope.order.ShipCountry:'',
	// 				EmailAddress: $scope.order.ShipEmailAddress ?$scope.order.ShipEmailAddress :($scope.order.EmailAddress ? $scope.order.EmailAddress : $scope.EmailAddress),
	// 				FirstName: $scope.order.ShipFirstName? $scope.order.ShipFirstName:'',
	// 				LastName: $scope.order.ShipLastName?$scope.order.ShipLastName:'',
	// 				PhoneNumber: $scope.order.ShipPhoneNumber?$scope.order.ShipPhoneNumber:'',
	// 				PostalCode: $scope.order.ShipPostalCode?$scope.order.ShipPostalCode:'',
	// 				State: $scope.order.ShipState?$scope.order.ShipState:'',
	// 			}
	// 			// console.log(orderShippingInfo, "orderShippingAddress")
	// 		}
	// 		else {
	// 			orderShippingInfo = {
	// 				ShippingAddress1: '',
	// 				ShippingAddress2: '',
	// 				City: '',
	// 				CompanyName: '',
	// 				Country: '',
	// 				FirstName: '',
	// 				LastName: '',
	// 				PhoneNumber: '',
	// 				PostalCode: '',
	// 				State: ''
	// 			}
	// 		}
	// 	}else { }
	// 	$('.modal-backdrop').show();
	// 	ModalService.showModal({
	// 		templateUrl: type === "customer" ? "template/customer-form.ejs" : "template/addressInfo-form.ejs",
	// 		controller: type === "customer" ? "CustomerController" : "AddressInfo",
	// 		inputs: {
	// 			customer: type === "customer" ? angular.copy(customer[0]) : (type === "orderShippingAddress" ? orderShippingInfo : orderBillingInfo),
	// 			type: type
	// 		}
	// 	}).then(function (modal) {
	// 		modal.element.modal({
	// 			backdrop: 'static',
	// 			keyboard: false
	// 		});
	// 		modal.close.then(function (response) {
	// 			$('.modal-backdrop').remove();
	// 			$('body').removeClass('modal-open');
	// 			if (response !== undefined) {
	// 				if (type === "customer") {
	// 					if (response.new == true) {
	// 						$scope.customers.unshift(response.data);
	// 						$scope.selected = {
	// 							item: $scope.customers[0]
	// 						};
	// 					} else {
	// 						$scope.selected = {
	// 							item: response.data
	// 						};
	// 					}
	// 					$timeout(function () {
	// 						$scope.customerListner(response.data)
	// 					});
	// 				}
	// 				else if (type === 'orderBillingAddress') {
	// 					$scope.order.BillingAddress1 = response.BillingAddress1
	// 					$scope.order.CustomerID = customer[0].CustomerID
	// 					$scope.order.BillingAddress2 = response.BillingAddress2
	// 					$scope.order.BillingCity = response.City
	// 					$scope.order.BillingCompanyName = response.CompanyName
	// 					$scope.order.BillingCountry = response.Country
	// 					// $scope.order.EmailAddress = response.EmailAddress
	// 					$scope.order.BillingFirstName = response.FirstName
	// 					$scope.order.BillingLastName = response.LastName
	// 					$scope.order.BillingPhoneNumber = response.PhoneNumber
	// 					$scope.order.BillingPostalCode = response.PostalCode
	// 					$scope.order.BillingState = response.State
	// 				} 
	// 				else if (type === 'orderShippingAddress') {
	// 					$scope.order.ShipAddress1 = response.ShippingAddress1
	// 					$scope.order.ShipAddress2 = response.ShippingAddress2
	// 					$scope.order.CustomerID = customer[0].CustomerID
	// 					$scope.order.ShipCity = response.City
	// 					$scope.order.ShipCompanyName = response.CompanyName
	// 					$scope.order.ShipCountry = response.Country
	// 					$scope.order.ShipEmailAddress = response.EmailAddress 
	// 					$scope.order.ShipFirstName = response.FirstName
	// 					$scope.order.ShipLastName = response.LastName
	// 					$scope.order.ShipPhoneNumber = response.PhoneNumber
	// 					$scope.order.ShipPostalCode = response.PostalCode
	// 					$scope.order.ShipState = response.State
	// 					console.log($scope.order.ShipFirstName,customer)
	// 					$scope.getTaxRate();
	// 				}
	// 				// $timeout(function () 
	// 					// response.CustomerID = customer.CustomerID
	// 					// $scope.customerListner(response)
	// 				// });
	// 			} else {
	// 				console.log('modal closed only');
	// 			}
	// 		});
	// 	});
	// }


	var changeOrderStatus = () => {
		$scope.order.OrderStatus = 'New'
	}
	var getQuoteForOrder = () => {
		CommonService.showLoader();
		$http({
			method: 'GET',
			url: getQuote + '?quoteId=' + $scope.QuoteNo,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(function successCallback(response) {
			$scope.quote = response.data.data;
			for (var i = 0; i < $scope.customers.length; i++) {
				if ($scope.customers[i].CustomerID === $scope.quote[0].CustomerID) {
					$scope.selected.customer = $scope.customers[i];
					$scope.customerListner($scope.customers[i])
					break;
				}
			}
			for (var i = 0; i < $scope.endUsers.length; i++) {
				if ($scope.endUsers[i].id === $scope.quote[0].endUserId) {
					$scope.selected.endUser = $scope.endUsers[i];
					$scope.endUserListner($scope.endUsers[i])
					break;
				}
			}
			$scope.productChilds = [];
			$scope.quote.forEach(elem => {
				for (var i = 0; i < $scope.products.length; i++) {
					if ($scope.products[i].ProductCode.toLowerCase() === elem.ProductCode.toLowerCase()) {
						var editAbleProduct = angular.copy($scope.products[i])
						editAbleProduct.QtyShipped = elem.QtyShipped;
						editAbleProduct.QtyOnPackingSlip = elem.Qty;
						editAbleProduct.DiscountValue = elem.Discount;
						editAbleProduct.ProductPrice = elem.Price ? elem.Price : 0;
						editAbleProduct.ProductDescriptionShort = elem.description;
						editAbleProduct.Quantity = elem.Qty;
						editAbleProduct.parent = elem.parent
						editAbleProduct.parentName = elem.parentName
						editAbleProduct.isChild = elem.isChild;
						editAbleProduct.isSerialAble = elem.isSerialAble
						if (!elem.isChild) {
							$scope.addRow(editAbleProduct)
						} else {
							$scope.productChilds.push(new InvoiceRow(editAbleProduct))
						}
						break;
					}
				}
			});

			$scope.productChilds.forEach(pc => {
				for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
					if (pc.parent == $scope.order.OrderDetails[i].parentName) {
						$scope.order.OrderDetails[i].Childs.push(pc);
					}
				}
			})

			// commented to turn off product serial feature

			$scope.order.OrderDetails.forEach(elem => {
				// $scope.updateShippingQty(elem)
				LookupService.GetProductSerials(elem.ProductID).then(function (response) {
					for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
						if (response.data[0] && response.data[0].ProductID == $scope.order.OrderDetails[i].ProductID) {
							$scope.order.OrderDetails[i].SerialsArray = response.data;
						}
					}
				}, function (error) {
					console.log('serial fetch error', error);
				})
			})
			for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
				$scope.order.OrderDetails[i].TaxableProduct = $scope.quote[0].isTaxable == 1 ? true : false;
			}
			$scope.order.OrderDetails
			$scope.OrderTaxExempt = $scope.quote[0].TaxExempt == 1 ? true : false;
			$scope.order.ShippingMethodID = $scope.quote[0].shippingMethodId;
			$scope.order.Order_Comments = $scope.quote[0].notes;
			$scope.order.TotalShippingCost = $scope.quote[0].Freight ? $scope.quote[0].Freight : 0;
			$scope.order.insuranceValue = $scope.order.ShipCountry && $scope.order.ShipCountry.toLowerCase() === 'us' ? 0 : $scope.quote[0].InsuranceValue
			$scope.order.SalesTaxRate1 = parseFloat($scope.quote[0].TaxShipping);
			$scope.order.BillingCompanyName = $scope.quote[0].BillingCompany
			$scope.order.ShipCompanyName = $scope.quote[0].ShippingCompany
			$scope.order.ShipFirstName = $scope.quote[0].CustomerFName
			$scope.order.ShipLastName = $scope.quote[0].CustomerLName
			$scope.order.ShipAddress1 = $scope.quote[0].ShippingAddress1;
			$scope.order.ShipAddress2 = $scope.quote[0].ShippingAddress2;
			$scope.order.BillingAddress1 = $scope.quote[0].BillingStreetAddress1
			$scope.order.BillingAddress2 = $scope.quote[0].BillingStreetAddress2
			$scope.order.ShipCity = $scope.quote[0].ShippingCity;
			$scope.order.ShipEmailAddress = $scope.quote[0].ShipEmailAddress 
			$scope.order.ShipCountry = $scope.quote[0].ShippingCountry;
			$scope.order.ShipPostalCode = $scope.quote[0].ShippingPostalCode;
			$scope.order.ShipPhoneNumber = $scope.quote[0].ShippingPhoneNumber;
			$scope.order.ShipState = $scope.quote[0].ShippingState;
			$scope.order.OrderNotes = $scope.quote[0].PrivateNotes;
			CommonService.hideLoader()
		});
	}


	var getOrderPackages = () => {
		CommonService.showLoader();
		var url = getOrderPackagesUrl + '/' + ($scope.OrderID ? $scope.OrderID : $scope.order.OrderID)
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(function (response) {
			console.log(response)
			if (response.data[0].OrderNotFound) {
				$scope.parcels = []
				$scope.parcels.push({
					length: 0,
					width: 0,
					height: 0,
					weight: 0
				})
			}
			else {
				$scope.isCalculateShipping = !$scope.isCalculateShipping
				$scope.parcels = response.data
				if ($scope.parcels.length > 0) {
					$scope.checkShippings()
				}
			}
			CommonService.hideLoader();
		})
	}

	var getOrder = () => {
		CommonService.showLoader();
		if ($scope.SerialNo === undefined) {
			var url = getOrderUrl + '/' + ($scope.OrderID ? $scope.OrderID : $scope.order.OrderID)
		} else {
			var url = getOrderBySerialUrl + '/' + $scope.SerialNo;
		}
		$http({
			method: 'GET',
			url: url,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(function (response) {
			$scope.orderData = response.data;
			if ($scope.mode == 'Clone') {
				$scope.orderData[0].Order_Comments = ""
				$scope.orderData[0].OrderDate = new Date();
				$scope.orderData[0].OrderStatus = 'New';
				// $scope.orderData[0].Order_Type = 'Customer';
				// $scope.orderData[0].ShippingMethodID = '';
				$scope.orderData[0].isPayed = false;
				$scope.orderData[0].InvoiceableOn = new Date();
			}
			if ($scope.orderData[0].OrderNotFound === 'OrderNotFound') {
				CommonService.showError($scope.orderData[0].orderId + " Order Not found!");
				CommonService.hideLoader();
				return;
			}
			for (var i = 0; i < $scope.customers.length; i++) {
				if ($scope.customers[i].CustomerID === $scope.orderData[0].CustomerID) {
					$scope.selected.customer = $scope.customers[i];
					$scope.customerListner($scope.customers[i])
					break;
				}
			}
			for (var i = 0; i < $scope.endUsers.length; i++) {
				if ($scope.endUsers[i].id === $scope.orderData[0].endUserId) {
					$scope.selected.endUser = $scope.endUsers[i];
					$scope.endUserListner($scope.endUsers[i])
					break;
				}
			}
			var d = new Date();
			$scope.pdfname =
				d.getFullYear() +
				("0" + (d.getMonth() + 1)).slice(-2) +
				("0" + d.getDate()).slice(-2) + "_" +
				("00000" + $scope.orderData[0].OrderID.toString()).slice(-6);
			$scope.taxExempt = $scope.orderData[0].IsTaxExempt === 1;
			// $scope.order.OrderDate = $scope.orderData[0].OrderDate.split("T")[0]
			$scope.order.OrderID = $scope.orderData[0].OrderID
			$scope.order.Custom_Field_CarrierAcctNo = $scope.orderData[0].Custom_Field_CarrierAcctNo
			$scope.order.Order_Comments = $scope.mode == 'Clone' ? "" : $scope.orderData[0].notes;

			$scope.order.IsPayed = $scope.orderData[0].IsPayed === 1;
			$scope.OrderTaxExempt = $scope.orderData[0].OrderTaxExempt == 1 ? true : false;
			$scope.order.Order_Entry_System = $scope.orderData[0].Order_Entry_System ? $scope.orderData[0].Order_Entry_System : 'BlueSky';
			$scope.order.insuranceValue = $scope.orderData[0].ShipCountry && $scope.orderData[0].ShipCountry.toLowerCase() === 'us' ? 0 : $scope.orderData[0].InsuranceValue;
			$scope.productChilds = [];

			$scope.orderData.forEach(elem => {
				for (var i = 0; i < $scope.products.length; i++) {

					if ($scope.products[i].ProductCode.toLowerCase() === elem.ProductCode.toLowerCase()) {
						var editAbleProduct = angular.copy($scope.products[i])
						editAbleProduct.DiscountValue = elem.Discount;
						editAbleProduct.ProductPrice = elem.Price ? elem.Price : 0;
						editAbleProduct.isSerialAble = $scope.products[i].isSerialAble
						// editAbleProduct.isSerialAble = $scope.products[i].isSerialAble
						editAbleProduct.ExportDescription = $scope.products[i].ExportDescription
						editAbleProduct.CountryOfOrigin = $scope.products[i].CountryOfOrigin
						editAbleProduct.UnitOfMeasure = $scope.products[i].UnitOfMeasure
						editAbleProduct.ExportControlClassificationNumber = $scope.products[i].ExportControlClassificationNumber
						editAbleProduct.HarmonizedCode = $scope.products[i].HarmonizedCode
						editAbleProduct.ProductDescriptionShort = elem.description;
						editAbleProduct.QtyShipped = elem.QtyShipped;
						editAbleProduct.Quantity = elem.Qty;
						editAbleProduct.QtyOnPackingSlipBackup = ($scope.orderData[0].OrderStatus === "Partially Shipped" || $scope.orderData[0].OrderStatus === "Shipped") ?  elem.QtyOnPackingSlip : 0;
						editAbleProduct.QtyOnPackingSlip = ($scope.orderData[0].OrderStatus === "Partially Shipped" || $scope.orderData[0].OrderStatus === "Shipped") ? 0 : elem.Qty - elem.QtyShipped;
						editAbleProduct.QtyOnBackOrder = elem.QtyOnBackOrder;
						editAbleProduct.Options = elem.Options;
						editAbleProduct.TaxableProduct = elem.TaxableProduct && elem.TaxableProduct.toLowerCase() === 'y' ? true : false;
						editAbleProduct.parent = elem.parent;
						editAbleProduct.parentName = elem.parentName;
						editAbleProduct.isChild = elem.isChild;
						if ($scope.order.OrderID) {
							editAbleProduct.ProductSerials = elem.ProductSerials && elem.ProductSerials.split(',').length > 0 ? elem.ProductSerials.split(',') : []; // in update case there are may be serial numbers
							// editAbleProduct.ProductSerials = elem.ProductSerials // in update case there are may be serial numbers
						} else {
							// editAbleProduct.ProductSerials = ''; //in clone case, there are no serial numbers.
							editAbleProduct.ProductSerials = []; // in clone case, there are no serial numbers.
						}
						if (!elem.isChild) {
							$scope.addRow(editAbleProduct)
						} else {
							$scope.productChilds.push(new InvoiceRow(editAbleProduct))
						}
						break;
					}
				}
			});
			$scope.productChilds.forEach(pc => {
				for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
					if (pc.parent == $scope.order.OrderDetails[i].parentName) {
						$scope.order.OrderDetails[i].Childs.push(pc);
					}
				}
			})
			// commented to turn off product serial feature

			$scope.order.OrderDetails.forEach(elem => {
				// $scope.updateShippingQty(elem, 'update')
				LookupService.GetProductSerials(elem.ProductID, $scope.order.OrderID).then(function (response) {
					for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
						if (response.data[0] && response.data[0].ProductID == $scope.order.OrderDetails[i].ProductID) {
							$scope.order.OrderDetails[i].SerialsArray = response.data;
						}
					}
				}, function (error) {
					console.log('serial fetch error', error);
				})
			})
			$scope.QtyShipped = $scope.orderData.QtyShipped;
			$scope.order.TotalShippingCost = $scope.orderData[0].Freight ? $scope.orderData[0].Freight : 0;
			// $scope.order.PrivateNotes = $scope.orderData[0].PrivateNotes;
			$scope.order.OrderNotes = $scope.mode == 'Clone' ? "" : $scope.orderData[0].OrderNotes;
			$scope.order.SalesTaxRate1 = $scope.orderData[0].SalesTaxRate1;
			$scope.order.OrderStatus = $scope.orderData[0].OrderStatus;
			$scope.order.Incoterm = $scope.orderData[0].Incoterm;
			$scope.order.PONum = $scope.orderData[0].PONum;
			$scope.order.TrackingNo = $scope.orderData[0].TrackingNo;
			$scope.order.Order_Type = $scope.orderData[0].Order_Type;
			$scope.order.ShippingMethodID = $scope.orderData[0].ShippingMethodID
			$scope.order.OrderSerials = $scope.orderData[0].OrderSerials;
			$scope.order.ShipFirstName = $scope.orderData[0].ShipFirstName;
			$scope.order.ShipLastName = $scope.orderData[0].ShipLastName;
			$scope.order.ShipEmailAddress = $scope.orderData[0].ShipEmailAddress;
			$scope.order.ShipAddress1 = $scope.orderData[0].ShipAddress1;
			$scope.order.ShipAddress2 = $scope.orderData[0].ShipAddress2;
			$scope.order.ShipCity = $scope.orderData[0].ShipCity;
			$scope.order.ShipCountry = $scope.orderData[0].ShipCountry;
			$scope.order.ShipCompanyName = $scope.orderData[0].ShipCompanyName;
			$scope.order.ShipPostalCode = $scope.orderData[0].ShipPostalCode;
			$scope.order.ShipState = $scope.orderData[0].ShipState;
			$scope.order.ShipPhoneNumber = $scope.orderData[0].ShipPhoneNumber;
			$scope.order.BillingFirstName = $scope.orderData[0].CustomerFName;
			$scope.order.BillingLastName = $scope.orderData[0].CustomerLName;
			$scope.order.BillingAddress1 = $scope.orderData[0].BillingStreetAddress1;
			$scope.order.BillingAddress2 = $scope.orderData[0].BillingStreetAddress2;
			$scope.order.BillingCity = $scope.orderData[0].BillingCity1;
			$scope.order.BillingCompanyName = $scope.orderData[0].CustomerCompany;
			$scope.order.BillingCountry = $scope.orderData[0].BillingCountry1;
			$scope.order.BillingPostalCode = $scope.orderData[0].BillingPostalCode;
			$scope.order.BillingState = $scope.orderData[0].BillingState;
			$scope.order.BillingPhoneNumber = $scope.orderData[0].BillingPhoneNumber;
			$scope.order.insuranceValue = $scope.orderData[0].ShipCountry.toLowerCase() === 'us' ? 0 : $scope.orderData[0].InsuranceValue
			if ($scope.orderData[0].LastModified) {
				$scope.modifiedOn = moment($scope.orderData[0].LastModified).format("MM/DD/YYYY, hh:mm:ss A");
			}
			$scope.order.OrderDate = $scope.orderData[0].OrderDate ? new Date($scope.orderData[0].OrderDate) : new Date($scope.order.OrderDate);
			if ($scope.orderData[0].InvoiceableOn) {
				$scope.order.InvoiceableOn = new Date($scope.orderData[0].InvoiceableOn);
			} else {
				$scope.order.InvoiceableOn = new Date($scope.orderData[0].OrderDate);
			}
			getAlloctedSerials($scope.OrderID || $scope.order.OrderID)
			getAllOrderSerials($scope.OrderID || $scope.order.OrderID)
			CommonService.hideLoader()
		});
	}

	$scope.getProducts = function () {
		CommonService.showLoader();
		if ($scope.mode === 'Update') {
			ProductService.getAllProducts().then(function (response) {
				if ($scope.QuoteNo) {
					getQuoteForOrder();
				} else if ($scope.OrderID || $scope.order.OrderID || $scope.SerialNo) {
					getOrder();
					getOrderPackages()

				}
				CommonService.hideLoader();
				$scope.products = response.data;
			}, function (response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving products");
			})
		} else {
			ProductService.getProducts().then(function (response) {
				if ($scope.QuoteNo) {
					getQuoteForOrder();
				} else if ($scope.OrderID || $scope.order.OrderID || $scope.SerialNo) {
					getOrder();
					getOrderPackages()
				}
				CommonService.hideLoader();
				$scope.products = response.data;
			}, function (response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving products");
			})
		}
	};

	var InvoiceRow = function (product) {
		this.FreeShippingItem = ''
		this.OnOrder_Qty = 0;
		this.ProductWeight = product ? product.ProductWeight : 0;
		this.QtyOnBackOrder = product ? product.QtyOnBackOrder : 0;
		this.QtyOnPackingSlip = product ? product.QtyOnPackingSlip : 0;
		this.QtyShipped = product ? product.QtyShipped : 0;
		// this.QtyOnBackOrder = product ? product.QtyOnBackOrder : 1;
		this.ShipDate = new Date();
		this.ProductSerials = product ? product.ProductSerials : '';
		this.SerialsArray = [];
		this.isChild = product ? product.isChild : false;
		this.TaxableProduct = product ? product.TaxableProduct : true;
		this.ProductCode = product ? product.ProductCode : '';
		this.ProductID = product ? product.ProductID : '';
		this.productIndex = -1;
		this.Quantity = product ? product.Quantity : 1;
		this.TotalPrice = 0;
		this.Childs = [];
		this.DiscountValue = product ? product.DiscountValue : 0;
		this.ProductName = product ? product.ProductName : '';
		this.Options = product && CommonService.IsJsonString(product.Options) ? JSON.parse(product.Options) : undefined;
		this.ProductPrice = product ? product.ProductPrice : 0;
		this.isSerialAble = product ? product.isSerialAble : 0;
		this.QtyOnPackingSlipBackup = product ? product.QtyOnPackingSlipBackup : 0;
		// this.isSerialAble = product ? product.isSerialAble : 0;
		this.ExportDescription = product ? product.ExportDescription : '';
		this.CountryOfOrigin = product ? product.CountryOfOrigin : '';
		this.UnitOfMeasure = product ? product.UnitOfMeasure : '';
		this.ExportControlClassificationNumber = product ? product.ExportControlClassificationNumber : '';
		this.HarmonizedCode = product ? product.HarmonizedCode : '';
		this.Discription = product && product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
		this.parent = product ? product.parent : undefined
		this.parentName = product ? product.parentName : undefined
		if (product)
			this.selectedProduct = product;
		var classRef = this;
		this.productListner = function (product, index) {
			if (product.IsActive === 0) {
				$scope.removeRow(index, product.ProductCode)
				$scope.addRow()
				CommonService.showError('You cannot select this product as it is in-active')
				return
			}
			LookupService.GetProductSerials(product.ProductID, $scope.order.OrderID).then(function (response) {
				$scope.order.OrderDetails[index].SerialsArray = response.data;
			}, function (error) {
				console.log('serial fetch error', error);
			})
			classRef.product = angular.copy(product);
			classRef.DiscountValue = $scope.order ? $scope.order.CurrentCustomerDiscount : product.DiscountValue;
			classRef.FreeShippingItem = product.FreeShippingItem;
			classRef.OnOrder_Qty = classRef.OnOrder_Qty;
			classRef.Quantity = classRef.Quantity;
			classRef.ProductWeight = product.ProductWeight;
			classRef.QtyOnPackingSlip = classRef.QtyOnPackingSlip;
			classRef.QtyShipped = classRef.QtyShipped;
			classRef.QtyOnBackOrder = classRef.QtyOnBackOrder;
			classRef.ShipDate = $scope.order.OrderDate;
			// classRef.TaxableProduct = $scope.order.OrderDetails[0].TaxableProduct;
			classRef.ProductCode = product.ProductCode;
			classRef.ProductID = product.ProductID;
			classRef.ProductName = product.ProductName;
			classRef.ProductPrice = product.ProductPrice ? product.ProductPrice : 0;
			classRef.isSerialAble = product.isSerialAble;
			// classRef.isSerialAble = product.isSerialAble;
			classRef.ExportDescription = product ? product.ExportDescription : '';
			classRef.CountryOfOrigin = product ? product.CountryOfOrigin : '';
			classRef.UnitOfMeasure = product ? product.UnitOfMeasure : '';
			classRef.ExportControlClassificationNumber = product ? product.ExportControlClassificationNumber : '';
			classRef.HarmonizedCode = product ? product.HarmonizedCode : '';
			classRef.Discription = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
			classRef.Childs = [];
			var accessories = CommonService.parseFreeAccessories(product.FreeAccessories);
			let generatedString = randomString();
			if (!classRef.isChild) {
				$scope.order.OrderDetails[index].parentName = product.ProductCode + generatedString;
				$scope.order.OrderDetails[index].ProductPrice = product.ProductPrice ? product.ProductPrice : 0;
				// $scope.order.OrderDetails[index].isSerialAble = product.isSerialAble;
				$scope.order.OrderDetails[index].Discription = product.ProductDescriptionShort ? product.ProductDescriptionShort.replace(/style="[^"]*"/g, "") : '';
			}
			var freeProducts = [];
			for (accessory of accessories) {
				for (var i = 0; i < $scope.products.length; i++) {
					if (accessory.code.toLowerCase() == $scope.products[i].ProductCode.toLowerCase()) {
						freeProducts.push(angular.copy($scope.products[i]));
						freeProducts[freeProducts.length - 1].parent = product.ProductCode + generatedString
						freeProducts[freeProducts.length - 1].Quantity = accessory.qty;
						freeProducts[freeProducts.length - 1].QtyOnPackingSlip = classRef.QtyOnPackingSlip;
						freeProducts[freeProducts.length - 1].Discription = freeProducts[freeProducts.length - 1].ProductDescriptionShort ? freeProducts[freeProducts.length - 1].ProductDescriptionShort.replace(/style="[^"]*"/g, "") : "";
						freeProducts[freeProducts.length - 1].ProductPrice = 0;
						freeProducts[freeProducts.length - 1].ProductSerials = '';
						freeProducts[freeProducts.length - 1].isChild = true;
						$scope.order.OrderDetails[index].Childs.push(new InvoiceRow(freeProducts[freeProducts.length - 1]))
						break;
					}
				}

			}
			classRef.updateLineTotal();
		}
		this.updateLineTotal = function (type, index = -1) {
			$scope.QtyShipped = $scope.order.OrderDetails[0].QtyShipped
			// if (type = 'qty' && index > -1) {
			// 	if ($scope.order.OrderDetails[index].isChild == 0) {
			// 		for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
			// 			var list = $scope.order.OrderDetails[i].selectedProduct;
			// 			var single = $scope.order.OrderDetails[index].selectedProduct;
			// 			if (list.parent == single.ProductCode) {
			// 				$scope.order.OrderDetails[i].Quantity = $scope.order.OrderDetails[index].Quantity;
			// 			}
			// 		}
			// 	}
			// }
			$scope.updateTotals();
		}
	};

	$scope.updateToShipQty = function (type, index = -1) {
		$scope.order.OrderDetails.map((elem) => {
			if (parseInt(elem.Quantity) - parseInt(elem.QtyShipped) < parseInt(elem.QtyOnPackingSlip)) {
				$scope.invalidQuantity = true;
				return CommonService.showError("To Shipped quantity cannot be greater than order quantity.")
			} else {
				$scope.invalidQuantity = false;
			}
		})

		if ($scope.order.OrderDetails[index].QtyOnPackingSlip > $scope.order.OrderDetails[index].Quantity) {
			return CommonService.showError("Ship quantity cannot be greater than order quantity.")
		}
		if (index > -1) {
			var accessories = CommonService.parseFreeAccessories($scope.order.OrderDetails[index].selectedProduct.FreeAccessories);
			if ($scope.order.OrderDetails[index].isChild == 0) {
				console.log('not child');
				for (var i = 0; i < $scope.order.OrderDetails[index].Childs.length; i++) {
					accessories.map((elem) => {
						if (elem.code === $scope.order.OrderDetails[index].Childs[i].ProductCode) {
							accessoryQty = elem.qty
							// $scope.order.OrderDetails[index].Childs[i].Quantity = accessoryQty * $scope.order.OrderDetails[index].Quantity;
							$scope.order.OrderDetails[index].Childs[i].QtyOnPackingSlip = (accessoryQty * $scope.order.OrderDetails[index].QtyOnPackingSlip);
						}
					})
				}
			}
			// if ($scope.order.OrderDetails[index].Childs.length > 0) {
			// 	$scope.order.OrderDetails[index].Childs.forEach(function (elem) {
			// 		elem.QtyOnPackingSlip = $scope.order.OrderDetails[index].QtyOnPackingSlip;
			// 	})
			// }
		} else {
			if ($scope.order.OrderDetails[index].Childs.length > 0) {
				$scope.order.OrderDetails[index].Childs.forEach(function (elem) {
					elem.QtyOnPackingSlip = $scope.order.OrderDetails[index].QtyOnPackingSlip;
				})
			}
		}
	}

	$scope.updateTotals = function (type, index = -1) {
		
		if (type == 'qty' && index > -1) {
			console.log($scope.order.OrderDetails[index].Quantity)
			var accessories = CommonService.parseFreeAccessories($scope.order.OrderDetails[index].selectedProduct.FreeAccessories);
			if ($scope.order.OrderDetails[index].isChild == 0) {
				for (var i = 0; i < $scope.order.OrderDetails[index].Childs.length; i++) {
					accessories.map((elem) => {
						if (elem.code === $scope.order.OrderDetails[index].Childs[i].ProductCode) {
							accessoryQty = elem.qty
							$scope.order.OrderDetails[index].Childs[i].Quantity = accessoryQty * $scope.order.OrderDetails[index].Quantity;
							$scope.order.OrderDetails[index].Childs[i].QtyOnPackingSlip = (accessoryQty * $scope.order.OrderDetails[index].Quantity) - ($scope.order.OrderDetails[index].Childs[i].QtyShipped ? $scope.order.OrderDetails[index].Childs[i].QtyShipped : 0);
						}
					})
				}
				// for (var i = 0; i < $scope.order.OrderDetails[index]$scope.order.OrderDetails[index].Childs.length; i++) {
				// 	$scope.order.OrderDetails[index].Childs[i].Quantity = $scope.order.OrderDetails[index].Quantity;
				// }
				$scope.order.OrderDetails[index].QtyOnPackingSlip = $scope.order.OrderDetails[index].Quantity - $scope.order.OrderDetails[index].QtyShipped;
				// if ($scope.order.OrderDetails[index].Childs.length > 0) {
				// 	$scope.order.OrderDetails[index].Childs.forEach(function (elem) {
				// 		elem.QtyOnPackingSlip = elem.Quantity - elem.QtyShipped;
				// 	})
				// }
			}
		}
		$scope.order.OrderDetails.forEach(function (elem) {
			// elem.total = elem.Quantity * elem.ProductPrice;
			elem.TotalPrice = parseFloat((elem.Quantity * elem.ProductPrice).toFixed(2));
			if (elem.DiscountValue > 0) {
				let discount = ((elem.DiscountValue / 100) * elem.ProductPrice);
				elem.TotalPrice = (elem.Quantity * ((elem.ProductPrice - discount).toFixed(2))).toFixed(2);
				// elem.TotalPrice -= discount;
			}
		})
		$scope.updateSubTotal();
	}
	//not in use
	$scope.updateShippingQty = function (orderRow, callFrom) {
		orderRow.QtyOnPackingSlip = orderRow.ProductSerials.length; //qty for show on packing slip
		var QtyShipped = orderRow.ProductSerials.length // qty for ship, same as above line
		orderRow.QtyOnBackOrder = orderRow.Quantity - QtyShipped; // remaing qty to ship
		orderRow.QtyShipped = QtyShipped //save record for qty shipped
		orderRow.Childs.forEach(elem => {
			elem.QtyOnPackingSlip = orderRow.QtyOnPackingSlip; //assigning same qty to child as parent have according to seriel num lenght
			elem.QtyShipped = orderRow.QtyShipped; //assigning same qty to child as parent have according to seriel num lenght
			elem.QtyOnBackOrder = orderRow.QtyOnBackOrder; //assigning same qty to child as parent have according to seriel num lenght
		})
		if ($scope.order.OrderID) { //calculation for new packing slip 
			orderRow.QtyOnPackingSlip = QtyShipped - orderRow.QtyShipped
			orderRow.Childs.forEach(elem => {
				elem.QtyOnPackingSlip = orderRow.QtyOnPackingSlip; //assigning same qty to child as parent have according to seriel num lenght
				elem.QtyShipped = orderRow.QtyShipped; //assigning same qty to child as parent have according to seriel num lenght
				elem.QtyOnBackOrder = orderRow.QtyOnBackOrder; //assigning same qty to child as parent have according to seriel num lenght
			})
		}
	}
	// end not in use
	$scope.updateSubTotal = function () {
		var total = 0;
		var taxTotal = 0;
		for (var i = 0; i < $scope.order.OrderDetails.length; i++) {
			total += parseFloat($scope.order.OrderDetails[i].TotalPrice);
			if ($scope.order.OrderDetails[i].TaxableProduct)
				taxTotal += parseFloat($scope.order.OrderDetails[i].TotalPrice)
		}
		$scope.order.Affiliate_Commissionable_Value = total;
		// $scope.taxTotal = parseFloat(taxTotal)- ((taxTotal / 100) * $scope.CustomerDiscount);
		$scope.taxTotal = taxTotal
		$scope.total = total;
	}

	$scope.removeRow = function (index) {
		$scope.order.OrderDetails.splice(index, 1)
		$scope.updateTotals();
	}

	$scope.addRow = function (product = undefined) {
		$scope.order.OrderDetails.push(new InvoiceRow(product));
	}

	$scope.customerListner = function (selectedCustomer) {
		$scope.order.CustomerID = selectedCustomer.CustomerID;
		$scope.order.BillingFirstName = selectedCustomer.FirstName;
		$scope.order.BillingLastName = selectedCustomer.LastName;
		$scope.order.BillingCompanyName = selectedCustomer.CompanyName;
		$scope.order.BillingAddress1 = selectedCustomer.BillingAddress1;
		$scope.order.BillingAddress2 = selectedCustomer.BillingAddress2;
		$scope.order.BillingCity = selectedCustomer.City;
		$scope.order.BillingCountry = selectedCustomer.Country;
		$scope.order.BillingPostalCode = selectedCustomer.PostalCode;
		$scope.order.BillingState = selectedCustomer.State;
		$scope.EmailAddress = selectedCustomer.EmailAddress;
		$scope.order.BillingPhoneNumber = selectedCustomer.PhoneNumber;
		$scope.CustomerDiscount = selectedCustomer.CustomerDiscount;
		$scope.order.CurrentCustomerDiscount = $scope.CustomerDiscount;
		$scope.addCustomerBtn = false;
		$scope.taxExempt = false
		$scope.order.OrderDetails.map((elem) => {
			elem.DiscountValue = $scope.CustomerDiscount;
		})
		$scope.updateTotals();
		$scope.selected.customer = selectedCustomer
		// console.log($scope.order)
	};
	$scope.endUserListner = function (selectedCustomer,checks) {
		console.log(selectedCustomer)
		$scope.order.endUserId = selectedCustomer.id
		$scope.selected.endUser = selectedCustomer
	};

	$scope.toggleSameAsShipping = function () {
		if ($scope.sameAsShipping) {
			$scope.sameAsBilling = false;
			$scope.sameAsShipping = true;
			$scope.updateAddress();
		}
	};

	$scope.toggleSameAsBilling = function () {
		if ($scope.sameAsBilling) {
			$scope.sameAsShipping = false;
			$scope.sameAsBilling = true;
			$scope.updateAddress();
			$scope.getTaxRate();
		}
		// $scope.isTaxExempt()
	};
	$scope.shipAddressChange = function () {
		if ($scope.isCalculateShipping)
			$scope.checkShippings()
		$scope.getTaxRate();
	}
	$scope.updateAddress = function () {
		if ($scope.sameAsShipping) {
			$scope.order.BillingAddress1 = angular.copy($scope.order.ShipAddress1);
			$scope.order.BillingAddress2 = angular.copy($scope.order.ShipAddress2);
			$scope.order.BillingCity = angular.copy($scope.order.ShipCity);
			$scope.order.BillingCountry = angular.copy($scope.order.ShipCountry);
			$scope.order.BillingPostalCode = angular.copy($scope.order.ShipPostalCode);
			$scope.order.BillingState = angular.copy($scope.order.ShipState);
			$scope.order.BillingPhoneNumber = angular.copy($scope.order.ShipPhoneNumber);
			$scope.order.BillingFirstName = angular.copy($scope.order.ShipFirstName);
			$scope.order.BillingLastName = angular.copy($scope.order.ShipLastName);
			$scope.EmailAddress = angular.copy($scope.order.ShipEmailAddress);
			$scope.order.BillingCompanyName = angular.copy($scope.order.ShipCompanyName);
		} else if ($scope.sameAsBilling) {
			$scope.order.ShipAddress1 = angular.copy($scope.order.BillingAddress1);
			$scope.order.ShipAddress2 = angular.copy($scope.order.BillingAddress2);
			$scope.order.ShipCity = angular.copy($scope.order.BillingCity);
			$scope.order.ShipCountry = angular.copy($scope.order.BillingCountry);
			$scope.order.ShipPostalCode = angular.copy($scope.order.BillingPostalCode);
			$scope.order.ShipState = angular.copy($scope.order.BillingState);
			$scope.order.ShipPhoneNumber = angular.copy($scope.order.BillingPhoneNumber);
			$scope.order.ShipFirstName = angular.copy($scope.order.BillingFirstName);
			$scope.order.ShipLastName = angular.copy($scope.order.BillingLastName);
			$scope.order.ShipEmailAddress = angular.copy($scope.EmailAddress);
			$scope.order.ShipCompanyName = angular.copy($scope.order.BillingCompanyName);
		}
	};

	// place order step start 1 
	$scope.validateOrder = async (next) => {
		// ----------------- order validations and menupulations start --------------------- //
		// let isQtyEmptied = false
		// $scope.order.OrderDetails.map(async (linItem) => {
		// 	if (linItem.Quantity < 0 || linItem.Quantity === "undefined" || linItem.Quantity === null){
		// 		isQtyEmptied = true
		// 		if (linItem.Childs.length > 0){
		// 			linItem.Childs.map(childLinItem => {
		// 				if (childLinItem.Quantity < 0 || childLinItem.Quantity === "undefined" || childLinItem.Quantity === null){
		// 					isQtyEmptied = true
		// 				}
		// 			});
		// 		}
		// 	} 
		// });
		// if (isQtyEmptied)  {
		// 	CommonService.showError('Product Quantity should be atleast one');
		// 	return;
		// }	
		if ($scope.invalidQuantity) {
			CommonService.showError("To Shipped cannot be greater than order Quantity.");
			return;
		}
		if ($scope.order.CustomerID === undefined || $scope.order.CustomerID === null) {
			CommonService.showError('Please select a customer!');
			return;
		}
		if (!$scope.order.ShipCountry) {
			CommonService.showError('Please select a Shipping Country!');
			return;
		}
		if (!$scope.order.BillingCountry) {
			CommonService.showError('Please select a Billing Country!');
			return;
		}
		
		if ($scope.order.OrderDetails[0].ProductName == "") {
			CommonService.showError('Please select a product!');
			return;
		}
		if ($scope.paymentMode)
			if (validateCC()) {
				// console.log($scope.card);
				// $scope.order.creditCard = angular.copy($scope.card)
			} else {
				CommonService.showError('Invalid credid card details.')
				return
			}
		if ($scope.order.CustomerID && $scope.order.ShipAddress1 && $scope.order.ShipCity && $scope.order.ShipCountry) {
			$scope.isTaxExempt().then(function (response) {
				if (response.data.status) {
					if (response.data.isExempt) {
						// CommonService.showSuccess(response.data.msg)
						CommonService.confirm("This shipping address has Tax Exemption, Do you want to Continue?", () => {
							$scope.order.SalesTaxRate1 = 0;
							$scope.order.IsTaxExempt = 1;
							$scope.order.TaxExemptionId = response.data.result[0].id;
							$scope.taxExempt = true;
							prepareOder(next)
						})
					} else {
						// CommonService.showWarning(response.data.msg)
						$scope.order.IsTaxExempt = 0;
						$scope.order.TaxExemptionId = null;
						prepareOder(next)
						$scope.taxExempt = false;
					}
				} else {
					CommonService.showError(response.data.msg)
					$scope.taxExempt = false;
					CommonService.confirm("Tax Exemption check faild, Do you want to Continue without checking?", () => {
						$scope.order.IsTaxExempt = 0;
						$scope.order.TaxExemptionId = null;
						prepareOder(next)
					})
				}
			})
		} else {
			CommonService.confirm("Shipping address not provided, Do you want to Continue?", () => {
				$scope.taxExempt = false;
				$scope.order.IsTaxExempt = 0;
				$scope.order.TaxExemptionId = null;
				prepareOder(next)
			})
		}
	}
	// var checkShipQuantityWithSerialArray = function (ProductID,QtyOnPackingSlip,QtyShipped){
	// 	if($scope.allocatedSerialArray){
	// 		if($scope.allocatedSerialArray.length > 0){
	// 		var shipped = $scope.allocatedSerialArray.length + QtyShipped
	// 		var toShipped = QtyShipped + QtyOnPackingSlip
	// 		if(shipped === toShipped)
	// 			return true
	// 		else
	// 			return false
	// 	}}
	// }
	// place order step 2
	var prepareOrderContinue = (persistPackingSlip,next) =>{
		// return
		
		if ($scope.mode !== "Clone") {
			$scope.order.UserId = $scope.order.OrderID ? $scope.orderData[0].UserId : $scope.currentUser.id;
		}
		$scope.order.PaymentAmount = CommonService.roundTo2Decimals(($scope.order.Affiliate_Commissionable_Value + $scope.order.TotalShippingCost) + ($scope.order.SalesTaxRate1 / 100 * $scope.taxTotal))
		$scope.order.Tax1_Title = "Tax (" + $scope.order.SalesTaxRate1 * 100 + "%)";
		$scope.order.SalesTax1 = CommonService.roundTo2Decimals($scope.order.SalesTaxRate1 / 100 * $scope.taxTotal)
		$scope.order.Total_Payment_Authorized = parseFloat($scope.order.PaymentAmount);
		$scope.order.Total_Payment_Received = 0 //($scope.order.Affiliate_Commissionable_Value + $scope.order.TotalShippingCost) + (($scope.order.SalesTaxRate1 / 100) * $scope.order.Affiliate_Commissionable_Value);
		// console.log('orignal order', $scope.order);
		$scope.order.QuoteNo = $scope.QuoteNo
		let isQtyEmptied = false
		// $scope.order.OrderDetails.map(async (linItem) => {
		// 	if (linItem.Quantity < 0 || linItem.Quantity === "undefined" || linItem.Quantity === null){
		// 		isQtyEmptied = true
		// 		if (linItem.Childs.length > 0){
		// 			linItem.Childs.map(childLinItem => {
		// 				if (childLinItem.Quantity < 0 || childLinItem.Quantity === "undefined" || childLinItem.Quantity === null){
		// 					isQtyEmptied = true
		// 				}
		// 			});
		// 		}
		// 	} 
		// });
		
		var dataToPost = angular.copy($scope.order);
		dataToPost.OrderDetails.map(function (elem) {
			delete elem.isSerialAble
			delete elem.selectedProduct.isSerialAble
			if (elem.Quantity < 1 || elem.Quantity === "undefined" || elem.Quantity === null){
				isQtyEmptied = true
			}
			if (elem.Childs.length > 0){
				elem.Childs.map(element => {
					delete element.isSerialAble
					delete element.selectedProduct.isSerialAble
					if (element.Quantity < 0 || element.Quantity === "undefined" || element.Quantity === null){
						isQtyEmptied = true
					}
				});
			}
		});
		console.log(dataToPost.OrderDetails)
		if (isQtyEmptied)  {
			CommonService.showError('Product Quantity should be atleast one');
			return;
		}
		var shortSerialsCheck = false;
		var orderStatusCheck = false;
		var productToShipCheck = false;
		var childsNotShowOnSlip = undefined;
		var proCode = [];
		dataToPost.tempArray = [];
		dataToPost.OrderDetails.forEach(elem => {
			dataToPost.tempArray.push(elem);
			// if (elem.ProductSerials.length < elem.Quantity) {
			// 	orderStatusCheck = true; //if order shipped qty is less then quatity.
			// }
			// if (elem.ProductSerials.length > elem.Quantity) {
			// 	shortSerialsCheck = true;
			// 	proCode.push(elem.ProductCode)
			// }
			if (elem)
				dataToPost.tempArray = dataToPost.tempArray.concat(elem.Childs);
		})
		dataToPost.OrderDetails.forEach(elem => {
			if (elem.TaxableProduct) {
				elem.TaxableProduct = 'Y'
			} else {
				elem.TaxableProduct = 'N'
			}
		})
		
		if ($scope.mode == 'Update') {
			dataToPost.LastModBy = $scope.currentUser.id;
			dataToPost.LastModified = new Date();
		}
		if ($scope.mode == 'Clone') {
			dataToPost.OrderDate = new Date();
			dataToPost.UserId = $scope.currentUser.id;
			delete dataToPost.OrderID
		}
		if ($scope.order.OrderStatus != 'Cancelled' && $scope.mode == 'Clone') {
			$scope.order.CancelDate = null;
			dataToPost.CancelDate = null;
		} else if ($scope.order.OrderStatus === 'Cancelled') {
			$scope.order.CancelDate = new Date;
			dataToPost.CancelDate = new Date($scope.order.CancelDate).toLocaleString('en-US').replace(',', '');;
		} else if ($scope.order.OrderStatus != 'Cancelled') {
			$scope.order.CancelDate = null;
			dataToPost.CancelDate = null;
		} else if (!orderStatusCheck && $scope.order.OrderStatus === 'Partially Shipped') {
			$scope.order.OrderStatus = 'Shipped';
			dataToPost.OrderStatus = 'Shipped';
		}
		if ($scope.order.OrderStatus === 'Partially Shipped' || $scope.order.OrderStatus === 'Shipped') {
			$scope.order.ShipDate = new Date;
			dataToPost.ShipDate = new Date($scope.order.ShipDate).toLocaleString('en-US').replace(',', '');
		}
		dataToPost.OrderDetails = dataToPost.tempArray;
		delete dataToPost.tempArray
		if (shortSerialsCheck) {
			CommonService.showError(proCode.join(', ') + " Serial Numbers Limit Exceeds!");
			return;
		}
		console.log($scope.order.OrderSerials)
		$scope.SerialNumberArray = [];
		dataToPost.OrderTaxExempt = $scope.OrderTaxExempt;
		dataToPost.OrderDetails.forEach(elem => {
			delete elem.productListner;
			delete elem.totalAllocatedForSerial
			delete elem.selectedProduct;
			delete elem.productIndex;
			delete elem.updateLineTotal;
			delete elem.product;
			delete elem.SerialsArray;
			delete elem.Childs;
			
			elem.qutantityForTrackToShipped =+ elem.QtyOnPackingSlip
			// console.log(elem.QtyOnPackingSlip);
			if (elem.QtyOnPackingSlip <= 0) {
				console.log("<= 0: ", elem.QtyOnPackingSlip, elem.QtyOnBackOrder);
				if (persistPackingSlip)
					elem.QtyOnPackingSlip = elem.QtyOnBackOrder
				else
					elem.QtyOnPackingSlip = 0;
				// delete elem.QtyOnPackingSlip 
			} else {
				console.log("> 0: ", elem.QtyOnPackingSlip, elem.QtyOnBackOrder);
				elem.QtyOnBackOrder = elem.QtyOnPackingSlip
			}
			// if($scope.order.OrderStatus === 'Partially Shipped' || $scope.order.OrderStatus === 'Shipped')
			// elem.qutantityForTrackToShipped =+ elem.QtyShipped
			// elem.QtyOnBackOrder = elem.Quantity - elem.QtyOnPackingSlip;
			// elem.QtyShipped = Math.abs(elem.Quantity - elem.QtyOnBackOrder);
			// console.log('elem.ProductSerials', elem.ProductSerials);

			// commented to turn off product serial feature
			if (elem.ProductSerials != undefined && elem.ProductSerials.length > 0 && !elem.isChild) {
				productToShipCheck = true;
				childsNotShowOnSlip = elem.parentName;
			}
			if (elem.QtyOnPackingSlip && elem.QtyOnPackingSlip > 0 && !elem.isChild) {
				productToShipCheck = true;
				childsNotShowOnSlip = elem.parentName;
			}
			if (childsNotShowOnSlip && childsNotShowOnSlip === elem.parent) {
				elem.showOnShippingSlip = false;
			}
			if (elem.ProductSerials != undefined && elem.ProductSerials.length > 0)
				$scope.SerialNumberArray = $scope.SerialNumberArray.concat(elem.ProductSerials)
			elem.ProductSerials = elem.ProductSerials ? elem.ProductSerials.join(',') : '';

			// $scope.order.OrderSerials = $scope.allocatedSerialArray.join(',').replace(/,{1,}$/, '')
			// $scope.order.OrderSerials = stringOfSerials
			dataToPost.OrderSerials = $scope.order.OrderSerials.replace(/,\s*$/, "");
			// dataToPost.OrderSerials = stringOfSerials
			elem.Options = elem.Options ? JSON.stringify(elem.Options) : ''
			elem.ProductName = elem.ProductName.replace(/'/g, "\\'").replace(/"/g, '\\"');
			elem.Discription = elem.Discription.replace(/'/g, "\\'").replace(/"/g, '\\"');
			elem.parentName = elem.parentName;
			elem.parent = elem.parent;
			if(elem.QtyOnPackingSlip == 0 && elem.QtyOnPackingSlipBackup > 0){
				elem.QtyOnPackingSlip = elem.QtyOnPackingSlipBackup
			}
			delete elem.QtyOnPackingSlipBackup
		});
		console.log(dataToPost)
		if (!productToShipCheck && next === 'slip') {
			CommonService.showError('Nothing to ship in this order!');
			return;
		}
		dataToPost.OrderDate = new Date(dataToPost.OrderDate).toLocaleString('en-US').replace(',', '');
		if ($scope.checkShippingsFetchForPackages) {
			dataToPost.parcels = $scope.parcels
			console.log('Order Ready', dataToPost.parcels);
		}

		// return
		// ----------------- order validations and menupulations ends --------------------- //
		if (next === 'payment') {
			makePayment(dataToPost)
		} else {
			// console.log(dataToPost);
			postOrder(dataToPost, next)
		}
	}
	var prepareOder = async function (next) {
        if($scope.order.BillingCountry === "RU" || 	$scope.order.BillingCountry === 'BY' || $scope.order.BillingCountry ==="KZ" || $scope.order.BillingCountry ==="AM" || $scope.order.BillingCountry ==="KG"  ){
			CommonService.showError('Order is for ' + $scope.order.BillingCountry + ' close');
			return
		}else if( $scope.order.ShipCountry === "RU"  || $scope.order.ShipCountry === "KZ" || $scope.order.ShipCountry ==="AM"|| $scope.order.ShipCountry === "KG"){
			CommonService.showError('Order is for ' +$scope.order.ShipCountry + ' close');
			return
		}else{
			let checkSerailsQuantity = true
			$scope.updateSubTotal() //for order total recalculate
			let filteredOD = $scope.order.OrderDetails.filter(od => od.Quantity === od.QtyShipped)
			let persistPackingSlip = filteredOD.length === $scope.order.OrderDetails.length;
			if (!$scope.isNew && ($scope.order.OrderStatus === 'Partially Shipped' || $scope.order.OrderStatus === 'Shipped')) {
				try {
					const responseOfSerialChecks = await $scope.order.OrderDetails.map((elem) => {
						let quantity = 0
						if (elem.isSerialAble) {
							console.log(elem.ProductCode,"serial able")
							if (elem.QtyOnPackingSlip > 0) {
								if ($scope.allocatedSerialArray) {
									$scope.allocatedSerialArray.map((serailObj) => {
										if (serailObj.ProductID === elem.ProductID) {
											quantity += 1
											if (elem.QtyOnPackingSlip === quantity) {
												checkSerailsQuantity = true
												elem.QtyShipped = elem.QtyShipped + elem.QtyOnPackingSlip;
												elem.Childs.map((e) => {
													e.QtyShipped = e.QtyShipped + e.QtyOnPackingSlip
												})
											} else {
												checkSerailsQuantity = false
											}
										}
									})
								} else {
									checkSerailsQuantity = false
								}
								if (!$scope.isNew && !checkSerailsQuantity) {
									$scope.checkProductCodeForSerial = elem.ProductCode
									CommonService.showError("Allocated Serials of " + $scope.checkProductCodeForSerial + " are not same as to Shipped");
									return !checkSerailsQuantity
								}
							}
							if(elem.QtyOnPackingSlip < 0 && elem.isSerialAble){
								elem.QtyShipped = elem.QtyShipped + elem.QtyOnPackingSlip;
								elem.Childs.map((e) => {
									e.QtyShipped = e.QtyShipped + e.QtyOnPackingSlip
								})
							}
						}
					})
				} catch (error) {
					console.log(error)
				}
				if (!$scope.isNew && !checkSerailsQuantity) {
					return
				}
				const notSerialAble = $scope.order.OrderDetails.map((elem) => {
					if (!elem.isSerialAble) 
					{
						console.log(elem.ProductCode,"not serial able")
						elem.QtyShipped = elem.QtyShipped + elem.QtyOnPackingSlip;
						elem.Childs.map((e) => {
							e.QtyShipped = e.QtyShipped + e.QtyOnPackingSlip
						})
					}
				})
				let SalesTaxRate1 = 0
				var country = $scope.order.ShipCountry.toLowerCase();
				if (country === 'us' || country === 'united states') {
					country = 'US'
				} else if (country === 'au' || country === 'Australia') {
					country = 'AU'
				}
				// return console.log($scope.order)
				if (($scope.order.ShipState === 'CA' || $scope.order.ShipState.toLowerCase() === 'california') && country === 'US') {
					var data = {
						ShipPostalCode: $scope.order.ShipPostalCode,
						ShipAddress: $scope.order.ShipAddress1,
						ShipCity: $scope.order.ShipCity
					}
					try {
						SalesTaxRate1 = $scope.order.SalesTaxRate1
						const response = await CommonService.getUsTax(data) 
						if (response.data.status && response.data.code === 200) {
							SalesTaxRate1 = parseFloat((parseFloat(response.data.final_tax_rate) * 100).toFixed(4));
						} else {
							SalesTaxRate1 = parseFloat((parseFloat(response.data.final_tax_rate) * 100).toFixed(4));
						}
						if($scope.OrderTaxExempt)
						{
							if ($scope.OrderTaxExempt) {
							SalesTaxRate1 = parseFloat((parseFloat(SalesTaxRate1) - 3.9375).toFixed(4))
							// console.log(typeof SalesTaxRate1)
							}
							if (!$scope.OrderTaxExempt && parseFloat(SalesTaxRate1) != 0) {
								$scope.order.SalesTaxRate = (parseFloat(SalesTaxRate1) + 3.9375).toFixed(4)
								SalesTaxRate1 = parseFloat($scope.order.SalesTaxRate)
								// console.log(SalesTaxRate1)
							}
							if (parseFloat(SalesTaxRate1) < 0) {
								SalesTaxRate1 = 0
								CommonService.showError('Tax Value Too Short!');
								$scope.OrderTaxExempt = false
							}
						}
						console.log(SalesTaxRate1, $scope.order.SalesTaxRate1)
						if(SalesTaxRate1 !== $scope.order.SalesTaxRate1 ){
							try {
								$('.modal-backdrop').show();
								const modal =await ModalService.showModal({
									templateUrl: "template/confirmation.ejs",
									controller: "ConfirmationController",
									inputs: {
										oldTax: $scope.order.SalesTaxRate1,
										newTax: SalesTaxRate1
									}
								})
								modal.element.modal({
									backdrop: 'static',
									keyboard: false
								});
								try {
									modal.close.then(function (response) {
										$('.modal-backdrop').remove();
										$('body').removeClass('modal-open');
										if(response){
											$scope.order.SalesTaxRate1 = SalesTaxRate1
											prepareOrderContinue(persistPackingSlip,next)
										} else{
											prepareOrderContinue(persistPackingSlip,next)
										}
									});
									
								} catch (error) {
									console.log(error)
								}
							} catch (error) {
								console.log(error)
							}
						}else{
							prepareOrderContinue(persistPackingSlip,next)
						}
						
					}catch(error){
						prepareOrderContinue(persistPackingSlip,next)
					}
				}else{
					prepareOrderContinue(persistPackingSlip,next)
				}
			}
			else{
				prepareOrderContinue(persistPackingSlip,next)
			}
		}
		

	}

	// place order step 3
	var postOrder = function (dataToPost, next) {
		// return console.log('Order Ready', dataToPost);
		// console.log(dataToPost)
		CommonService.showLoader()
		$http({
			method: 'POST',
			url: placeOrderBlueSkyUrl,
			header: {
				'Content-Type': 'application/xml; charset=utf-8'
			},
			data: dataToPost
		}).then(function (response) {
			// return console.log('Order response', response);

			if (response.data.status && response.data.error === undefined) {
				redirectOrder(response, next)
			} else {
				console.log("Something went Wrong!", response);
				CommonService.showError("Something went Wrong, Try again!");
			}
			CommonService.hideLoader();
		}, function (response) {
			CommonService.hideLoader();
			CommonService.showError("Error while placing order, Check you internet connection!");
		});
	}

	// place order step end 4
	var redirectOrder = function (response, next) {
		CommonService.showSuccess("Order has been placed.")
		$scope.isOrdered = 1;
		$scope.mode = "Update";
		$scope.isNew = false;
		$scope.order.OrderID = orderId = response.data.data.id;
		// var d = new Date();
		// var pdfname =
		// 	d.getFullYear() +
		// 	("0" + (d.getMonth() + 1)).slice(-2) +
		// 	("0" + d.getDate()).slice(-2) + "_" +
		// 	("00000" + orderId.toString()).slice(-6);
		// if (next == "invoice") {
		// 	window.open(
		// 		location.origin + "/genrate-order-pdf/" + pdfname + '.pdf',
		// 		'_blank' // <- This is what makes it open in a new window.
		// 	);
		// } else {
		// 	window.open(
		// 		location.origin + "/genrate-packing-slip/" + pdfname + '.pdf',
		// 		'_blank' // <- This is what makes it open in a new window.
		// 	);
		// }
		window.location = "/order-new?update=" + $scope.order.OrderID
	}

	$scope.makePayment = function (dataToPost) {
		if ($scope.paymentMode) {
			dataToPost.OrderID = response.data.data.id
			makePayment(dataToPost, (payment) => {
				// console.log(payment,'res');
			})
		}
	}

	$scope.sendPaymentDataToAnet = function () {
		CommonService.showLoader();
		if (validateCC()) {
			$scope.authData = {};
			// $scope.authData.clientKey = "46gk36Be6QJ76ByU3NZjpdMZqJeUJyM962Wc3Q86kyg3d3sTCqT3uN2g7UtjWcZF";
			// $scope.authData.apiLoginID = "3xS98PkAb2x";

			// $scope.authData.clientKey = "636q26Hk7dMc9PQZ9N3KsGj9Rc8WvbAB4e7cq3Vcj6a5YZEr89jJ7Ph6mHeE2E9w";
			// $scope.authData.apiLoginID = "834vyGZjP";

			$scope.authData.clientKey = "53FKADzhwu57QU6f7BZ6TBacd6Wjtp86DP347apAcyjW4HqXrPAgnYFK3vQ8neEr";
			$scope.authData.apiLoginID = "45N48U7q4tL";

			$scope.cardData = {};
			$scope.cardData.cardNumber = $scope.card.number.replace(/\s/g, '');
			// $scope.cardData.expiry =  $scope.card.expiry;
			$scope.cardData.month = $scope.card.expiry.slice(0, 2);
			$scope.cardData.year = '20' + $scope.card.expiry.slice(3, 5);
			$scope.cardData.cardCode = $scope.card.cvc;

			$scope.secureData = {};
			$scope.secureData.authData = $scope.authData;
			$scope.secureData.cardData = $scope.cardData;
			// console.log($scope.secureData)
			Accept.dispatchData($scope.secureData, responseHandler);

			function responseHandler(response) {
				if (response.messages.resultCode === "Error") {
					$scope.paymentAcceptError = response.messages.message[0].text
					console.log(response, "Auth Error");
					CommonService.hideLoader()
				} else {

					$scope.status = ["failure", response]
					// console.log($scope.status, "status");
					$scope.opaqueData = $scope.status[1].opaqueData
					// console.log($scope.opaqueData, "opaqueData");
					$scope.validateOrder('payment')
				}
			}
		} else {
			$scope.paymentError = null;
			$scope.paymentAcceptError = null;
			CommonService.showError('Invalid credid card details.')
			CommonService.hideLoader()
			return
		}
	}
	var makePayment = function (order, callback) {
		PaymentService.charge({
			order: order,
			payment: $scope.opaqueData
		}).then((response) => {
			// console.log(response);
			if (response.data.code === 200 && response.data.status) {
				$scope.order.IsPayed = true;
				$scope.paymentMode = false;
				$scope.paymentSuccess = true
				CommonService.hideLoader()
				// callback(response)
			} else {
				$scope.paymentError = response.data.msg
				CommonService.showError(response.data.msg)
				CommonService.hideLoader()
			}
			// CommonService.hideLoader()
		})
	}

	$scope.isTaxExempt = function (address) {
		$scope.order.OrderDate = new Date($scope.order.OrderDate)
		if ($scope.order.CustomerID && $scope.order.ShipAddress1 && $scope.order.ShipCity && $scope.order.ShipCountry) {
			var data = {
				address1: $scope.order.ShipAddress1,
				address2: $scope.order.ShipAddress2,
				state: $scope.order.ShipState,
				postalCode: $scope.order.ShipPostalCode,
				city: $scope.order.ShipCity,
				country: $scope.order.ShipCountry,
				orderDate: $scope.order.OrderDate.toISOString(),
			}
			return TaxExemptionService.checkTaxExemption(data)
		}
	}

	$scope.chargePayment = function () {
		$('.modal-backdrop').show();
		ModalService.showModal({
			templateUrl: "template/payment-modal.ejs",
			controller: "PaymentController",
			inputs: {
				order: angular.copy($scope.order)
			}
		}).then(function (modal) {
			modal.element.modal({
				backdrop: 'static',
				keyboard: false
			});
			modal.close.then(function (response) {
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
			});
		});
	}
	
	$scope.calculateTaxExempt = function () {
		console.log($scope.order.SalesTaxRate1)
		if ($scope.OrderTaxExempt) {
			$scope.order.SalesTaxRate1 = parseFloat((parseFloat($scope.order.SalesTaxRate1) - 3.9375).toFixed(4))
			console.log($scope.order.SalesTaxRate1)

		}
		if (!$scope.OrderTaxExempt && parseFloat($scope.order.SalesTaxRate1) != 0) {
			$scope.order.SalesTaxRate = (parseFloat($scope.order.SalesTaxRate1) + 3.9375).toFixed(4)
			$scope.order.SalesTaxRate1 = parseFloat($scope.order.SalesTaxRate)
			console.log($scope.order.SalesTaxRate1)
		}
		if (parseFloat($scope.order.SalesTaxRate1) < 0) {
			$scope.order.SalesTaxRate1 = 0
			CommonService.showError('Tax Value Too Short!');
			$scope.OrderTaxExempt = false
		}

	};
	$scope.getTaxRate = function () {
		if ($scope.order.CustomerID === undefined || $scope.order.CustomerID === null) {
			CommonService.showError('Please select a customer!');
			return;
		}
		if (!$scope.order.ShipAddress1) {
			CommonService.showError('Please input Shipping Address 1!');
			return;
		}
		if (!$scope.order.ShipCity) {
			CommonService.showError('Please input Shipping City!');
			return;
		}
		if (!$scope.order.ShipCountry) {
			CommonService.showError('Please select Shipping City!');
			return;
		}
		if ($scope.order.CustomerID && $scope.order.ShipAddress1 && $scope.order.ShipCity && $scope.order.ShipCountry) {
			$scope.isTaxExempt().then(function (response) {
				$scope.OrderTaxExempt = $scope.OrderTaxExempt?$scope.OrderTaxExempt : false;
				if (response.data.status) {
					if (response.data.isExempt) {
						$scope.OrderTaxExempt = false
						CommonService.showSuccess("This address have tax exemption, can not get tax for this address.")
					} else {
						getTax()
					}
				} else {
					CommonService.showError(response.data.msg)
					$scope.taxExempt = false;
					$scope.OrderTaxExempt =false
					CommonService.confirm("Tax Exemption check faild, Do you want to Continue without checking?", () => {
						getTax()
					})
				}
			})
		} else {
			CommonService.showError('To Get Tax shipping address is required.')
		}
	}

	$scope.selectShipping = function (selectedShipping) {
		// console.log("selectedShipping")
		if (selectedShipping) {
			console.log("selectedShipping  True")
			$scope.selectedShipping = selectedShipping
			$scope.order.TotalShippingCost = parseFloat(selectedShipping.charges) ? parseFloat(selectedShipping.charges) : 0
			$scope.order.ShippingMethodID = parseInt(selectedShipping.id)
			$scope.checkShippingsFetchForPackages = true

		} else {
			console.log("selectedShipping  False",selectedShipping)
			CommonService.showError('Please select shipping option')
		}
	}

	$scope.checkShippings = function () {
		let totalWeight = 0
		let shippingWeight = 0
		let isValidDimension = true
		if ($scope.order.CustomerID === undefined || $scope.order.CustomerID === null) {
			CommonService.showError('Please select a customer!');
			return;
		}
		if (!$scope.isNew) {
			if ($scope.order.OrderDetails[0].ProductName == "" || $scope.order.OrderDetails[0].ProductPrice < 0) {
				CommonService.showError('Please select a product!');
				return;
			}
		}
		if (!$scope.order.ShipCountry) {
			CommonService.showError('To Get Shipping Rates, shipping country is required.')
			return
		}
		let invalidRows = false
		$scope.parcels.map(elem => {
			if (elem.weight > 150)
				invalidRows = true
		})
		if (invalidRows) {
			CommonService.showError('Weight should be less then 150 lbs for one parcel.');
			return
		}
		$scope.order.OrderDetails.forEach(elem => {
			totalWeight = totalWeight + (elem.ProductWeight * elem.Quantity);
		})
		$scope.parcels.forEach(elem => {
			shippingWeight = shippingWeight + elem.weight;
			if (elem.dimensions) {
				if (elem.dimensions.split(' x ').length === 3) {
					elem.length = parseFloat(elem.dimensions.split(' x ')[0])
					elem.width = parseFloat(elem.dimensions.split(' x ')[1])
					elem.height = parseFloat(elem.dimensions.split(' x ')[2])
				}
				if (!elem.length > 0 || !elem.width > 0 || !elem.height > 0)
					isValidDimension = false;
			}
		})
		if (shippingWeight <= 0) {
			CommonService.showError('Weight should be greater then ZERO');
			return;
		}
		if (!isValidDimension) {
			CommonService.showError('Box dimensions can not be ZERO or less then ZERO');
			return
		}
		if ($scope.order.insuranceValue < 0) {
			CommonService.hideLoader();
			CommonService.showError('Invalid insurance value!');
			return;
		}
		if ($scope.total < $scope.order.insuranceValue) {
			CommonService.hideLoader();
			CommonService.showError('Insurance value can not more then sub total amount of quote!');
			return;
		}
		if (shippingWeight !== totalWeight) {
			CommonService.confirm("Total product(s) weight and To Ship weight didn't matched, Do you want to continue?", () => {
				getShippings()
			})
		} else {
			getShippings()
		}
	}

	function getShippings() {
		// if(!$scope.isNew){
		$scope.freight = 0
		$scope.shippingId = 0
		// $scope.shippingMethods = undefined
		CommonService.showLoader();
		let dataToPost = {
			insuranceValue: $scope.order.ShipCountry.toLowerCase() === 'us' ? 0 : $scope.order.insuranceValue,
			ShipCity: $scope.order.ShipCountry,
			ShipCountry: $scope.order.ShipCountry,
			ShipPostalCode: $scope.order.ShipPostalCode,
			packages: $scope.parcels
		}
		LookupService.getShippings(dataToPost).then((response) => {
			CommonService.hideLoader();
			let ShippingMethodID = angular.copy($scope.order.ShippingMethodID)
			$scope.shippingMethods = response.result
			if ($scope.shippingMethods.length > 0) {
				CommonService.showSuccess('Available shippping options fetched.')
				$scope.shippingMethods.forEach(elem => {
					console.log(ShippingMethodID);
					if (elem.id === ShippingMethodID) {
						$scope.calculated = true
						console.log(elem.id, ShippingMethodID, "shipping method ids")
						// $scope.order.ShippingMethodID = ShippingMethodID
						$scope.selectedShipping = elem
						$scope.selectShipping(elem)
					}
					else {
						if (!$scope.calculated)
							$scope.calculated = false
					}
				});
				if (!$scope.calculated) {
					$scope.order.TotalShippingCost = 0
					$scope.calculated = true
					CommonService.showSuccess('Your selected shipping option is not available for this region')
				}
			}
			else {
				$scope.order.TotalShippingCost = 0
				CommonService.showSuccess('No available shippping options for this region.')
				$scope.calculated = false
			}
		}, (error) => {
			console.log(error);
			CommonService.hideLoader();
			CommonService.showError(error.msg || 'Unable to fetch shipping option.')
		})
		// }
	}

	$scope.addParcel = function () {
		$scope.parcels.push({
			length: 0,
			width: 0,
			height: 0,
			weight: 0
		})
	}
	$scope.removeParcel = function (index) {
		$scope.parcels.splice(index, 1)
	}
	$scope.calculateWeight = function (parcel, index) {
		// console.log(parcel)
		parcel.weight = 0
		$scope.order.OrderDetails.forEach(elem => {
			parcel.weight = parcel.weight + (elem.ProductWeight * elem.Quantity);
		})
		// $scope.parcels,$scope.invoiceRows[]
	}
	$scope.calculateRemainingWeight = function (parcel, index) {
		let totalWeight = 0
		let shippingWeight = 0
		console.log($scope.order.OrderDetails)
		$scope.order.OrderDetails.forEach(elem => {
			if (parcel.productId === elem.ProductID)
				totalWeight = totalWeight + (elem.ProductWeight * elem.Quantity);
			console.log(totalWeight)
		})
		$scope.parcels.forEach((elem, i) => {
			if (i !== index && parcel.productId === elem.productId)
				shippingWeight = shippingWeight + elem.weight;
		})
		parcel.weight = totalWeight - shippingWeight;
		// $scope.parcels,$scope.invoiceRows[]
	}

	$scope.calculateBoxes = async () => {
		let productDims = {}
		//get all dimensions for selected products
		const dimensions = await Promise.all($scope.order.OrderDetails.map(async elem => {
			// console.log(elem)
			if (!elem.isChild) {
				const response = await PackagingService.list(elem.ProductID)
				return response.data.result
			}
		}), (errors) => {
			console.log(errors);
		})

		//remove undefined nodes
		var filteredDimensions = dimensions.filter(function (el) {
			return el != undefined;
		});
		filteredDimensions.map(elem => {
			if (elem) {
				if (elem.length)
					productDims[elem[0].productId] = elem
			}
		})
		$scope.parcels = [];
		$scope.order.OrderDetails.map(row => {
			if (!row.isChild && productDims[row.ProductID]) {
				let productQuantity = row.Quantity;

				while (productQuantity !== 0) {
					let dimension = findCloset(productDims[row.ProductID], productQuantity)
					if (dimension) {
						productQuantity = productQuantity - dimension.quantity
						console.log(row.ProductID)
						$scope.parcels.push({
							dimensions: dimension.dimensions,
							weight: parseFloat(row.ProductWeight * dimension.quantity),
							quantity: parseInt(dimension.quantity),
							// productCode: row.ProductCode,
							productId: parseInt(row.ProductID)
						})
					} else {
						productQuantity = 0
					}
				}
			}

		})
		console.log($scope.parcels, "calculateBoxes")
		$timeout(() => {
			$scope.$apply()
		})
	}
	var getPackagingBox = function () {
		$scope.productPackagingBox = []
		PackagingBoxService.list().then(function (response) {
			if (!response.data.status)
				return CommonService.showError(response.data.msg)
			$scope.productPackagingBox = response.data.result
		})
	}
	$scope.showTable = function () {
		$scope.isCalculateShipping = !$scope.isCalculateShipping
	}
	let findCloset = (array, value) => {
		var i = -1;
		while (array[++i] && array[i].quantity <= value);
		return array[--i];
	}

	var getTax = function () {
		var country = $scope.order.ShipCountry.toLowerCase();
		if (country === 'us' || country === 'united states') {
			country = 'US'
		} else if (country === 'au' || country === 'Australia') {
			country = 'AU'
		}
		// return console.log($scope.order)
		if (($scope.order.ShipState === 'CA' || $scope.order.ShipState.toLowerCase() === 'california') && country === 'US') {

			// var data = {
			// 	ShipPostalCode: $scope.order.ShipPostalCode,
			// 	ShipCountry: country
			// }

			//For CDTFA Tax Rate API

			var data = {
				ShipPostalCode: $scope.order.ShipPostalCode,
				ShipAddress: $scope.order.ShipAddress1,
				ShipCity: $scope.order.ShipCity
			}
			CommonService.showLoader()
			CommonService.getUsTax(data).then(function (response) {
				CommonService.hideLoader()
				if (response.data.status && response.data.code === 200) {
					// $scope.order.SalesTaxRate1 = parseFloat(response.data.result.final_tax_rate);
					$scope.order.SalesTaxRate1 = parseFloat((parseFloat(response.data.final_tax_rate) * 100).toFixed(4));
					
					if($scope.OrderTaxExempt){
						$scope.calculateTaxExempt()
					}
					$scope.updateSubTotal()
					CommonService.showSuccess('Sales tax fetched');
				} else {
					$scope.order.SalesTaxRate1 = parseFloat((parseFloat(response.data.final_tax_rate) * 100).toFixed(4));
					if($scope.OrderTaxExempt){
						$scope.calculateTaxExempt()
					}
					CommonService.showError(response.data.msg);
				}
			})

		} else if (($scope.order.ShipState.toLowerCase() === 'michigan' || $scope.order.ShipState === 'MI') && country === 'US') {
			$scope.order.SalesTaxRate1 = 6;
			$scope.OrderTaxExempt = false
			
		} else {
			$scope.order.SalesTaxRate1 = 0;
			$scope.OrderTaxExempt = false

		}
	}

	var orderDate = new Date().toLocaleString('en-US').replace(',', '');
	myFunction = function (event) {
		var x = event.keyCode;
		if (!(x >= 48 && x <= 57)) {
			event.preventDefault();
		}
	}
	zipFormat = function (event) {
		var entry = event.key
		// console.log(event)
		var format = /^\w+([\s-_]\w+)*$/;
		if (!(entry.match(format)) && event.keyCode != 45 && event.keyCode != 32) {
			event.preventDefault();
		}
	};
	PhoneFormat = function (event) {
		var x = event.keyCode;
		console.log(x)
		if (!(x >= 48 && x <= 57)) {
			if (x != 43 && x != 120 && x != 88 && x != 32 && x != 46 && x != 45 && x != 43 && x != 40 && x != 41) {
				event.preventDefault();
			}
		}
	}
	$scope.stickToPhoneFormatOnCopy = function () {
		var x = $scope.order.BillingPhoneNumber
		$scope.order.BillingPhoneNumber = ''
		x = x.split('');
		x.forEach(number => {
			var z = number.charCodeAt()
			if (!(z >= 48 && z <= 57)) {
				if (z != 43 && z != 120 && z != 88 && z != 32 && z != 46 && z != 45 && z != 43 && z != 40 && z != 41) {
					// event.preventDefault();

				}
				else {
					$scope.order.BillingPhoneNumber = $scope.order.BillingPhoneNumber + number
				}
			}
			else {
				$scope.order.BillingPhoneNumber = $scope.order.BillingPhoneNumber + number
			}

		});
	}
	$scope.stickToPhoneFormatOnCopyShipping = function () {
		var x = $scope.order.ShipPhoneNumber
		$scope.order.ShipPhoneNumber = ''
		x = x.split('');
		x.forEach(number => {
			var z = number.charCodeAt()
			if (!(z >= 48 && z <= 57)) {
				if (z != 43 && z != 120 && z != 88 && z != 32 && z != 46 && z != 45 && z != 43 && z != 40 && z != 41) {
					// event.preventDefault();
				}
				else {
					$scope.order.ShipPhoneNumber = $scope.order.ShipPhoneNumber + number
				}
			}
			else {
				$scope.order.ShipPhoneNumber = $scope.order.ShipPhoneNumber + number
			}

		});
	}
	$scope.ccNumberChange = function () {
		let master = payform.cards.filter(elem => {
			return elem.type == "mastercard";
		})
		master[0].pattern = /^5[0-5]/;
		$scope.card.cardType = payform.parseCardType($scope.card.number) || 'other'
		$scope.ccMask = getCCMask($scope.card.cardType)
		validCard($scope.card.number)
	}
	var validCard = (value) => {
		var cardno = value.replace(/\s/g, '')
		var AmericanExpressCardno = /^(?:3[47][0-9]{0})/;
		// var VisaCardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
		var VisaCardno = /^(?:4[0-9]{0}(?:[0-9]{0}))/;
		// var MasterCardno = /^(?:5[1-5][0-9]{14})$/;
		var MasterCardno = /^(?:5[1-5][0-9]{0})/;
		if (cardno.length >= 2) {
			if (!cardno.match(AmericanExpressCardno) && !cardno.match(VisaCardno) && !cardno.match(MasterCardno)) {
				return CommonService.showError('Card not supported')
			}
		}
		if (cardno.match(AmericanExpressCardno)) {
			if (cardno.length > 15) {
				return CommonService.showError('American Express card number length is 15 digits')
			}
		}
		if (cardno.match(VisaCardno)) {
			if (cardno.length < 16) {
				return CommonService.showError('Card number too short')
			}
		}
		if (cardno.match(MasterCardno)) {
			if (cardno.length < 16) {
				return CommonService.showError('Card number too short')
			}
		}
	};
	var getCCMask = function (cardType) {
		var masks = {
			'mastercard': '9999 9999 9999 9999',
			'visa': '9999 9999 9999 9999',
			// 'jcb': '9999 9999 9999 9999',
			'amex': '9999 999999 99999',
			// 'dinersclub': '9999 9999 9999 99',
			// 'discover': '9999 9999 9999 9999',
			'other': '9999 9999 9999 9999'
		};
		return masks[cardType] || masks['other'];
	}

	var validateCC = function () {
		$scope.ccValid = payform.validateCardNumber($scope.card.number);
		$scope.cvcValid = payform.validateCardCVC($scope.card.cvc, $scope.card.cardType);
		var expiry = payform.parseCardExpiry($scope.card.expiry)
		$scope.card.expiryMY = payform.parseCardExpiry($scope.card.expiry)
		$scope.expValid = payform.validateCardExpiry(expiry.month, expiry.year);
		return $scope.ccValid && $scope.expValid && $scope.cvcValid
	}

	var genrateOrderHash = () => {
		$scope.SerialNumberArray = [];
		$scope.order = {
			OrderDetails: [],
			OrderSerials: '',
			TotalShippingCost: 0,
			SalesTaxRate1: 0,
			SalesTax1: 0,
			OrderDate: new Date(),
			CancelDate: null,
			InvoiceableOn: new Date(),
			IsCustomerNameShow: true,
			IsCustomerEmailShow: true,
			IsPayed: false,
			IsAGift: 'N',
			IsGTSOrder: false,
			// LastModBy: 4711, //Colt developer
			// LastModified: orderDate,
			ShipDate: null,
			OrderStatus: 'New',
			PaymentMethodID: 5,
			Printed: 'N',
			SalesRep_CustomerID: 4711, //Colt developer
			Shipped: 'Y',
			ShippingMethodID: '701',
			ShipResidential: 'N',
			Stock_Priority: 3,
			Order_Entry_System: 'BlueSky',
			Order_Type: 'Customer',
			// UserId: $scope.currentUser.id,
			QuoteNo: parseInt($scope.QuoteNo) || 0
		}
	}

	function getShippingMethods() {
		LookupService.GetShippingMethods().then(response => {
			$scope.shippingMethodLookup = response.data
		})
	}
	$scope.copyBilling = function () {
		if (!$scope.order.CustomerID) {
			return CommonService.showError('Please select customer first')
		}
		$scope.copyBillingAddress = `${$scope.order.BillingFirstName ? $scope.order.BillingFirstName : ''} ${$scope.order.BillingLastName ? $scope.order.BillingLastName : ''},,${$scope.order.BillingCompanyName},,${$scope.order.BillingAddress1},,${$scope.order.BillingAddress2},,${$scope.order.BillingCity}, ${$scope.order.BillingState}, ${$scope.order.BillingPostalCode},,${$scope.order.BillingCountry},,${$scope.order.BillingPhoneNumber}**`
		$scope.copyBillingAddress = $scope.copyBillingAddress.replace(/,,/g, '<br>');
		var copyText = document.getElementById("BillingAddress");
		copyText.value = $scope.copyBillingAddress;
		var copy = document.getElementById("BillingAddress2")
		copy.value = copyText.value.replace(/<br>/g, '\n')
		copy.select();
		document.execCommand("copy");
		console.log($scope.order.ShipCountry)
		$scope.order.insuranceValue = $scope.order.ShipCountry.toLowerCase() === 'us' ? 0 : $scope.quote[0].InsuranceValue
		// alert("Copied the text: " + copyText.value);
		CommonService.showSuccess("Billing Address copied successfully.")
	};
	$scope.copyShipping = function () {
		if (!$scope.order.CustomerID) {
			return CommonService.showError('Please select customer first')
		}
		$scope.copyShippingAddress = `${$scope.order.ShipFirstName ? $scope.order.ShipFirstName : ''} ${$scope.order.ShipLastName ? $scope.order.ShipLastName : ''},,${$scope.order.ShipCompanyName},,${$scope.order.ShipAddress1},,${$scope.order.ShipAddress2},,${$scope.order.ShipCity}, ${$scope.order.ShipState}, ${$scope.order.ShipPostalCode},,${$scope.order.ShipCountry},,${$scope.order.ShipPhoneNumber}**`
		// $scope.copyBillingAddress = $scope.copyBillingAddress.replace(/, ,/g, ',').trim()
		// $scope.copyShippingAddress = $scope.copyShippingAddress.repla                                                                                                                                                                                                              ce(/,/g, "|").trim()
		$scope.copyShippingAddress = $scope.copyShippingAddress.replace(/,,/g, '<br>');
		var copyText = document.getElementById("ShippingAddress");
		copyText.value = $scope.copyShippingAddress;
		var copy = document.getElementById("ShippingAddress2")
		copy.value = copyText.value.replace(/<br>/g, '\n')
		copy.select();
		document.execCommand("copy");
		console.log($scope.order.ShipCountry)

		$scope.order.insuranceValue = $scope.order.ShipCountry.toLowerCase() === 'us' ? 0 : $scope.quote[0].InsuranceValue

		// alert("Copied the text: " + copyText.value);
		CommonService.showSuccess("Shipping Address copied successfully.")
	};
	$scope.newInventory = function (product, OrderID, toShipped,i) {
		$('.modal-backdrop').show();
		var QuantitySend = toShipped - ($scope.order.OrderDetails[i].totalAllocatedForSerial?$scope.order.OrderDetails[i].totalAllocatedForSerial:0)
		ModalService.showModal({
			templateUrl: "template/order-inventory.ejs",
			controller: "OrderInventoryController",
			inputs: {
				product: product,
				OrderID: OrderID,
				toShipped: QuantitySend
			}
		}).then(function (modal) {
			modal.element.modal({
				backdrop: 'static',
				keyboard: false
			});
			modal.close.then(function (response, qty) {
				if (response) {
					$scope.order.OrderDetails[i].totalAllocatedForSerial = response.SerialNO.length
					// console.log(response)
				}
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open');
				getAlloctedSerials(OrderID)
				getAllOrderSerials(OrderID)

				// console.log(response);
			});
		});
	}

	function getAlloctedSerials(OrderID) {
		// orderInventoryAllocatedGetURL
		if(OrderID){
		$http({
			method: 'GET',
			url: orderInventoryAllocatedGetURL + '/' + OrderID,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(function successCallback(response) {
			console.log("all serial of this order", response)
			if (response.data.Result.length > 0) {
				$scope.allocatedSerialArray = response.data.Result
			}
			$scope.order.OrderSerials = ""
			if ($scope.allocatedSerialArray) {
				$scope.allocatedSerialArray.forEach(element => {
					$scope.order.OrderSerials += element.SerialNO + ","
				});
			}
			// console.log($scope.order.OrderSerials)
		})}
	}
	function getAllOrderSerials(OrderID) {
		// orderInventoryAllocatedGetURL
		if(OrderID){
			$http({
				method: 'GET',
				url: getAllOrderSerialUrl + '/' + OrderID,
				headers: {
					'Content-Type': 'application/xml; charset=utf-8'
				}
			}).then(function successCallback(response) {
				let serialArray = []
				$scope.serials = ""
				console.log("all serial of this order", response)
				if (response.data.Result.length > 0) {
					serialArray= response.data.Result
					serialArray.forEach(element => {
						element.SerialNO.toString()
						$scope.serials += element.SerialNO + ","
					});
				}
				console.log($scope.serials )
			})
		}
	}
 	const getOrderTrack = (orderID)=> {
		$http({
			method: 'GET',
			url: getOrderTrackUrl + '/' + (orderID ? orderID : $scope.order.OrderID),
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(function (response) {
			if (response.data) {
				$scope.shippingHistory = response.data
				if ($scope.shippingHistory[0].TrackingNo) {
					$scope.shippingHistory.map((elem) => {
						elem.ShipDate = new Date(elem.ShipDate)
						if (elem.ShippingMethodID !== 0) {
							if($scope.shippingMethodLookup.length){
								elem.ShippingMethod = $scope.shippingMethodLookup.filter(elem2 => {
									if (elem.ShippingMethodID === elem2.id)
										return elem2;
								})
								elem.ShippingMethod = elem.ShippingMethod[0].name
							}
						} else {
							elem.ShippingMethod = "N/A"
						}
						if (elem.Gateway !== undefined && (elem.ShippingMethod.includes("DHL") || elem.ShippingMethod.includes("UPS"))) {
							if (elem.ShippingMethod.includes("DHL"))
								elem.Gateway = "DHL"
							else if (elem.ShippingMethod.includes("UPS"))
								elem.Gateway = "UPS"
							else
								elem.Gateway = "Others"
						} else {
							elem.Gateway = "Others"
						}
						if(elem.updatedBy){
							console.log(elem.updatedBy)
							$scope.users.map(user=>{
								if(user.id === elem.updatedBy){
									elem.updatedBy = user.email
								}
							})
						}
					})
				}
				else {
					$scope.noShippingHistory = false
				}
				$timeout(()=>{
					$scope.$apply()
				},0)

			}
		})
	}
	$scope.remove = function (id, index) {
		CommonService.confirm("Are you sure you want to delete this shipping track", function () {
			$http({
				method: 'DELETE',
				url: deleteOrderTrackUrl,
				data: { Id: id },
				headers: { 'Content-Type': 'application/json' }
			}).then(function (response) {
				$scope.shippingHistory.splice(index, 1)
			})
		});
	}

	init();
});