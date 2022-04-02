require('dotenv').config()
var Mysql = require('../helpers/database-manager')
var moment = require('moment');
const { slack } = require('../helpers/slack-helper');

exports.GeneralSearch = function (searchQuery,callback) {
	var search = '"%'+searchQuery+'%"'
	var query = ""+
	" select OrderID, OrderDate as createdOn, OrderID as result, \'OrderID\' as columnName, \'order\' as type from orders where OrderID like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingAddress1 as result, \'BillingAddress1\' as columnName, \'order\' as type  from orders where PaymentAmount like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingAddress2 as result, \'BillingAddress2\' as columnName, \'order\' as type  from orders where BillingAddress2 like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingCity as result, \'BillingCity\' as columnName, \'order\' as type  from orders where BillingCity like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingCompanyName as result, \'BillingCompanyName\' as columnName, \'order\' as type  from orders where BillingCompanyName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingCountry as result, \'BillingCountry\' as columnName, \'order\' as type  from orders where BillingCountry like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingFaxNumber as result, \'BillingFaxNumber\' as columnName, \'order\' as type  from orders where BillingFaxNumber like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingFirstName as result, \'BillingFirstName\' as columnName, \'order\' as type  from orders where BillingFirstName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingLastName as result, \'BillingLastName\' as columnName, \'order\' as type  from orders where BillingLastName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingPhoneNumber as result, \'BillingPhoneNumber\' as columnName, \'order\' as type  from orders where BillingPhoneNumber like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingPostalCode as result, \'BillingPostalCode\' as columnName, \'order\' as type  from orders where BillingPostalCode like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, BillingState as result, \'BillingState\' as columnName, \'order\' as type  from orders where BillingState like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, CustomerID as result, \'CustomerID\' as columnName, \'order\' as type  from orders where CustomerID like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, Order_Comments as result, \'Order_Comments\' as columnName, \'order\' as type  from orders where Order_Comments like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, OrderDate as result, \'OrderDate\' as columnName, \'order\' as type  from orders where OrderDate like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, OrderNotes as result, \'PrivateNotes\' as columnName, \'order\' as type  from orders where OrderNotes like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, OrderStatus as result, \'OrderStatus\' as columnName, \'order\' as type  from orders where OrderStatus like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, PaymentAmount as result, \'PaymentAmount\' as columnName, \'order\' as type  from orders where PaymentAmount like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, PONum as result, \'PONum\' as columnName, \'order\' as type  from orders where PONum like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, SalesRep_CustomerID as result, \'SalesRep_CustomerID\' as columnName, \'order\' as type  from orders where SalesRep_CustomerID like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, SalesTax1 as result, \'SalesTax1\' as columnName, \'order\' as type  from orders where SalesTax1 like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, SalesTaxRate as result, \'SalesTaxRate\' as columnName, \'order\' as type  from orders where SalesTaxRate like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, SalesTaxRate1 as result, \'SalesTaxRate1\' as columnName, \'order\' as type  from orders where SalesTaxRate1 like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipAddress1 as result, \'ShipAddress1\' as columnName, \'order\' as type  from orders where ShipAddress1 like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipAddress2 as result, \'ShipAddress2\' as columnName, \'order\' as type  from orders where ShipAddress2 like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipCity as result, \'ShipCity\' as columnName, \'order\' as type  from orders where ShipCity like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipCompanyName as result, \'ShipCompanyName\' as columnName, \'order\' as type  from orders where ShipCompanyName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipCountry as result, \'ShipCountry\' as columnName, \'order\' as type  from orders where ShipCountry like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipFirstName as result, \'ShipFirstName\' as columnName, \'order\' as type  from orders where ShipFirstName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipLastName as result, \'ShipLastName\' as columnName, \'order\' as type  from orders where ShipLastName like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipPhoneNumber as result, \'ShipPhoneNumber\' as columnName, \'order\' as type  from orders where ShipPhoneNumber like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipPostalCode as result, \'ShipPostalCode\' as columnName, \'order\' as type  from orders where ShipPostalCode like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, ShipState as result, \'ShipState\' as columnName, \'order\' as type  from orders where ShipState like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, Tax1_IgnoreNoTaxRules as result, \'Tax1_IgnoreNoTaxRules\' as columnName, \'order\' as type  from orders where Tax1_IgnoreNoTaxRules like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, Tax1_Title as result, \'Tax1_Title\' as columnName, \'order\' as type  from orders where Tax1_Title like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, Total_Payment_Authorized as result, \'Total_Payment_Authorized\' as columnName, \'order\' as type  from orders where Total_Payment_Authorized like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, Total_Payment_Received as result, \'Total_Payment_Received\' as columnName, \'order\' as type  from orders where Total_Payment_Received like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, TotalShippingCost as result, \'TotalShippingCost\' as columnName, \'order\' as type  from orders where TotalShippingCost like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, VendorID as result, \'VendorID\' as columnName, \'order\' as type  from orders where VendorID like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, pdfname as result, \'pdfname\' as columnName, \'order\' as type  from orders where pdfname like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, QuoteNo as result, \'QuoteNo\' as columnName, \'order\' as type  from orders where QuoteNo like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, PrivateNotes as result, \'PrivateNotes\' as columnName, \'order\' as type  from orders where PrivateNotes like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, UserId as result, \'UserId\' as columnName, \'order\' as type  from orders where UserId like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, OrderSerials as result, \'OrderSerials\' as columnName, \'order\' as type  from orders where OrderSerials like  " + search + "  union" +
	" select OrderID, OrderDate as createdOn, OldOrder as result, \'OldOrder\' as columnName, \'order\' as type  from orders where OldOrder like  " + search + " union" +

	" select QuoteNo as OrderID, IssueDate as createdOn, QuoteNo as result, \'OrderID\' as columnName, \'quote\' as type from quotes where QuoteNo like  " + search + "  union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, CustomerID as result, \'CustomerID\' as columnName, \'quote\' as type from quotes where CustomerID like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingStreetAddress1 as result, \'BillingStreetAddress1\' as columnName, \'quote\' as type from quotes where BillingStreetAddress1 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingStreetAddress2 as result, \'BillingStreetAddress2\' as columnName, \'quote\' as type from quotes where BillingStreetAddress2 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingCity1 as result, \'BillingCity1\' as columnName, \'quote\' as type from quotes where BillingCity1 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingCountry1 as result, \'BillingCountry1\' as columnName, \'quote\' as type from quotes where BillingCountry1 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingState as result, \'BillingState\' as columnName, \'quote\' as type from quotes where BillingState like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, BillingPostalCode as result, \'BillingPostalCode\' as columnName, \'quote\' as type from quotes where BillingPostalCode like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingAddress1 as result, \'ShippingAddress1\' as columnName, \'quote\' as type from quotes where ShippingAddress1 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingAddress2 as result, \'ShippingAddress2\' as columnName, \'quote\' as type from quotes where ShippingAddress2 like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingCity as result, \'ShippingCity\' as columnName, \'quote\' as type from quotes where ShippingCity like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingCountry as result, \'ShippingCountry\' as columnName, \'quote\' as type from quotes where ShippingCountry like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingState as result, \'ShippingState\' as columnName, \'quote\' as type from quotes where ShippingState like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, ShippingPostalCode as result, \'ShippingPostalCode\' as columnName, \'quote\' as type from quotes where ShippingPostalCode like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, CustomerFName as result, \'CustomerFName\' as columnName, \'quote\' as type from quotes where CustomerFName like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, CustomerLName as result, \'CustomerLName\' as columnName, \'quote\' as type from quotes where CustomerLName like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, Freight as result, \'Freight\' as columnName, \'quote\' as type from quotes where Freight like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, TaxShipping as result, \'TaxShipping\' as columnName, \'quote\' as type from quotes where TaxShipping like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, notes as result, \'notes\' as columnName, \'quote\' as type from quotes where notes like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, pdfname as result, \'pdfname\' as columnName, \'quote\' as type from quotes where pdfname like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, CustomerCompany as result, \'CustomerCompany\' as columnName, \'quote\' as type from quotes where CustomerCompany like " + search + " union" +
	" select QuoteNo as OrderID, IssueDate as createdOn, PrivateNotes as result, \'PrivateNotes\' as columnName, \'quote\' as type from quotes where PrivateNotes like " + search + " union" +

	" select id as OrderID, RMAIssuedDate as createdOn, id as result, \'id\' as columnName, \'RMA\' as type from rmadatabase where id like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, Device as result, \'Device\' as columnName, \'RMA\' as type from rmadatabase where Device like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, SN as result, \'SN\' as columnName, \'RMA\' as type from rmadatabase where SN like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, HavePO as result, \'HavePO\' as columnName, \'RMA\' as type from rmadatabase where HavePO like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, RMAIssuedDate as result, \'RMAIssuedDate\' as columnName, \'RMA\' as type from rmadatabase where RMAIssuedDate like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, RMANumber as result, \'RMANumber\' as columnName, \'RMA\' as type from rmadatabase where RMANumber like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, ReceivedByName as result, \'ReceivedByName\' as columnName, \'RMA\' as type from rmadatabase where ReceivedByName like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, ReceivedDateTime as result, \'ReceivedDateTime\' as columnName, \'RMA\' as type from rmadatabase where ReceivedDateTime like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, UnitInfo as result, \'UnitInfo\' as columnName, \'RMA\' as type from rmadatabase where UnitInfo like " + search + " union" +
	" select id as OrderID, RMAIssuedDate as createdOn, FinishedDayTime as result, \'FinishedDayTime\' as columnName, \'RMA\' as type from rmadatabase where FinishedDayTime like " + search + " order by OrderID desc limit 200;";
    Mysql.query(query)
    .then(function (results) {
        callback(results);
    })
    .catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: dashboard.js, \nAction: GeneralSearch, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        reject(err);
    });
};
exports.Widget1 = function (year,callback) {
    year = parseInt(year);
    var query = "";
    Mysql.query(query)
    .then(function (results) {
        callback(results);
    })
    .catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: dashboard.js, \nAction: Widget1, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        reject(err);
    });
};
exports.Widget2 = function (year,month,callback) {
    Mysql.query("")
    .then(function (results) {
        callback(results);
    })
    .catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: dashboard.js, \nAction: Widget2, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        reject(err);
    });
};

exports.Widget3 = function (year,month,date,callback) {
    Mysql.query("")
    .then(function (results) {
        callback(results);
    })
    .catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: dashboard.js, \nAction: Widget2, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        reject(err);
    });
};
