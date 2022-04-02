vulusionApp.factory("CustomersService",['$http', '$q', function ($http, $q) {
    return {
        getCustomers : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getCustomersURL,
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
                data: customer,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        updateCustomerRecord : function(customer){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: updateCustomerUrl,
                data: customer,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        updateCustomerToken : function(customer){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: updateTokenCustomerUrl,
                data: customer,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        updateCustomerPassword : function(data){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: updatePasswordCustomerUrl,
                data: data,
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getCustomerRecord : function(customerID){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getCustomersRecordURL+ "/"+ customerID,
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
