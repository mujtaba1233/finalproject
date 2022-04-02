vulusionApp.controller('NewInventoryController', function NewInventoryController(InventoryDetailService,CommonService,$cookies,$rootScope,$scope,$timeout, $http,product,close) {

	init = function(){
		CommonService.authenticateUser().then(function(){
			$rootScope.logout = CommonService.logout;
			// console.log('selected product',product);
			$scope.product = product;
			$scope.totalProducts = 0;
			$scope.inventory = {
				ProductCode: $scope.product.ProductCode,
				ProductID: $scope.product.ProductID
			}
			$scope.firstTime = false
			$scope.barCodeScan()
			new BarcodeScanerEvents();
		});
	}

	$scope.close = function(obj){
		$scope.firstTime = false
		close(obj);
	}
	var timeoutPromise;
	$scope.barCodeScan = function() {
		if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
			
			let str = $scope.inventory.SerialNO
			str = str.replace(/,\s*$/, "");
			var text = str;
			var resArray = text.split(",");
			var filtered = resArray.filter(function(value, index, arr){ 
				return arr[index] !== '';
			});
			$scope.totalProducts = filtered.length
		}else{
			$scope.totalProducts = 0;
		}
	}

	$scope.barCodeScanMore = function() {
		
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
		$scope.totalProducts=resArray.length
	}
	$scope.removeBarCodeAll = function(){
		$scope.inventory.SerialNO = ''
		$scope.totalProducts=0
	}
	// $(document).on('onbarcodescaned',function(str){
	// 	console.log("hello")
	// 	$scope.changeEvent();
	// });

	var BarcodeScanerEvents = function() {
		this.initialize.apply(this, arguments);
  	};
	
	BarcodeScanerEvents.prototype = {
		initialize: function() {
		   $(document).on({
			  keyup: $.proxy(this._keyup, this)
		   });
		},
		_timeoutHandler: 0,
		_inputString: '',
		_keyup: function (e) {
			if (this._timeoutHandler) {
				clearTimeout(this._timeoutHandler);
				this._inputString += String.fromCharCode(e.which);
			} 
			
	
			this._timeoutHandler = setTimeout($.proxy(function () {
				if (this._inputString.length <= 3) {
					this._inputString = '';
					if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
						let str = $scope.inventory.SerialNO
						str = str.replace(/,\s*$/, "");
						var text = str;
						var resArray = text.split(",");
						var filtered = resArray.filter(function(value, index, arr){ 
							return arr[index] !== '';
						});
						$scope.totalProducts = filtered.length
					}
					return;
				}
				else{
					if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
						if(e.target.value.charAt(e.target.value.length - 1 ) !==',' && $scope.firstTime)
						e.target.value += ","
						let str = $scope.inventory.SerialNO
						str = str.replace(/,\s*$/, "");
						var text = str;
						var resArray = text.split(",");
						var filtered = resArray.filter(function(value, index, arr){ 
							return arr[index] !== '';
						});
						$scope.totalProducts = filtered.length
					}else{
						if($scope.inventory.SerialNO === undefined){
							e.target.value += ","
							$scope.firstTime = true
							
						}
					}
				}
	
				$(document).trigger('onbarcodescaned', this._inputString);
	
				this._inputString = '';
	
			}, this), 20);

		}
	};

	$scope.changeEvent = function() {
		if($scope.inventory.SerialNO !== undefined && $scope.inventory.SerialNO !== ""){
			// console.log(event);
			console.log("hello")
			$timeout.cancel(timeoutPromise);
			timeoutPromise = $timeout(function(event) {
				
				angular.element("#serialForm").triggerHandler('submit');
			},500);
		}
	};
	$scope.addInventory = function(){
		CommonService.showLoader();
		var data = angular.copy($scope.inventory)
		if(data.SerialNO){
			let isLimit = false
			data.SerialNO = data.SerialNO.replace(/,\s*$/, "");
			serialNOArray = data.SerialNO.split(",");
			data.SerialNO = removeDuplicated(serialNOArray)
			delete data.ProductCode;
			console.log(data.SerialNO )
			data.SerialNO.forEach(elem => {
				if(elem.length > 6 ){
					isLimit = true
					CommonService.showError(elem + " is greater than 6");
					CommonService.hideLoader();
				}
				else if(elem.length < 5){
					isLimit = true
					CommonService.showError(elem + " is less than 5");
					CommonService.hideLoader();
				}
				
			});
			if(isLimit === true)
			return
			InventoryDetailService.save(data).then(function(response){
				CommonService.hideLoader();
				// console.log(response);
				if(response.data.status){
					CommonService.showSuccess(response.data.msg);
					$scope.inventory.SerialNO = "";
					$scope.totalProducts = 0
					$scope.close(undefined)
				}else {
					if(response.data.duplicateArray){
						if(response.data.duplicateArray.length < data.SerialNO.length){
							CommonService.showSuccess(response.data.msg);
							$scope.close(undefined)

						}
						else{
							CommonService.showError("All Serial No's are already saved!!!");
							$scope.close(undefined)
							
						}
					}
					else{
						CommonService.showError(response.data.msg);
						$scope.close(undefined)
					}
				}
			},function(err){
				CommonService.hideLoader();
				console.log("err",err);
			})
		}
		else{
			CommonService.showError("no serial no is added");
			$scope.close(undefined)
			CommonService.hideLoader();
		}
	}

	function removeDuplicated(array) {
		return array.filter((value,index)=> array.indexOf(value)===index)
	}

	function postCustomer(){
		CommonService.showLoader();

	}

	init();
});
