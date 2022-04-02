vulusionApp.factory("CommonService", ['$http', '$q', '$location', '$cookies', '$rootScope', function ($http, $q, $location, $cookies, $rootScope) {
	var parall = 0;
	return {
		showSuccess: function (msg) {
			toastr.success(msg);
		},
		showError: function (error) {
			// alertify.error(error);
			toastr.error(error)
		},
		showInfo: function (info) {
			toastr.info(info);
		},
		showWarning: function (warn) {
			toastr.warning(warn);
		},
		showLoader: function (count = 0) {
			parall++;
			$('.overlay').show();
		},
		roundTo2Decimals: function (number = 0.00) {
			return Math.round((number + Number.EPSILON) * 100) / 100
		},
		confirm: function (msg, callback, cancel) {
			alertify.confirm('Confirmation',
				function () {
					callback();
				},
				function () {
					if(cancel){
						toastr.error('Cancelled!')
						cancel()
					}
				}).set({
					transition: 'fade',
					message: msg
				})
				.setHeader("Confirm").show();
		},
		hideLoader: function () {
			parall--;
			if (parall <= 0) {
				parall = 0;
				$('.overlay').hide();
			}
		},
		logout: function () {
			window.location.search = ""
			if ($cookies.get('user') !== undefined) {
				$cookies.remove('BLUE_SKY_TOKEN');
				$cookies.remove('user');
				$cookies.remove('WATCH_TOKEN');
				window.location.pathname = '/login';
			}
			else {
				window.location.pathname = '/login';
			}
		},
		authenticateUser: function (user) {
			var defer = $q.defer();
			if (user || $cookies.get('user') !== undefined) {
				$rootScope.loggedInUser = user ? user : JSON.parse($cookies.get('user'));
				var currentUser = user ? user : JSON.parse($cookies.get('user'));
				var exp = new Date(new Date().getTime() + 1000 * 60 * 60).toUTCString();
				$cookies.put('user', JSON.stringify(currentUser), {
					expires: exp
				});
				defer.resolve(currentUser);
			} else {
				// defer.reject("Error Occured");
				// console.log('asas');
				// console.log(window.location.pathname, window.location.hash, window.location.search);
				if (window.location.hash != "") {
					window.location = "/login?next=" + window.location.pathname + window.location.hash;
				} else {
					window.location = "/login?next=" + window.location.pathname + window.location.search;
				}
			}
			return defer.promise;
		},
		isProduction: function () {
			if ($location.host() === "www.yourbluefuture.com" || $location.host() === "yourbluefuture.com") {
				return true;
			} else {
				return false;
			}
		},
		IsJsonString: function(str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		parseFreeAccessories: function (freeAccessories) {
			var array = []
			if (freeAccessories != null && freeAccessories != '') {
				//handle with multiple or single freeAccessories
				var parsed = freeAccessories.split(',');
				for (elem of parsed) {
					var obj = {};
					obj.qty = parseInt(elem.match(/\(([^)]+)\)/)[1])
					obj.code = elem.split('(')[0];
					array.push(obj);
				}
			} else {
				//handle with no freeAccessories
				// return false;
			}
			return array;

		},
		getTax: function (data) {
			var defer = $q.defer();
			$http({
				method: 'POST',
				url: '/api/quote/get-tax-rate',
				data: data
			}).then(function successCallback(response) {
				defer.resolve(response);
			}, function errorCallback(response) {
				defer.reject(response);
			}).catch(function (err) {
				defer.reject(err);
			});
			return defer.promise;
		},
		getUsTax: function (data) {
			var defer = $q.defer();
			$http({
				method: 'POST',
				url: '/api/quote/get-us-tax-rate',
				data: data
			}).then(function successCallback(response) {
				defer.resolve(response);
			}, function errorCallback(response) {
				defer.reject(response);
			}).catch(function (err) {
				defer.reject(err);
			});
			return defer.promise;
		},
		roundTo2Decimals: (number = 0.00) => {
			const formatter = new Intl.NumberFormat('en-US', {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
			return parseFloat(formatter.format(number).replace(/,/g,''))
			// return Math.round((number + Number.EPSILON) * 100) / 100
		}

	};
}]);