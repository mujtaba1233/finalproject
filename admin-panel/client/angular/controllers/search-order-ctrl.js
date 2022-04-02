vulusionApp.controller('SearchOrderController', function SearchOrderController($timeout,ProductService, SyncService,LookupService, UserService, CommonService, OrderService, $rootScope, $filter, $location, $cookies, $scope, $http, ModalService) {
	var init = function () {
		CommonService.showLoader();
		CommonService.authenticateUser().then(function (response) {
			$scope.OrderStatus = "open";
			$scope.showOrders = "open";
			$scope.orderByIdSearch = ""
			$scope.productCodes = []
			$rootScope.logout = CommonService.logout;
			$scope.createdBySearch = ['CreatedByVoluFirstName', 'CreatedByVoluLastName', 'CreatedByBlueFirstName', 'CreatedByBlueLastName'];
			$scope.orders = [];
			$scope.tempOrders = [];
			$scope.customTotalAmount = ''
			// $scope.countryFilter = ""
			$scope.openStatus = ['New', 'Partially Shipped'];
			// $scope.openStatus = true;
			$scope.duration = 'all';
			$scope.serialNo = ""
			$scope.type = 'all'
			$scope.getHeader = function () {return ["ORDER #", "DATE ENTERED", "PO TOTAL", "COMPANY", "ORDER STATUS", "WHY OPEN?"]};
			$scope.searchFrom = new Date();
			$scope.searchTo = new Date();
			ProductService.getAllProducts().then(function (response) {
				$scope.products = response.data;
			}, function (response) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving products");
			})
			var goToOrderPageByNo = document.getElementById("goToOrderPageByNo");
			goToOrderPageByNo.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					document.getElementById("goToOrderPageByNoButton").click();
				}
			});
			$scope.searchFrom.setMonth($scope.searchFrom.getMonth() - 3);
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
			$scope.datePicker = ""
			$scope.shipdatePicker = ""
			if (CommonService.isProduction()) {
				// SyncService.order().then(function (response) {
				if (window.location.search && window.location.search.indexOf('productId') > -1) {
					// console.log('Product Id', window.location.search.split('?')[1].split('=')[1]);
					$scope.ProductID = window.location.search.split('?')[1].split('=')[1];
					$scope.heading = "Open Orders";
					$scope.getOpenOrdersByProduct($scope.ProductID)
				} else {
					$scope.heading = "Search Orders";
					$scope.filterOrders()
				}
				// }, function (err) {
				// 	if (window.location.search && window.location.search.indexOf('productId') > -1) {
				// 		// console.log('Product Id', window.location.search.split('?')[1].split('=')[1]);
				// 		$scope.ProductID = window.location.search.split('?')[1].split('=')[1];
				// 		$scope.heading = "Open Orders";
				// 		$scope.getOpenOrdersByProduct($scope.ProductID)
				// 	} else {
				// 		$scope.heading = "Search Orders";
				// 		// $scope.getOrders(3);
				// 		$scope.filterOrders()
				// 	}
				// 	if (err.status != -1) {
				// 		CommonService.showError(err.data.status);
				// 	} else {
				// 		CommonService.showError("Order sync failed");
				// 	}
				// });
			} else {
				if (window.location.search && window.location.search.indexOf('productId') > -1) {
					// console.log('Product Id', window.location.search.split('?')[1].split('=')[1]);
					$scope.ProductID = window.location.search.split('?')[1].split('=')[1];
					$scope.heading = "Open Orders";
					$scope.getOpenOrdersByProduct($scope.ProductID)
				} else {
					$scope.heading = "Search Orders";
					if($scope.duration === 'all'){
						$scope.searchFrom = '';
					}
					// console.log($scope.heading)
					$scope.filterOrders()
					// $scope.getOrders($scope.duration);
				}
			}
			$scope.itemsByPage = 50;
			$scope.sellectAll = false;

			$scope.exportColumns = [
				'OrderID',
				'OrderDate',
				'PaymentAmount',
				'BillingCompanyName',
				'OrderStatus',
				'Order_Comments'
			]
			// console.log(response);
			$scope.user = response;
			$scope.selectedOption =response.orderExportColumns? (response.orderExportColumns.split(',').length ? response.orderExportColumns.split(',') : []) : [];
			if($scope.selectedOption.length === $scope.exportColumns.length){
				$scope.sellectAll = true
			}else{
				$scope.sellectAll = false
			}
			$scope.updateExportFileName()
			
		})
	}

	$scope.customTotalAmountSearch = async function() {
		let val = $scope.customTotalAmount
		let findVal = []
		if(val){
			$scope.allorders=[]
			val =  val.replace('$','').replace(/^[, ]+|[, ]+$|[, ]+/g, "").replace(/\s/g, '').trim();
			val = Number(val);
			var arrayofObject = $scope.tempOrders.filter(function(item) {
				if(item.PaymentAmount !== null){	
					let PaymentAmount = (item.PaymentAmount).toString()
					if(PaymentAmount.includes(val))
					return true
					else
					return false;
				}
			  })
			if(arrayofObject.length > 0)
			arrayofObject.forEach(elem => {
				elem.dateForExcel = ((elem.OrderDateView.getMonth() > 8) ? (elem.OrderDateView.getMonth() + 1) : ('0' + (elem.OrderDateView.getMonth() + 1))) + '/' + ((elem.OrderDateView.getDate() > 9) ? elem.OrderDateView.getDate() : ('0' + elem.OrderDateView.getDate())) + '/' + elem.OrderDateView.getFullYear()
			});
			$scope.allorders = arrayofObject
			
			$scope.selectedOptions = await Object.keys($scope.allorders[0])
		$scope.selectedOptionsToShow()

		}else{
			$scope.allorders = $scope.tempOrders
			$scope.selectedOptions = await Object.keys($scope.allorders[0])
			$scope.allorders.forEach(elem => {
				elem.dateForExcel = ((elem.OrderDateView.getMonth() > 8) ? (elem.OrderDateView.getMonth() + 1) : ('0' + (elem.OrderDateView.getMonth() + 1))) + '/' + ((elem.OrderDateView.getDate() > 9) ? elem.OrderDateView.getDate() : ('0' + elem.OrderDateView.getDate())) + '/' + elem.OrderDateView.getFullYear()
				});
		$scope.selectedOptionsToShow()

		}
	}

	$scope.updateExportFileName =  function (needToSave) {
		
		$scope.fileName = 'Orders_' + new Date().getTime() + '.csv';
		if(needToSave){
			$scope.saveExportColumns();
		}
	}
	$scope.handleChangeForSelect = function () {
		if ($scope.sellectAll) {
			$scope.selectedOption = angular.copy($scope.exportColumns);
		} else {
			$scope.selectedOption = []
		}
	}
	$scope.selectedOptionsToShow = () =>{
		let selectedOptionsToShow = ["OrderID","dateForExcel","PaymentAmountForExcel","BillingCompanyName","OrderStatus","Order_Comments_excel" ]
		$scope.selectedOptions = selectedOptionsToShow
	}
	$scope.saveExportColumns = () => {
		CommonService.showLoader();
		$scope.selectedOptionsToShow()
		$scope.user.orderExportColumns = $scope.selectedOptions.length?$scope.selectedOptions.join(','):''
		console.log( $scope.user.orderExportColumns)
		UserService.save({
			data: {
				id: $scope.user.id,
				orderExportColumns: $scope.user.orderExportColumns
			}
		}).then((response)=>{
			CommonService.hideLoader();
			if(response.data.error){
				// CommonService.showError("Error! try Again");
				console.log(response.data.error);
			}else{
				CommonService.showSuccess("Export save for future use.");
				CommonService.authenticateUser($scope.user).then((response)=> {
					// console.log(response);
				})
			}
		})
		.catch(()=>{
			CommonService.hideLoader();
		})
	}
	$scope.filterOrders =async  function () {
		let selectedCountry = ""
		let serialNo = $scope.serialNo
		if($scope.countryFilter === null || $scope.countryFilter === "undefined" || !$scope.countryFilter)
		 selectedCountry = "all"
		else
		 selectedCountry = $scope.countryFilter
		if ($scope.showOrders == "open" && $scope.OrderStatus == "open") {
			// console.log("response")
			$scope.allorders = [];
			
			// console.log(value)
			let dataObj = {}
			if($scope.duration === "custom"){
				 dataObj = {
					dates: {
						from: $scope.searchFrom,
						to: $scope.searchTo
					},
					status: $scope.showOrders,
					country:selectedCountry,
					serialNo:serialNo,
					type:$scope.type,
					productCode:$scope.productCodes.length > 0 ? $scope.productCodes : []
				}
			}
			else{
				 dataObj = {
					all: $scope.duration === "all"?true:false,
					status:$scope.showOrders,
					country:selectedCountry,
					serialNo:serialNo,
					type:$scope.type,
					productCode:$scope.productCodes.length > 0 ? $scope.productCodes: []
				}
			}
			OrderService.getOrdersByOpenStatus(dataObj).then(function(response){
			$scope.ordersForSearches = response.data

				displayOrders(response.data);
				CommonService.hideLoader();
				
			}, function (err) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving orders, Try reload!");
			});
		}else {
			let dataObj = {}
			if($scope.duration === "custom"){
				 dataObj = {
					dates: {
						from: $scope.searchFrom,
						to: $scope.searchTo
					},
					status: $scope.OrderStatus,
					country:selectedCountry,
					serialNo:serialNo,
					type:$scope.type,
					productCode:$scope.productCodes.length > 0 ? $scope.productCodes : []
				}
			}
			else{
				 dataObj = {
					status:$scope.OrderStatus,
					country:selectedCountry,
					serialNo:serialNo,
					type:$scope.type,
					productCode:$scope.productCodes.length > 0 ? $scope.productCodes : []
				}
			}
			CommonService.showLoader();
			OrderService.getOrdersByOpenStatus(dataObj).then(function(response){
			// console.log(response)
			$scope.ordersForSearches = response.data

			displayOrders(response.data);
			CommonService.hideLoader();
			}, function (err) {
			CommonService.hideLoader();
			CommonService.showError("Error while retrieving orders, Try reload!");
		});
		}
	}
	$scope.fetchOrderBySearchDuration = function(value){
		CommonService.showLoader();
		OrderService.getOrdersByTimeSpan($scope.searchFrom,$scope.searchTo).then(function(response){
			$scope.ordersForSearches = response.data

			displayOrders(response.data);
			CommonService.hideLoader();
		}, function (err) {
			CommonService.hideLoader();
			CommonService.showError("Error while retrieving orders, Try reload!");
		});
	}
	$scope.dateFilter =  function() {
		if($scope.datePicker || $scope.shipdatePicker){
			let allorders = angular.copy($scope.ordersForSearches)
			let newOrder = []
			let datePicker =  convert($scope.datePicker)
			let shipdatePicker =  convert($scope.shipdatePicker)
			if($scope.datePicker && $scope.shipdatePicker){
				newOrder = allorders.filter(elem=>{
					if(elem.orderdatesearch === datePicker && elem.shipdatesearch === shipdatePicker )
						return elem;
				})
			}
			else if($scope.datePicker){
				newOrder = allorders.filter(elem=>{
					if(elem.orderdatesearch === datePicker )
						return elem;
				})
			}
			else{
				newOrder = allorders.filter(elem=>{
					if(elem.shipdatesearch === shipdatePicker )
						return elem;
				})
			}
			displayOrders(newOrder)
		}
		else{
			$scope.getOrdersByOrderStatus()
		}
	}
	function convert(str) {
		var date = new Date(str),
		  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		  day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}
	var displayOrders = async function (orders) {
		$scope.allorders = orders;
		$scope.allorders.forEach((elem) => {
			let companies = [elem.BillingCompanyName, elem.ShipCompanyName].join(', ');
			elem.companies = companies;
			elem.PaymentAmountForSearch =elem.PaymentAmount>0? " "+ elem.PaymentAmount.toFixed(2) +" ":elem.PaymentAmount
			elem.PaymentAmountForSearch =elem.PaymentAmount>0? numberWithCommas(elem.PaymentAmountForSearch) :elem.PaymentAmount
			elem.PaymentAmountForExcel = "$"+elem.PaymentAmountForSearch 
			elem.Order_Comments_excel = elem.Order_Comments ?elem.Order_Comments.replace(/(<([^>]+)>)/gi, "").replace(/\&nbsp;/g, '') : ""
			elem.orderdatesearch = convert(elem.OrderDate)
			// elem.orderdatesearch = $filter('date')(elem.OrderDate, "MM/dd/yyyy");
			elem.shipdatesearch = convert(elem.ShipDate);
		})

		$scope.allorders.forEach(function (elem) {
			elem.OrderDate = new Date(elem.OrderDate);
			elem.ShipDate = elem.ShipDate?new Date(elem.ShipDate): null;
			elem.OrderDateView = new Date(elem.OrderDate);
			elem.IssueDateView = elem.IssueDate?new Date(elem.IssueDate): null;
			elem.ShipDateView = elem.ShipDate?new Date(elem.ShipDate): null;
			elem.CancelDateView = elem.CancelDate?new Date(elem.CancelDate): null;
			elem.IsPayed = elem.IsPayed === 1;
			var d =
				elem.OrderDateView.getFullYear() +
				("0" + (elem.OrderDateView.getMonth() + 1)).slice(-2) +
				("0" + elem.OrderDateView.getDate()).slice(-2);
			elem.pdfname = d + "_" + ("00000" + elem.OrderID.toString()).slice(-6) + '.pdf';
			elem.wordname = d + "_" + ("00000" + elem.OrderID.toString()).slice(-6) + '.docx';
			elem.dateForExcel = ((elem.OrderDateView.getMonth() > 8) ? (elem.OrderDateView.getMonth() + 1) : ('0' + (elem.OrderDateView.getMonth() + 1))) + '/' + ((elem.OrderDateView.getDate() > 9) ? elem.OrderDateView.getDate() : ('0' + elem.OrderDateView.getDate())) + '/' + elem.OrderDateView.getFullYear()
			// console.log('CancelDate: ',elem.CancelDate);
			// if (elem.QuoteNo && elem.IssueDateView) {
			// 	var quoteLink =
			// 		elem.IssueDateView.getFullYear() +
			// 		("0" + (elem.IssueDateView.getMonth() + 1)).slice(-2) +
			// 		("0" + elem.IssueDateView.getDate()).slice(-2);
			// 	elem.quoteLink = quoteLink + "_" + ("00000" + elem.QuoteNo.toString()).slice(-6) + '.pdf';
			// 	console.log('Quote Link: ', elem.quoteLink);
			// } else {
			// 	elem.quoteLink = ''
			// }
			
		});
		$scope.tempOrders = $scope.allorders
		$scope.selectedOptions = await Object.keys($scope.allorders[0])
		$scope.selectedOptionsToShow()

		if($scope.customTotalAmount!==null){
			$scope.customTotalAmountSearch()
		}
		$timeout(() => {
			$scope.$apply()
		})
		console.log($scope.selectedOptions)
		// $scope.filterOrders($scope.showOrders);
	}
	function generateQuoteName() {
		var d = new Date();
		var pdfName =
			d.getFullYear() +
			("0" + (d.getMonth() + 1)).slice(-2) +
			("0" + d.getDate()).slice(-2) + "_" +
			("00000" + quoteId.toString()).slice(-6);
		return pdfName;
	}
	$scope.getOpenOrdersByProduct = function (productId) {
		OrderService.getOpenOrdersByProduct(productId).then(function (response) {
			// console.log('all orders', response);
			$scope.ordersForSearches = response.data
			displayOrders(response.data)
			CommonService.hideLoader();
		}, function (err) {
			CommonService.hideLoader();
			CommonService.showError("Error while retrieving orders, Try reload!");
		});

	}
	$scope.getOrdersByDuration = function(){
		CommonService.showLoader();
		$scope.getOrders();
	}
	$scope.getOrders = function () {
		if($scope.duration !== "Custom"){
			OrderService.getOrders($scope.duration).then(function (response) {
				var duration = $scope.duration;
				var today = new Date();
				var year = today.getFullYear();
				var month = today.getMonth();
				var day = today.getDate();
				if(duration < 12){
					$scope.searchFrom = new Date(today.setMonth(month - duration));
					$scope.searchTo = new Date();
				}else{
					duration = duration/12;
					$scope.searchFrom = new Date(today.setFullYear(year-duration));
					$scope.searchTo = new Date();
				}
				// console.log('all orders', response);
				$scope.ordersForSearches = response.data
				displayOrders(response.data)
				CommonService.hideLoader();
			}, function (err) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving orders, Try reload!");
			});
		}
	};
	$scope.getOrdersByOrderStatus = function () {
		OrderService.getOrdersByOrderStatus().then(function (response) {
			$scope.ordersForSearches = response.data

			displayOrders(response.data)
			CommonService.hideLoader();
		}, function (err) {
			CommonService.hideLoader();
			CommonService.showError("Error while retrieving orders, Try reload!");
		});
	};
	$scope.totalAmountOfOrders = function (orders) {
		PaymentAmount = 0;
		orders.map(function(value,indexOf){
			PaymentAmount+=value['PaymentAmount'];
		});
		return PaymentAmount.toFixed(2);
	}
	$scope.totalCountOfOrders = function (orders) {
		return orders.length;
	}
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	init();
	
});