vulusionApp.factory("ActivityLogService",['$http', '$q', function ($http, $q) {
    return {
        save : function(user){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: postCurrentUserRecord,
                data: user,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getRecord : function(details){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: getCurrentUserRecordURL,
                data: details,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
    };
}]);
