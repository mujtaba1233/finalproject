vulusionApp.controller(
  "CreateQuoteController",
  function (
    CommonService,
    PackagingService,
    PackagingBoxService,
    ProductService,
    CustomerService,
    LookupService,
    $timeout,
    EndUserService,
    $rootScope,
    ModalService,
    $scope,
    $http,
    $cookies
  ) {
    function init() {
      $scope.selected = {
          customer: {},
					endUser:{}
      };
      CommonService.authenticateUser().then(function (user) {
        $scope.taxExempt = false;
        $scope.quoteNo = "";
        $rootScope.logout = CommonService.logout;
        $scope.user = user;
        // console.log($scope.user)
        $scope.showCustomerName = true;
        $scope.showCustomerEmail = true;
        $scope.isNew = true;
        $scope.total = 0;
        $scope.quotes = {}
        $scope.invoiceRows = [];
        $scope.products = [];
        $scope.customers = [];
        $scope.product;
        $scope.customerData = new customerData();
        $scope.issueDate = new Date();
        $scope.modifiedOn = new Date();
        $scope.validTill = new Date();
        $scope.cutomerDisount = 0;
        $scope.validTill.setMonth($scope.validTill.getMonth() + 1);
        $scope.InsuranceValue = 0;
        $scope.shippingCost = 0;
        $scope.freight = 0;
        $scope.taxShipping = 0;
        $scope.notes = "";
        $scope.sameAsShipping = false;
        $scope.sameAsBilling = false;
        $scope.addCustomerBtn = false;
        $scope.shippingCompany = "ups";
        $scope.isCalculateShipping = false;
        $scope.updatePriceCheck = false;
        $scope.parcels = [];
        $scope.endUsers = []
        $scope.calculated = false;
        $scope.parcels.push({
          length: 0,
          width: 0,
          height: 0,
          weight: 0,
        });
        $scope.getCustomers();
        EndUserService.getEndUser().then(function (response) {
          CommonService.hideLoader();
          $scope.endUsers = response.data;
          // console.log($scope.endUsers,"getEndUsers")
        }, function errorCallback(response) {
          CommonService.hideLoader();
          CommonService.showError("Error while retrieving end users");
        });
        getShippingMethods();
        getPackagingBox();
        CommonService.showLoader();
        LookupService.getCountries().then(
          function (response) {
            CommonService.hideLoader();
            $scope.countries = response.data;
            // $scope.filteredCountries = $scope.countries.filter(country => {
            //     return country.code != 'CU' && country.code != 'IR' && country.code != 'KP'
            // })
          },
          function (error) {
            CommonService.hideLoader();
            CommonService.showError("Error while retrieving country names");
          }
        );
      });
    }
    
    $scope.saveCustomer = function () {
      CommonService.showLoader();
      let customer = {
        Active: 0,
        BillingAddress1: $scope.customer.ShippingAddress1,
        BillingAddress2: $scope.customer.ShippingAddress2,
        City: $scope.customer.ShippingCity,
        CompanyName: $scope.customer.ShippingCompany,
        Country: $scope.customer.ShippingCountry,
        CreatedAt: new Date(),
        CustomerDiscount: 0,
        EmailAddress: $scope.customer.CustomerEmail,
        FirstName: $scope.customer.CustomerFName,
        LastName: $scope.customer.CustomerLName,
        PhoneNumber: $scope.customer.ShippingPhoneNumber,
        PostalCode: $scope.customer.ShippingPostalCode,
        State: $scope.customer.ShippingState,
        hide: 0,
      };
      CustomerService.save(customer).then(
        function (response) {
          if (response.data.error) {
            CommonService.hideLoader();
            if (
              response.data.error.toString().indexOf("for key 'email'") !== -1
            ) {
              CommonService.showError("Email already exist");
            } else {
              CommonService.showError("Error while adding customer!");
            }
            console.log(response.data.error);
          } else {
            CommonService.hideLoader();
            if (response.data.status == 200) {
              CommonService.showSuccess("Success!");
              customer.CustomerID = response.data.data.insertId;
              // $scope.close({ 'new': true, data: customer });
              $scope.customers.unshift(customer);
              $scope.selected = {
                item: $scope.customers[0],
              };
              $timeout(function () {
                $scope.customerListner($scope.customers[0]);
              });
            } else if (response.data.status == 202) {
              CommonService.showError(response.data.message);
              $scope.customers.forEach((cust, index) => {
                console.log(cust.EmailAddress);
                if (cust.EmailAddress === customer.EmailAddress) {
                  $scope.selected = {
                    item: $scope.customers[index],
                  };
                  $timeout(function () {
                    $scope.customerListner($scope.customers[index]);
                  });
                }
              });
              // console.log('old customer',$scope.customer);
              // console.log('already exist',response);
              // $scope.close({ 'new': false, data: response.data.customer });
            } else {
              CommonService.showError("Unknown status!");
              console.log("unknown status code in success", response);
            }
          }
          // console.log(response);
        },
        function (response) {
          CommonService.hideLoader();
          CommonService.showError("Error while adding customer");
        }
      );
    };
    $scope.addCustomer = function (type) {
      let billingInfo = {};
      let customer = {};
      let shippingInfo = {};
      let endUser = {}
      if(type === "endUser"){
        try {
          endUser = $scope.endUsers.filter((elem) => {
            return elem.id == $scope.quotes.endUserId
          })
          console.log(endUser)
        } catch (error) {
          console.log(error)
        }
      }
      if (type === "customer") {
        if ($scope.customer && $scope.customer.BillingStreetAddress1) {
          customer = {
            Active: $scope.customer.Active,
            BillingAddress1: $scope.customer.BillingStreetAddress1,
            BillingAddress2: $scope.customer.BillingStreetAddress2,
            City: $scope.customer.BillingCity1,
            CompanyName: $scope.customer.CustomerCompany
              ? $scope.customer.CustomerCompany
              : $scope.customer.BillingCompany,
            Country: $scope.customer.BillingCountry1,
            CreatedAt: new Date(),
            CustomerDiscount: $scope.customer.Discount,
            EmailAddress: $scope.customer.CustomerEmail
              ? $scope.customer.CustomerEmail
              : $scope.EmailAddress,
            FirstName: $scope.customer.CustomerFName,
            LastName: $scope.customer.CustomerLName,
            PhoneNumber: $scope.customer.BillingPhoneNumber,
            PostalCode: $scope.customer.BillingPostalCode,
            State: $scope.customer.BillingState,
            hide: 0,
          };
        } else if ($scope.customer && $scope.customer.BillingAddress1) {
          customer = {
            Active: $scope.customer.Active,
            BillingAddress1: $scope.customer.BillingAddress1,
            BillingAddress2: $scope.customer.BillingAddress2,
            City: $scope.customer.City,
            CompanyName: $scope.customer.CompanyName,
            Country: $scope.customer.Country,
            CreatedAt: new Date(),
            CustomerDiscount: $scope.customer.CustomerDiscount,
            EmailAddress: $scope.customer.EmailAddress
              ? $scope.customer.EmailAddress
              : $scope.EmailAddress,
            FirstName: $scope.customer.FirstName,
            LastName: $scope.customer.LastName,
            PhoneNumber: $scope.customer.PhoneNumber,
            PostalCode: $scope.customer.PostalCode,
            State: $scope.customer.State,
            hide: 0,
          };
        } else {
          customer = {
            Active: 0,
            BillingAddress1: "",
            BillingAddress2: "",
            City: "",
            CompanyName: "",
            Country: "",
            CreatedAt: new Date(),
            CustomerDiscount: "",
            EmailAddress: "",
            FirstName: "",
            LastName: "",
            PhoneNumber: "",
            PostalCode: "",
            State: "",
            hide: 0,
          };
        }
      } else if (type === "billingAddress") {
        if ($scope.customerData && $scope.customerData.billingAddress) {
          billingInfo = {
            BillingAddress1: $scope.customerData.billingAddress.address1,
            BillingAddress2: $scope.customerData.billingAddress.address2,
            City: $scope.customerData.billingAddress.city,
            CompanyName: $scope.customerData.billingAddress.BillingCompany
              ? $scope.customerData.billingAddress.BillingCompany
              : '',
            Country: $scope.customerData.billingAddress.country,
            EmailAddress: $scope.customerData.billingAddress.EmailAddress
              ? $scope.customerData.billingAddress.EmailAddress
              : $scope.EmailAddress,
            FirstName: $scope.customerData.customerFName,
            LastName: $scope.customerData.customerLName,
            PhoneNumber: $scope.customerData.billingAddress.phoneNumber,
            PostalCode: $scope.customerData.billingAddress.postalCode,
            State: $scope.customerData.billingAddress.state,
          };
        } else {
          billingInfo = {
            BillingAddress1: "",
            BillingAddress2: "",
            City: "",
            CompanyName: "",
            Country: "",
            FirstName: "",
            LastName: "",
            PhoneNumber: "",
            PostalCode: "",
            State: "",
          };
        }
      } else if (type === "shippingAddress") {
        if ($scope.customerData && $scope.customerData.shippingAddress) {
          shippingInfo = {
            ShippingAddress1: $scope.customerData.shippingAddress.address1,
            ShippingAddress2: $scope.customerData.shippingAddress.address2,
            City: $scope.customerData.shippingAddress.city,
            CompanyName: $scope.customerData.shippingAddress.ShippingCompany
              ? $scope.customerData.shippingAddress.ShippingCompany
              : '',
            Country: $scope.customerData.shippingAddress.country,
            EmailAddress:$scope.customerData.shippingAddress.ShipEmailAddress?$scope.customerData.shippingAddress.ShipEmailAddress :($scope.customerData.shippingAddress.EmailAddress
              ? $scope.customerData.shippingAddress.EmailAddress
              : $scope.EmailAddress),
            FirstName: $scope.customerData.shippingAddress.ShipFirstName
            ? $scope.customerData.shippingAddress.ShipFirstName
            : $scope.customerData.customerFName,
            LastName: $scope.customerData.shippingAddress.ShipLastName
            ? $scope.customerData.shippingAddress.ShipLastName
            :$scope.customerData.customerLName,
            PhoneNumber: $scope.customerData.shippingAddress.phoneNumber,
            PostalCode: $scope.customerData.shippingAddress.postalCode,
            State: $scope.customerData.shippingAddress.state,
          };
          console.log(shippingInfo)
          // console.log(shippingAddress,"shippingAddress")
        } else {
          shippingInfo = {
            ShippingAddress1: "",
            ShippingAddress2: "",
            City: "",
            CompanyName: "",
            Country: "",
            FirstName: "",
            LastName: "",
            PhoneNumber: "",
            PostalCode: "",
            State: "",
          };
        }
      } else {
      }
      $(".modal-backdrop").show();
      console.log(type,"type")
      ModalService.showModal({
        templateUrl: type === "customer" || type === "endUser" ? "template/customer-form.ejs" : "template/addressInfo-form.ejs",
        controller: type === "customer" || type === "endUser" ? "CustomerController" : "AddressInfo",
        inputs: {
          customer:
            type === "customer" ? customer : ( type === "shippingAddress" ? shippingInfo : (type==="endUser" ? angular.copy(endUser[0]) : billingInfo)),
          type: type,
        },
      }).then(function (modal) {
        modal.element.modal({
          backdrop: "static",
          keyboard: false,
        });
        modal.close.then(function (response) {
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          if (response !== undefined) {
            if (type === "customer") {
              if (response.new == true) {
                $scope.customers.unshift(response.data);
                // $scope.selected = {
                //   item: $scope.customers[0],
                // };
              }
              $scope.customerListner(JSON.parse(JSON.stringify(response.data)));
            }else if(type === "endUser"){
              if (response.new == true) {
                $scope.endUsers.unshift(JSON.parse(JSON.stringify(response.data)));
              }else{
  
              }
              $scope.endUserListner(JSON.parse(JSON.stringify(response.data)))
            } else if (type === "billingAddress") {
              $scope.customerData.billingAddress.address1 =
                response.BillingAddress1;
              $scope.customerData.billingAddress.address2 =
                response.BillingAddress2;
              $scope.customerData.billingAddress.city = response.City;
              $scope.customerData.billingAddress.BillingCompany =
                response.CompanyName;
              $scope.customerData.billingAddress.country = response.Country;
              $scope.customerData.billingAddress.EmailAddress =
                response.EmailAddress;
              $scope.customerData.customerFName = response.FirstName;
              $scope.customerData.customerLName = response.LastName;
              $scope.customerData.billingAddress.phoneNumber =
                response.PhoneNumber;
              $scope.customerData.billingAddress.postalCode =
                response.PostalCode;
              $scope.customerData.billingAddress.state = response.State;
            } else if (type === "shippingAddress") {
              $scope.customerData.shippingAddress.address1 =
                response.ShippingAddress1;
              $scope.customerData.shippingAddress.address2 =
                response.ShippingAddress2;
              $scope.customerData.shippingAddress.city = response.City;
              $scope.customerData.shippingAddress.ShippingCompany =
                response.CompanyName;
              $scope.customerData.shippingAddress.country = response.Country;
              $scope.customerData.shippingAddress.ShipEmailAddress =
                response.EmailAddress;
              $scope.customerData.shippingAddress.ShipFirstName = response.FirstName;
              $scope.customerData.shippingAddress.ShipLastName= response.LastName;
              $scope.customerData.shippingAddress.phoneNumber =
                response.PhoneNumber;
              $scope.customerData.shippingAddress.postalCode =
                response.PostalCode;
              $scope.customerData.shippingAddress.state = response.State;
              $scope.getTaxRate();
              console.log( $scope.customerData.shippingAddress)
            }
          } else {
            console.log("modal closed only");
          }
        });
      });
    };

    $scope.getQuote = function () {
      CommonService.showLoader();
      $http({
        method: "GET",
        url: getQuote + "?quoteId=" + $scope.quoteNo,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
      }).then(
        async function successCallback(response) {
          CommonService.hideLoader();
          $scope.arrayOfNewProduct = [];
          let arrayOfDeletedProduct = [];
          if (response.data.data.length > 0 && $scope.customers.length > 0) {
            $scope.lineItems = angular.copy(
              response.data.data.sort((a, b) =>
                a.display_order > b.display_order ? 1 : -1
              )
            );
            if ($scope.lineItems.length > 0) {
              for (var j = 0; j < $scope.lineItems.length; j++) {
                for (var i = 0; i < $scope.products.length; i++) {
                  $scope.lineItems[j].ProductDescriptionShort =
                    $scope.lineItems[j].description;
                  if (
                    $scope.products[i].ProductCode.toLowerCase() ===
                    $scope.lineItems[j].ProductCode.toLowerCase()
                  ) {
                    if (!$scope.lineItems[j].isChild) {
                      var editAbleProduct = angular.copy($scope.products[i]);
                      if (
                        $scope.lineItems[j].Price !==
                          $scope.products[i].ProductPrice &&
                        $scope.lineItems[j].parentName != null &&
                        $scope.lineItems[j].parentName != undefined &&
                        $scope.lineItems[j].parentName
                      ) {
                        $scope.arrayOfNewProduct.push($scope.products[i]);
                      }
                      editAbleProduct.isTaxable =
                        $scope.lineItems[j].isTaxable == 1 ? true : false;
                      editAbleProduct.ProductDescriptionShort =
                        $scope.lineItems[j].description;
                      editAbleProduct.ProductPrice = $scope.lineItems[j].Price;
                      editAbleProduct.Qty = $scope.lineItems[j].Qty;
                      $scope.lineItems[j].Discount = $scope.lineItems[j]
                        .Discount
                        ? $scope.lineItems[j].Discount
                        : 0;
                      editAbleProduct.discount =
                        $scope.lineItems[j].isChild != 1
                          ? $scope.lineItems[j].Discount
                          : 0;
                      editAbleProduct.parent = $scope.lineItems[j].parent;
                      editAbleProduct.parentName =
                        $scope.lineItems[j].parentName;
                      editAbleProduct.isChild =
                        $scope.lineItems[j].isChild == 1 ? true : false;
                      // console.log(editAbleProduct)
                      $scope.addRow(editAbleProduct);
                      var length = angular.copy($scope.invoiceRows.length - 1);
                      $scope.invoiceRows[length].productListner(
                        editAbleProduct
                      );
                    }

                    $scope.updateTotals("qty", length);
                    i = $scope.products.length;
                  } else {
                    // console.log("Product Not Found. length: ", $scope.products.length);
                  }
                }
              }
              let editAbleProductArray = [];
              $scope.invoiceRows.forEach((element) => {
                editAbleProductArray.push(element.product);
              });
              if ($scope.arrayOfNewProduct.length > 0) {
                $scope.updatePriceCheck = true;
              }
              for (let i = 0; i < $scope.invoiceRows.length; i++) {
                for (let j = 0; j < $scope.lineItems.length; j++) {
                  if ($scope.lineItems[j].isChild) {
                    if (
                      $scope.lineItems[j].ProductCode ===
                      $scope.invoiceRows[i].product.ProductCode
                    ) {
                      $scope.invoiceRows[i].description =
                        $scope.lineItems[j].description;
                      $scope.invoiceRows[i].product.ProductDescriptionShort =
                        $scope.lineItems[j].description;
                    }
                  }
                }
              }
              var onlyInA = editAbleProductArray.filter(
                comparer($scope.lineItems)
              );
              var onlyInB = $scope.lineItems.filter(
                comparer(editAbleProductArray)
              );
              $scope.removedLineItems = onlyInA.concat(onlyInB);
              if ($scope.removedLineItems.length > 0) {
                $scope.removedLineItems.forEach((elem) => {
                  let errorString = "";
                  let lastString = "";
                  if (elem.parent) {
                    errorString +=
                      "Accessories of " + elem.parent + " has been updated";
                  } else errorString += elem.ProductCode + " is removed.";

                  CommonService.showError(errorString);
                });
              }
              console.log($scope.removedLineItems);
            } else {
              console.log("Something went wrong with quotes from db");
            }
            $scope.quotes = response.data.data[0];
            for (var i = 0; i < $scope.endUsers.length; i++) {
              if ($scope.endUsers[i].id === $scope.quotes.endUserId) {
                $scope.selected.endUser = $scope.endUsers[i];
                $scope.endUserListner($scope.endUsers[i])
                break;
              }
            }
            if ($scope.quotes.isApproved === 0) {
              $scope.issueDate = new Date();
              $scope.validTill = new Date(
                new Date().setMonth(new Date().getMonth() + 2)
              );
              console.log($scope.issueDate, $scope.validTill);
            } else {
              $scope.issueDate = new Date(
                $scope.quotes.IssueDate.replace(
                  /(\d{2})-(\d{2})-(\d{4})/,
                  "$2/$1/$3"
                )
              );
              $scope.validTill = new Date(
                $scope.quotes.ValidTill.replace(
                  /(\d{2})-(\d{2})-(\d{4})/,
                  "$2/$1/$3"
                )
              );
            }
            if ($scope.quotes.modifiedOn) {
              $scope.modifiedOn = moment($scope.quotes.modifiedOn).format(
                "YYYY/MM/DD, hh:mm:ss A"
              );
            }
            if ($scope.quotes.IssueDate) {
              $scope.createdAt = moment($scope.quotes.IssueDate).format(
                "YYYY/MM/DD, hh:mm:ss A"
              );
            } else {
              $scope.createdAt = moment($scope.quotes.createdOn).format(
                "YYYY/MM/DD, hh:mm:ss A"
              );
            }
            $scope.customerData.customerID = $scope.quotes.CustomerID;
            $scope.customerData.customerFName = $scope.quotes.CustomerFName;
            $scope.customerData.customerLName = $scope.quotes.CustomerLName;
            $scope.customerData.billingAddress.address1 =
              $scope.quotes.BillingStreetAddress1;
            $scope.customerData.billingAddress.address2 =
              $scope.quotes.BillingStreetAddress2;
            $scope.customerData.billingAddress.BillingCompany =
              $scope.quotes.BillingCompany;
            $scope.customerData.billingAddress.state =
              $scope.quotes.BillingState;
            $scope.customerData.billingAddress.postalCode =
              $scope.quotes.BillingPostalCode;
            $scope.customerData.billingAddress.phoneNumber =
              $scope.quotes.BillingPhoneNumber;
            $scope.customerData.billingAddress.city =
              $scope.quotes.BillingCity1;
            $scope.customerData.billingAddress.country =
              $scope.quotes.BillingCountry1;
            $scope.customerData.shippingAddress.comapny =
              $scope.customerData.CompanyName;
            $scope.customerData.shippingAddress.address1 =
              $scope.quotes.ShippingAddress1;
            $scope.customerData.shippingAddress.address2 =
              $scope.quotes.ShippingAddress2;
            $scope.customerData.shippingAddress.ShippingCompany =
              $scope.quotes.ShippingCompany;
            $scope.customerData.shippingAddress.ShipFirstName =
            $scope.quotes.ShipFirstName;
            $scope.customerData.shippingAddress.ShipLastName =
            $scope.quotes.ShipLastName;
            $scope.customerData.shippingAddress.ShipEmailAddress =
            $scope.quotes.ShipEmailAddress;
            $scope.customerData.shippingAddress.state =
              $scope.quotes.ShippingState;
            $scope.customerData.shippingAddress.postalCode =
              $scope.quotes.ShippingPostalCode;
            $scope.customerData.shippingAddress.phoneNumber =
              $scope.quotes.ShippingPhoneNumber;
            $scope.customerData.shippingAddress.city =
              $scope.quotes.ShippingCity;
            $scope.customerData.shippingAddress.country =
              $scope.quotes.ShippingCountry;
            $scope.customer = $scope.quotes;
            $scope.showCustomerEmail =
              $scope.quotes.IsCustomerEmailShow == 1 ? true : false;
            $scope.showCustomerName =
              $scope.quotes.IsCustomerNameShow == 1 ? true : false;
            $scope.taxExempt = $scope.quotes.TaxExempt == 1 ? true : false;
            $scope.notes = $scope.quotes.notes;
            $scope.PrivateNotes = $scope.quotes.PrivateNotes;
            $scope.taxShipping = $scope.quotes.TaxShipping;
            $scope.freight = $scope.quotes.Freight;
            $scope.InsuranceValue = $scope.quotes.InsuranceValue
              ? $scope.quotes.InsuranceValue
              : 0;
            $scope.shippingId = $scope.quotes.shippingMethodId;

            $scope.customers.forEach((elem) => {
              if (elem.CustomerID == $scope.quotes.CustomerID) {
                $scope.selected.item = elem; //customer dropdown selection
                $scope.customerData.customerDiscount = elem.CustomerDiscount;
                $scope.customerData.CompanyName =
                  $scope.selected.item.CompanyName;
                $scope.EmailAddress = elem.EmailAddress;
              }
            });
            if (
              !!$scope.lineItems[0].isExternal &&
              !!$scope.lineItems[0].isApproved
            ) {
              $scope.invoiceRows.map((elem) => {
                elem.discount = $scope.customerData.customerDiscount
                  ? $scope.customerData.customerDiscount
                  : 0;
              });
            }
            $scope.updateTotals();
          } else {
            console.log("Something went wrong with customer or line items.");
          }
          // console.log($scope.customerData);
        },
        function errorCallback(response) {
          console.log("Error while retrieving line items", response);
          // showError("Error while retrieving customers");
        }
      );
    };
    var product = function () {
      (this.name = ""), (this.ProductPrice = 0);
    };
    function comparer(otherArray) {
      return function (current) {
        return (
          otherArray.filter(function (other) {
            return other.ProductCode == current.ProductCode;
          }).length == 0
        );
      };
    }
    $scope.removeRow = function (index, productCode) {
      var temp = [];
      if (index >= 0 && productCode) {
        $scope.invoiceRows.splice(index, 1);
        for (var i = 0; $scope.invoiceRows.length > i; i++) {
          if ($scope.invoiceRows[i].product.parent == productCode) {
            // $scope.invoiceRows.splice(i,1)
          } else {
            temp.push($scope.invoiceRows[i]);
          }
        }
        if (temp.length == 0) temp.push(new InvoiceRow());
        $scope.invoiceRows = angular.copy(temp);
      } else {
        var parents = [];
        for (elem of $scope.invoiceRows) {
          if (!elem.isChild) {
            parents.push(elem);
          }
        }
        var final = [];
        parents.forEach(function (parent) {
          for (var j = 0; j < $scope.invoiceRows.length; j++) {
            if (
              $scope.invoiceRows[j].selectedProduct.parentName ==
                parent.selectedProduct.parentName ||
              $scope.invoiceRows[j].selectedProduct.parent ==
                parent.selectedProduct.parentName
            ) {
              final.push(j);
            } else {
              console.log("Not");
            }
          }
        });
        final = final.filter(function (item, pos, self) {
          return self.indexOf(item) == pos;
        });
        final.forEach(function (index) {
          temp.push($scope.invoiceRows[index]);
        });
        if (temp.length == 0) temp.push(new InvoiceRow());
        $scope.invoiceRows = angular.copy(temp);
      }
      $scope.updateTotals();
    };

    $scope.options = {
      language: "en",
      allowedContent: true,
      entities: false,
    };

    var InvoiceRow = function (prod, freeAccessory, qty, price) {
      // console.log($scope.customerData, "customerData")$scope.customerData.customerDiscount
      this.productIndex = -1;
      this.product = prod ? prod : new product();
      this.selectedProduct = prod;
      this.qty = prod ? prod.Qty : 1;
      this.desc = "";
      this.total = 0;
      this.weight = prod ? prod.ProductWeight : 0;
      // this.discount = prod ? prod.discount : 0;
      this.discount = prod ? prod.discount : 0;
      this.isTaxable = prod ? prod.isTaxable : true;
      this.isChild = prod ? prod.isChild : freeAccessory == null ? false : true;
      var classRef = this;
      // console.log(this)
      this.productListner = function (product, index) {
        if (product.IsActive === 0) {
          $scope.removeRow(index, product.ProductCode);
          $scope.addRow();
          CommonService.showError(
            "You cannot select this product as it is in-active"
          );
          return;
        }
        if (freeAccessory == null || index > -1) {
          var accessories = CommonService.parseFreeAccessories(
            product.FreeAccessories
          );
          // console.log('free accessory',accessories,product);
          var freeProducts = [];
          for (accessory of accessories) {
            for (var i = 0; i < $scope.products.length; i++) {
              if (
                accessory.code.toLowerCase() ==
                $scope.products[i].ProductCode.toLowerCase()
              ) {
                freeProducts.push(angular.copy($scope.products[i]));
                freeProducts[freeProducts.length - 1].parent = product.ProductCode;
                $scope.addRow( undefined, freeProducts[freeProducts.length - 1], accessory.qty, 0);
                break;
              }
            }
          }
          if ($scope.isNew) {
            product.parentName = product.ProductCode;
            $scope.invoiceRows[index].product = angular.copy(product);
            $scope.invoiceRows[index].discount = $scope.customerData
              ? $scope.customerData.customerDiscount
              : product.discount;
            $scope.invoiceRows[index].qty =
              parseInt(classRef.product.Qty) > 0
                ? parseInt(classRef.product.Qty)
                : 1;
            $scope.invoiceRows[index].weight =  parseInt(product.ProductWeight) > 0 ? parseInt(product.ProductWeight) : classRef.product.weight;
            $scope.invoiceRows[index].description = classRef.product
              .ProductDescriptionShort
              ? classRef.product.ProductDescriptionShort.replace(
                  /style="[^"]*"/g,
                  ""
                )
              : "";
            // $scope.invoiceRows[index].weight = classRef.product.ProductWeight || 0;
            // console.log($scope.invoiceRows[index], "sdsd")
            // console.log(classRef)
            // $scope.removeRow(index);
          }
          classRef.updateLineTotal();
        } else if (freeAccessory) {
          // console.log(product)
          freeAccessory.qty = qty;
          classRef.qty = freeAccessory.qty;
          freeAccessory.ProductPrice = 0;
          product = angular.copy(freeAccessory);
        }
        // $scope.invoiceRows[0].discount = prod ? prod.discount : 0;
        // console.log($scope.invoiceRows);
        classRef.product = angular.copy(product);
        classRef.selectedProduct = angular.copy(product);
        classRef.weight = product.ProductWeight?product.ProductWeight:0
        classRef.updateLineTotal();

        // cleanText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
        classRef.description = classRef.product.ProductDescriptionShort
          ? classRef.product.ProductDescriptionShort.replace(
              /style="[^"]*"/g,
              ""
            )
          : "";
      };
      this.updateLineTotal = function () {
        classRef.total = this.qty * this.product.ProductPrice;
        if (classRef.discount > 0) {
          let discount = ((classRef.discount / 100) * this.product.ProductPrice).toFixed(2);
          classRef.total = this.qty * parseFloat((this.product.ProductPrice - discount).toFixed(2));
        }
        $scope.updateSubTotal();
      };
      if (freeAccessory != null) this.productListner(freeAccessory);
      // console.log(this)
    };

    $scope.updateTotals = function (type, index = -1) {
      if (type == "qty" && index > -1) {
        var accessories = CommonService.parseFreeAccessories(
          $scope.invoiceRows[index].selectedProduct.FreeAccessories
        );
        if ($scope.invoiceRows[index].isChild == 0) {
          for (var i = 0; i < $scope.invoiceRows.length; i++) {
            if (
              $scope.invoiceRows[i].product.parent ==
              $scope.invoiceRows[index].product.ProductCode
            ) {
              accessories.map((elem) => {
                if (elem.code === $scope.invoiceRows[i].product.ProductCode) {
                  accessoryQty = elem.qty;
                  $scope.invoiceRows[i].qty =
                    accessoryQty * $scope.invoiceRows[index].qty;
                }
              });
            }
          }
          $scope.invoiceRows[index].weight =
            $scope.invoiceRows[index].product.ProductWeight *
            $scope.invoiceRows[index].qty; //weight update on qty change
        }
      }

      // if(type = 'qty' && index > -1){
      // 	if($scope.order.OrderDetails[index].isChild == 0){
      // 		for(var i = 0; i < $scope.order.OrderDetails.length; i++){
      // 			var list = $scope.order.OrderDetails[i].selectedProduct;
      // 			var single = $scope.order.OrderDetails[index].selectedProduct;
      // 			console.log(list,single);
      // 			if(list.parent == single.ProductCode){
      // 				$scope.order.OrderDetails[i].Quantity = $scope.order.OrderDetails[index].Quantity;
      // 			}
      // 		}
      // 	}
      // }

      $scope.invoiceRows.forEach(function (elem) {
        elem.total = elem.qty * elem.product.ProductPrice;
        if (elem.discount > 0) {
          let discount = ((elem.discount / 100) * elem.product.ProductPrice);
          elem.total = elem.qty * parseFloat((elem.product.ProductPrice - discount).toFixed(2));
          // var discount = (elem.discount / 100) * elem.total;
          // elem.total -= discount;
        }
      });
      $scope.updateSubTotal();
    };

    var customerData = function () {
      this.customerID = "";
      this.customerFName = "";
      this.customerLName = "";
      this.customerDiscount = "";
      this.billingAddress = {
        BillingCompany: "",
        address1: "",
        address2: "",
        city: "",
        country: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
      };

      this.shippingAddress = {
        ShippingCompany: "",
        ShipFirstName:"",
        ShipLastName:"",
        ShipEmailAddress:"",
        address1: "",
        address2: "",
        city: "",
        country: "",
        state: "",
        postalCode: "",
        phoneNumber: "",
      };
    };
    $scope.addRow = function (
      product = undefined,
      accessory = null,
      qty = 1,
      price = 0
    ) {
      $scope.invoiceRows.push(new InvoiceRow(product, accessory, qty, price));
    };

    $scope.updateSubTotal = function () {
      // console.log($scope.invoiceRows)
      var total = 0;
      var taxableTotal = 0;
      for (var i = 0; i < $scope.invoiceRows.length; i++) {
        total += $scope.invoiceRows[i].total;
      }
      for (var i = 0; i < $scope.invoiceRows.length; i++) {
        if ($scope.invoiceRows[i].isTaxable) {
          taxableTotal += $scope.invoiceRows[i].total;
        }
      }
      // $scope.taxableTotal = taxableTotal - ((taxableTotal / 100) * $scope.customerData.customerDiscount);
      $scope.taxableTotal = taxableTotal;
      $scope.total = total;
    };

    $scope.getProducts = function () {
      CommonService.showLoader();
      ProductService.getProducts().then(
        function (response) {
          if (window.location.search.indexOf("quote") != -1) {
            $scope.quoteNo = parseInt(window.location.search.split("=")[1]);
            $scope.isNew = false;
            $scope.getQuote();
          } else {
            $scope.isNew = true;
            $scope.invoiceRows = [new InvoiceRow()];
          }
          CommonService.hideLoader();
          for (var i = 0; i < response.data.length; i++) {
            $scope.products.push(response.data[i]);
          }
        },
        function (response) {
          CommonService.showError("Error while retrieving products");
        }
      );
    };
    $scope.getCustomers = function () {
      CommonService.showLoader();
      CustomerService.getCustomers().then(
        function (response) {
          $scope.getProducts();
          CommonService.hideLoader();
          $scope.customers = response.data;

          // $scope.customers.splice($scope.customers.findIndex(e => e.hide === "1"),1);
          // console.log($scope.customers , "filtered array");
        },
        function errorCallback(response) {
          CommonService.showError("Error while retrieving customers");
        }
      );
    };
    $scope.endUserListner = function (selectedCustomer,checks) {
      console.log(selectedCustomer)
      $scope.quotes.endUserId = selectedCustomer.id
      $scope.selected.endUser = selectedCustomer
    };
    $scope.customerListner = function (selectedCustomer) {
      console.log(selectedCustomer)
      
      $scope.customer = selectedCustomer;
      $scope.customerData.customerDiscount = selectedCustomer.CustomerDiscount;
      $scope.customerData.customerID = selectedCustomer.CustomerID;
      $scope.customerData.customerFName = selectedCustomer.FirstName;
      $scope.customerData.customerLName = selectedCustomer.LastName;

      $scope.customerData.billingAddress.BillingCompany =
        selectedCustomer.CompanyName;
      $scope.customerData.billingAddress.address1 =
        selectedCustomer.BillingAddress1;
      $scope.customerData.billingAddress.address2 =
        selectedCustomer.BillingAddress2;
      $scope.customerData.billingAddress.city = selectedCustomer.City;
      $scope.customerData.billingAddress.country = selectedCustomer.Country;
      $scope.customerData.billingAddress.postalCode =
        selectedCustomer.PostalCode;
      $scope.customerData.billingAddress.state = selectedCustomer.State;
      $scope.customerData.billingAddress.phoneNumber =
        selectedCustomer.PhoneNumber;
      $scope.EmailAddress = selectedCustomer.EmailAddress;
      $scope.addCustomerBtn = true;
      $scope.updateAddress();
      $scope.invoiceRows.map((elem) => {
        elem.discount = $scope.customerData.customerDiscount;
      });
      $scope.InsuranceValue =
        $scope.customerData.billingAddress.country &&
        $scope.customerData.billingAddress.country.toLowerCase() === "us"
          ? 0
          : $scope.quotes.InsuranceValue;

      $scope.updateTotals();
    };
    $scope.placeOrderOnVolusion = function () {
      CommonService.showLoader();
      var date = new Date();
      orderDate = date.toLocaleString("en-US");
      var OrderDetail = " ";
      $scope.invoiceRows.forEach((item) => {
        // OrderDetail = OrderDetail.toSring();
        OrderDetail =
          OrderDetail +
          "<OrderDetails>" +
          "<FreeShippingItem>" +
          item.product.FreeShippingItem +
          "</FreeShippingItem>" +
          "<OnOrder_Qty>" +
          item.qty +
          "</OnOrder_Qty>" +
          "<ProductCode>" +
          item.product.ProductCode.replace(/-/g, " ") +
          "</ProductCode>" +
          "<ProductNote></ProductNote>" +
          "<ProductPrice>" +
          item.product.ProductPrice +
          "</ProductPrice>" +
          "<ProductWeight>" +
          item.product.ProductWeight +
          "</ProductWeight>" +
          "<QtyOnPackingSlip>" +
          item.qty +
          "</QtyOnPackingSlip>" +
          "<QtyShipped>0</QtyShipped>" +
          "<Quantity>" +
          item.qty +
          "</Quantity>" +
          "<ShipDate>" +
          orderDate +
          "</ShipDate>" +
          "<TaxableProduct>" +
          item.product.TaxableProduct +
          "</TaxableProduct>" +
          "<TotalPrice>" +
          item.total +
          "</TotalPrice>" +
          // "<OptionIDs/>"+
          // "<Options/>"+
          // "<ProductID>37510</ProductID>"+
          // "<ProductName>"+item.product.ProductName+"</ProductName>"+
          // "<QtyOnBackOrder>0</QtyOnBackOrder>"+
          // "<QtyOnHold>0</QtyOnHold>"+
          // "<GiftTrakNumber>0</GiftTrakNumber>"+
          // "<GiftWrap></GiftWrap>"+
          // "<GiftWrapCost>0.0000</GiftWrapCost>"+
          // "<GiftWrapNote></GiftWrapNote>"+
          // "<IsKitID></IsKitID>"+
          // "<KitID></KitID>"+
          // "<Locked>Y</Locked>"+
          // "<AutoDropShip/>"+
          // "<Warehouses></Warehouses>"+
          "</OrderDetails>";
      });
      $http({
        method: "POST",
        url: placeOrderVolusionUrl,
        header: {
          "Content-Type": "application/xml; charset=utf-8",
        },
        data: {
          data:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            "<Volusion_API>" +
            "<Orders>" +
            "<BillingAddress1>" +
            $scope.customerData.billingAddress.address1 +
            "</BillingAddress1>" +
            "<BillingAddress2>" +
            $scope.customerData.billingAddress.address2 +
            "</BillingAddress2>" +
            "<BillingCity>" +
            $scope.customerData.billingAddress.city +
            "</BillingCity>" +
            "<BillingCompanyName>" +
            $scope.customerData.billingAddress.BillingCompany +
            "</BillingCompanyName>" +
            "<BillingCountry>" +
            $scope.customerData.billingAddress.country +
            "</BillingCountry>" +
            "<BillingFaxNumber></BillingFaxNumber>" +
            "<BillingFirstName>" +
            $scope.customerData.customerFName +
            "</BillingFirstName>" +
            "<BillingLastName>" +
            $scope.customerData.customerLName +
            "</BillingLastName>" +
            "<BillingPhoneNumber></BillingPhoneNumber>" +
            "<BillingPostalCode>" +
            $scope.customerData.billingAddress.postalCode +
            "</BillingPostalCode>" +
            "<BillingState>" +
            $scope.customerData.billingAddress.state +
            "</BillingState>" +
            "<Customer_IPAddress>" +
            $scope.currentIP +
            "</Customer_IPAddress>" +
            "<CustomerID>" +
            $scope.customerData.customerID +
            "</CustomerID>" +
            "<IsAGift>N</IsAGift>" +
            "<IsGTSOrder>False</IsGTSOrder>" +
            "<LastModBy>4711</LastModBy>" +
            "<LastModified>" +
            orderDate +
            "</LastModified>" +
            "<Order_Comments>...</Order_Comments>" +
            "<OrderDate>" +
            orderDate +
            "</OrderDate>" +
            "<OrderNotes/>" +
            "<OrderStatus>New</OrderStatus>" +
            "<PaymentAmount>" +
            ($scope.total +
              $scope.freight +
              ($scope.taxShipping / 100) * $scope.taxableTotal) +
            "</PaymentAmount>" +
            "<PaymentMethodID>5</PaymentMethodID>" +
            "<Printed>N</Printed>" +
            "<Processed_AutoEvents>N</Processed_AutoEvents>" +
            "<SalesRep_CustomerID>4711</SalesRep_CustomerID>" +
            "<SalesTax1>" +
            ($scope.taxShipping / 100) * $scope.taxableTotal +
            "</SalesTax1>" +
            "<SalesTax2>0.0000</SalesTax2>" +
            "<SalesTax3>0.0000</SalesTax3>" +
            "<SalesTaxRate>0</SalesTaxRate>" +
            "<SalesTaxRate1>" +
            $scope.taxShipping +
            "</SalesTaxRate1>" +
            "<SalesTaxRate2>0</SalesTaxRate2>" +
            "<SalesTaxRate3>0</SalesTaxRate3>" +
            "<ShipAddress1>" +
            $scope.customerData.shippingAddress.address1 +
            "</ShipAddress1>" +
            "<ShipAddress2>" +
            $scope.customerData.billingAddress.address2 +
            "</ShipAddress2>" +
            "<ShipCity>" +
            $scope.customerData.shippingAddress.city +
            "</ShipCity>" +
            "<ShipCompanyName>" +
            $scope.customerData.shippingAddress.ShippingCompany +
            "</ShipCompanyName>" +
            "<ShipCountry>" +
            $scope.customerData.shippingAddress.country +
            "</ShipCountry>" +
            "<ShipFaxNumber/>" +
            "<ShipFirstName>" +
            $scope.customerData.customerFName +
            "</ShipFirstName>" +
            "<ShipLastName>" +
            $scope.customerData.customerLName +
            "</ShipLastName>" +
            "<Shipped>N</Shipped>" +
            "<ShippingMethodID>1000</ShippingMethodID>" +
            "<ShipPostalCode>" +
            $scope.customerData.shippingAddress.postalCode +
            "</ShipPostalCode>" +
            "<ShipResidential>N</ShipResidential>" +
            "<ShipState>" +
            $scope.customerData.shippingAddress.state +
            "</ShipState>" +
            "<Stock_Priority>3</Stock_Priority>" +
            "<Tax1_IgnoreNoTaxRules>N</Tax1_IgnoreNoTaxRules>" +
            "<Tax1_Title>Tax (" +
            $scope.taxShipping +
            "%)</Tax1_Title>" +
            "<Tax2_IgnoreNoTaxRules>N</Tax2_IgnoreNoTaxRules>" +
            "<Tax2_IncludePrevious>0</Tax2_IncludePrevious>" +
            "<Tax2_Title></Tax2_Title>" +
            "<Tax3_IgnoreNoTaxRules>N</Tax3_IgnoreNoTaxRules>" +
            "<Tax3_IncludePrevious>0</Tax3_IncludePrevious>" +
            "<Tax3_Title></Tax3_Title>" +
            "<Affiliate_Commissionable_Value>" +
            $scope.total +
            "</Affiliate_Commissionable_Value>" +
            "<Total_Payment_Authorized>" +
            ($scope.total +
              $scope.freight +
              ($scope.taxShipping / 100) * $scope.taxableTotal) +
            "</Total_Payment_Authorized>" +
            "<Total_Payment_Received>0</Total_Payment_Received>" +
            "<TotalShippingCost>" +
            $scope.freight +
            "</TotalShippingCost>" +
            "<InsauranceValue>" +
            $scope.InsuranceValue +
            "</InsauranceValue>" +
            "<Order_Entry_System>ONLINE</Order_Entry_System>" +
            "<VendorID>0</VendorID>" +
            OrderDetail +
            "</Orders>" +
            // "<PCIaaS_CardId>7f4ad67cc60045cb80fd74422cb41847</PCIaaS_CardId>"+
            // "<PCIaaS_MaskedCardRef>************7489</PCIaaS_MaskedCardRef>"+
            // "<PONum/>"+
            // "<ShipDate>12/4/2014 12:20:00 PM</ShipDate>"+
            // "<ShipPhoneNumber>810-225-4300</ShipPhoneNumber>"+
            // "<Shipping_Locked>Y</Shipping_Locked>"+
            // "<sOrderID>24145</sOrderID>"+
            // "<Locked>Y</Locked>"+
            // "<OrderDateUtc>12/4/2014 4:52:13 PM</OrderDateUtc>"+
            // "<CVV2_Response/>"+
            // "<GiftWrapNote/>"+
            // "<InitiallyShippedDate>12/4/2014 12:20:00 PM</InitiallyShippedDate>"+
            // "<CardHoldersName>77F92DFFF7FC19C645278B3B2959319E3F855819D86208552AF818E0EEFE61F7</CardHoldersName>"+
            // "<CC_Last4>7489</CC_Last4>"+
            // "<CreditCardAuthorizationDate>12/4/2014 11:54:00 AM</CreditCardAuthorizationDate>"+
            // "<CreditCardAuthorizationNumber>757708</CreditCardAuthorizationNumber>"+
            // "<CreditCardTransactionID>6725598829</CreditCardTransactionID>"+
            // "<AddressValidated>Y</AddressValidated>"+
            // "<AuthHash>bab57f0924537e661106e0e86e5c4eea</AuthHash>"+
            // "<AVS>P</AVS>"+
            "</Volusion_API>",
        },
      }).then(
        function successCallback(response) {
          CommonService.hideLoader();
          // hideLoader();
          if (
            response.data.ReturnResult &&
            response.data.ReturnResult.Success == "False"
          ) {
            console.log("Error while ordering", response);
            showError(response.Message);
          } else if (
            response.data.Volusion_API &&
            response.data.Volusion_API.Orders &&
            response.data.Volusion_API.Orders.Success == "True"
          ) {
            // console.log('success - order id:', response.data.Volusion_API.Orders.OrderID);
            CommonService.showSuccess("Order has been placed.");
          } else {
            console.log("Something went Wrong!", response);
            CommonService.showError("Something went Wrong, Try again!");
          }
        },
        function errorCallback(response) {
          // console.log(response);
          CommonService.hideLoader();
          CommonService.showError(
            "Error while placing order, Check you internet connection!"
          );
        }
      );
    };
    $scope.placeOrderOnBlueSky = function () {
      if( $scope.customerData.billingAddress.country === "RU"||	 $scope.customerData.billingAddress.country === 'BY'|| $scope.customerData.billingAddress.country ==="KZ"|| $scope.customerData.billingAddress.country ==="AM"|| $scope.customerData.billingAddress.country ==="KG"){
        CommonService.showError('Order is for ' +  $scope.customerData.billingAddress.country + ' close');
        return
      }else if($scope.customerData.billingAddress.country === "RU"||	 $scope.customerData.billingAddress.country === 'BY'|| $scope.customerData.billingAddress.country ==="KZ"|| $scope.customerData.billingAddress.country ==="AM"|| $scope.customerData.billingAddress.country ==="KG"){
        CommonService.showError('Order is for ' +  $scope.customerData.billingAddress.country + ' close');
        return
      }
      // console.log('Rows', $scope.invoiceRows);
      CommonService.showLoader();
      var date = new Date();
      orderDate = date.toLocaleString("en-US");
      var OrderDetails = [];
      $scope.invoiceRows.forEach((item) => {
        OrderDetail = {
          FreeShippingItem: item.product.FreeShippingItem,
          OnOrder_Qty: item.qty,
          ProductWeight: item.product.ProductWeight,
          QtyOnPackingSlip: item.qty,
          QtyShipped: item.qty,
          ShipDate: orderDate,
          TaxableProduct: item.product.TaxableProduct,
          TotalPrice: item.total,
          ProductCode: item.product.ProductCode,
          Quantity: item.qty,
          ProductName: item.product.ProductName,
          ProductPrice: parseFloat(item.product.ProductPrice),
          DiscountValue: item.discount,
          Discription: item.description,
        };
        OrderDetails.push(OrderDetail);
      });
      console.log("Order detail", $scope.notes);
      $http({
        method: "POST",
        url: placeOrderBlueSkyUrl,
        header: {
          "Content-Type": "application/xml; charset=utf-8",
        },
        data: {
          BillingAddress1: $scope.customerData.billingAddress.address1,
          BillingAddress2: $scope.customerData.billingAddress.address2,
          BillingCity: $scope.customerData.billingAddress.city,
          BillingCompanyName: $scope.customerData.billingAddress.BillingCompany,
          BillingCountry: $scope.customerData.billingAddress.country,
          BillingFirstName: $scope.customerData.customerFName,
          BillingLastName: $scope.customerData.customerLName,
          BillingPostalCode: $scope.customerData.billingAddress.postalCode,
          BillingState: $scope.customerData.billingAddress.state,
          BillingPhoneNumber: $scope.customerData.billingAddress.phoneNumber,
          Customer_IPAddress: $scope.currentIP,
          CustomerID: $scope.customerData.customerID,
          IsAGift: "N",
          IsGTSOrder: false,
          LastModBy: 4711, //Colt developer
          LastModified: orderDate,
          Order_Comments: $scope.notes,
          OrderDate: orderDate,
          OrderStatus: "New",
          PaymentAmount:
            $scope.total +
            $scope.freight +
            ($scope.taxShipping / 100) * $scope.taxableTotal,
          PaymentMethodID: 5,
          Printed: "N",
          SalesRep_CustomerID: 4711, //Colt developer
          SalesTax1: ($scope.taxShipping / 100) * $scope.taxableTotal,
          SalesTaxRate1: $scope.taxShipping,
          ShipAddress1: $scope.customerData.shippingAddress.address1,
          ShipAddress2: $scope.customerData.billingAddress.address2,
          ShipCity: $scope.customerData.shippingAddress.city,
          ShipCompanyName: $scope.customerData.shippingAddress.ShippingCompany,
          ShipCountry: $scope.customerData.shippingAddress.country,
          ShipFirstName:  $scope.customerData.shippingAddress.ShipFirstName,
          ShipLastName:  $scope.customerData.shippingAddress.ShipLastName,
          ShipEmailAddress:  $scope.customerData.shippingAddress.ShipEmailAddress,
          ShippingPhoneNumber: $scope.customerData.shippingAddress.ShippingPhoneNumber,
          Shipped: "Y",
          ShippingMethodID: 1000,
          ShipPostalCode: $scope.customerData.shippingAddress.postalCode,
          ShipResidential: "N",
          ShipState: $scope.customerData.shippingAddress.state,
          Stock_Priority: 3,
          Tax1_Title: "Tax (" + $scope.taxShipping + "%)",
          Affiliate_Commissionable_Value: $scope.total,
          Total_Payment_Authorized:
            $scope.total +
            $scope.freight +
            ($scope.taxShipping / 100) * $scope.taxableTotal,
          Total_Payment_Received:
            $scope.total +
            $scope.freight +
            ($scope.taxShipping / 100) * $scope.taxableTotal,
          TotalShippingCost: $scope.freight ? $scope.freight : 0,
          Insurance: $scope.InsuranceValue ? $scope.InsuranceValue : 0,
          Order_Entry_System: "BlueSky",
          UserId: $scope.currentUser.id,
          QuoteNo: quoteNo,
          OrderDetails: OrderDetails,
        },
      }).then(
        function successCallback(response) {
          CommonService.hideLoader();
          // console.log("Res", response);
          if (response.data.status && response.data.error === undefined) {
            CommonService.showSuccess("Order has been placed.");
            $scope.quotes.isOrdered = 1;
            if (response.data.data.id != undefined) {
              orderId = response.data.data.id;
              var d = new Date();
              var pdfname =
                d.getFullYear() +
                ("0" + (d.getMonth() + 1)).slice(-2) +
                ("0" + d.getDate()).slice(-2) +
                "_" +
                ("00000" + orderId.toString()).slice(-6);
              // showLoader();
              // window.location = "GeneratePDF/" + pdfname +'.pdf';
              window.open(
                location.origin + "/genrate-order-pdf/" + pdfname + ".pdf",
                "_blank" // <- This is what makes it open in a new window.
              );
            }
          } else {
            console.log("Something went Wrong!", response);
            CommonService.showError("Something went Wrong, Try again!");
          }
        },
        function errorCallback(response) {
          console.log(response);
          CommonService.hideLoader();
          CommonService.showError(
            "Error while placing order, Check you internet connection!"
          );
        }
      );
    };

    $scope.checkPrice = async function () {
      let res;
      try {
        if ($scope.updatePriceCheck) res = await $scope.checkPriceModal();
        else res = await $scope.saveQuote();

        return res;
      } catch (error) {
        console.log(error);
      }
    };

    $scope.saveQuote = function () {
      if( $scope.customerData.billingAddress.country === "RU" || 	 $scope.customerData.billingAddress.country === 'BY' ||  $scope.customerData.billingAddress.country ==="KZ" ||  $scope.customerData.billingAddress.country ==="AM" ||  $scope.customerData.billingAddress.country ==="KG"){
        CommonService.showError('Quote is for ' +  $scope.customerData.billingAddress.country + ' close');
        return
      }else if( $scope.customerData.shippingAddress.country === "RU" || 	 $scope.customerData.shippingAddress.country === 'BY' ||  $scope.customerData.shippingAddress.country ==="KZ" ||  $scope.customerData.shippingAddress.country ==="AM" ||  $scope.customerData.shippingAddress.country ==="KG"){
        CommonService.showError('Quote is for ' +  $scope.customerData.shippingAddress.country + ' close');
        return
      }
      var quoteLines = [];
      let validPrice = true;
      for (var i = 0; i < $scope.invoiceRows.length; i++) {
        if ($scope.invoiceRows[i].product.ProductName != undefined)
          quoteLines.push({
            Qty: $scope.invoiceRows[i].qty,
            ProductName: $scope.invoiceRows[i].product.ProductName.replace(
              /'/g,
              "\\'"
            ).replace(/"/g, '\\"'),
            description: $scope.invoiceRows[i].description,
            ProductCode: $scope.invoiceRows[i].product.ProductCode,
            isChild: $scope.invoiceRows[i].isChild,
            Price: parseFloat($scope.invoiceRows[i].product.ProductPrice),
            Discount: $scope.invoiceRows[i].discount,
            isTaxable: $scope.invoiceRows[i].isChild
              ? 0
              : $scope.invoiceRows[i].isTaxable,
            parent: $scope.invoiceRows[i].product.parent
              ? $scope.invoiceRows[i].product.parent
              : "",
            parentName: $scope.invoiceRows[i].product.parentName
              ? $scope.invoiceRows[i].product.parentName
              : "",
          });
      }
      quoteLines.forEach((elem) => {
        // console.log(elem.Price);

        if (
          (isNaN(elem.Price) || !elem.Price < 0) &&
          elem.parentName !== null &&
          elem.parentName !== "undefined" &&
          elem.parentName
        ) {
          validPrice = false;
        }
      });

      if (!validPrice) {
        CommonService.showError("One or more product price is not valid!");
        return;
      }
      if (!$scope.customerData.billingAddress.country) {
        CommonService.showError("Please select a Billing Country!");
        return;
      }
      if (!$scope.customerData.shippingAddress.country) {
        CommonService.showError("Please select a Shipping Country!");
        return;
      }
      if (
        $scope.customerData.customerID === undefined ||
        $scope.customerData.customerID === null
      ) {
        CommonService.showError("Please select a customer!");
        return;
      }
      // if ($scope.total < $scope.InsuranceValue) {
      // 	CommonService.hideLoader();
      // 	CommonService.showError('Insurance value can not more then sub total amount of quote!');
      // 	return;
      // }
      // if ($scope.InsuranceValue <= 300) {
      // 	$scope.InsuranceValue = 3.15;
      // }
      if (quoteLines.length <= 0) {
        CommonService.showError("Please select a product!");
        return;
      }
      if ($scope.modifiedOn) {
        $scope.modifiedOn = new Date();
      }
      let fullQuote = {
        Quote: {
          QuoteNo: $scope.quoteNo,
          isApproved: 1,
          CustomerID: $scope.customerData.customerID,
          CustomerFName: $scope.customerData.customerFName,
          CustomerCompany: $scope.customerData.CompanyName,
          CustomerLName: $scope.customerData.customerLName,
          BillingStreetAddress1: $scope.customerData.billingAddress.address1,
          BillingStreetAddress2: $scope.customerData.billingAddress.address2,
          BillingCompany: $scope.customerData.billingAddress.BillingCompany,
          BillingCity1: $scope.customerData.billingAddress.city,
          BillingCountry1: $scope.customerData.billingAddress.country,
          BillingPhoneNumber: $scope.customerData.billingAddress.phoneNumber,
          SelectedCustomerDiscount: $scope.customerData.customerDiscount,
          ValidTill: $scope.validTill,
          // 'IssueDate': moment($scope.issueDate).format("YYYY/MM/DD, hh:mm:ss A"),
          IssueDate: $scope.issueDate,
          modifiedOn: $scope.isNew ? null : $scope.modifiedOn,
          BillingState: $scope.customerData.billingAddress.state,
          BillingPostalCode: $scope.customerData.billingAddress.postalCode,
          ShippingAddress1: $scope.customerData.shippingAddress.address1,
          ShippingAddress2: $scope.customerData.shippingAddress.address2,
          ShippingCompany: $scope.customerData.shippingAddress.ShippingCompany,
          ShipFirstName: $scope.customerData.shippingAddress.ShipFirstName,
          ShipLastName: $scope.customerData.shippingAddress.ShipLastName,
          ShipEmailAddress: $scope.customerData.shippingAddress.ShipEmailAddress,
          ShippingPhoneNumber: $scope.customerData.shippingAddress.phoneNumber,
          ShippingCity: $scope.customerData.shippingAddress.city,
          ShippingCountry: $scope.customerData.shippingAddress.country,
          ShippingState: $scope.customerData.shippingAddress.state,
          ShippingPostalCode: $scope.customerData.shippingAddress.postalCode,
          IsCustomerEmailShow: $scope.showCustomerEmail,
          IsCustomerNameShow: $scope.showCustomerName,
          InsuranceValue: $scope.InsuranceValue,
          Freight: $scope.freight,
          endUserId : $scope.quotes.endUserId,
          shippingMethodId: parseInt($scope.shippingId) || 0,
          TaxShipping: $scope.taxShipping,
          TaxExempt: $scope.taxExempt,
          notes: $scope.notes,
          PrivateNotes: $scope.PrivateNotes,
          createdBy: $scope.isNew
            ? $scope.user.id
            : $scope.quotes.isApproved === 0
            ? $scope.user.id
            : $scope.quotes.createdBy,
          modBy: $scope.isNew ? null : $scope.user.id,
        },
        QuoteLines: quoteLines,
      };
      console.log(fullQuote);
      // return
      CommonService.showLoader();
      $http({
        method: "POST",
        url: $scope.isNew ? saveQuoteUrl : updateQuoteUrl,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        data: fullQuote,
      }).then(
        function successCallback(response) {
          CommonService.hideLoader();

          if (response.data.status == "norows")
            CommonService.showError("No products selected!");
          else if (response.data.status == "ok") {
            quoteId = response.data.quoteNo;
            if (quoteId != undefined) {
              $scope.quoteNo = quoteId;
              $scope.isNew = false;
              var d = new Date();
              // var pdfname =
              //   d.getFullYear() +
              //   ("0" + (d.getMonth() + 1)).slice(-2) +
              //   ("0" + d.getDate()).slice(-2) +
              //   "_" +
              //   ("00000" + quoteId.toString()).slice(-6);
              var pdfname = $scope.customerData.billingAddress.BillingCompany.replace('-','_') + '-' +
                ("00000" + quoteId.toString()).slice(-6) + '-' + $scope.customerData.customerFName + '-' + $scope.customerData.customerLName + '-' + d.getFullYear() +("0" + (d.getMonth() + 1)).slice(-2) +("0" + d.getDate()).slice(-2);
              // CommonService.showLoader();
              window.open(
                location.origin + "/GeneratePDF/" + pdfname + ".pdf",
                "_blank" // <- This is what makes it open in a new window.
              );
              // window.location = window.location.href + "GeneratePDF/" + pdfname + '.pdf';
            }
            redirectQuote(response);
          } else if (response.data.status == "error")
            CommonService.showError("Error while saving quote");
        },
        function errorCallback(response) {
          CommonService.hideLoader();
          CommonService.showError("Error while saving quote");
        }
      );
    };
    var redirectQuote = function (response) {
      CommonService.showSuccess("Quote has been created.");
      $scope.mode = "Update";
      $scope.isNew = false;
      quoteId = response.data.quoteNo;
      window.location = "/edit?quote=" + quoteId;
    };

    $scope.toggleSameAsShipping = function () {
      if ($scope.sameAsShipping) {
        $scope.sameAsBilling = false;
        $scope.updateAddress();
      }
    };

    $scope.toggleSameAsBilling = function () {
      if ($scope.sameAsBilling) {
        $scope.sameAsShipping = false;
        $scope.updateAddress();
        $scope.getTaxRate();
      }
    };
    $scope.shipAddressChange = function () {
      $scope.getTaxRate();
    };
    zipFormat = function (event) {
      var entry = event.key;
      // console.log(event)
      var format = /^\w+([\s-_]\w+)*$/;
      if (!entry.match(format) && event.keyCode != 45 && event.keyCode != 32) {
        event.preventDefault();
      }
    };

    myFunction = function (event) {
      var x = event.keyCode;
      if (!(x >= 48 && x <= 57)) {
        event.preventDefault();
      }
    };
    PhoneFormat = function (event) {
      var x = event.keyCode;
      // console.log(x)
      if (!(x >= 48 && x <= 57)) {
        if (
          x != 43 &&
          x != 120 &&
          x != 88 &&
          x != 32 &&
          x != 46 &&
          x != 45 &&
          x != 43 &&
          x != 40 &&
          x != 41
        ) {
          event.preventDefault();
        }
      }
    };
    $scope.stickToPhoneFormatOnCopy = function () {
      var x = $scope.customerData.billingAddress.phoneNumber;
      $scope.customerData.billingAddress.phoneNumber = "";
      x = x.split("");
      x.forEach((number) => {
        var z = number.charCodeAt();
        if (!(z >= 48 && z <= 57)) {
          if (
            z != 43 &&
            z != 120 &&
            z != 88 &&
            z != 32 &&
            z != 46 &&
            z != 45 &&
            z != 43 &&
            z != 40 &&
            z != 41
          ) {
            // event.preventDefault();
          } else {
            $scope.customerData.billingAddress.phoneNumber =
              $scope.customerData.billingAddress.phoneNumber + number;
          }
        } else {
          $scope.customerData.billingAddress.phoneNumber =
            $scope.customerData.billingAddress.phoneNumber + number;
        }
      });
    };
    $scope.stickToPhoneFormatOnCopyShipping = function () {
      var x = $scope.customerData.shippingAddress.phoneNumber;
      $scope.customerData.shippingAddress.phoneNumber = "";
      x = x.split("");
      x.forEach((number) => {
        var z = number.charCodeAt();
        if (!(z >= 48 && z <= 57)) {
          if (
            z != 43 &&
            z != 120 &&
            z != 88 &&
            z != 32 &&
            z != 46 &&
            z != 45 &&
            z != 43 &&
            z != 40 &&
            z != 41
          ) {
            // event.preventDefault();
          } else {
            $scope.customerData.shippingAddress.phoneNumber =
              $scope.customerData.shippingAddress.phoneNumber + number;
          }
        } else {
          $scope.customerData.shippingAddress.phoneNumber =
            $scope.customerData.shippingAddress.phoneNumber + number;
        }
      });
    };
    $scope.updateAddress = function () {
      if ($scope.sameAsShipping) {
        $scope.customerData.billingAddress = angular.copy(
          $scope.customerData.shippingAddress
        );
        $scope.EmailAddress = angular.copy($scope.customerData.shippingAddress.ShipEmailAddress)
      } else if ($scope.sameAsBilling) {
        $scope.customerData.shippingAddress = angular.copy(
          $scope.customerData.billingAddress
        );
        $scope.customerData.shippingAddress.ShippingCompany = angular.copy(
          $scope.customerData.billingAddress.BillingCompany
        );
        $scope.customerData.shippingAddress.ShipFirstName = angular.copy(
          $scope.customerData.customerFName 
        );
        $scope.customerData.shippingAddress.ShipLastName = angular.copy($scope.customerData.customerLName
        );
        $scope.customerData.shippingAddress.ShipEmailAddress = angular.copy($scope.EmailAddress
          );
        $scope.customerData.shippingAddress.country = angular.copy(
          $scope.customerData.billingAddress.country
        );
      }
    };
    $scope.calculateTaxExempt = function () {
      if ($scope.taxExempt) {
        $scope.taxShipping = parseFloat($scope.taxShipping) - 3.9375;
      }
      if (!$scope.taxExempt && parseFloat($scope.taxShipping) != 0) {
        $scope.taxShipping = parseFloat($scope.taxShipping) + 3.9375;
      }
      if (parseFloat($scope.taxShipping) < 0) {
        $scope.taxShipping = 0;
        CommonService.showError("Tax Value Too Short!");
        $scope.taxExempt = false;
      }
    };
    $scope.getTaxRate = function () {
      console.log($scope.customerData.shippingAddress.state);
      if (
        $scope.customerData.customerID === undefined ||
        $scope.customerData.customerID === null
      ) {
        CommonService.showError("Please select a customer!");
        return;
      }
      if (!$scope.customerData.shippingAddress.country) {
        CommonService.showError("Please select a Shipping Country!");
        return;
      }
      if (!$scope.customerData.shippingAddress.state) {
        CommonService.showError("Please input a Shipping State!");
        return;
      }
      if (!$scope.customerData.shippingAddress.postalCode) {
        CommonService.showError("Please input a Shipping Postal Code!");
        return;
      }
      if (!$scope.customerData.shippingAddress.address1) {
        CommonService.showError("Please input a Shipping Address 1!");
        return;
      }
      // if(!$scope.isNew)
      // if ($scope.invoiceRows[0].product.ProductName === undefined) {
      // 	CommonService.showError('Please select a product!');
      // 	return;
      // }

      if ($scope.customerData.shippingAddress.country) {
        var country = $scope.customerData.shippingAddress.country.toLowerCase();
        if (country === "us" || country === "united states") {
          country = "US";
        } else if (country === "au" || country === "Australia") {
          country = "AU";
        }
        // if($scope.customerData.shippingAddress.state != 'CA' || $scope.customerData.shippingAddress.state != 'MI'){
        // 	$scope.taxShipping = 0;
        // 	return;
        // }
        if (
          ($scope.customerData.shippingAddress.state === "CA" ||
            $scope.customerData.shippingAddress.state.toLowerCase() ===
              "california") &&
          country === "US"
        ) {
          // var data = {
          // 	ShipPostalCode: $scope.customerData.shippingAddress.postalCode,
          // 	ShipCountry: country,
          // 	ShipAddress: $scope.customerData.shippingAddress.address1,
          // 	ShipCity: $scope.customerData.shippingAddress.city
          // }
          //For CDTFA Tax Rate API
          var data = {
            ShipPostalCode: $scope.customerData.shippingAddress.postalCode,
            ShipAddress: $scope.customerData.shippingAddress.address1,
            ShipCity: $scope.customerData.shippingAddress.city,
          };
          CommonService.showLoader();
          CommonService.getUsTax(data).then(function (response) {
            CommonService.hideLoader();
            // console.log(response.data)
            if (response.data.status && response.data.code === 200) {
              $scope.taxExempt = false;
              // $scope.taxShipping = parseFloat((parseFloat(response.data.result.final_tax_rate) * 100).toFixed(4));
              $scope.taxShipping = parseFloat(
                (parseFloat(response.data.final_tax_rate) * 100).toFixed(4)
              );
              $scope.updateSubTotal();
              CommonService.showSuccess("Sales tax fetched");
            } else {
              CommonService.showError(response.data.msg);
            }
          });
        } else if (
          $scope.customerData.shippingAddress.state.toLowerCase() ===
            "michigan" ||
          ($scope.customerData.shippingAddress.state === "MI" &&
            country === "US")
        ) {
          $scope.taxShipping = 6;
        } else {
          $scope.taxShipping = 0;
        }
      } else {
        CommonService.showError("To Get Tax shipping address is required.");
      }
    };
    $scope.checkShippings = function () {
      let totalWeight = 0;
      let shippingWeight = 0;
      let isValidDimension = true;
      if (
        $scope.customerData.customerID === undefined ||
        $scope.customerData.customerID === null
      ) {
        CommonService.showError("Please select a customer!");
        return;
      }
      if ($scope.invoiceRows[0].product.ProductName === undefined) {
        CommonService.showError("Please select a product!");
        return;
      }
      if (!$scope.customerData.shippingAddress.country) {
        CommonService.showError(
          "To Get Shipping Rates, shipping address is required."
        );
        return;
      }
      $scope.invoiceRows.forEach((elem) => {
        totalWeight = totalWeight + elem.weight;
      });
      let invalidRows = false;
      $scope.parcels.map((elem) => {
        if (elem.weight > 150) rinvalidRows = true;
      });
      if (invalidRows) {
        CommonService.showError(
          "Weight should be less then 150 lbs for one parcel."
        );
        return;
      }
      $scope.parcels.forEach((elem) => {
        shippingWeight = shippingWeight + elem.weight;
        if (elem.dimensions && elem.dimensions.split(" x ").length === 3) {
          elem.length = parseFloat(elem.dimensions.split(" x ")[0]);
          elem.width = parseFloat(elem.dimensions.split(" x ")[1]);
          elem.height = parseFloat(elem.dimensions.split(" x ")[2]);
        }
        if (!elem.length > 0 || !elem.width > 0 || !elem.height > 0)
          isValidDimension = false;
      });
      if (shippingWeight <= 0) {
        CommonService.showError("Weight should be greater then ZERO");
        return;
      }
      if (!isValidDimension) {
        CommonService.showError(
          "Box dimensions can not be ZERO or less then ZERO"
        );
        return;
      }
      // console.log($scope.parcels, shippingWeight, totalWeight);

      if (shippingWeight !== totalWeight) {
        CommonService.confirm(
          "Total product(s) weight and To Ship weight did't matched, Do you want to continue?",
          () => {
            getShippings();
          }
        );
      }
      if ($scope.InsuranceValue < 0) {
        CommonService.hideLoader();
        CommonService.showError("Invalid insurance value!");
        return;
      }
      if ($scope.total < $scope.InsuranceValue) {
        CommonService.hideLoader();
        CommonService.showError(
          "Insurance value can not more then sub total amount of quote!"
        );
        return;
      } else {
        getShippings();
      }
    };
    function getShippings() {
      $scope.freight = 0;
      $scope.shippingId = 0;
      $scope.shippingMethods = undefined;
      CommonService.showLoader();
      let dataToPost = {
        InsuranceValue: $scope.InsuranceValue ? $scope.InsuranceValue : 0,
        ShipCountry: $scope.customerData.shippingAddress.country,
        ShipCity: $scope.customerData.shippingAddress.city,
        ShipPostalCode: $scope.customerData.shippingAddress.postalCode,
        packages: $scope.parcels,
      };
      LookupService.getShippings(dataToPost).then(
        (response) => {
          CommonService.hideLoader();
          $scope.shippingMethods = response.result;
          $scope.calculated = true;
          CommonService.showSuccess("Available shippping options fetched.");
        },
        (error) => {
          console.log(error);
          CommonService.hideLoader();
          CommonService.showError(
            error.msg || "Unable to fetch shipping option."
          );
        }
      );
    }

    $scope.addParcel = function () {
      $scope.parcels.push({
        length: 0,
        width: 0,
        height: 0,
        weight: 0,
      });
    };
    $scope.removeParcel = function (index) {
      $scope.parcels.splice(index, 1);
    };
    $scope.calculateWeight = function (parcel, index) {
      parcel.weight = 0;
      $scope.invoiceRows.forEach((elem) => {
        if (parcel.productId === elem.product.ProductID) {
          parcel.weight = parcel.weight + elem.weight;
        }
      });
      // $scope.parcels,$scope.invoiceRows[]
    };
    $scope.calculateRemainingWeight = function (parcel, index) {
      let totalWeight = 0;
      let shippingWeight = 0;
      $scope.invoiceRows.forEach((elem) => {
        if (parcel.productId === elem.product.ProductID)
          totalWeight = totalWeight + elem.weight;
      });
      $scope.parcels.forEach((elem, i) => {
        if (i !== index && parcel.productId === elem.productId)
          shippingWeight = shippingWeight + elem.weight;
      });
      parcel.weight = totalWeight - shippingWeight;
      // $scope.parcels,$scope.invoiceRows[]
    };
    $scope.selectShipping = function (selectedShipping) {
      if (selectedShipping) {
        $scope.freight = parseFloat(selectedShipping.charges);
        $scope.shippingId = parseInt(selectedShipping.id);
      } else {
        console.log("shipping not selected");
        // CommonService.showError('Something went wrong, Try again!')
      }
    };
    var getPackagingBox = function () {
      $scope.productPackagingBox = [];
      PackagingBoxService.list().then(function (response) {
        // console.log(response)
        if (!response.data.status)
          return CommonService.showError(response.data.msg);
        $scope.productPackagingBox = response.data.result;
        // console.log($scope.productPackagingBox)
      });
    };

    $scope.calculateBoxes = async () => {
      // console.log($scope.invoiceRows)
      let selectedProductNames = [];
      angular.forEach($scope.invoiceRows, function (item, index) {
        if (!item.isChild) {
          selectedProductNames.push(item.selectedProduct);
          // console.log(selectedProductNames);
        }
      });
      // console.log(selectedProductNames)
      let productDims = {};
      //get all dimensions for selected products
      const dimensions = await Promise.all(
        $scope.invoiceRows.map(async (elem) => {
          if (!elem.isChild) {
            const response = await PackagingService.list(
              elem.product.ProductID
            );
            return response.data.result;
          }
        }),
        (errors) => {
          console.log(errors);
        }
      );
      // console.log(dimensions);
      //remove undefined nodes
      var filteredDimensions = dimensions.filter(function (el) {
        return el != undefined;
      });
      filteredDimensions.map((dim) => {
        selectedProductNames.map((elem, index) => {
          if (dim.length > 0 && elem.ProductID === dim[0].productId) {
            selectedProductNames.splice(index, 1);
          }
        });
      });
      if (selectedProductNames.length > 0) {
        CommonService.showError(
          "No boxes defined for " +
            selectedProductNames.map((e) => {
              return e.ProductCode;
            })
        );
      }
      $scope.parcels = [];
      // console.log(filteredDimensions);
      // console.log(selectedProductNames);
      filteredDimensions.map((elem) => {
        if (elem) {
          if (elem.length) productDims[elem[0].productId] = elem;
          else if (elem.length == 0) {
            $scope.parcels.push({
              length: 0,
              width: 0,
              height: 0,
              weight: 0,
            });
          }
        }
      });

      $scope.invoiceRows.map((row) => {
        if (!row.isChild && productDims[row.product.ProductID]) {
          let productQuantity = row.qty;

          while (productQuantity !== 0) {
            let dimension = findCloset(
              productDims[row.product.ProductID],
              productQuantity
            );
            // console.log(dimension);
            if (dimension) {
              productQuantity = productQuantity - dimension.quantity;
              $scope.parcels.push({
                dimensions: dimension.dimensions,
                weight: parseFloat(
                  row.product.ProductWeight * dimension.quantity
                ),
                quantity: parseInt(dimension.quantity),
                productCode: row.product.ProductCode,
                productId: parseInt(row.product.ProductID),
              });
            } else if (!dimension) {
              productQuantity = 0;
            }
          }
        }
      });
      $timeout(() => {
        $scope.$apply();
      });

      // console.log($scope.parcels);
    };
    let findCloset = (array, value) => {
      var i = -1;
      while (array[++i] && array[i].quantity <= value);
      return array[--i];
    };

    function getShippingMethods() {
      LookupService.GetShippingMethods().then((response) => {
        $scope.shippingMethodLookup = response.data;
      });
    }
    $scope.getPercentage = (amount, percentage) => {
      if (amount >= 0 && percentage >= 0)
        $scope.InsuranceValue = (amount / 100) * percentage;
      else CommonService.showError("invalid values!");
    };
    $scope.copyBilling = function () {
      if (
        $scope.customerData.customerID === undefined ||
        $scope.customerData.customerID === null
      ) {
        CommonService.showError("Please select customer first");
        return;
      }
      $scope.copyBillingAddress = `${$scope.customerData.customerFName} ${$scope.customerData.customerLName},,${$scope.customerData.CompanyName},,${$scope.customerData.billingAddress.address1},,${$scope.customerData.billingAddress.address2},,${$scope.customerData.billingAddress.city}, ${$scope.customerData.billingAddress.state}, ${$scope.customerData.billingAddress.postalCode},,${$scope.customerData.billingAddress.country},,${$scope.customerData.billingAddress.phoneNumber}**`;
      $scope.copyBillingAddress = $scope.copyBillingAddress.replace(
        /,,/g,
        "<br>"
      );
      var copyText = document.getElementById("BillingAddress");
      copyText.value = $scope.copyBillingAddress;
      var copy = document.getElementById("BillingAddress2");
      copy.value = copyText.value.replace(/<br>/g, "\n");
      copy.select();
      document.execCommand("copy");
      CommonService.showSuccess("Billing Address copied successfully.");
    };
    $scope.copyShipping = function () {
      if (
        $scope.customerData.customerID === undefined ||
        $scope.customerData.customerID === null
      ) {
        CommonService.showError("Please select customer first");
        return;
      }
      $scope.copyShippingAddress = `${$scope.customerData.customerFName} ${$scope.customerData.customerLName},,${$scope.customerData.shippingAddress.comapny},,${$scope.customerData.shippingAddress.address1},,${$scope.customerData.shippingAddress.address2},,${$scope.customerData.shippingAddress.city}, ${$scope.customerData.shippingAddress.state}, ${$scope.customerData.shippingAddress.postalCode},,${$scope.customerData.shippingAddress.country},,${$scope.customerData.billingAddress.phoneNumber}**`;
      $scope.copyShippingAddress = $scope.copyShippingAddress.replace(
        /,,/g,
        "<br>"
      );
      // $scope.copyShippingAddress = $scope.copyShippingAddress.replace(/,/g, "|")
      var copyText = document.getElementById("ShippingAddress");
      copyText.value = $scope.copyShippingAddress;
      var copy = document.getElementById("ShippingAddress2");
      copy.value = copyText.value.replace(/<br>/g, "\n");
      copy.select();
      document.execCommand("copy");
      CommonService.showSuccess("Shipping Address copied successfully.");
    };
    $scope.checkPriceModal = function () {
      let isUpdate = false;
      ModalService.showModal({
        templateUrl: "template/create-quote-price-modal.ejs",
        controller: "PriceCheckModal",
      }).then(function (modal) {
        modal.element.modal({
          backdrop: "static",
          keyboard: false,
        });
        modal.close.then(function (response) {
          $(".modal-backdrop").remove();
          $("body").removeClass("modal-open");
          if (response !== undefined) {
            if (response.isUpdate) {
              for (let i = 0; i < $scope.invoiceRows.length; i++) {
                for (let j = 0; j < $scope.arrayOfNewProduct.length; j++) {
                  if (
                    $scope.arrayOfNewProduct[j].ProductCode ===
                    $scope.invoiceRows[i].product.ProductCode
                  ) {
                    if (
                      $scope.invoiceRows[i].product.parentName != null &&
                      $scope.invoiceRows[i].product.parentName != undefined &&
                      $scope.invoiceRows[i].product.parentName
                    )
                      $scope.invoiceRows[i].product.ProductPrice =
                        $scope.arrayOfNewProduct[j].ProductPrice;

                    $scope.updateTotals();
                    $scope.saveQuote();
                  }
                }
              }
            }
            $scope.saveQuote();
          } else {
            console.log("modal closed only");
            // $scope.saveQuote()
          }
        });
      });
      return isUpdate;
    };
    init();
  }
);
