vulusionApp.factory("PackagingBoxService",['$http', '$q', function ($http, $q) {
    return {
        list : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: PackagingBoxRestURL,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        } 
    };
}]);
