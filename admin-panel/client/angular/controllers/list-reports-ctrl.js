vulusionApp.controller(
	"ListReportsController",
	function QueryBuilderController(
		CommonService,
		$scope,
		$http,
		$rootScope
	) {
		init = function () {
			CommonService.authenticateUser().then(function (response) {
				$scope.currentUser = response.id;
				$scope.reports = [];
			$scope.itemsByPage = 50;
			$rootScope.logout = CommonService.logout;

				
				$scope.getReports()
			});
		};
		$scope.getReports = function () {
			
			$http({
				method: "GET",
				url: getReportsForQueries + "/" + $scope.currentUser,
				headers: {
					"Content-Type": "application/xml; charset=utf-8",
				},
			}).then(function (response) {
				displayOrders(response.data)
			});
			// return $scope.allReports

		};
		var displayOrders = function (reports) {
			$scope.allReports = reports;
			$scope.tempReports = $scope.allReports
		}
		init();
	}
);
