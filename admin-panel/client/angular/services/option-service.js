vulusionApp.factory("OptionService", [
  "$http",
  "$q",
  function ($http, $q) {
    return {
      list: function (id) {
        var defer = $q.defer();
        $http({
          method: "GET",
          url: GetOptionsUrl + "/" + id,
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
      save: function (option) {
        var defer = $q.defer();
        $http({
          method: "POST",
          url: GetOptionsUrl,
          data: option,
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
        // console.log(endUser,"serviceData")
        return defer.promise;
      },

      delete: function (data) {
        var defer = $q.defer();
        $http({
          method: "DELETE",
          url: GetOptionsUrl,
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
