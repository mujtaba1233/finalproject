vulusionApp.controller('ActivityLogController', function SearchQuoteController(CommonService,ActivityLogService,CustomerService,UserService,$rootScope,$cookies,$scope,$http, ModalService) {
    var init = function(){
        CommonService.authenticateUser().then(function(response){
            $scope.type = 'all';
            $scope.date = '1';
            $scope.records = [];
            $scope.selected = true;
            $scope.duration = '1';
            $scope.startTo = moment(new Date).format("MM/DD/YYYY");
            $scope.formatedDateTo = new Date($scope.startTo);
            $scope.startFrom = new Date;
            $scope.fileName = 'Records.csv';
            $scope.startFrom.setMonth($scope.startFrom.getMonth() - 3);
            $scope.startFrom = moment($scope.startFrom).format("MM/DD/YYYY")
            $scope.formatedDateFrom = new Date($scope.startFrom);
            $scope.to = new Date();
            $scope.from = new Date();
            $scope.options = { hour12: false };
            $scope.from.setMonth($scope.from.getMonth() - 3);
            var todaysDate = new Date();
            var year = todaysDate.getFullYear();
            var day = ("0" + todaysDate.getDate()).slice(-2);
            var month = ('0' + (todaysDate.getMonth() - 2)).slice(-2);
            $scope.maxDate = (year + "-" + month + "-" + day);
            var maxMonth = ('0' + (todaysDate.getMonth() + 1)).slice(-2);
            $scope.minDate = (year + "-" + maxMonth + "-" + day);
            $scope.getActivityLogData();
            $scope.getAllUsers();
            $scope.itemsByPage = 50;
            CustomerService.getCustomers().then(function (response) {
                $scope.customers = response.data;
                // $scope.customers.splice($scope.customers.findIndex(e => e.hide === "1"),1);
                // console.log($scope.customers);
            }, function errorCallback(response) {
                CommonService.showError("Error while retrieving customers");
            });
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
        }
        else if($cookies.get('admin') !== undefined){
			$cookies.remove('BLUE_SKY_TOKEN');
            $cookies.remove('admin');
            window.location.pathname = '/login';
        }
        else {
            window.location.pathname = '/login';
        }
    }
    $scope.getAllUsers = function(){
        CommonService.showLoader();
        UserService.list().then(function(response) {
            CommonService.hideLoader();
            $scope.allUsers = response.data;
            // console.log($scope.allUsers);

        }, function(response) {
            CommonService.showError("Error while retrieving customers");
        });
    }
    $scope.getValue = function (type) {
        // console.log(type);
        // $scope.type = type
        
	};
    $scope.customerSelect = function (selectedUser) {
        $scope.customerID = selectedUser.CustomerID
        // console.log($scope.customerID, "selectedCustomerID")
        $scope.getActivityLogData()
	};
    $scope.userListner = function (selectedUser) {
        // console.log(selectedUser, "selectedCustomer")
		$scope.customer = selectedUser;
        // $scope.$apply()
        $scope.getActivityLogData()
	};
    $scope.getActivityLogData = function(){
        // console.log($scope.customer)
        // console.log($scope.from)
        $scope.details = {to: $scope.to, from: $scope.from, id: $scope.customer? $scope.customer.id : null, customerId: $scope.customerID? $scope.customerID : null}
        // console.log($scope.details)
        // CommonService.showLoader();
    ActivityLogService.getRecord({data: $scope.details }).then(function(response) {
            // console.log(response)
            $scope.records = response.data
            $scope.records.forEach(element => {
                element.lastModifyOnTime = moment(new Date(element.lastModifyOn), ["h:mm A"]).format("HH:mm");
                element.lastModifyOn = new Date(element.lastModifyOn)
            });
        	// CommonService.hideLoader();
        	// CommonService.showSuccess("Record fetched.");
        }, function(response) {
        	CommonService.showError("Error while fetching Record");
        });
    }
    $scope.getActivityLogDataByDates = function(){
        // return console.log($scope.from)
        // if($scope.date == 1){
        //     $scope.from = new Date();
        //     $scope.from.setMonth($scope.from.getMonth() - 1);
        // }
        // if($scope.date == 2){
        //     $scope.from = new Date();
        //     $scope.from.setMonth($scope.from.getMonth() - 2);
        // }
        // if($scope.date == 3){
        //     $scope.from = new Date();
        //     $scope.from.setMonth($scope.from.getMonth() - 3);
        // }
        // console.log($scope.to)
        $scope.getActivityLogData();
    }
    init();
});
