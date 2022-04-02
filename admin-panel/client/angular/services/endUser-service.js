vulusionApp.factory("EndUserService",['$http', '$q', function ($http, $q) {
    return {
        getEndUser : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getEndUserURL,
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
        save : function(endUser){
            console.log(endUser)
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: postEndUserUrl,
                data: endUser,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            // console.log(endUser,"serviceData")
            return defer.promise;
            
        },
        updateEndUserRecord : function(endUser){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: updateEndUserUrl,
                data: endUser,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getEndUserRecord : function(endUserID){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getEndUserRecordURL+ "/"+ endUserID,
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
    };
}]);
