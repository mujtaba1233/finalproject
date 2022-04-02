vulusionApp.controller('ReportSaveCtrl', function ReportSaveCtrl(CommonService,$cookies,$rootScope,$scope,$timeout, $http,reportName,close) {

	init = function(){
		CommonService.authenticateUser().then(function(){
			$rootScope.logout = CommonService.logout;
			$scope.reportName = reportName;
		});
	}

	$scope.close = function(obj){
		close(obj);
	}
	
	$scope.addReportName = function(){
		$scope.close($scope.reportName)
	}

	init();
});