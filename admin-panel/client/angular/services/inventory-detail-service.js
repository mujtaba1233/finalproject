vulusionApp.factory("InventoryDetailService",['$http', '$q', function ($http, $q) {
    return {
        list : function(productId,OrderID,count){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: inventoryDetailListURL+'/'+OrderID+'/'+productId+'/'+count,
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
        listAtProductInventory : function(productId,type){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: inventorySerialDetailListURL+'/'+productId+'/'+type,
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
        save : function(data){
            console.log("data : ",data)
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: inventoryDetailSaveURL,
                data: data
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        orderInventoryAllocatedSave : function(data){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: orderInventoryAllocatedSaveURL,
                data: data
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
		delete : function(data){
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: inventoryDetailDeleteURL,
                data: data,
				headers: {'Content-Type' : 'application/json'}
            }).then(function successCallback(response) {
                defer.resolve(response);
            },function errorCallback(response) {
                defer.reject(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        deleteAllocated : function(data){
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: inventoryOrderDetailUnAllocatedURL,
                data: data,
				headers: {'Content-Type' : 'application/json'}
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
