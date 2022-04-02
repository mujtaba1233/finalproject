vulusionApp.factory("InventoryService",['$http', '$q', function ($http, $q) {
    return {
        list: function () {
            var method = "GET";
            var url = inventoryListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
		add: function (data) {
            var method = "POST";
            var url = inventoryAddURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
				data: data
            }).then(function (response) {
                defer.resolve(response);
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
		update: function (data){
			var method = "POST";
            var url = inventoryUpdateURL;
            var defer = $q.defer();
			$http({
				method: method,
				url: url,
				data: data
			}).then(function(response){
				defer.resolve(response);
			}).catch(function(err){
				defer.reject(err);
			})
			return defer.promise;
		}
    };
}]);
