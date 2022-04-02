vulusionApp.controller('OrderInventoryController', function OrderInventoryController(InventoryDetailService,CommonService,$cookies,$rootScope,$scope,$timeout, $http,toShipped,product,OrderID,close) {

	init = function(){
		CommonService.authenticateUser().then(function(){
			$rootScope.logout = CommonService.logout;
			// console.log('selected product',product);
			console.log(product)
			console.log(OrderID)
			$scope.product = product;
			$scope.totalProducts = 0;
			$scope.inventory = {
				ProductCode: $scope.product.ProductCode,
				ProductID: $scope.product.ProductID
			}
			$scope.quantityCheck = toShipped
			$scope.inventory.SerialNO = ''
			$scope.allocatedSerialsLength = 0
			if(toShipped == 0 ){
				$scope.disableSelect = true
			}
			else{
				$scope.disableSelect = false
			}
			GetSerialsForSelect($scope.product.ProductID)

			GetSerials($scope.product.ProductID,OrderID);
			// console.log("hello")
			new BarcodeScanerEvents();
		});
	}

	$scope.close = function(obj,qty){
		close(obj,qty);
	}
	var timeoutPromise;
	$scope.barCodeScan = function() {
		
		if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
			let tempArrayForSerials =  $scope.inventory.SerialNO +','
			let str = tempArrayForSerials
			str = str.replace(/,\s*$/, "");
			var text = str;
			var resArray = text.split(",");
			$scope.inventory.SerialNO = tempArrayForSerials
			console.log($scope.quantityCheck == (resArray.length+$scope.allocatedSerialsLength) ,$scope.quantityCheck,(resArray.length+$scope.allocatedSerialsLength) )

			if($scope.quantityCheck == (resArray.length+$scope.allocatedSerialsLength)){
				$scope.disableSelect = true;
			}
			$scope.totalProducts=resArray.length
		}
	}
	$scope.lastBarcodeValueRemove = function(){
		let str = $scope.inventory.SerialNO
		str = str.replace(/,\s*$/, "");
		var resArray = str.split(",");
		resArray.pop();
		var result = resArray.toString();
		if(result[0]){
			str = result + ","
			$scope.inventory.SerialNO = str}
		else{
			$scope.inventory.SerialNO = result
		}
	}
	$scope.removeBarCodeAll = function(){
		$scope.inventory.SerialNO = ''
	}
	$(document).on('onbarcodescaned',function(str){
		// console.log("hello")
		$scope.changeEvent();
	});
	$scope.changeEvent = function() {
		if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
			// console.log(event);
			// console.log("hello")
			$timeout.cancel(timeoutPromise);
			timeoutPromise = $timeout(function(event) {
				
				angular.element("#serialForm").triggerHandler('submit');
			},500);
		}
	};
	$scope.addInventory = function(){
		CommonService.showLoader();
		var data = angular.copy($scope.inventory)
		data.SerialNO = data.SerialNO.replace(/,\s*$/, "");
		data.OrderID = OrderID
		data.SerialNO = data.SerialNO.split(",");
		if(data.SerialNO[0] !== ""){
			delete data.ProductCode;
			InventoryDetailService.orderInventoryAllocatedSave(data).then(function(response){
				if(!response.data.status){
					CommonService.showError(response.data.msg);
				}
				else{
					CommonService.showSuccess(response.data.msg);
					$scope.close(data,$scope.totalProducts)
				}
			},function(err){
				CommonService.hideLoader();
				console.log("err",err);
				$scope.close(undefined)

			})
			
		}
		else{
			$scope.close(data,$scope.totalProducts)
		}
		CommonService.hideLoader();
	}

	function GetSerialsForSelect(ProductID) {
		InventoryDetailService.list(ProductID).then(function(response){
			$scope.allSerials = response.data
		})
	}
	function GetSerials(ProductID,OrderID) {
		InventoryDetailService.list(ProductID,OrderID).then(function(response){
			$scope.results = response.data;
			console.log($scope.results)
			if($scope.results)
			if($scope.results.length){
				$scope.results.forEach(elem => {	
					if(elem.status === "allocated")
						$scope.allocatedSerialsLength +=1 
					// console.log(elem.status)
					// console.log($scope.quantityCheck,$scope.allocatedSerialsLength,$scope.quantityCheck <= $scope.allocatedSerialsLength)
					if($scope.quantityCheck <= $scope.allocatedSerialsLength){
						$scope.disableSelect = true
					}
				});
				
			}
			CommonService.hideLoader()
		}, function () {
			CommonService.hideLoader()
			CommonService.showError("Whoops! Something went wrong, Check Your internet connection")
		})
		
	}

	$scope.remove = function (id, index) {
		CommonService.confirm("Are you sure you want to un-allocate this serial?", function () {
			InventoryDetailService.deleteAllocated({ ProductSerialID: id }).then(function (response) {
				if (response.data.status) {
					CommonService.showSuccess(response.data.msg);
					$scope.results.splice(index, 1)
					GetSerialsForSelect($scope.product.ProductID)
					GetSerials($scope.product.ProductID,OrderID)
				} else {
					CommonService.showError(response.data.msg);
				}
			})
		});
	}
	init();
});
