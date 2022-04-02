vulusionApp.controller(
  "OptionsController",
  function OptionsController(
    CommonService,
    OptionService,
    $rootScope,
    $scope,
    $http,
    $timeout,
    UserService
  ) {
    var option = function () {
      this.optionsDesc = "";
      this.priceDiff = 0;
      this.productWeight = 0;
      this.recurringPriceDiff = 0;
      this.arrangeOptionsBy = 0;
      this.defaultSelected = false;
      this.lastModified = new Date();
      this.lastModBy = "";
      this.onlyAvailableWithOptionIds = " ";
      this.notAvailableWithOptionIds = " ";
    };
    init = function () {
      CommonService.authenticateUser().then(async function (response) {
        $rootScope.logout = CommonService.logout;
        $scope.itemsByPage = 8;
        $scope.isUpdate = false;
        $scope.options = [];

        if (
          window.location.search &&
          window.location.search.indexOf("update") > -1
        ) {
          $scope.optionCatId = window.location.search
            .split("?")[1]
            .split("=")[1];
          CommonService.showLoader();
          try {
            const res = await UserService.list();
            $scope.users = res.data;
          } catch (error) {
            console.log(error);
          }
          $timeout(() => {
            $scope.$apply();
          });
          const response = await OptionService.list($scope.optionCatId);
          CommonService.hideLoader();
          if (response.data.status) {
            console.log(response.data.result);
            $scope.options = response.data.result;
            $scope.options.forEach(async function (elem) {
              try {
                elem.lastModified = elem.lastModified
                  ? new Date(elem.lastModified)
                  : null;
                let user = await $scope.users.filter((el) => {
                  return el.id === elem.lastModBy;
                });
                console.log(user[0]);
                elem.lastModBy = await user[0].email;
              } catch (error) {
                console.log(error);
              }
            });
            $scope.itemsByPage = $scope.options.length;
          } else {
            CommonService.showError(response.data.msg);
          }
        }
        $scope.option = new option();
        $scope.option.lastModBy = response.id;
        $scope.option.optionCatId = $scope.optionCatId;
      });
    };
    $scope.update = function (option) {
      $scope.option = option;
      $scope.option.defaultSelected = $scope.option.defaultSelected
        ? true
        : false;
      $scope.isUpdate = true;
    };
    // $scope.cancel = function () {
    // 	$scope.isUpdate = false;
    // 	$scope.option = new option();
    // };
    $scope.save = function () {
      CommonService.showLoader();
      post();
    };
    var redirect = function () {
      window.location.reload();
    };
    function post() {
      OptionService.save($scope.option).then(function (response) {
        if (response.data.status) {
          CommonService.hideLoader();
          CommonService.showSuccess(response.data.msg);
          if (!$scope.isUpdate) {
            $scope.option.id = response.data.insertId;
            $scope.options.unshift($scope.option);
            $scope.option = new option();
            redirect();
          } else {
            $scope.isUpdate = false;
            $scope.option = new option();
          }
        } else {
          CommonService.hideLoader();
        }
      });
    }
    $scope.delete = function (option, index) {
      CommonService.confirm(
        "Are you sure you want to delete this option permanently?",
        () => {
          CommonService.showLoader();
          OptionService.delete(option).then((response) => {
            if (response.data.status) {
              console.log(option), "OPTION";
              $scope.options.splice(index, 1);
              CommonService.showSuccess(response.data.msg);
            } else {
              CommonService.showError(response.data.msg);
            }
            CommonService.hideLoader();
          }),
            function () {
              CommonService.showError(
                "Error while deleting categories, check your internet connection"
              );
            };
        }
      );
    };
    init();
  }
);
