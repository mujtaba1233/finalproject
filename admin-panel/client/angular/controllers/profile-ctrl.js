vulusionApp.controller('ProfileController', function CreateQuoteController(CommonService,ProfileService,$cookies,$rootScope,$scope, $http) {
	init = function(){
		CommonService.authenticateUser().then(function(response){
			$scope.user = response;
			$scope.user.oldPassword = "";
			$scope.user.newPassword = "";
			$scope.user.confirmPassword = "";
			$rootScope.logout = CommonService.logout;
			// console.log($scope.user);
		});
	}
	
	$scope.updateProfile = function(){
		// console.log($scope.user);
		ProfileService.update($scope.user).then(function(response){
			if(response.data.success){
				CommonService.showSuccess(response.data.msg)
				$scope.user.oldPassword = "";
				$scope.user.newPassword = "";
				$scope.user.confirmPassword = "";
			}else {
				CommonService.showError(response.data.msg)
				$scope.user.oldPassword = "";
			}
			// console.log("update response",response);
		})
	}
	init();
});
