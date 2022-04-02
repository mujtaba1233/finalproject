vulusionApp.factory("TaxExemptionService",['$http', '$q', function ($http, $q) {
    return {
        list : function(){
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: TaxExemptionRestURL,
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
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: TaxExemptionRestURL,
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
        checkTaxExemption : function(data){
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: `${TaxExemptionRestURL}/check`,
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
		delete : function(data){
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: TaxExemptionRestURL,
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
