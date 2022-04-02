vulusionApp.controller('PriceCheckModal', function PriceCheckModal(CommonService, PackagingService, PackagingBoxService, ProductService, CustomerService, LookupService, $timeout, $rootScope, ModalService, $scope, $http, $cookies,close) {

	init = function(){
        $scope.data = {
            isUpdate: false
        }

	}
    $scope.updatePrice= function(isUpdated) {
            $scope.data.isUpdate = isUpdated
            $scope.close($scope.data)
    }
    $scope.close = function(obj){
        close(obj);
    }
	init();
});