vulusionApp.controller('ExcelViewController', function ExcelViewController(FileService, Upload, CommonService, $rootScope, $scope, $http, $timeout) {
    $scope.init = function () {
        CommonService.authenticateUser().then(function (user) {
            $scope.userId = user.id;
            $rootScope.logout = CommonService.logout;
            $scope.fileId = window.location.pathname.split('/')[2];
            $scope.selectedSheetNo = 0;
            $scope.colLimit = 15;
            $scope.itemsByPage = 10;
            $scope.tabData = []
            if (parseInt($scope.fileId)) {
                data = {
                    id: $scope.fileId
                }
                getSheetsDetails(data);
            } else {
                CommonService.showError('Incorrect file.')
                console.log('fileID incorrect');
            }
        });
    };

    $scope.handleClickOnTab = function (event, index, tab) {
        $scope.tabData = []
        $scope.sheets.forEach((elem, elemIndex) => {
            $scope.sheets[elemIndex].active = false;
        });
        $scope.sheets[index].active = true;
        $scope.sheet = $scope.sheets[index];
        bindScrool($scope.sheet.paneId);
    }

    var getSheetsDetails = function (data) {
        CommonService.showLoader();
        FileService.getSheetsDetails(data).then(function (response) {
            CommonService.hideLoader();
            try {
                $scope.sheets = response.data.result;
                $scope.sheets[$scope.selectedSheetNo].active = true;
                $scope.sheet = $scope.sheets[$scope.selectedSheetNo];
                bindScrool($scope.sheet.paneId);

            } catch (err) {
                console.log("ERROR", err)
            }
        }, function (err) {
            console.error("Error: ", err);
            CommonService.hideLoader();
        })
    }


    $scope.parseDate = function (date) {
        return new Date(date)
    }
    $scope.getKeys = function (obj) {
        delete obj.$$hashKey
        return Object.keys(obj)
    }
    var bindScrool = function (id) {
        setTimeout(function () {
            $(`.div_${id}`).width($(`.${id}`)[0].scrollWidth)
            $(`.wrapper_${id}`).on('scroll', function (e) {
                $(`.${id}`).scrollLeft($(`.wrapper_${id}`).scrollLeft());
            });
            $(`.${id}`).on('scroll', function (e) {
                $(`.wrapper_${id}`).scrollLeft($(`.${id}`).scrollLeft());
            });
        })
    }
    $scope.init()
});