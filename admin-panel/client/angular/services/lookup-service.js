vulusionApp.factory("LookupService", ['$http', '$q', 'CommonService', function ($http, $q, CommonService) {
    return {
        GetShippingMethods: function () {
            var method = "GET";
            var url = shippingMethodsListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetCompanies: function (){
            var method = "GET";
            var url = getCompaniesURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetShippingMethodById: function (shippingMethodId) {
            var method = "GET";
            var url = ShippingMethodById + '/' + shippingMethodId;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetAllUsersForReport: function () {
            var method = "GET";
            var url = GetAllUsersForReport;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetOrderStatus: function () {
            var method = "GET";
            var url = orderStatusListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetLocations: function () {
            var method = "GET";
            var url = locationsListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetShippingAvailablityStatus: function () {
            var method = "GET";
            var url = shippingAvailabilityStatusListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetProducts: function () {
            var method = "GET";
            var url = productListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetCategories: function () {
            var method = "GET";
            var url = categoryListURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetCustomers: function () {
            var method = "GET";
            var url = customerLookUpURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        GetProductSerials: function (productId,orderId) {
            var method = "GET";
            if (productId && orderId) {
                var url = serialListURL + '/' + productId + '/' + orderId ;
            }else if (productId) {
                var url = serialListURL + '/' + productId;
            }else{
                var url = serialListURL;
            }
            var defer = $q.defer();
            $http({
                method: method,
                url: url
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getShippings: function(data) {
            var method = "POST";
            var url = shippingRatesURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
                data:data
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    if(!response.data.ups.status)
                    defer.reject(response.data.ups);
                    else if(!response.data.dhl.status)
                    defer.reject(response.data.dhl);
                    // CommonService.showError(response.data.msg)
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getTaxRate: function(data) {
            var method = "POST";
            var url = taxRateURL;
            var defer = $q.defer();
            $http({
                method: method,
                url: url,
                data:data
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(err);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        },
        getCountries: function() {
            var defer = $q.defer();
            $http({
                method: "GET",
                url: countryList,
            }).then(function (response) {
                if (response.data.status) {
                    defer.resolve(response.data);
                } else {
                    CommonService.showError(response.data.msg)
                    defer.reject(response);
                }
            }).catch(function (err) {
                defer.reject(err);
            });
            return defer.promise;
        }


    };
}]);
