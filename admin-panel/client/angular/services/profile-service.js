vulusionApp.factory("ProfileService",['$http', '$q', function ($http, $q) {
    return {
        update: function (user) {

            var method = "PUT";
            var defer = $q.defer();
            $http({
                method: method,
                url: profileURL,
                data: user,
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
        // get: function(userId) {
        //     var method = "GET";
        //     var defer = $q.defer();
        //     $http({
        //         method: method,
        //         url: profileURL + "/"+ userId,
        //     }).then(function (response) {
        //         defer.resolve(response);
        //     }).catch(function (err) {
        //         defer.reject(err);
        //     });
        //     return defer.promise;
        // }

    };
}]);
