vulusionApp.factory("PackagingService", ['$http', '$q', function ($http, $q) {
    return {
        list: function (productId = '') {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: productId ? PackagingRestURL + '/' + productId : PackagingRestURL,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        save: function (data) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: PackagingRestURL,
                data: data
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        delete: function (data) {
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: PackagingRestURL,
                data: data,
                headers: { 'Content-Type': 'application/json' }
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    };
}]);
