// var vulusionApp = angular.module('vulusionApp', ['ui.select', 'ngSanitize','smart-table']);
vulusionApp.controller('SearchQuoteController', function SearchQuoteController(CommonService,$timeout,$rootScope,$cookies,$scope, $http, ModalService) {
    var init = function(){
        CommonService.authenticateUser().then(function(response){
            $scope.user = response
            console.log($scope.user.id, "user");
            $scope.quotes = [];
            $scope.duration = 'all';
            $scope.fromSearchDate = "";
            $scope.toSearchDate = new Date();
            $scope.getQuotes();
			$scope.customTotalAmount = ''
            $scope.quoteByIdSearch = ""
			$scope.tempOrders = [];
            $scope.itemsByPage = 50;
            var goToQuotePageByNo = document.getElementById("goToQuotePageByNo");
			goToQuotePageByNo.addEventListener("keyup", function(event) {
				if (event.keyCode === 13) {
					event.preventDefault();
					document.getElementById("goToQuotePageByNoButton").click();
				}
			});
            $scope.datePicker = ""
        },function(err){
			CommonService.showError("Something went wrong! logout and login again.");
			console.log(err);
		});
    }
    $scope.customTotalAmountSearch = async function() {
		let val = $scope.customTotalAmount
		let findVal = []
		if(val){
			$scope.allquotes=[]
			val =  val.replace('$','').replace(/^[, ]+|[, ]+$|[, ]+/g, "").replace(/\s/g, '').trim();
			val = Number(val);
			var arrayofObject = $scope.tempOrders.filter(function(item) {
                if(item.total !== null){
                    console.log(item.total)
                    let total = (item.total).toString();
                    if(total.includes(val))
                    return true
                    else
                    return false;
                }
			  })
			if(arrayofObject.length > 0)
			$scope.allquotes = arrayofObject
		}else{
			$scope.allquotes = $scope.tempOrders

		}
			$scope.selectedOptions = await Object.keys($scope.allquotes[0])
            $timeout(() => {
                $scope.$apply()
            })

	}

    $scope.updateExportFileName =  function (needToSave) {
		
		$scope.fileName = 'Quotes_' + new Date().getTime() + '.csv';
		
	}

    $scope.dateFilter = async  function() {
		if($scope.datePicker){
			let allquotes = angular.copy($scope.allquotesForSearch)
			let newOrder = []
			let datePicker =  convert($scope.datePicker)
			if($scope.datePicker){
				newOrder = allquotes.filter(elem=>{
					if(elem.orderdatesearch === datePicker )
                        return elem;
				})
			}
            $scope.allquotes = newOrder
            $scope.tempOrders = $scope.allquotes
			$scope.selectedOptions = await Object.keys($scope.allquotes[0])
            $timeout(() => {
                $scope.$apply()
            })
		}
		else{
            if($scope.duration === 'custom')
                $scope.dataSearchFilter()
            else
                $scope.getQuotes()
		}
	}
    $scope.cloneQuote = function(quoteNo){
        CommonService.showLoader()
        $http({
            method: 'POST',
            url: cloneQuoteUrl,
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            data : {
                'quoteNo' : quoteNo,
                'userId' : $scope.user.id
            }
        }).then(async function successCallback(response) {
            CommonService.hideLoader();
            if(response.data.success){
                $scope.allquotes.unshift(response.data.quote);
                $scope.allquotesForSearch = $scope.allquotes
			$scope.selectedOptions = await Object.keys($scope.allquotes[0])
            $timeout(() => {
                $scope.$apply()
            })

                CommonService.showSuccess("Quote has been cloned!");
                window.location = "/edit?quote=" + response.data.quote.QuoteNo;
            }else {
                CommonService.showError("Error while cloning quote!");
            }
        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while saving quote");
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
    function generateQuoteName(){
        var d = new Date();
        var pdfName =
        d.getFullYear() +
        ("0"+(d.getMonth()+1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) + "_" +
        ("00000" + quoteId.toString()).slice(-6);
        return pdfName;
    }
    $scope.removeQuote = async function(index, quoteNo){
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
            }).then(async function successCallback(response) {
                CommonService.hideLoader();
                // console.log(response);
                if(response.data.success){
                    $scope.allquotes.splice(index,1);
                $scope.allquotesForSearch = $scope.allquotes
			$scope.selectedOptions = await Object.keys($scope.allquotes[0])
            $timeout(() => {
                $scope.$apply()
            })
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

    $scope.dataSearchFilter = function() {
        let pdfDateCreated = ""
        let dateObject = {"to":$scope.toSearchDate , "from" : $scope.fromSearchDate}
        if($scope.duration === 'custom'){
            CommonService.showLoader();
            // console.log(dateObject)
            $http({
                method: 'POST',
                url: searchByDateQuoteUrl,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                data:dateObject
            }).then( async function successCallback(response) {
                CommonService.hideLoader();
                $scope.allquotes = response.data;
                $scope.tempOrders = $scope.allquotes
                // console.log($scope.allquotes)
                $scope.allquotes.map((elem) => {
                    let companies = [elem.BillingCompany, elem.ShippingCompany].join(', ');
                    elem.companies = companies;
                    pdfDateCreated = elem.IssueDate
                    elem.orderdatesearch = convert(elem.IssueDate)
                    date = new Date(elem.IssueDate)
                  
                    elem.IssueDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
                })
                
                $scope.allquotes.forEach(function(elem){
                    // elem.pdfname = pdfDateCreated.split('T')[0].replace(/-/g,'') + "_" + ("00000" + elem.QuoteNo.toString()).slice(-6)+'.pdf';
                    elem.pdfname = (elem.BillingCompany).replace('-','_') + "-" + ("00000" + elem.QuoteNo.toString()).slice(-6)+ '-'+ elem.FirstName + '-' + elem.LastName +'.pdf';

                    elem.ValidTill = new Date(elem.ValidTill);
                    // console.log('L ',$scope.allquotes);
                    // console.log('No Name',elem.pdfname);
                });
                $scope.allquotesForSearch = $scope.allquotes
			$scope.selectedOptions = await Object.keys($scope.allquotes[0])
            $timeout(() => {
                $scope.$apply()
            })
                // console.log($scope.allquotes ,"$scope.allquotes ");
            }, function errorCallback(response) {
                CommonService.hideLoader();
                CommonService.showError("Error while retrieving customers",response);
            });
        }
        else{

        }
    }

    $scope.getQuotes = function(){
        let pdfDateCreated = ""
        if($scope.duration !== 'custom'){
            CommonService.showLoader();
            $http({
                method: 'GET',
                url: searchQuoteUrl + '/' + $scope.duration,
                headers: {
                    'Content-Type': 'application/xml; charset=utf-8'
                }
            }).then(async function successCallback(response) {
                CommonService.hideLoader();
                $scope.allquotes = response.data;
                $scope.tempOrders = $scope.allquotes
                $scope.allquotes.map((elem) => {
                    let companies = [elem.BillingCompany, elem.ShippingCompany].join(', ');
                    elem.companies = companies;
                    elem.PaymentAmountForSearch =elem.total>0? " "+ elem.total.toFixed(2) +" ":0
                    elem.PaymentAmountForSearch =elem.total>0? numberWithCommas(elem.PaymentAmountForSearch) :0
                    pdfDateCreated = elem.IssueDate
                    date = new Date(elem.IssueDate)
                    elem.orderdatesearch = convert(elem.IssueDate)
                    elem.IssueDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
                })
                
                $scope.allquotes.forEach(function(elem){
                    // elem.pdfname = elem.BillingCompany + "-" + ("00000" + elem.QuoteNo.toString()).slice(-6)+ '-'+ elem.CustomerFName + '-' + elem.CustomerLName +'.pdf';
                    elem.pdfname = elem.BillingCompany.replace('-','_')  + "-" + ("00000" + elem.QuoteNo.toString()).slice(-6)+ '-'+ elem.FirstName + '-' + elem.LastName +'.pdf';


                    elem.ValidTill = new Date(elem.ValidTill);
                    // console.log('L ',$scope.allquotes);
                    // console.log('No Name',elem.pdfname);
                });
                $scope.allquotesForSearch = $scope.allquotes
                $scope.selectedOptions = await Object.keys($scope.allquotes[0])
                $timeout(() => {
                    $scope.$apply()
                })
                // console.log($scope.allquotes ,"$scope.allquotes ");
            }, function errorCallback(response) {
                CommonService.hideLoader();
                CommonService.showError("Error while retrieving customers",response);
            });
        }
    }
    function convert(str) {
		var date = new Date(str),
		  mnth = ("0" + (date.getMonth() + 1)).slice(-2),
		  day = ("0" + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join("-");
	}
    function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
    init();
});
