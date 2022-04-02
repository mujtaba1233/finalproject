vulusionApp.factory("FileService",['$http', '$q','Upload', function ($http, $q,Upload ) {
    return {
        remove: function (data) {
            var method = "DELETE";
            var defer = $q.defer();
            $http({
                method: method,
                url: fileRestURL,
                data: data,
                headers: {'Content-Type' : 'application/json'}
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        savePDF: function (data, files) {
            var url = fileRestURL;
            var defer = $q.defer();
            Upload.upload({
                url: url,
                file: files,
                data: {data:JSON.stringify(data)}
            }).progress(function (e) {
                console.log('Progress->', parseInt(e.loaded / e.total * 100, 10));
            }).then(function (response) {
                defer.resolve(response);
            }, function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getFiles : function(query){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: `${FileURL}/${query}`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getFile : function(data){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: FileURL + "/" + data.id,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getSheetsDetails : function(data){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: `${FileURL}/sheets-details/${data.id}`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getSheetsData : function(data){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: `${FileURL}/sheets-data/${data.id}`,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        removeFile: function (data,folder) {
            var method = "DELETE";
            var defer = $q.defer();
            $http({
                method: method,
                url: `${FileURL}/${folder}`,
                data: data,
                headers: {'Content-Type' : 'application/json'}
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
    };
}]);
