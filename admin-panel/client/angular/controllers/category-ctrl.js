vulusionApp.controller('CategoryController', function CreateQuoteController(CommonService, CategoryService, $rootScope, $scope, $http) {
    var category = function () {
        this.name = "";
        this.isActive = true;
    };
    init = function () {
        CommonService.authenticateUser().then(function (response) {
            $rootScope.logout = CommonService.logout;
            $scope.itemsByPage = 8;
            $scope.isUpdate = false;
            $scope.category = new category();
            CommonService.showLoader();
            CategoryService.list().then(function (response) {
                CommonService.hideLoader();
                if (response.data.status) {
                    // console.log($scope.categories);
                    $scope.categories = response.data.result;
                    $scope.itemsByPage = $scope.categories.length;
                } else {
                    CommonService.showError(response.data.msg);
                }
            }, function (response) {
                CommonService.showError("Error while retrieving categories, check your internet connection");
            });
        });

    }
    $scope.update = function (category) {
        if (category.isActive == 1) {
            category.isActive = true;
        } else {
            category.isActive = false;
        }
        $scope.category = category;
        $scope.isUpdate = true;
    }
    $scope.cancel = function () {
        $scope.isUpdate = false;
        $scope.category = new category();
    }
    $scope.save = function () {
        // console.log("sss");
        CommonService.showLoader();
        post();
    }
    function post() {
        CategoryService.save($scope.category).then(function (response) {
            if (response.data.status) {
                CommonService.hideLoader();
                CommonService.showSuccess(response.data.msg);
                if (!$scope.isUpdate) {
                    $scope.category.id = response.data.insertId
                    $scope.categories.unshift($scope.category);
                    $scope.category = new category();
                } else {
                    $scope.isUpdate = false;
                    $scope.category = new category();
                }
            } else {
                CommonService.hideLoader();

            }
            // console.log(response);
        });
    }
    $scope.delete = function (category, index) {
        CommonService.showLoader();
        CategoryService.delete(category).then(function (response) {
            if (response.data.status) {
                CommonService.showSuccess(response.data.msg);
                $scope.categories.splice(index, 1);
            } else {
                CommonService.showError(response.data.msg);
            }
            CommonService.hideLoader();
        }, function () {
            CommonService.showError("Error while deleting categories, check your internet connection");
        })
    }
    init();
});
