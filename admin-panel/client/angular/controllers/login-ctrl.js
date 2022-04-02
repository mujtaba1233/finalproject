var loginApp =
    angular.module('loginApp', [
        'ngCookies'
    ]);
loginApp.controller('loginController', function CreateQuoteController($scope, $http, $cookies, $location) {

    init = function () {
        if (window.location.pathname.split('/').length === 3) {
            $scope.token = window.location.pathname.split('/')[2];
        } else {
            // console.log('Path-------------->',window.location.pathname);
        }
    }
    $scope.authenticate = function () {
        showLoader();
        $http.post(loginAuthUrl, { data: $scope.user }).then(function (response) {
            // console.log(response)
            if (!$scope.user.email) {
                hideLoader();
                showError("Email required");
            }
            if (response.data.error) {
                hideLoader();
                showError(response.data.error);
                console.log('data.error', response.data);
            } else if (response.data.dbError) {
                hideLoader();
                showError(response.data.dbError);
                console.log('db error', response.data.dbError);
            } else if (response.data.is_expire) {
                hideLoader();
                showError("Password is expired kindly check your mail to reset your password.");
            } else if (response.data.isBlocked) {
                hideLoader();
                return showError("Your account is blocked for attempting too many failed attemps.Kindly Check your provided email.");
            } else if (response.data.active) {
                var exp = new Date(new Date().getTime() + 1000 * 60 * 60).toUTCString();
                $cookies.put('user', JSON.stringify(response.data), {
                    expires: exp
                })
                hideLoader();
                showSuccess("Success!");
                var next = window.location.href.split('login?')
                if (next.length == 2 && next[1].indexOf('next') > -1) {
                    // console.log('Next Route',next);
                    next = next[1].split('next=')[1]
                    // console.log('Next Route final',next);
                    window.location = next;
                } else {
                    window.location = '/order-search';
                }
            } else {
                hideLoader();
                showError("Whoops! Something went wrong, Check your internet connection!!");
                // console.log(response);
            }
        });
    }
    $scope.savePassword = function () {
        $scope.user.token = $scope.token
        var passw = /^(?=.*\d)(?=.*[a-z]).{8,20}$/;
        if (!$scope.user.password.match(passw)) {
            return showError("Password must have numeric and alphanumeric characters in it.");
        }
        $http.post(setPassUrl, { data: $scope.user }).then(function (response) {
            // console.log(response)
            // console.log(typeof response.data.changedRows, " changedRows")
            if (response.data.status) {
                showSuccess("Success!");
                window.location.pathname = '/login';
            }
            else if (!response.data.status) {
                return showError(response.data.msg);
            }
            else {
                hideLoader();
                showError("Whoops! Something went wrong, Check your internet connection!!");
            }
        });
    }


    var parall = 0;

    function showLoader() {
        parall++;
        $('.loader').show();
        $('#overlay').show();
    }

    function hideLoader() {
        parall--;
        if (parall == 0) {
            $('.loader').hide();
            $('#overlay').hide();
        }
    }

    function showError(error) {
        alertify.error(error);
    }
    function showSuccess(msg) {
        alertify.success(msg);
    }

    init();
});
