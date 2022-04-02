vulusionApp.controller('ProductNewController', function ProductNewController(LookupService, ProductService, CommonService, $cookies, $rootScope, $scope, $http) {
    var user = function () {
        CommonService.authenticateUser().then(function () {
            $rootScope.logout = CommonService.logout;
        });
    };
    $scope.saveProduct = function () {
        console.log("Product Hash: ", $scope.product);
    }
    init = function () {
        $scope.ProductCodePattern = "^[a-zA-Z0-9._-]+$";
        $scope.option = { allowClear: true };
        getShippingAvailablityStatus();
        getProductsLookup();
    }
    var getShippingAvailablityStatus = function () {
        CommonService.showLoader();
        LookupService.GetShippingAvailablityStatus().then(function (response) {
            $scope.shippingAvailablity = response.data;
            // console.log($scope.shippingAvailablity);
            CommonService.hideLoader();
        }, function (err) {
            console.log(err);
            CommonService.hideLoader();
        })
    }
    var getProductsLookup = function () {
        CommonService.showLoader();
        LookupService.GetProducts().then(function (response) {
            $scope.products = response.data;
            // console.log("products lookup",$scope.products);
            CommonService.hideLoader();
        }, function (err) {
            console.log(err);
            CommonService.hideLoader();
        })
    }
    init();
});
