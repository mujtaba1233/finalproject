vulusionApp.controller('PaymentController', function CustomerController(CustomerService, CommonService, $rootScope, $scope, order, close) {
    // $scope.ccMask = '9999 9999 9999 9999'
    init = function () {
        CommonService.authenticateUser().then(function () {
            $rootScope.logout = CommonService.logout;
            $scope.ccValid = true
            $scope.cvcValid = true
            $scope.expValid = true
        });
    }
    $scope.close = function (obj) {
        close(obj);
    }
    $scope.chargeCC = function () {
        if (validateCC()) {
            console.log($scope.card);
        } else {
            CommonService.showError('Invalud credid card details.')
        }
    }
    // $scope.$watch('card.number', function (newNumber) {
    //     $scope.card.cardType = payform.parseCardType(newNumber) || 'other'
    //     $scope.ccMask = getCCMask($scope.card.cardType)
    // });
    $scope.ccNumberChange = function () {
        $scope.card.cardType = payform.parseCardType($scope.card.number) || 'other'
        // console.log($scope.card.cardType);
        $scope.ccMask = getCCMask($scope.card.cardType)
        // console.log($scope.ccMask);

    }
    var getCCMask = function (cardType) {
        var masks = {
            'mastercard': '9999 9999 9999 9999',
            'visa': '9999 9999 9999 9999',
            'jcb': '9999 9999 9999 9999',
            'amex': '9999 999999 99999',
            'dinersclub': '9999 9999 9999 99',
            'discover': '9999 9999 9999 9999',
            'other': '9999 9999 9999 9999'
        };
        return masks[cardType] || masks['other'];
    }
    var validateCC = function () {
        $scope.ccValid = payform.validateCardNumber($scope.card.number);
        $scope.cvcValid = payform.validateCardCVC($scope.card.cvc, $scope.card.cardType);
        var expiry = payform.parseCardExpiry($scope.card.expiry)
        $scope.card.expiryMY = payform.parseCardExpiry($scope.card.expiry)
        $scope.expValid = payform.validateCardExpiry(expiry.month, expiry.year);
        return $scope.ccValid && $scope.expValid && $scope.cvcValid
    }
    init();
});