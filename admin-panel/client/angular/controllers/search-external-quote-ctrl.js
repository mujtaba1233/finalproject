// var vulusionApp = angular.module('vulusionApp', ['ui.select', 'ngSanitize','smart-table']);

vulusionApp.controller('SearchExternalQuoteController', function SearchExternalQuoteController(CommonService,$rootScope,$cookies,$scope, $http, ModalService) {
    var init = function(){
        CommonService.authenticateUser().then(function(response){
            $scope.user = response
            $scope.quotes = [];
            $scope.duration = '1';
            $scope.getQuotes();
            $scope.itemsByPage = 50;
        },function(err){
			CommonService.showError("Something went wrong! logout and login again.");
			console.log(err);
		});
    }
    
    $rootScope.logout = function(){
        if($cookies.get('user') !== undefined){
			$cookies.remove('BLUE_SKY_TOKEN');
            $cookies.remove('user');
			$cookies.remove('WATCH_TOKEN');
            window.location.pathname = '/login';
        }else {
            window.location.pathname = '/login';
        }
    }

    $scope.getQuotes = function(){
        CommonService.showLoader();
        $http({
            method: 'GET',
            url: searchExternalQuoteUrl,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();
            console.log(response)
            $scope.allquotes = response.data;
            $scope.allquotes.map((elem) => {
                let companies = [elem.BillingCompany, elem.ShippingCompany].join(', ');
                elem.companies = companies;
            })
            
            $scope.allquotes.forEach(function(elem){
                // elem.pdfname = elem.IssueDate.split('T')[0].replace(/-/g,'') + "_" + ("00000" + elem.QuoteNo.toString()).slice(-6)+'.pdf';
                elem.IssueDate = new Date(elem.IssueDate);
                elem.ValidTill = new Date(elem.ValidTill);
            });
        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving customers",response);
        });
    }
    $scope.removeQuote = function(index, quoteNo){
        CommonService.confirm("Are you sure you want to delete this quote?", function () {
            CommonService.showLoader()
            $http({
                method: 'POST',
                url: removeQuoteUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data : {
                    'quoteId' : quoteNo
                }
            }).then(function successCallback(response) {
                CommonService.hideLoader();
                console.log(response);
                if(response.data.success){
                    $scope.allquotes.splice(index,1);
                    CommonService.showSuccess("Quote has been removed!");
                }else {
                    console.log("deletion error",response.data);
                    CommonService.showError("Error while removing quote!");
                }
            }, function errorCallback(response) {
                CommonService.hideLoader();
                CommonService.showError("Error while removing quote");
            });
        });
    }
    init();
});
