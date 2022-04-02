vulusionApp.controller('SettingsController', function CreateQuoteController(CommonService, $rootScope, $scope, SettingsService) {
    init = function () {
        CommonService.authenticateUser().then(function (user) {
            if (user.usertype == ADMIN) {
                $rootScope.logout = CommonService.logout;
                $scope.updateFlag = false;
                $scope.settings = new setting();
                CommonService.showLoader();
                SettingsService.list().then(function(response) {
                    CommonService.hideLoader();
                    if(response){
                        $scope.updateFlag = true;
                        $scope.settings = response.data.result;
                        // console.log($scope.settings);
                        if($scope.settings == undefined){
                            $scope.updateFlag = false;
                        }
                    }
                }, function(response) {
                    CommonService.showError("Error while retrieving settings");
                });
            } else {
                window.location = "/login";
            }
        });
    }
    var setting = function () {
        this.upsPercentage = "",
        this.upsOffset = "",
        this.dhlPercentage = "",
        this.dhlOffset = ""
    };
    $scope.save = function () {
            post();
    }
    function post() {
        // console.log($scope.settings)
        SettingsService.save($scope.settings).then(function (response) {
            // console.log(response);
            if (response.data.status) {
                CommonService.hideLoader();
                CommonService.showSuccess("Success!");
                if (!$scope.updateFlag) {
                    $scope.setting.id = response.data.insertId
                    $scope.settings.unshift($scope.settings);
                    $scope.settings = new setting();
                } else {
                    $scope.updateFlag = false;
                    $scope.settings = new setting()
                }
            }
        });
    }

    init();
});