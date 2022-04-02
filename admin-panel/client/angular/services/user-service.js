vulusionApp.factory("UserService",['$http', '$q', function ($http, $q) {
    return {
        save: function (user) {
            var method = "POST";
            var url = postUserUrl;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
                data: user,
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        sendMail: function (mail) {
            var method = "POST";
            var url = forgotPasswordUrl;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
                data: mail,
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        list: function() {
            var method = "GET";
            var url = searchUserUrl;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        get: function() {
            var method = "GET";
            var url = searchUserUrl;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }
    };
}]);
