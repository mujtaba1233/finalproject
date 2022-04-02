vulusionApp.controller('ProductSalesReportController', function ProductSalesController(CommonService,LookupService, $timeout, $location, $cookies, $rootScope, $scope, $http) {

	init = function () {
		CommonService.authenticateUser().then(function (response) {
			if (response.usertype == ADMIN) {
				$scope.isAdmin = true;
			} else {
				$scope.isAdmin = false;
			}
			$scope.companyNames = []
			var min = 2007;
			var max = new Date().getFullYear();
			$scope.years = ["2007-"+max];
			$scope.country = ""
			$scope.itemsByPage = 50;
			$scope.Company=''
		
			for (var i = max; i >= min; i--) {
				$scope.years.push(i);
			}
			// console.log('years', $scope.years);
			$rootScope.logout = CommonService.logout;
			$scope.year = max;
			LookupService.GetCompanies().then(function (response) {
				CommonService.hideLoader();	
				$scope.companies = response.data
				console.log($scope.companies)
			}, function (error) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving country names");
			})
			LookupService.getCountries().then(function (response) {
				CommonService.hideLoader();	
				$scope.countries = response.data
				var a = document.getElementById("select2-BillingCountry-container")
				if(a.innerHTML === '')
				document.getElementById("select2-BillingCountry-container").innerHTML = "Select Country"
			}, function (error) {
				CommonService.hideLoader();
				CommonService.showError("Error while retrieving country names");
			})
			$scope.getResults();
			
		});
		
		
	}
	$scope.updateExportFileName =  function (needToSave) {
		
		$scope.fileName = 'Product_' + new Date().getTime() + '.csv';
		
	}
	$(function () {
		$(".wrapper1").scroll(function () {
			$(".double-scroll")
				.scrollLeft($(".wrapper1").scrollLeft());
		});
		$(".double-scroll").scroll(function () {
			$(".wrapper1")
				.scrollLeft($(".double-scroll").scrollLeft());
		});
	});
	
	$scope.reset = function () {
		var min = 2007;
		var max = new Date().getFullYear();
		var range = ""+ min + "-" + max;
		$scope.years = [];
		$scope.country = ""
		$scope.itemsByPage = 50;
		$scope.Company=''
		$scope.years.push(range)
		for (var i = max; i >= min; i--) {
			$scope.years.push(i);
		}
		$scope.year =  max;
			
		LookupService.getCountries().then(function (response) {
			CommonService.hideLoader();	
			$scope.countries = response.data
			document.getElementById("select2-BillingCountry-container").innerHTML = "Select Country"
		}, function (error) {
			CommonService.hideLoader();
			CommonService.showError("Error while retrieving country names");
		})
		$scope.getResults();

	}
	console.log("test countries")
	$scope.isNumber = function (val) { return typeof val !== 'number'; }
	$scope.getResults = async function (type,value) {
		CommonService.showLoader()
		$http.post(productSalesReportUrl, {
			year: $scope.year,
			country: $scope.country,
			company:$scope.companyNames,
		}).then(function (response) {
			// console.log('response->', response);
			$scope.searchResult = response.data;
			
			var index=0
			response.data.forEach((elem )=> {
				$scope.searchResult[index].AvgPerUnit = (elem.totalAmount/elem.totalQty)>=0 || (elem.totalAmount/elem.totalQty)!='N/A'? elem.totalAmount/elem.totalQty : 'N/A'
				index+=1
			});
			
			$scope.getTotalTaxAndShippings($scope.searchResult)
			$scope.itemsByPage = 50;
			CommonService.hideLoader()
			setTimeout(function () {
				$('.div1').width($('.table-responsive')[0].scrollWidth)
				$("tbody tr").click(function () {
					$("tr").removeClass("selected-row");
					$(this).addClass("selected-row")
				})
				$('.wrapper1').on('scroll', function (e) {
					$('.table-responsive').scrollLeft($('.wrapper1').scrollLeft());
				});
				$('.table-responsive').on('scroll', function (e) {
					$('.wrapper1').scrollLeft($('.table-responsive').scrollLeft());
				});
			})
		})
		if($scope.searchResult)
		$scope.selectedOptions = await Object.keys($scope.searchResult[0])
	}
	$scope.getTotal = function (data, key) {
		if(key!=='AvgPerUnit'){
		if (typeof (data) === 'undefined' || typeof (key) === 'undefined' ) {
			return 0;
		}}
		if(key!=='AvgPerUnit'){
		var sum = 0;
		angular.forEach(data, function (obj, objKey) {
			if (obj[key])
				sum += parseFloat(obj[key]);
		});
		return sum;}
	};
	$scope.getTotalTaxAndShippings = async function () {
		let year=$scope.year=='2007-2021'?'allYear':$scope.year
		$scope.Company = ($scope.Company !== '' && $scope.Company !== null && $scope.Company !== "undefined")? $scope.Company : ''
		$http({
			method: 'GET',
			url: reportUrl +'ShipByFilters?year=' + year+"&country="+$scope.country+"&company="+$scope.Company,
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		}).then(async function successCallback(taxAndShipping) {
			CommonService.hideLoader();
			var current = [];
			taxAndShipping.data.forEach(elem => {
				if (elem.orderYear === $scope.year) {
					current.push(elem);
				}
			});
			taxAndShipping.data = current;
			var salesTax = {
				OrderID: 0,
				ProductCode: "Sales Tax",
				ProductID: 0,
				ProductName: "",
				jan: 0,
				janAmount: taxAndShipping.data[0] ? taxAndShipping.data[0].totalTax : 0,
				feb: 0,
				febAmount: taxAndShipping.data[1] ? taxAndShipping.data[1].totalTax : 0,
				mar: 0,
				marAmount: taxAndShipping.data[2] ? taxAndShipping.data[2].totalTax : 0,
				apr: 0,
				aprAmount: taxAndShipping.data[3] ? taxAndShipping.data[3].totalTax : 0,
				may: 0,
				mayAmount: taxAndShipping.data[4] ? taxAndShipping.data[4].totalTax : 0,
				jun: 0,
				junAmount: taxAndShipping.data[5] ? taxAndShipping.data[5].totalTax : 0,
				jul: 0,
				julAmount: taxAndShipping.data[6] ? taxAndShipping.data[6].totalTax : 0,
				aug: 0,
				augAmount: taxAndShipping.data[7] ? taxAndShipping.data[7].totalTax : 0,
				sep: 0,
				sepAmount: taxAndShipping.data[8] ? taxAndShipping.data[8].totalTax : 0,
				oct: 0,
				octAmount: taxAndShipping.data[9] ? taxAndShipping.data[9].totalTax : 0,
				nov: 0,
				novAmount: taxAndShipping.data[10] ? taxAndShipping.data[10].totalTax : 0,
				des: 0,
				desAmount: taxAndShipping.data[11] ? taxAndShipping.data[11].totalTax : 0,
				totalAmount: $scope.getTotal(taxAndShipping.data, 'totalTax'),
				totalQty: 0,
				AvgPerUnit: 'N/A',
			}
			var shipping = {
				OrderID: 0,
				ProductCode: "Shipping Cost",
				ProductID: 0,
				ProductName: "",
				AvgPerUnit: 'N/A',
				jan: 0,
				janAmount: taxAndShipping.data[0] ? taxAndShipping.data[0].shippingCost : 0,
				feb: 0,
				febAmount: taxAndShipping.data[1] ? taxAndShipping.data[1].shippingCost : 0,
				mar: 0,
				marAmount: taxAndShipping.data[2] ? taxAndShipping.data[2].shippingCost : 0,
				apr: 0,
				aprAmount: taxAndShipping.data[3] ? taxAndShipping.data[3].shippingCost : 0,
				may: 0,
				mayAmount: taxAndShipping.data[4] ? taxAndShipping.data[4].shippingCost : 0,
				jun: 0,
				junAmount: taxAndShipping.data[5] ? taxAndShipping.data[5].shippingCost : 0,
				jul: 0,
				julAmount: taxAndShipping.data[6] ? taxAndShipping.data[6].shippingCost : 0,
				aug: 0,
				augAmount: taxAndShipping.data[7] ? taxAndShipping.data[7].shippingCost : 0,
				sep: 0,
				sepAmount: taxAndShipping.data[8] ? taxAndShipping.data[8].shippingCost : 0,
				oct: 0,
				octAmount: taxAndShipping.data[9] ? taxAndShipping.data[9].shippingCost : 0,
				nov: 0,
				novAmount: taxAndShipping.data[10] ? taxAndShipping.data[10].shippingCost : 0,
				des: 0,
				desAmount: taxAndShipping.data[11] ? taxAndShipping.data[11].shippingCost : 0,
				
				totalAmount: $scope.getTotal(taxAndShipping.data, 'shippingCost'),
				totalQty: 0,
				
			}
			$scope.searchResult.unshift(salesTax)
			$scope.searchResult.unshift(shipping)
			if($scope.searchResult)
			$scope.selectedOptions = await Object.keys($scope.searchResult[0])
			// console.log('sales tax and shipping', taxAndShipping, salesTax);
		})
	}
	
	init();
});