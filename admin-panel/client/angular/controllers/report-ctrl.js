vulusionApp.controller('ReportController', function ReportController(SyncService,ProductService,LookupService, CommonService, $cookies, $location, $rootScope, $scope, $http) {
    init = function () {
        CommonService.showLoader();
        CommonService.authenticateUser().then(function (response) {
            $rootScope.logout = CommonService.logout;
            // $scope.selected_product = "all"
            $scope.selected_user = "all"
            $scope.products = []
            $scope.getAllUserForReport();
            // ProductService.getAllProducts().then(function (response) {
			// 	$scope.products = response.data;
			// }, function (response) {
			// 	CommonService.hideLoader();
			// 	CommonService.showError("Error while retrieving products");
			// })
            $scope.oldYearRecords = [{
                    orderYear: 2002,
                    paymentAmount: 527180.00
                },
                {
                    orderYear: 2003,
                    paymentAmount: 552534.62
                },

                {
                    orderYear: 2004,
                    paymentAmount: 1000421.00
                },
                {
                    orderYear: 2005,
                    paymentAmount: 1461554.00
                },
                {
                    orderYear: 2006,
                    paymentAmount: 2314891.00
                    // },
                    // {
                    //     orderYear:2007,
                    //     paymentAmount: 2774247.16
                    // },
                    // {
                    //     orderYear:2008,
                    //     paymentAmount: 3089822.04
                    // },
                    // {
                    //     orderYear:2009,
                    //     paymentAmount: 2749885.62
                    // },
                    // {
                    //     orderYear:2010,
                    //     paymentAmount: 6663701.17
                    // },
                    // {
                    //     orderYear:2011,
                    //     paymentAmount: 8644357.79
                    // },
                    // {
                    //     orderYear:2012,
                    //     paymentAmount: 10732266.80
                }
            ]
            $scope.monthName = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $scope.itemsByPage = 30;
            $scope.update = false;
            // if (CommonService.isProduction()) {
            //     SyncService.order().then(function (response) {
            //         $scope.getYearlyReport();
            //         CommonService.hideLoader();
            //     }, function (err) {
            //         if (err.status != -1) {
            //             CommonService.showError(err.data.status);
            //         } else {
            //             CommonService.showError("Order sync failed");
            //         }
            //         $scope.getYearlyReport();
            //         CommonService.hideLoader();
            //     });
            // } else {
            $scope.users = []
            CommonService.hideLoader();
            $scope.getYearlyReport();
            // }
        })
    }


    $scope.getAllUserForReport = async function () {
        try{
            let response = await LookupService.GetAllUsersForReport()
            $scope.users = response.data
        }catch(e){
            CommonService.showError("Error while retrieving users");
        }
    }

    $scope.userReport = function () {
        if($scope.yearReport)
        $scope.getYearlyReport()
        else if($scope.monthReport)
        $scope.getMonthlyReport($scope.selectedYear)
        else if($scope.dayReport)
        $scope.getDailyReport($scope.selectedYear, $scope.selectedMonth)
        else if($scope.dateReport)
        $scope.getDateReport($scope.selectedDate,$scope.selectedMonth,$scope.pdfName)
        else
        $scope.getYearlyReport()

    }

    function getPercentageChange(oldNumber, newNumber) {
        // console.log('Old',oldNumber,'New',newNumber);
        var value = newNumber - oldNumber;
        var percentage = (value / oldNumber) * 100;
        return percentage;
    }

    $scope.getYearlyReport = function () {
        $scope.yearReport = true;
        $scope.monthReport = false;
        $scope.dayReport = false;
        $scope.dateReport = false;
        if(!$scope.selected_user)
        $scope.selected_user = 0
        // if(!$scope.selected_product)
        // $scope.selected_product = "all"
        CommonService.showLoader();
        console.log($scope.selected_user,$scope.selected_product)
        $http({
            method: 'GET',
            url: reportUrl + 'intake/' + $scope.selected_user,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();

            // console.log(response);
            $scope.allReports = $scope.oldYearRecords.concat(response.data);
            // console.log('Orignal', $scope.allReports);

            // $scope.allReports = $scope.oldYearRecords.concat($scope.allReports);
            $scope.allReports.forEach(function (elem, index) {
                if (elem.orderYear == null) {
                    // console.log(elem, index);
                    $scope.allReports.splice(index, 1)
                }
            });
            $scope.allReports.forEach(function (elem, index) {
                if (index <= 0)
                    elem.progress = 0;
                if (index > 0)
                    elem.progress = getPercentageChange($scope.allReports[index - 1].paymentAmount, elem.paymentAmount)
                if (elem.orderYear == new Date().getFullYear())
                    elem.progress = getPercentageChange(elem.previosPartial, elem.paymentAmount)
            });
            // console.log($scope.allReports);
            var categories = $scope.allReports.map(function (el) {
                return el.orderYear;
            });
            // console.log(categories);
            var payment = $scope.allReports.map(function (el) {
                return parseFloat(el.paymentAmount.toFixed(2).toLocaleString("en-US"));
            });
            var progress = $scope.allReports.map(function (el) {
                return parseFloat(el.progress.toFixed(2));
            });
            var lastPayment = new Array;
            categories.forEach(function (elem, index) {
                if (elem == new Date().getFullYear()) {
                    lastPayment[index] = payment[index];
                    payment.splice(index, 1);
                } else {
                    lastPayment[index] = null;
                }
            });
            // console.log($scope.allReports)
            $scope.allReports
            var orderCoverted = $scope.allReports.map(function (el) {
                if(el.conertedOrdersFromQuote)
                return el.conertedOrdersFromQuote
                else
                return 0
            });
            // console.log(categories);
            // console.log('payment', payment);
            // console.log('progress', progress);

            $scope.allReports.reverse();
            drawChart('Yearly Report', 'Year', categories,orderCoverted, payment, progress, lastPayment)

        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving report");
        });
    }

    $scope.getMonthlyReport = function (year) {
        $scope.yearReport = false;
        $scope.monthReport = true;
        $scope.dayReport = false;
        $scope.dateReport = false;
        $scope.selectedYear = year;
        if(!$scope.selected_user)
        $scope.selected_user = 0
        CommonService.showLoader();
        $http({
            method: 'GET',
            url: reportUrl + 'intake/' + year + '/' + $scope.selected_user,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();
            // console.log(response);
            var previous = [];
            var current = [];
            var previousTotal = 0;
            var currentTotal = 0;
            console.log()
            response.data.forEach(elem => {
                if (elem.orderYear == null) {
                    console.log(elem, index);
                    $scope.allReports.splice(index, 1)
                } else {
                    if (elem.orderYear == year) {
                        current.push(elem);
                    } else {
                        previous.push(elem)
                    }
                }
            });
            // console.log('prev', previous);
            // console.log('curr', current);
            $scope.allReports = current;
            console.log($scope.allReports,"all reports")
            $scope.allReports.forEach(function (elem, index) {
                if (elem.orderMonth == (new Date().getMonth() + 1) && elem.orderYear == (new Date().getFullYear())) {
                    elem.progress = getPercentageChange(elem.previosPartial, elem.paymentAmount);
                    previousTotal += elem.previosPartial;
                    currentTotal += elem.paymentAmount;
                } else {
                    if(previous[index]){
                        elem.progress = getPercentageChange(previous[index].paymentAmount, elem.paymentAmount);
                        previousTotal += previous[index].paymentAmount;
                    }
                    else{
                        elem.progress = "N/A"
                        previousTotal+=0
                    }
                    currentTotal += elem.paymentAmount;
                }
            });
            let start = 0;
             $scope.allReports
             .forEach(function (elem) {
                // console.log(elem,"elem")   
                start += elem.paymentAmount;
                elem.runningAmount = start
                // console.log(elem.runningAmount, "runningAmount")
            });
            $scope.allReports.reverse()
            // console.log('prevTot', previousTotal);
            // console.log('currTot', currentTotal);
            $scope.yearToDateProgress = getPercentageChange(previousTotal, currentTotal);
            var categories = $scope.allReports.map(function (el) {
                return $scope.monthName[el.orderMonth];start
            });
            var payment = $scope.allReports.map(function (el) {
                return parseFloat(el.paymentAmount.toFixed(2));
            });
            var progress = $scope.allReports.map(function (el) {
                if(el.progress !== "N/A")
                return parseFloat(el.progress.toFixed(2));
                else 
                return 0.00
            });

            var lastPayment = new Array;
            categories.forEach(function (elem, index) {
                if (elem == $scope.monthName[new Date().getMonth() + 1] && year == (new Date().getFullYear())) {
                    lastPayment[index] = payment[index];
                    payment.splice(index, 1);
                } else {
                    lastPayment[index] = null;
                }
            });
            var orderCoverted = $scope.allReports.map(function (el) {
                return el.conertedOrdersFromQuote
            });
            // console.log('payment', payment);
            $scope.allReports
            drawChart('Monthly Report', 'Month', categories, orderCoverted,payment, progress, lastPayment)

        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving report");
        });
    }

    $scope.getDailyReport = function (year, month) {
        $scope.yearReport = false;
        $scope.monthReport = false;
        $scope.dayReport = true;
        $scope.dateReport = false;
        $scope.selectedMonth = month;
        if(!$scope.selected_user)
        $scope.selected_user = 0
        CommonService.showLoader();
        $http({
            method: 'GET',
            url: reportUrl + 'intake/' + year + '/' + month + '/' + $scope.selected_user,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();
            // console.log(response);
            $scope.allReports = response.data;
            $scope.allReports.forEach(function (elem, index) {
                if (elem.orderYear == null) {
                    // console.log(elem, index);
                    $scope.allReports.splice(index, 1)
                }
                if (index <= 0)
                    elem.progress = 0;
                if (index > 0)
                    elem.progress = getPercentageChange($scope.allReports[index - 1].paymentAmount, elem.paymentAmount)
            });
            var categories = $scope.allReports.map(function (el) {
                return $scope.monthName[el.orderMonth] + '-' + el.orderDate;
            });
            var payment = $scope.allReports.map(function (el) {
                return parseFloat(el.paymentAmount.toFixed(2));
            });
            var progress = $scope.allReports.map(function (el) {
                return 0;
            });
            var orderCoverted = $scope.allReports.map(function (el) {
                return el.conertedOrdersFromQuote
            });
            // console.log('payment', payment);
            // console.log('progress', progress);
            $scope.allReports.reverse();
            var lastPayment = new Array;
            drawChart('Daily Report', 'Date', categories,orderCoverted, payment, progress, lastPayment)

        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving report");
        });
        
    }

    $scope.getDateReport = function (year, month, date) {
        $scope.yearReport = false;
        $scope.monthReport = false;
        $scope.dayReport = false;
        $scope.dateReport = true;
        $scope.selectedDate = date;
        $scope.selectedMonth = month;
        $scope.pdfName = year +
            ("0" + month).slice(-2) +
            ("0" + date).slice(-2);
        if(!$scope.selected_user)
        $scope.selected_user = 0
        CommonService.showLoader();
        $http({
            method: 'GET',
            url: reportUrl + 'intake/' + year + '/' + month + '/' + date + '/' + $scope.selected_user,
            headers: {
                'Content-Type': 'application/xml; charset=utf-8'
            }
        }).then(function successCallback(response) {
            CommonService.hideLoader();
            // console.log(response);
            $scope.allReports = response.data;
            $scope.allReports.forEach(function (elem, index) {
                if (elem.orderYear == null) {
                    // console.log(elem, index);
                    $scope.allReports.splice(index, 1)
                }
                elem.pdfName = $scope.pdfName + "_" + ("00000" + elem.orders.toString()).slice(-6) + '.pdf';
                if (index > 0)
                    elem.progress = getPercentageChange($scope.allReports[index - 1].paymentAmount, elem.paymentAmount)

            });
            var categories = $scope.allReports.map(function (el) {
                return el.orders;
            });
            var payment = $scope.allReports.map(function (el) {
                return parseFloat(el.paymentAmount.toFixed(2));
                
            });            
            var orderCoverted = $scope.allReports.map(function (el) {
                return el.conertedOrdersFromQuote
            });
            // console.log('payment', payment);
            $scope.allReports.reverse();
            var lastPayment = new Array;
            drawChart('By Order Report', 'Order #', categories,orderCoverted, payment, progress, lastPayment)

        }, function errorCallback(response) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving report");
        });
    }

    var drawChart = function (chartTitle, xAxisTitle, xAxisData, xAxisData2, yAxisData, yAxisData2, yAxisData3) {
        Highcharts.setOptions({
            lang: {
                thousandsSep: ','
            }
        });
        Highcharts.chart('container', {
            credits: {
                enabled: false
            },
            title: {
                text: chartTitle
            },
            xAxis: {
                categories: xAxisData,
                title: {
                    text: xAxisTitle
                }
            },
            yAxis: [{ // secondary axis
                labels: {
                    format: '{value}%',
                    style: {
                        color: '#666666'
                    }
                },
                title: {
                    text: 'Percent Change',
                    style: {
                        color: '#666666'
                    }
                },
                opposite: true
            }, { // Primary axis
                labels: {
                    style: {
                        color: '#0000ff'
                    }
                },
                title: {
                    text: "Amount ($)",
                    style: {
                        color: '#0000ff'
                    }
                }
            }],
            series: [{
                data: yAxisData2,
                name: 'Percent Change',
                type: 'column',
                color: '#666666',
                pointPlacement: 0.1
            },
            {
                data: yAxisData,
                yAxis: 1,
                name: 'Payment Amount',
                color: '#0000ff'
            },
            
            {
                data: xAxisData2,
                yAxis: 1,
                name: 'Order Coverted',
                color: '#222222'
            },
            {
                name: 'To Date Payment',
                data: yAxisData3,
                yAxis: 1,
                color: 'rgba(0,255,0,.7)',
                type: 'column',
                pointPadding: -0.2,
                pointPlacement: -0.2
            }]
        });
    }

    $scope.getTotal = function (data, key) {
        if (typeof (data) === 'undefined' || typeof (key) === 'undefined') {
            return 0;
        }

        var sum = 0;
        angular.forEach(data, function (obj, objKey) {
            if (obj[key])
                sum += parseFloat(obj[key]);
        });

        return sum;
    };
    init();
});