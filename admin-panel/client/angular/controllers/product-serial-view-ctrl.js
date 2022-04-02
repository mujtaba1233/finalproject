vulusionApp.controller('ProductSerialViewController', function ProductInventoryController(InventoryDetailService, CommonService, $timeout, $location, $cookies, $rootScope, $scope, $http, product, type, close) {
	init = function () {
		CommonService.authenticateUser().then(function (response) {
			$rootScope.logout = CommonService.logout;
			if (response.usertype == ADMIN) {
				$scope.isAdmin = true;
			} else {
				$scope.isAdmin = false;
			}
			if(type == "allocated")
				$scope.type = "Allocated"
			else if(type == "unAllocated")
				$scope.type = "Un-Allocated"
			else
				$scope.type = "Shipped"

			$scope.product = product
			$scope.getResults();
			
			// console.log("serial view", product, type);
		});
		$scope.itemsByPage = 50;
	}
	$scope.getResults = function () {
		CommonService.showLoader()
		InventoryDetailService.listAtProductInventory($scope.product.ProductID,type).then(function (response) {
			$scope.results = response.data;
			CommonService.hideLoader()
		}, function () {
			CommonService.hideLoader()
			CommonService.showError("Whoops! Something went wrong, Check Your internet connection")
		})
	}
	$scope.close = function (obj) {
		close(obj);
	}
	$scope.remove = function (id, index) {
		if (!$scope.isAdmin) {
			CommonService.showError("You don't have enough rights to delete this record.")
			return
		}
		CommonService.confirm("Are you sure you want to delete this serial?", function () {
			InventoryDetailService.delete({ ProductSerialID: id }).then(function (response) {
				if (response.data.status) {
					CommonService.showSuccess(response.data.msg);
					$scope.results.splice(index, 1)
				} else {
					CommonService.showError(response.data.msg);
				}
			})
		});
	}
	init();
});
