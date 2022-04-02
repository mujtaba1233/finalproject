vulusionApp.controller('ExcelHandlerController', function ExcelHandler(FileService, Upload, CommonService, $rootScope, $scope, $http, $timeout) {
    $scope.init = function (mode) {
        CommonService.authenticateUser().then(function (user) {
            $scope.userId = user.id;
            // console.log('user', user);
            $rootScope.logout = CommonService.logout;
            getFiles();
            // CommonService.showLoader();
        });

    };
    $scope.$watch('excelFiles', function () {
        $scope.fileSelect();
    });
    $scope.fileSelect = function () {
        $scope.excels = [];
        if ($scope.excelFiles)
            $scope.excelFiles.forEach(elem => {
                $scope.excels.push({
                    file: elem,
                    FileURL: elem.name,
                    FileName: elem.name.split('.')[0],
                    FileExt: elem.name.split('.').pop(),
                    TableName: 'Excel Files',
                    TableID: 0,
                    CreatedBy: $scope.userId,
                    IsActive: 1,
                    // Ext: elem.name.split('.').pop()
                })
            });
        // console.log($scope.excels);
    }
    $scope.removeExcel = function (index, data) {
        CommonService.confirm('Are you sure you want to delete this file permanently?', () => {
            CommonService.showLoader();
            FileService.removeFile(data,'excel').then(response => {
                if (response.data.status) {
                    $scope.filesArray.splice(index,1)
                    CommonService.showSuccess(response.data.msg)
                } else {
                    CommonService.showError(response.data.msg)
                }
                CommonService.hideLoader();
            })
        })
    }
    $scope.saveExcel = function () {
        // console.log("excelData", $scope.excels);
        if ($scope.excels && $scope.excels.length) {
            CommonService.showLoader();
            $scope.excels.forEach(function (elem) {
                delete elem.file;
            })
            Upload.upload({
                url: FileURL,
                file: $scope.excelFiles,
                data: {
                    data: JSON.stringify({
                        files: $scope.excels,
                    })
                }
            }).progress(function (e) {
                console.log('Progress->', parseInt(e.loaded / e.total * 100, 10));
            }).then(function (response) {
                if (response.data.status) {
                    CommonService.showSuccess(response.data.msg);
                    $scope.excelFiles = []
                    $scope.excels = []
                    getFiles()

                }
                CommonService.hideLoader();
            }, function (err) {
                CommonService.showError('Something went wrong.');
                CommonService.hideLoader();
                console.log(err);
            });
        } else {
            CommonService.showError('select atleast one file');
        }
    }
    $scope.viewExcel = function (file) {
        // console.log(file);

        var url = "/excel/" + file.FileURL;
        $http({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        }).then(function (data) {
            var wb = XLSX.read(data.data, {
                type: "array"
            });
            $scope.sheets = [];
            for (const key in wb.Sheets) {
                $scope.sheets.push(XLSX.utils.sheet_to_json(wb.Sheets[key]))
                // console.log(key);
                // console.log(wb.Sheets[key]);
            }
            console.log('====================================');
            console.log($scope.sheets);
            console.log('====================================');
            // var d = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
            // $scope.data = d;
        }, function (err) {
            console.log(err);
        });
    }
    var getFiles = function () {
        CommonService.showLoader();
        FileService.getFiles('excel files').then(function (response) {
            $scope.filesArray = response.data.result;
            CommonService.hideLoader();
        }, function (err) {
            console.log(err);
            CommonService.hideLoader();
        })
    }
    $scope.parseDate = function (date) {
        return new Date(date)
    }
    $scope.init()
});