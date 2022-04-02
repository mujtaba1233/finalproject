vulusionApp.factory("RMAService",['$http', '$q', function ($http, $q) {
    return {
        getRMAList : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getRMAListURL,
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
        },
		getRMA : function(id){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getRMAURL+id,
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
