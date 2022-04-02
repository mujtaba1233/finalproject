vulusionApp.factory("SyncService",['$http', '$q', function ($http, $q) {
    return {
        order: function () {
            var defer = $q.defer();
            var insertOrders = function(){
                $http({
                    method: 'GET',
                    url: syncOrderUrl,
                    headers: {
                        'Content-Type': 'application/xml; charset=utf-8'
                    }
                }).then(function successCallback(response) {
                    if(response.data.status == "already updated"){
                        defer.resolve(response);
                    } else if(response.data.status == "updated"  && response.data.length == 100){
                        insertOrders();
                    }else if(response.data.length < 100) {
                    	defer.resolve(response);
                    }
					if(response.data.status.toLowerCase() === "volusion password expired") {
                    	defer.reject(response);
                    }
                }, function errorCallback(response) {
                    defer.reject(response);
                });
            };
            insertOrders();
            return defer.promise;
        },
        customer: function(){
            var defer = $q.defer();
            var insertCustomers = function(){
                $http({
                    method: 'GET',
                    url: syncCustomerUrl,
                    headers: {
                        'Content-Type': 'application/xml; charset=utf-8'
                    }
                }).then(function successCallback(response) {
                    if(response.data.status == "already updated"){
                        defer.resolve(response);
                    } else if(response.data.status == "updated"){
                        insertCustomers();
                    }
					if(response.data.status.toLowerCase() === "volusion password expired") {
                    	defer.reject(response);
                    }
                }, function errorCallback(response) {
                    defer.reject(response);
                });
            };
            insertCustomers();
            return defer.promise;
        },
        product:function(){
            var defer = $q.defer();
            var insertProducts = function(){
                $http({
                    method: 'GET',
                    url: syncProductUrl,
                    headers: {
                        'Content-Type': 'application/xml; charset=utf-8'
                    }
                }).then(function successCallback(response) {
                    if(response.data.status == "update complete"){
                        defer.resolve(response);
                    } else if(response.data.status == "updated"){
                        insertProducts();
                    }
					if(response.data.status.toLowerCase() === "volusion password expired") {
                    	defer.reject(response);
                    }
                }, function errorCallback(response) {
                    defer.reject(response);
                });
            };
            insertProducts();
            return defer.promise;
        }
    };
}]);
