vulusionApp.controller('ProductModalController', function ProductModalController(ProductService,CommonService,Upload,$cookies,$rootScope,$scope, $http,close) {

	init = function(){
		$scope.path = '';
		$scope.valid = true;
		CommonService.authenticateUser().then(function(){
			$rootScope.logout = CommonService.logout;
		});
	}
	$scope.onFileSelect = function(file) {
		$scope.valid = true;
		// console.log(file);
		Upload.upload({
			url: productUploadUrl,
			file: file,
		}).progress(function(e) {
			$scope.uploadProgress = parseInt(e.loaded / e.total * 100, 10);
			if($scope.uploadProgress == 100){
				$scope.uploadProgress = undefined;
				$scope.uploadComplete = "Validating..."
			}
		}).then(function(response, status, headers, config) {
			// file is uploaded successfully
			// console.log(response,status,headers,config);
			if(response.data.success){
				$scope.path = response.data.path;
				$scope.valid = false;
				$scope.uploadComplete = "Uploaded!"
				CommonService.showSuccess(response.data.message)
			}else {
				CommonService.showError(response.data.message);
			}
		});
	}
	$scope.importProducts = function(){
		$scope.uploadComplete = "Saving..."
		ProductService.saveXMLProducts({path:$scope.path}).then(function(response){
			if(response.data.staus){
				$scope.uploadComplete = "Completed..."
				console.log("Completed")
				CommonService.showError("Import complete with errors")
				$scope.close({})
			}else {
				$scope.uploadComplete = "Completed..."
				console.log("Completed")
				CommonService.showSuccess("Import complete successfully");
				$scope.close({})
			}
		},function(){
			console.log(err);
			CommonService.showError("Error while saving products")
		})
	}
	$scope.close = function(obj){
		close(obj);
	}
	init();
});
