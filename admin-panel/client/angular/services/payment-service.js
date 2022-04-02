vulusionApp.factory("PaymentService", ['$http', '$q', function ($http, $q) {
    var paymentURL = PaymentRestURL;
    return {
        charge: function (data) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: `${paymentURL}/charge`,
                data: data
            }).then(function(response) {
                defer.resolve(response);
            }, function(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        // refund : function(data){
        //     var defer = $q.defer();
        //     $http({
        //         method: 'POST',
        //         url: `${paymentURL}/refund`,
        //         data: data
        //     }).then(function successCallback(response) {
        //         defer.resolve(response);
        //     },function errorCallback(response) {
        //         defer.reject(response);
        //     }).catch(function (err) {
        //         defer.reject(err);
        //     });
        //     return defer.promise;
        // }
    };
}]);