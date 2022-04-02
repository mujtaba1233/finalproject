vulusionApp.controller('DescriptionFileController', function (FileService, Upload, CommonService, $rootScope, $scope, $http, $timeout) {
    $scope.init = function (mode) {
        CommonService.authenticateUser().then(function (user) {
            $scope.userId = user.id;
            // console.log('user', user);
            $rootScope.logout = CommonService.logout;
            getFiles();
            // CommonService.showLoader();
        });

    };
    $scope.$watch('files', function () {
        $scope.fileSelect();
    });
    $scope.fileSelect = function () {
        $scope.filesArray = [];
        if ($scope.files)
            $scope.files.forEach(elem => {
                $scope.filesArray.push({
                    file: elem,
                    FileURL: elem.name,
                    FileName: elem.name.split('.')[0],
                    FileExt: elem.name.split('.').pop(),
                    TableName: 'Desc Files',
                    TableID: 0,
                    CreatedBy: $scope.userId,
                    IsActive: 1
                })
            });
    }
    $scope.removeFile = function (data, index) {
        // console.log(index);
        
        $scope.filesArray.splice(index, 1);
        $scope.files.splice(index, 1);
    }
    $scope.deleteFile = function (index, data) {
        CommonService.confirm('Are you sure you want to delete this file permanently?', () => {
            CommonService.showLoader();
            FileService.removeFile(data,'desc-files').then(response => {
                if (response.data.status) {
                    $scope.savedFiles.splice(index,1)
                    CommonService.showSuccess(response.data.msg)
                } else {
                    CommonService.showError(response.data.msg)
                }
                CommonService.hideLoader();
            })
        })
    }
    $scope.saveFiles = function () {
        if ($scope.filesArray && $scope.filesArray.length) {
            CommonService.showLoader();
            $scope.filesArray.forEach(function (elem) {
                delete elem.file;
            })
            Upload.upload({
                url: DescFileURL,
                file: $scope.files,
                data: {
                    data: JSON.stringify({
                        files: $scope.filesArray,
                    })
                }
            }).progress(function (e) {
                console.log('Progress->', parseInt(e.loaded / e.total * 100, 10));
            }).then(function (response) {
                if (response.data.status) {
                    CommonService.showSuccess(response.data.msg);
                    $scope.files = []
                    $scope.filesArray = []
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
    var getFiles = function () {
        CommonService.showLoader();
        FileService.getFiles('desc files').then(function (response) {
            $scope.savedFiles = response.data.result;
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