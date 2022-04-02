vulusionApp.controller(
  "OptionCategoryController",
  function OptionCategoryController(
    CommonService,
    OptionCategoryService,
    $rootScope,
    UserService,
    $timeout,
    $scope,
    $http,
    CustomersService
  ) {
    var optionCategory = function () {
      this.aboutOptionCategories = "";
      this.arrangeOptionCategoriesBy = 0;
      this.displayType = "TEXTBOX";
      this.headingGroup = "";
      this.hideOptionCategoriesDesc = false;
      this.isRequired = false;
      this.lastModBy = 0;
      this.optionCategoriesDesc = "";
    };
    init = function () {
      CommonService.authenticateUser().then(async function (response) {
        $rootScope.logout = CommonService.logout;
        $scope.itemsByPage = 8;
        $scope.isUpdate = false;
        $scope.optionCategories = [];
        $scope.optionCategory = new optionCategory();
        $scope.user = response.id;
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
        console.log($scope.users);
        OptionCategoryService.list().then(
          function (response) {
            CommonService.hideLoader();
            if (response.data.status) {
              console.log(response.data.result);
              // console.log($scope.categories);
              $scope.optionCategories = response.data.result;
              $scope.optionCategories.forEach(async function (elem) {
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

              $scope.itemsByPage = $scope.optionCategories.length;
            } else {
              CommonService.showError(response.data.msg);
            }
          },
          function (response) {
            CommonService.showError(
              "Error while retrieving categories, check your internet connection"
            );
          }
        );
      });
    };
    var redirect = function () {
      window.location.reload();
    };
    $scope.update = function (option) {
      $scope.optionCategory = option;
      $scope.optionCategory.hideOptionCategoriesDesc = $scope.optionCategory
        .hideOptionCategoriesDesc
        ? true
        : false;
      $scope.optionCategory.isRequired = $scope.optionCategory.isRequired
        ? true
        : false;
      $scope.isUpdate = true;
    };
    $scope.cancel = function () {
      $scope.isUpdate = false;
      $scope.optionCategory = new optionCategory();
    };
    $scope.save = function () {
      // console.log("sss");
      CommonService.showLoader();
      post();
    };
    function post() {
      $scope.optionCategory.lastModBy = $scope.user;
      //   console.log($scope.optionCategory);
      //   return;
      OptionCategoryService.save($scope.optionCategory).then(function (
        response
      ) {
        console.log(response);
        if (response.data.status) {
          CommonService.hideLoader();
          CommonService.showSuccess(response.data.msg);
          redirect();
          if (!$scope.isUpdate) {
            $scope.optionCategory.id = response.data.result.insertId;
            $scope.optionCategories.unshift($scope.optionCategory);
            $scope.optionCategory = new optionCategory();
          } else {
            $scope.isUpdate = false;
            $scope.optionCategory = new optionCategory();
          }
          redirect();
        } else {
          CommonService.hideLoader();
        }
        // console.log(response);
      });
    }
    $scope.delete = function (option, index) {
      CommonService.showLoader();
      OptionCategoryService.delete(option).then(
        function (response) {
          if (response.data.status) {
            CommonService.showSuccess(response.data.msg);
            $scope.optionCategories.splice(index, 1);
          } else {
            CommonService.showError(response.data.msg);
          }
          CommonService.hideLoader();
        },
        function () {
          CommonService.showError(
            "Error while deleting categories, check your internet connection"
          );
        }
      );
    };
    init();
  }
);
