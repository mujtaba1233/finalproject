vulusionApp.factory("OrderService",['$http', '$q', function ($http, $q) {
    return {
        getOrders : function(duration){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: searchOrderUrl + '/' + duration,
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
        getOrdersByOpenStatus : function(showOrders){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: searchOrderByOrderStatusUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data:showOrders
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getOrdersByOrderStatus : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: searchOrderByOpenStatusUrl,
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
        getOrdersByTimeSpan : function(from,to){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: searchOrderUrl ,
                data:{
                    startDate: from,
                    endDate: to
                },
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
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
		getOpenOrdersByProduct : function(productId){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getOpenOrdersUrl+productId,
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
        getOrder : function(orderId){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: getOrderUrl + '/' + orderId,
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
        // updateParentOnly : function(data){
        //     var defer = $q.defer();
        //     $http({
        //         method: 'POST',
        //         url: updateParentOnlyUrl,
        //         data: data
        //     }).then(function successCallback(response) {
        //         defer.resolve(response);
        //     },function errorCallback(response) {
        //         defer.reject(response);
        //     }).catch(function (err) {
        //         defer.reject(err);
        //     });
        //     return defer.promise;
        // },
    };
}]);
