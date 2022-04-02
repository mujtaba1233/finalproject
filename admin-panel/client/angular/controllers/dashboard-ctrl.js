vulusionApp.controller('DashboardController', function CustomerController(CommonService, ProductService, $timeout, $location, $cookies, $rootScope, $scope, $http) {

    init = function () {
        CommonService.authenticateUser().then(function () {
            $rootScope.logout = CommonService.logout;
            $scope.searchResult = [];
            if ($location.search().query) {
                $scope.query = $location.search().query;
                $scope.getResults();
            }

            // console.log($location.search());
        });
        $scope.query = ""
        $scope.itemsByPage = 50;
    }
    $scope.selectedNumber = null;
    var timeoutPromise;
    $scope.getResults = function () {
        // console.log('query-> ', $scope.query);
        $timeout.cancel(timeoutPromise);
        timeoutPromise = $timeout(function () {
            if ($scope.query == "") {
                $scope.searchResult = [];
                // CommonService.hideLoader()
            } else {
                $location.search({ 'query': $scope.query });
                CommonService.showLoader()
                $http.get('/api/dashboard/search/' + $scope.query).then(function (response) {
                    // console.log('response->', response);
                    $scope.searchResult = response.data;
                    CommonService.hideLoader()
                })
            }

        }, 800);
    }
    $scope.removeQuote = function (index, quoteNo) {
        CommonService.confirm("Are you sure you want to delete this quote?", function () {
            console.log("Delete", quoteNo);
            CommonService.showLoader()
            $http({
                method: 'POST',
                url: removeQuoteUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data: {
                    'quoteId': quoteNo
                }
            }).then(function successCallback(response) {
                CommonService.hideLoader();
                // console.log(response);
                if (response.data.success) {
                    $scope.searchResult.splice(index, 1);
                    CommonService.showSuccess("Quote has been removed!");
                } else {
                    console.log("deletion error", response.data);
                    CommonService.showError("Error while removing quote!");
                }
            }, function errorCallback(response) {
                CommonService.hideLoader();
                CommonService.showError("Error while removing quote");
            });
        });
    }
    $scope.cloneQuote = function (quoteNo) {
        // console.log('clone', quoteNo);
        CommonService.showLoader()
        $http({
            method: 'POST',
            url: cloneQuoteUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: {
                'quoteNo': quoteNo
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();
            // console.log(response);
            if (response.data.success) {
                // $scope.allquotes.unshift(response.data.quote);
                CommonService.showSuccess("Quote has been cloned!");
                window.location = "/edit?quote=" + response.data.quote.QuoteNo;
            } else {
                CommonService.showError("Error while cloning quote!");
            }
        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while saving quote");
        });
    }

    init();
});
