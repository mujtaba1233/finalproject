vulusionApp.factory("CustomerService",['$http', '$q', function ($http, $q) {
    return {
        getCustomers : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getModalCustomersURL,
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
        save : function(customer){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: postCustomerUrl,
                data: {data:customer}
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
