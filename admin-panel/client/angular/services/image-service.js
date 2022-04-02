vulusionApp.factory("ImageService",['$http', '$q', function ($http, $q) {
    return {
        remove: function (data) {

            var method = "DELETE";
            var defer = $q.defer();
            $http({
                method: method,
                url: imageRestURL,
                data: data,
                headers: {'Content-Type' : 'application/json'}
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        update: function (data) {

            var method = "POST";
            var defer = $q.defer();
            $http({
                method: method,
                url: imageRestURL,
                data: data,
                headers: {'Content-Type' : 'application/json'}
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
