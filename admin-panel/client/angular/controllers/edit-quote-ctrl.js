// // var vulusionApp = angular.module('vulusionApp', ['ui.select', 'ngSanitize','smart-table']);
//
// vulusionApp.controller('EditQuoteController', function EditQuoteController($timeout, $rootScope, $cookies,$routeParams,ModalService, $scope, $http) {
//     var parall = 0;
//     var quoteNo = parseInt(window.location.search.split('?')[1].split('=')[1]);
//     console.log($routeParams);
//     var init = function(){
//         $scope.selected = {item : {}}
//         if($cookies.get('user') !== undefined){
//             $scope.showCustomerName = true;
//             $scope.showCustomerEmail = true;
//             $rootScope.loggedInUser = JSON.parse($cookies.get('user'));
//             $scope.currentUser = JSON.parse($cookies.get('user'));
//             var exp = new Date(new Date().getTime() + 1000*60*60).toUTCString();
//             $cookies.put('user', JSON.stringify($scope.currentUser), {expires: exp});
//             $scope.total = 0;
//             $scope.invoiceRows = [];
//             $scope.products = [];
//             $scope.customers = [];
//             $scope.product;
//             $scope.customerData = new customerData();
//             $scope.issueDate = new Date();
//             $scope.validTill = new Date();
//             $scope.validTill.setMonth($scope.validTill.getMonth() + 1);
//             $scope.freight = 0;
//             $scope.taxShipping = 0;
//             $scope.notes = '';
//             $scope.sameAsShipping = false;
//             $scope.sameAsBilling = false;
//             $scope.addCustomerBtn = true;
//             $scope.quotes = [];
//             $scope.itemsByPage = 8;
//
//             $scope.getCustomers();
//             var getIpUrl = "//freegeoip.net/json/";
//             $http.get(getIpUrl).then(function(response) {
//                 console.log(response);
//                 $scope.currentIP = response.data.ip;
//                 console.log("Ip", $scope.currentIP);
//                 console.log("Customer data",$scope.customerData);
//             });
//         }else {
//             window.location = "/login";
//         }
//     }
//     $scope.addCustomer = function(){
//         $('.modal-backdrop').show();
//         ModalService.showModal({
//             templateUrl: "template/customer-form.ejs",
//             controller: "CustomerController",
//             inputs : {
//                 customer: angular.copy($scope.customer)
//             }
//         }).then(function(modal) {
//             modal.element.modal( {backdrop: 'static',  keyboard: false });
//             modal.close.then(function(response) {
//                 $('.modal-backdrop').remove();
//                 $('body').removeClass('modal-open');
//                 if(response !== undefined){
//                     if(response.new == true){
//                         $scope.customers.unshift(response.data);
//                         $scope.selected = { item: $scope.customers[0] };
//                         console.log('all',$scope.customers);
//                     }else {
//                         console.log('old customer');
//                         $scope.selected = { item: response.data };
//                     }
//                     $timeout(function () {
//                         console.log(response.data);
//                         $scope.customerListner(response.data)
//                     });
//                 }else {
//                     console.log('modal closed only');
//                 }
//             });
//         });
//     }
//     $scope.customerListner = function(selectedCustomer){
//         console.log('customer',selectedCustomer);
//         $scope.customer = selectedCustomer;
//         $scope.customerData.customerID = selectedCustomer.CustomerID;
//         $scope.customerData.customerFName = selectedCustomer.FirstName;
//         $scope.customerData.customerLName = selectedCustomer.LastName;
//         $scope.customerData.CompanyName = selectedCustomer.CompanyName;
//
//         $scope.customerData.billingAddress.address1 = selectedCustomer.BillingAddress1;
//         $scope.customerData.billingAddress.address2 = selectedCustomer.BillingAddress2;
//         $scope.customerData.billingAddress.city = selectedCustomer.City;
//         $scope.customerData.billingAddress.country = selectedCustomer.Country;
//         $scope.customerData.billingAddress.postalCode = selectedCustomer.PostalCode;
//         $scope.customerData.billingAddress.state = selectedCustomer.State;
//         $scope.addCustomerBtn = false;
//         $scope.updateAddress();
//
//         $scope.$apply()
//     };
//     $scope.toggleSameAsShipping = function(){
//         console.log($scope.sameAsShipping);
//         if($scope.sameAsShipping){
//             $scope.sameAsBilling = false;
//             $scope.updateAddress();
//         }
//     }
//
//     $scope.toggleSameAsBilling = function(){
//         console.log($scope.sameAsBilling);
//         if($scope.sameAsBilling){
//             $scope.sameAsShipping = false;
//             $scope.updateAddress();
//         }
//     }
//     $scope.updateAddress = function(){
//         if($scope.sameAsShipping){
//             $scope.customerData.billingAddress = angular.copy($scope.customerData.shippingAddress);
//         } else if($scope.sameAsBilling){
//             $scope.customerData.shippingAddress = angular.copy($scope.customerData.billingAddress);
//         }
//     }
//     var product = function(price,name,code,weight,taxable,freeShipping) {
//         this.ProductName = name,
//         this.ProductCode = code,
//         this.ProductPrice = [price]
//         this.TaxableProduct = taxable
//         this.FreeShippingItem = freeShipping
//         this.ProductWeight = weight
//     };
//     $scope.updateSubTotal = function() {
//         var total = 0;
//         for(var i = 0; i < $scope.invoiceRows.length; i++){
//             total += $scope.invoiceRows[i].total;
//         }
//         $scope.total = total;
//     }
//     $scope.removeRow = function(index){
//         $scope.invoiceRows.splice(index,1)
//         $scope.updateSubTotal();
//     }
//     var InvoiceRow = function(productObj,description,qty,discount,price,name,code,weight,taxable,freeShipping) {
//         this.selectedProduct = productObj;
//         this.productIndex = -1;
//         this.product = new product(price,name,code,weight,taxable,freeShipping);
//         this.description = description;
//         this.qty = qty;
//         this.total = 0;
//         this.discount = discount;
//         var classRef = this;
//         this.productListner = function(product){
//             classRef.product = angular.copy(product);
//             classRef.description = product.ProductDescriptionShort? product.ProductDescriptionShort.replace(/<\/?[^>]+(>|$)/g, "") : '';
//             classRef.updateLineTotal();
//         }
//         this.updateLineTotal = function(){
//             classRef.total = this.qty * this.product.ProductPrice;
//             if(classRef.discount > 0){
//                 var discount = (classRef.discount / 100) * classRef.total;
//                 classRef.total -= discount;
//             }
//             $scope.updateSubTotal();
//         }
//         // this.updateLineTotal();
//     };
//     var customerData = function(){
//         this.customerID  = "";
//         this.customerFName = "";
//         this.customerLName = "";
//         this.CompanyName = "";
//
//         this.billingAddress = {
//             address1 : "",
//             address2 : "",
//             city : "",
//             country : "",
//             state : "",
//             postalCode : "",
//         };
//
//         this.shippingAddress = {
//             address1 : "",
//             address2 : "",
//             city : "",
//             country : "",
//             state : "",
//             postalCode : "",
//         };
//     }
//     function showLoader(){
//         parall++;
//         $('.loader').show();
//         $('#overlay').show();
//     }
//     function hideLoader(){
//         parall--;
//         if(parall == 0){
//             $('.loader').hide();
//             $('#overlay').hide();
//         }
//     }
//     function showError(error){
//         alertify.error(error);
//     }
//     function showSuccess(msg){
//         alertify.success(msg);
//     }
//     $scope.getQuote = function(){
//         showLoader();
//         $http({
//             method: 'GET',
//             url: getQuote+'?quoteId='+quoteNo,
//             headers: {
//                 'Content-Type': 'application/xml; charset=utf-8'
//             }
//         }).then(function successCallback(response) {
//             hideLoader();
//             $scope.getProducts();
//             if(response.data.data.length > 0 && $scope.customers.length > 0){
//                 $scope.lineItems = angular.copy(response.data.data);
//                 $scope.quotes = response.data.data[0];
//                 console.log('Line Items ========>',$scope.lineItems);
//                 console.log('Quote ========>',$scope.quotes);
//                 $scope.customers.forEach(elem => {
//                     if(elem.CustomerID == $scope.quotes.CustomerID){
//                         $scope.selected.item = elem; //customer dropdown selection
//                         var issueDate = $scope.quotes.IssueDate.split('-');
//                         $scope.issueDate = new Date( $scope.quotes.IssueDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
//                         $scope.validTill = new Date( $scope.quotes.ValidTill.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
//
//                         console.log("elem",elem);
//                         $scope.customerData.customerID = $scope.quotes.CustomerID;
//                         $scope.customerData.customerFName = $scope.quotes.CustomerFName;
//                         $scope.customerData.customerLName = $scope.quotes.CustomerLName;
//                         $scope.customerData.CompanyName = $scope.selected.item.CompanyName;
//
//                         $scope.customerData.billingAddress.address1 = $scope.quotes.BillingStreetAddress1;
//                         $scope.customerData.billingAddress.address2 = $scope.quotes.BillingStreetAddress2;
//                         $scope.customerData.billingAddress.state = $scope.quotes.BillingState;
//                         $scope.customerData.billingAddress.postalCode = $scope.quotes.BillingPostalCode;
//                         $scope.customerData.billingAddress.city = $scope.quotes.BillingCity1;
//                         $scope.customerData.billingAddress.country = $scope.quotes.BillingCountry1;
//                         $scope.customerData.shippingAddress.address1 = $scope.quotes.ShippingAddress1;
//                         $scope.customerData.shippingAddress.address2 = $scope.quotes.ShippingAddress2;
//                         $scope.customerData.shippingAddress.state = $scope.quotes.ShippingState;
//                         $scope.customerData.shippingAddress.postalCode = $scope.quotes.ShippingPostalCode;
//                         $scope.customerData.shippingAddress.city = $scope.quotes.ShippingCity;
//                         $scope.customerData.shippingAddress.country = $scope.quotes.ShippingCountry;
//                         $scope.showCustomerEmail = $scope.quotes.IsCustomerEmailShow == 1? true:false;
//                         $scope.showCustomerName = $scope.quotes.IsCustomerNameShow == 1? true:false ;
//                         $scope.notes = $scope.quotes.notes;
//                         $scope.PrivateNotes = $scope.quotes.PrivateNotes;
//                         $scope.taxShipping = $scope.quotes.TaxShipping;
//                         $scope.freight = $scope.quotes.Freight;
//                     }
//                 });
//             }else {
//                 console.log("Something went wrong with customer or line items.");
//             }
//             // console.log($scope.customers[5]);
//
//         }, function errorCallback(response) {
//             console.log("Error while retrieving line items",response);
//             // showError("Error while retrieving customers");
//         });
//     };
//     $scope.getCustomers = function(){
//         showLoader();
//         $http({
//             method: 'GET',
//             url: getCustomersURL,
//             headers: {
//                 'Content-Type': 'application/xml; charset=utf-8'
//             }
//         }).then(function successCallback(response) {
//             $scope.customers = response.data;
//             $scope.getQuote();
//             hideLoader();
//         }, function errorCallback(response) {
//             showError("Error while retrieving customers");
//         });
//     };
//     $scope.addRow = function(product,description,qty,discount,price,name,code,weight,taxable,freeShipping){
//         $scope.invoiceRows.push( new InvoiceRow(product,description,qty,discount,price,name,code,weight,taxable,freeShipping) );
//     }
//     $scope.getProducts = function(){
//         showLoader();
//
//         $http({
//             method: 'GET',
//             url: getProductsURL,
//             headers: {
//                 'Content-Type': 'application/xml; charset=utf-8'
//             }
//         }).then(function successCallback(response) {
//             hideLoader();
//             $scope.products = response.data
//             if($scope.lineItems.length > 0){
//                 for (let j = 0; j < $scope.lineItems.length; j++) {
//                     for(var i = 0; i < $scope.products.length; i++){
//                         if($scope.products[i].ProductCode.toLowerCase() === $scope.lineItems[j].ProductCode.toLowerCase()){
//                             $scope.addRow($scope.products[i],$scope.lineItems[j].description,$scope.lineItems[j].Qty,$scope.lineItems[j].Discount,$scope.lineItems[j].Price,$scope.products[i].ProductName,$scope.products[i].ProductCode,$scope.products[i].ProductWeight,$scope.products[i].TaxableProduct,$scope.products[i].FreeShippingItem);
//                             console.log('=====Product Found=====',$scope.products[i].ProductCode);
//                             i = $scope.products.length;
//                         }else {
//                             console.log("Product Not Found. length: ",$scope.products.length);
//                         }
//                     }
//                 }
//             }else {
//                 console.log("Something went wrong with quotes from db");
//             }
//         }, function errorCallback(response) {
//             showError("Error while retrieving products");
//         });
//     };
//     $scope.updateQuote = function(){
//         console.log("update");
//         showLoader();
//
//         var quoteLines = [];
//         for(var i = 0; i < $scope.invoiceRows.length; i++){
//             if($scope.invoiceRows[i].product.ProductName != undefined)
//             quoteLines.push({
//
//                 'Qty' : $scope.invoiceRows[i].qty,
//                 'ProductName' : $scope.invoiceRows[i].product.ProductName,
//                 'description' : $scope.invoiceRows[i].description? $scope.invoiceRows[i].description.replace(/'/g, "\\'"): '',
//                 'ProductCode' : $scope.invoiceRows[i].product.ProductCode,
//                 'Price' : parseFloat($scope.invoiceRows[i].product.ProductPrice),
//                 'Discount' : $scope.invoiceRows[i].discount
//             });
//         }
//
//         if(!$scope.customerData.customerID){
//             hideLoader();
//             showError('Please select a customer!');
//             return;
//         }
//
//         if(quoteLines.length <= 0){
//             hideLoader();
//             showError('Please select a product!');
//             return;
//         }
//
//         $http({
//             method: 'POST',
//             url: updateQuoteUrl,
//             headers: {
//                 'Content-Type': 'application/json; charset=utf-8'
//             },
//             data : {
//                 'Quote' : {
//                     'QuoteNo' : quoteNo,
//                     'CustomerID': $scope.customerData.customerID,
//                     'CustomerFName' : $scope.customerData.customerFName,
//                     'CustomerLName' : $scope.customerData.customerLName,
//                     'BillingStreetAddress1' : $scope.customerData.billingAddress.address1,
//                     'BillingStreetAddress2' : $scope.customerData.billingAddress.address2,
//                     'BillingCity1' : $scope.customerData.billingAddress.city,
//                     'BillingCountry1': $scope.customerData.billingAddress.country,
//                     'ValidTill' : $scope.validTill,
//                     'IssueDate': $scope.issueDate,
//                     'BillingState' : $scope.customerData.billingAddress.state,
//                     'BillingPostalCode': $scope.customerData.billingAddress.postalCode,
//                     'ShippingAddress1' : $scope.customerData.shippingAddress.address1,
//                     'ShippingAddress2' : $scope.customerData.shippingAddress.address2,
//                     'ShippingCity' : $scope.customerData.shippingAddress.city,
//                     'ShippingCountry' : $scope.customerData.shippingAddress.country,
//                     'ShippingState' : $scope.customerData.shippingAddress.state,
//                     'ShippingPostalCode' : $scope.customerData.shippingAddress.postalCode,
//                     'IsCustomerEmailShow' : $scope.showCustomerEmail,
//                     'IsCustomerNameShow' : $scope.showCustomerName,
//                     'Freight' : $scope.freight,
//                     'TaxShipping' : $scope.taxShipping,
//                     'notes' : $scope.notes,
//                     'PrivateNotes' : $scope.PrivateNotes
//                 },
//                 'QuoteLines' : quoteLines
//             }
//         }).then(function successCallback(response) {
//             hideLoader();
//
//             if(response.data.status == "norows")
//             showError("No products selected!");
//             else if(response.data.status == "ok"){
//                 quoteId = response.data.quoteNo;
//                 if(quoteId != undefined){
//                     var d = new Date();
//                     var pdfname =
//                     d.getFullYear() +
//                     ("0"+(d.getMonth()+1)).slice(-2) +
//                     ("0" + d.getDate()).slice(-2) + "_" +
//                     ("00000" + quoteId.toString()).slice(-6);
//                     // showLoader();
//                     // window.location = "GeneratePDF/" + pdfname +'.pdf';
//                     window.open(
//                         location.origin+"/GeneratePDF/" + pdfname +'.pdf',
//                         '_blank' // <- This is what makes it open in a new window.
//                     );
//                 }
//             }
//             else if(response.data.status == 'error')
//             showError("Error while saving quote");
//
//
//         }, function errorCallback(response) {
//             hideLoader();
//             showError("Error while saving quote");
//         });
//     }
//     $rootScope.logout = function(){
//         if($cookies.get('user') !== undefined){
//             $cookies.remove('user');
//             window.location.pathname = '/login';
//         }else {
//             window.location.pathname = '/login';
//         }
//     }
//     $scope.placeOrderOnVolusion = function(){
//         console.log('Rows',$scope.invoiceRows);
//         showLoader();
//         var date = new Date();
//         orderDate = date.toLocaleString('en-US');
//         var OrderDetail = ' ';
//         $scope.invoiceRows.forEach(item => {
//             // OrderDetail = OrderDetail.toSring();
//             OrderDetail = OrderDetail+"<OrderDetails>"+
//             "<FreeShippingItem>"+item.product.FreeShippingItem+"</FreeShippingItem>"+
//             "<OnOrder_Qty>"+item.qty+"</OnOrder_Qty>"+
//             "<ProductCode>"+item.product.ProductCode.replace(/-/g,' ')+"</ProductCode>"+
//             "<ProductNote></ProductNote>"+
//             "<ProductPrice>"+item.product.ProductPrice+"</ProductPrice>"+
//             "<ProductWeight>"+item.product.ProductWeight+"</ProductWeight>"+
//             "<QtyOnPackingSlip>"+item.qty+"</QtyOnPackingSlip>"+
//             "<QtyShipped>0</QtyShipped>"+
//             "<Quantity>"+item.qty+"</Quantity>"+
//             "<ShipDate>"+orderDate+"</ShipDate>"+
//             "<TaxableProduct>"+item.product.TaxableProduct+"</TaxableProduct>"+
//             "<TotalPrice>"+item.total+"</TotalPrice>"+
//             // "<OptionIDs/>"+
//             // "<Options/>"+
//             // "<ProductID>37510</ProductID>"+
//             // "<ProductName>"+item.product.ProductName+"</ProductName>"+
//             // "<QtyOnBackOrder>0</QtyOnBackOrder>"+
//             // "<QtyOnHold>0</QtyOnHold>"+
//             // "<GiftTrakNumber>0</GiftTrakNumber>"+
//             // "<GiftWrap></GiftWrap>"+
//             // "<GiftWrapCost>0.0000</GiftWrapCost>"+
//             // "<GiftWrapNote></GiftWrapNote>"+
//             // "<IsKitID></IsKitID>"+
//             // "<KitID></KitID>"+
//             // "<Locked>Y</Locked>"+
//             // "<AutoDropShip/>"+
//             // "<Warehouses></Warehouses>"+
//             "</OrderDetails>";
//             console.log("Item",item,'Order detail',OrderDetail);
//         });
//         console.log(orderDate);
//         $http({
//             method: 'POST',
//             url: placeOrderVolusionUrl,
//             header: {
//                 'Content-Type': 'application/xml; charset=utf-8'
//             },
//             data: {
//                 'data' :
//                 "<?xml version=\"1.0\" encoding=\"utf-8\" ?>"+
//                 "<Volusion_API>"+
//                 "<Orders>"+
//                 "<BillingAddress1>"+$scope.customerData.billingAddress.address1+"</BillingAddress1>"+
//                 "<BillingAddress2>"+$scope.customerData.billingAddress.address2+"</BillingAddress2>"+
//                 "<BillingCity>"+$scope.customerData.billingAddress.city+"</BillingCity>"+
//                 "<BillingCompanyName>"+$scope.customerData.CompanyName+"</BillingCompanyName>"+
//                 "<BillingCountry>"+$scope.customerData.billingAddress.country+"</BillingCountry>"+
//                 "<BillingFaxNumber></BillingFaxNumber>"+
//                 "<BillingFirstName>"+$scope.customerData.customerFName+"</BillingFirstName>"+
//                 "<BillingLastName>"+$scope.customerData.customerLName+"</BillingLastName>"+
//                 "<BillingPhoneNumber></BillingPhoneNumber>"+
//                 "<BillingPostalCode>"+$scope.customerData.billingAddress.postalCode+"</BillingPostalCode>"+
//                 "<BillingState>"+$scope.customerData.billingAddress.state+"</BillingState>"+
//                 "<Customer_IPAddress>"+$scope.currentIP+"</Customer_IPAddress>"+
//                 "<CustomerID>"+$scope.customerData.customerID+"</CustomerID>"+
//                 "<IsAGift>N</IsAGift>"+
//                 "<IsGTSOrder>False</IsGTSOrder>"+
//                 "<LastModBy>4711</LastModBy>"+
//                 "<LastModified>"+orderDate+"</LastModified>"+
//                 "<Order_Comments>...</Order_Comments>"+
//                 "<OrderDate>"+orderDate+"</OrderDate>"+
//                 "<OrderNotes/>"+
//                 "<OrderStatus>New</OrderStatus>"+
//                 "<PaymentAmount>"+(($scope.total + $scope.freight) + (($scope.taxShipping / 100) * $scope.total)) +"</PaymentAmount>"+
//                 "<PaymentMethodID>5</PaymentMethodID>"+
//                 "<Printed>N</Printed>"+
//                 "<Processed_AutoEvents>N</Processed_AutoEvents>"+
//                 "<SalesRep_CustomerID>4711</SalesRep_CustomerID>"+
//                 "<SalesTax1>"+(($scope.taxShipping / 100) * $scope.total)+"</SalesTax1>"+
//                 "<SalesTax2>0.0000</SalesTax2>"+
//                 "<SalesTax3>0.0000</SalesTax3>"+
//                 "<SalesTaxRate>0</SalesTaxRate>"+
//                 "<SalesTaxRate1>"+$scope.taxShipping/100+"</SalesTaxRate1>"+
//                 "<SalesTaxRate2>0</SalesTaxRate2>"+
//                 "<SalesTaxRate3>0</SalesTaxRate3>"+
//                 "<ShipAddress1>"+$scope.customerData.shippingAddress.address1+"</ShipAddress1>"+
//                 "<ShipAddress2>"+$scope.customerData.billingAddress.address2 +"</ShipAddress2>"+
//                 "<ShipCity>"+$scope.customerData.shippingAddress.city+"</ShipCity>"+
//                 "<ShipCompanyName>"+$scope.customerData.CompanyName+"</ShipCompanyName>"+
//                 "<ShipCountry>"+$scope.customerData.shippingAddress.country+"</ShipCountry>"+
//                 "<ShipFaxNumber/>"+
//                 "<ShipFirstName>"+$scope.customerData.customerFName+"</ShipFirstName>"+
//                 "<ShipLastName>"+$scope.customerData.customerLName+"</ShipLastName>"+
//                 "<Shipped>N</Shipped>"+
//                 "<ShippingMethodID>1000</ShippingMethodID>"+
//                 "<ShipPostalCode>"+$scope.customerData.shippingAddress.postalCode+"</ShipPostalCode>"+
//                 "<ShipResidential>N</ShipResidential>"+
//                 "<ShipState>"+$scope.customerData.shippingAddress.state+"</ShipState>"+
//                 "<Stock_Priority>3</Stock_Priority>"+
//                 "<Tax1_IgnoreNoTaxRules>N</Tax1_IgnoreNoTaxRules>"+
//                 "<Tax1_Title>Tax ("+$scope.taxShipping+"%)</Tax1_Title>"+
//                 "<Tax2_IgnoreNoTaxRules>N</Tax2_IgnoreNoTaxRules>"+
//                 "<Tax2_IncludePrevious>0</Tax2_IncludePrevious>"+
//                 "<Tax2_Title></Tax2_Title>"+
//                 "<Tax3_IgnoreNoTaxRules>N</Tax3_IgnoreNoTaxRules>"+
//                 "<Tax3_IncludePrevious>0</Tax3_IncludePrevious>"+
//                 "<Tax3_Title></Tax3_Title>"+
//                 "<Affiliate_Commissionable_Value>"+$scope.total+"</Affiliate_Commissionable_Value>"+
//                 "<Total_Payment_Authorized>"+(($scope.total + $scope.freight) + (($scope.taxShipping / 100) * $scope.total)) +"</Total_Payment_Authorized>"+
//                 "<Total_Payment_Received>0</Total_Payment_Received>"+
//                 "<TotalShippingCost>"+$scope.freight+"</TotalShippingCost>"+
//                 "<Order_Entry_System>ONLINE</Order_Entry_System>"+
//                 "<VendorID>0</VendorID>"+
//                 OrderDetail +
//                 "</Orders>"+
//                 // "<PCIaaS_CardId>7f4ad67cc60045cb80fd74422cb41847</PCIaaS_CardId>"+
//                 // "<PCIaaS_MaskedCardRef>************7489</PCIaaS_MaskedCardRef>"+
//                 // "<PONum/>"+
//                 // "<ShipDate>12/4/2014 12:20:00 PM</ShipDate>"+
//                 // "<ShipPhoneNumber>810-225-4300</ShipPhoneNumber>"+
//                 // "<Shipping_Locked>Y</Shipping_Locked>"+
//                 // "<sOrderID>24145</sOrderID>"+
//                 // "<Locked>Y</Locked>"+
//                 // "<OrderDateUtc>12/4/2014 4:52:13 PM</OrderDateUtc>"+
//                 // "<CVV2_Response/>"+
//                 // "<GiftWrapNote/>"+
//                 // "<InitiallyShippedDate>12/4/2014 12:20:00 PM</InitiallyShippedDate>"+
//                 // "<CardHoldersName>77F92DFFF7FC19C645278B3B2959319E3F855819D86208552AF818E0EEFE61F7</CardHoldersName>"+
//                 // "<CC_Last4>7489</CC_Last4>"+
//                 // "<CreditCardAuthorizationDate>12/4/2014 11:54:00 AM</CreditCardAuthorizationDate>"+
//                 // "<CreditCardAuthorizationNumber>757708</CreditCardAuthorizationNumber>"+
//                 // "<CreditCardTransactionID>6725598829</CreditCardTransactionID>"+
//                 // "<AddressValidated>Y</AddressValidated>"+
//                 // "<AuthHash>bab57f0924537e661106e0e86e5c4eea</AuthHash>"+
//                 // "<AVS>P</AVS>"+
//                 "</Volusion_API>"
//             }
//         }).then(function successCallback(response) {
//             hideLoader();
//             console.log("Res",response);
//             hideLoader();
//             if(response.data.ReturnResult && response.data.ReturnResult.Success == "False"){
//                 console.log('Error while ordering',response);
//                 showError(response.Message);
//             }else if(response.data.Volusion_API && response.data.Volusion_API.Orders && response.data.Volusion_API.Orders.Success == "True") {
//                 console.log('success - order id:',response.data.Volusion_API.Orders.OrderID);
//                 showSuccess("Order has been placed.")
//             }else {
//                 console.log("Something went Wrong!",response);
//                 showError("Something went Wrong, Try again!");
//             }
//         }, function errorCallback(response) {
//             console.log(response);
//             hideLoader();
//             showError("Error while placing order, Check you internet connection!");
//         });
//     };
//     $scope.placeOrderOnBlueSky = function(){
//         console.log('Rows',$scope.invoiceRows);
//         showLoader();
//         var date = new Date();
//         orderDate = date.toLocaleString('en-US');
//         var OrderDetails = [];
//         $scope.invoiceRows.forEach(item => {
//             OrderDetail = {
//                 FreeShippingItem: item.product.FreeShippingItem,
//                 OnOrder_Qty: item.qty,
//                 ProductWeight: item.product.ProductWeight,
//                 QtyOnPackingSlip: item.qty,
//                 QtyShipped: item.qty,
//                 ShipDate: orderDate,
//                 TaxableProduct: item.product.TaxableProduct,
//                 TotalPrice: item.total,
//                 ProductCode: item.product.ProductCode,
//                 Quantity: item.qty,
//                 ProductName: item.product.ProductName,
//                 ProductPrice: parseFloat(item.product.ProductPrice),
//                 DiscountValue: item.discount,
//                 Discription: item.description,
//             }
//             OrderDetails.push(OrderDetail);
//         });
//         console.log('Order detail',OrderDetails);
//         $http({
//             method: 'POST',
//             url: placeOrderBlueSkyUrl,
//             header: {
//                 'Content-Type': 'application/xml; charset=utf-8'
//             },
//             data: {
//                 BillingAddress1 : $scope.customerData.billingAddress.address1,
//                 BillingAddress2 : $scope.customerData.billingAddress.address2,
//                 BillingCity : $scope.customerData.billingAddress.city,
//                 BillingCompanyName : $scope.customerData.CompanyName,
//                 BillingCountry : $scope.customerData.billingAddress.country,
//                 BillingFirstName : $scope.customerData.customerFName,
//                 BillingLastName : $scope.customerData.customerLName,
//                 BillingPostalCode : $scope.customerData.billingAddress.postalCode,
//                 BillingState : $scope.customerData.billingAddress.state,
//                 Customer_IPAddress : $scope.currentIP,
//                 CustomerID : $scope.customerData.customerID,
//                 IsAGift :'N',
//                 IsGTSOrder : false,
//                 LastModBy : 4711, //Colt developer
//                 LastModified : orderDate,
//                 Order_Comments : $scope.notes,
//                 OrderDate : orderDate,
//                 OrderStatus : 'New',
//                 PaymentAmount : (($scope.total + $scope.freight) + (($scope.taxShipping / 100) * $scope.total)),
//                 PaymentMethodID : 5,
//                 Printed : 'N',
//                 SalesRep_CustomerID : 4711, //Colt developer
//                 SalesTax1 : (($scope.taxShipping / 100) * $scope.total),
//                 SalesTaxRate1 : $scope.taxShipping,
//                 ShipAddress1 : $scope.customerData.shippingAddress.address1,
//                 ShipAddress2 : $scope.customerData.billingAddress.address2,
//                 ShipCity : $scope.customerData.shippingAddress.city,
//                 ShipCompanyName : $scope.customerData.CompanyName,
//                 ShipCountry : $scope.customerData.shippingAddress.country,
//                 ShipFirstName : $scope.customerData.customerFName,
//                 ShipLastName : $scope.customerData.customerLName,
//                 Shipped : 'Y',
//                 ShippingMethodID : 1000,
//                 ShipPostalCode : $scope.customerData.shippingAddress.postalCode,
//                 ShipResidential : 'N',
//                 ShipState : $scope.customerData.shippingAddress.state,
//                 Stock_Priority : 3,
//                 Tax1_Title : "Tax ("+$scope.taxShipping+"%)",
//                 Affiliate_Commissionable_Value : $scope.total,
//                 Total_Payment_Authorized : (($scope.total + $scope.freight) + (($scope.taxShipping / 100) * $scope.total)),
//                 Total_Payment_Received : (($scope.total + $scope.freight) + (($scope.taxShipping / 100) * $scope.total)),
//                 TotalShippingCost : $scope.freight,
//                 Order_Entry_System : 'BlueSky',
//                 UserId: $scope.currentUser.id,
//                 QuoteNo: quoteNo,
//                 OrderDetails: OrderDetails
//             }
//         }).then(function successCallback(response) {
//             hideLoader();
//             console.log("Res",response);
//             if(response.data.status && response.data.error === undefined){
//                 showSuccess("Order has been placed.")
//                 $scope.quotes.isOrdered = 1;
//                 if(response.data.data.id != undefined){
//                     orderId = response.data.data.id;
//                     var d = new Date();
//                     var pdfname =
//                     d.getFullYear() +
//                     ("0"+(d.getMonth()+1)).slice(-2) +
//                     ("0" + d.getDate()).slice(-2) + "_" +
//                     ("00000" + orderId.toString()).slice(-6);
//                     // showLoader();
//                     // window.location = "GeneratePDF/" + pdfname +'.pdf';
//                     window.open(
//                         location.origin+"/genrate-order-pdf/" + pdfname +'.pdf',
//                         '_blank' // <- This is what makes it open in a new window.
//                     );
//                 }
//             }else {
//                 console.log("Something went Wrong!",response);
//                 showError("Something went Wrong, Try again!");
//             }
//         }, function errorCallback(response) {
//             console.log(response);
//             hideLoader();
//             showError("Error while placing order, Check you internet connection!");
//         });
//     };
//     init();
// });
