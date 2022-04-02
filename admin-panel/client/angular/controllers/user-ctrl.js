vulusionApp.controller('UserController', function CreateQuoteController(CommonService,UserService,$rootScope,$scope, $http) {
    var user = function() {
        CommonService.authenticateUser().then(function(response){
            if(response.usertype == ADMIN){
                this.firstname = "",
                this.lastname = "",
                this.email = "",
                this.usertype = USER,
                this.active = true
            }else {
                window.location = "/login";
            }
        });
    };
    
    init = function(){
        $rootScope.logout = CommonService.logout;
        $scope.itemsByPage = 8;
        $scope.update = false;
        $scope.user = new user();
        CommonService.showLoader();
        UserService.list().then( async function(response) {
            CommonService.hideLoader();
            $scope.users = response.data;
		    $scope.selectedOptions = await Object.keys($scope.users[0])
            return $scope.selectedOptions
            // console.log($scope.users);

        }, function(response) {
            CommonService.showError("Error while retrieving customers");
        });
    }
    $scope.updateUser = function(user){
        if(user.active==1){
            user.active = true;
        }else {
            user.active = false;
        }
        $scope.user = user;
        $scope.update = true;
    }
    $scope.SendMail = function(user){
        CommonService.showLoader();
        $scope.email = user.email;
        UserService.sendMail({ data: $scope.email }).then(function(response) {
                CommonService.hideLoader();
                CommonService.showSuccess(response.data.msg);
                // console.log(response);
        });
    }
    $scope.cancelUpdate = function(){
        $scope.update = false;
        $scope.user = new user();
    }
    $scope.saveUser = function(){
        // console.log("sss",$scope.user.firstname);
        if($scope.user.firstname === undefined){
            CommonService.showError("First name is empty");
            return
        }
        else if($scope.user.lastname === undefined){
            CommonService.showError("Last name is empty");
            return
        }
        else if($scope.user.email === undefined){
            CommonService.showError("Email is empty");
            return
        }
        else{
            CommonService.showLoader();
            postUser();
        }
    }
    function postUser(){

        if($scope.user.usertype){
            UserService.save({ data: $scope.user }).then(function(response) {
                if(response.data.error){
                    CommonService.hideLoader();
                    if(response.data.error.toString().indexOf("for key 'email'") !== -1){
                        CommonService.showError("Email already exist!");
    
                    }else {
                        CommonService.showError("Error while adding user!");
                    }
                    console.log(response.data.error);
                }else {
                    CommonService.hideLoader();
                    CommonService.showSuccess("Success!");
                    if (!$scope.update) {
                        $scope.user.id = response.data.insertId
                        $scope.users.push($scope.user);
                        $scope.user = new user();
                    }else {
                        $scope.update = false;
                        $scope.user = new user();
                    }
                }
                // console.log(response);
            });
        }
        else{
            CommonService.hideLoader();
            CommonService.showError("Please select a user role");
        }
        
    }
    init();
});
