vulusionApp.factory("OptionCategoryService", [
	"$http",
	"$q",
	function ($http, $q) {
		return {
			list: function () {
				console.log("yo");
				var defer = $q.defer();
				$http({
					method: "GET",
					url: GetOptionCategoryUrl,
					headers: {
						"Content-Type": "application/xml; charset=utf-8",
					},
				})
					.then(
						function successCallback(response) {
							defer.resolve(response);
						},
						function errorCallback(response) {
							defer.reject(response);
						}
					)
					.catch(function (err) {
						defer.reject(err);
					});
				return defer.promise;
			},
			save : function(category){
				var defer = $q.defer();
				$http({
					method: 'POST',
					url: GetOptionCategoryUrl,
					data: category,
				}).then(function successCallback(response) {
					defer.resolve(response);
				},function errorCallback(response) {
					defer.reject(response);
				}).catch(function (err) {
					defer.reject(err);
				});
				// console.log(endUser,"serviceData")
				return defer.promise;
				
			},
			delete : function(data){
				var defer = $q.defer();
				$http({
					method: 'DELETE',
					url: GetOptionCategoryUrl,
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
	},
]);
