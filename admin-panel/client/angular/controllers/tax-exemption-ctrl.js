vulusionApp.controller('TaxExemptionController', function CreateQuoteController(CommonService, LookupService, $rootScope, $scope, TaxExemptionService) {
    init = function () {
        CommonService.authenticateUser().then(function (user) {
            if (user.usertype == ADMIN) {
                $rootScope.logout = CommonService.logout;
                $scope.itemsByPage = 8;
                $scope.updateFlag = false;
                $scope.user = user;
                $scope.taxExem = new taxExem();
                $scope.taxExems = [];
                getCustomers();
                getTaxExems();
            } else {
                window.location = "/login";
            }
        });
    }
    var taxExem = function () {
        this.address1 = ""
        this.customerId = ""
        this.address2 = ""
        this.company = ""
        this.city = ""
        this.state = ""
        this.postalCode = ""
        this.country = ""
        this.dateFrom = new Date()
        this.dateTill = new Date()
        this.createdBy = $scope.user.id
        this.updatedBy = $scope.user.id
        this.isActive = true
    };
    $scope.update = function (taxExem) {
        if (taxExem.isActive == 1) {
            taxExem.isActive = true;
        } else {
            taxExem.isActive = false;
        }
        taxExem.dateFrom = new Date(taxExem.dateFrom)
        taxExem.dateTill = new Date(taxExem.dateTill)
        $scope.taxExem = taxExem;
        $scope.updateFlag = true;
    }
    $scope.cancelUpdate = function () {
        $scope.updateFlag = false;
        $scope.taxExem = new taxExem();
    }
    $scope.save = function () {
        if (!$scope.dateValidate()) {
            return
        } else {
            CommonService.showLoader();
            post();
        }
    }
    $scope.delete = function (data,index) {
        CommonService.confirm('Are you sure you want to remove address from tax exemption?', () => {
            CommonService.showLoader();
            TaxExemptionService.delete({
                id: data.id
            }).then(function (response) {
                if (response.data.status) {
                    $scope.taxExems.splice(index,1)
                    CommonService.showSuccess(response.data.msg)
                } else {
                    CommonService.showError(response.data.msg)
                }
                CommonService.hideLoader();
            })
        })
    }

    function post() {
        $scope.taxExem.dateFrom = $scope.taxExem.dateFrom.toISOString()
        $scope.taxExem.dateTill = $scope.taxExem.dateTill.toISOString()
        TaxExemptionService.save($scope.taxExem).then(function (response) {
            console.log(response);
            if (response.data.status) {
                CommonService.hideLoader();
                CommonService.showSuccess("Success!");
                if (!$scope.updateFlag) {
                    $scope.taxExem.id = response.data.insertId
                    $scope.taxExems.unshift($scope.taxExem);
                    $scope.taxExem = new taxExem();
                } else {
                    $scope.updateFlag = false;
                    $scope.taxExem = new taxExem()
                }
            }
        });
    }
    $scope.fillAddress = function () {
        $scope.taxExem = new taxExem()
        $scope.taxExem.customerId = $scope.customer.CustomerID
        $scope.taxExem.address1 = $scope.customer.BillingAddress1
        $scope.taxExem.address2 = $scope.customer.BillingAddress2
        $scope.taxExem.city = $scope.customer.City
        $scope.taxExem.country = $scope.customer.Country
        $scope.taxExem.state = $scope.customer.State
        $scope.taxExem.company = $scope.customer.CompanyName
        $scope.taxExem.postalCode = $scope.customer.PostalCode
    }
    $scope.parseDate = function (date) {
        return new Date(date);
    }
    $scope.dateValidate = function () {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var till = $scope.taxExem.dateTill;
        if (till < now) {
            CommonService.showError('End of Tax Exemption can not be in the past.')
            return false
        }
        return true
    }
    var getCustomers = function () {
        CommonService.showLoader();
        LookupService.GetCustomers().then(function (response) {
            CommonService.hideLoader();
            if (response.status) {
                $scope.customers = response.data
            } else {
                CommonService.showError(response.msg)
            }
        }, function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error fetching customer, check your internet connection!")
            console.log(error);

        })
    }
    var getTaxExems = function () {
        CommonService.showLoader();
        TaxExemptionService.list().then(function (response) {
            CommonService.hideLoader();
            if (response.status) {
                $scope.taxExems = response.data.result
            } else {
                CommonService.showError(response.msg)
            }
        }, function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error fetching Tax Exems, check your internet connection!")
            console.log(error);

        })
    }
    init();
});