vulusionApp.factory("ProductService", [
  "$http",
  "Upload",
  "$q",
  "CommonService",
  function ($http, Upload, $q, CommonService) {
    return {
      getProducts: function () {
        var defer = $q.defer();
        $http({
          method: "GET",
          url: getProductsURL,
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
      getAllProducts: function () {
        var defer = $q.defer();
        $http({
          method: "GET",
          url: getProductsCompleteURL,
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
      getProduct: function (id) {
        var defer = $q.defer();
        $http({
          method: "GET",
          url: getProductsURL + "/" + id,
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
      save: function (data, files) {
        var url = saveProductUrl;
        var defer = $q.defer();
        Upload.upload({
          url: url,
          file: files,
          data: {
            data: JSON.stringify(data),
          },
        })
          .progress(function (e) {
            console.log("Progress->", parseInt((e.loaded / e.total) * 100, 10));
          })
          .then(
            function (response) {
              defer.resolve(response);
            },
            function (err) {
              defer.reject(err);
            }
          );
        return defer.promise;
      },
      savePartial: function (product, images, pdfs) {
        var url = saveProductEmptyUrl;
        var defer = $q.defer();
        $http
          .post(url, {
            product: product,
            productDetail: pdfs,
            productImages: images,
          })
          .then(
            function (response) {
              defer.resolve(response);
            },
            function (err) {
              defer.reject(err);
            }
          );
        return defer.promise;
      },
      saveXMLProducts: function (data) {
        var method = "POST";
        var url = saveUploadedProductsUrl;
        var defer = $q.defer();
        $http({
          method: method,
          url: url,
          data: data,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
        })
          .then(function (response) {
            defer.resolve(response);
          })
          .catch(function (err) {
            defer.reject(err);
          });
        return defer.promise;
      },
      remove: function (id) {
        var defer = $q.defer();
        $http({
          method: "DELETE",
          url: removeProductUrl,
          data: { ProductID: id },
          headers: { "Content-Type": "application/json" },
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
      simpleUpdate: function (data) {
        var defer = $q.defer();
        $http({
          method: "POST",
          url: simpleUpdateProductUrl,
          data: data,
          headers: { "Content-Type": "application/json" },
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
    };
  },
]);
