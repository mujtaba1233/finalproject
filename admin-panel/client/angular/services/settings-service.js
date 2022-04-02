vulusionApp.factory("SettingsService",['$http', '$q', function ($http, $q) {
    return {
        list : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: settingsURL,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            }).then(function successCallback(response) {
                // console.log(response)
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        save : function(data){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: settingsURL,
                data: data
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                console.log(err);
                defer.reject(err);
            });
            return defer.promise;
        }, 
    };
}]);
