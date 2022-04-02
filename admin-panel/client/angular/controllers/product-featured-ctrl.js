vulusionApp.controller('ProductFeatruedController', function ProductFeatruedController(CommonService, ProductService, LookupService, $timeout, $scope) {
	init = function () {
		CommonService.showLoader();
		getProducts();
		$scope.featured = [];
		$scope.itemsByPage = 50
	}

	$scope.save = function () {

	}

	$scope.markFeatured = function (row, index) {
		if ($scope.featured.length < 6) {
			ProductService.simpleUpdate({ ProductID: row.id, IsFeatured: row.featured }).then(function (res) {
				// console.log(res);
				$scope.featured.push(row);
			}, function (err) {
				console.log(err);
			})
		} else {
			row.featured = 0;
			CommonService.showError('Only 6 products can be marked as Featured.')
		}
	}

	$scope.markUnFeatured = function (row, index) {
		row.featured = 0;
		ProductService.simpleUpdate({ ProductID: row.id, IsFeatured: row.featured }).then(function (res) {
			// console.log(res);
			$scope.featured.splice(index, 1)
		}, function (err) {
			console.log(err);
		})
		// console.log(row, index);
	}
	var getProducts = function () {
		LookupService.GetProducts().then(function (response) {
			$scope.products = response.data.filter(elem => elem.hide !== 'Y');
			$scope.products.forEach(element => {
				element.featured = element.featured ? true : false
				if (element.featured)
					$scope.featured.push(element);
			});
			$timeout(function () {
				$scope.$apply();
			}, 0)
			// console.log("products lookup", $scope.products);
			CommonService.hideLoader();
		}, function (err) {
			console.log(err);
			CommonService.hideLoader();
		})
	}
	init();
});