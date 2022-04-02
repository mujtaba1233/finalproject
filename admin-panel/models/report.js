var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.ReportByYear = function (userID,callback) {
	
	where = " "
	if(userID > 0 && userID !== "all" && userID){
		where += " and UserId = "+ userID + " ";
	}
		// where += " and UserId = "+ userID + " ";
	var query = "SELECT DISTINCT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderYear, Count(OrderID) as quantity,SUM(case when QuoteNo > 0 then 1 else 0 end) as conertedOrdersFromQuote, SUM(PaymentAmount) as paymentAmount, SUM(SalesTax1 + SalesTax2 + SalesTax3) as totalTax, SUM(Affiliate_Commissionable_Value) as commissionableValue, SUM(TotalShippingCost) as shippingCost, (SELECT  SUM(PaymentAmount) as paymentAmount FROM orders where  (OrderStatus <> 'Cancelled' "+ where +" )  and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) and  Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = (DATE_FORMAT(curdate(),'%Y') - 1) and DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y')) <= SUBDATE(curdate(), INTERVAL 1 Year)) as previosPartial FROM orders where (OrderStatus <> 'Cancelled' "+ where +" )  and(DATE(InvoiceableOn) <= CURDATE()  or InvoiceableOn IS NULL) group by YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')));";
	// console.log(query)
	Mysql.query(query)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByYear, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};
exports.ReportByMonth = function (year,userID, callback) {
	year = parseInt(year);
	where = " "
	if(userID > 0){
		where += " and UserId = "+ userID + " ";
	}

	var query = "SELECT DISTINCT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderYear, Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth,Count(OrderID) as quantity,SUM(case when QuoteNo > 0 then 1 else 0 end) as conertedOrdersFromQuote, SUM(PaymentAmount) as paymentAmount, SUM(SalesTax1 + SalesTax2 + SalesTax3) as totalTax, SUM(Affiliate_Commissionable_Value) as commissionableValue, SUM(TotalShippingCost) as shippingCost,(SELECT  SUM(PaymentAmount) as paymentAmount FROM orders where  OrderStatus <> 'Cancelled' "+ where +"  and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) and  Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = (DATE_FORMAT(curdate(),'%Y') - 1) and Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = (DATE_FORMAT(curdate(),'%c')) and DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y')) <= SUBDATE(curdate(), INTERVAL 1 Year)) as previosPartial FROM orders where OrderStatus <> 'Cancelled' "+ where +" and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) and( Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + year + " or Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + (year - 1) + ") group by Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))), Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')));";
	Mysql.query(query)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByMonth, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};
exports.ReportByAllFilter = function (params, callback) {
	year = parseInt(params.year);
	let where = '';
	let query = ''
	if (params.country  !== '' && params.country !== null && params.country !== 'undefined') {
		where = where + " and ShipCountry= '" + params.country + "' "
	}
	if (params.company  !== '' && params.company !== null && params.company !== 'undefined') {
		where = where + " and ShipCompanyName= '" + params.company + "' "
	}
	if (params.year !== "allYear") {
		where = where + " and Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + year
		query = "SELECT DISTINCT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderYear, Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth,Count(OrderID) as quantity, SUM(SalesTax1 + SalesTax2 + SalesTax3) as totalTax, SUM(TotalShippingCost) as shippingCost FROM orders where OrderStatus <> 'Cancelled' and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) " + where + " group by Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))), Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) ;";
	} else {
		query = "SELECT DISTINCT Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth,Count(OrderID) as quantity, SUM(SalesTax1) as totalTax, SUM(TotalShippingCost) as shippingCost FROM orders where OrderStatus <> 'Cancelled' and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) " + where + " group by  Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) ;";
	}
	console.log(query)
	Mysql.query(query)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByAllFilter, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};
exports.ReportByDay = function (year, month,userID, callback) {
	where = " "
	if(userID > 0){
		where += " and UserId = "+ userID + " ";
	}
	Mysql.query("SELECT DISTINCT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) as orderYear, Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth, Day(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')) As orderDate, Count(OrderID) as quantity,SUM(case when QuoteNo > 0 then 1 else 0 end) as conertedOrdersFromQuote, SUM(PaymentAmount) as paymentAmount, SUM(SalesTax1 + SalesTax2 + SalesTax3) as totalTax, SUM(Affiliate_Commissionable_Value) as commissionableValue, SUM(TotalShippingCost) as shippingCost FROM orders where  (OrderStatus <> 'Cancelled' "+ where +" ) and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) and  Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + year + " and Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + month + " group by DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'));")
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByDay, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};

exports.ReportByDate = function (year, month, date,userID, callback) {
	where = " "
	if(userID > 0){
		where += " and UserId = "+ userID + " ";
	}

	Mysql.query("SELECT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) as orderYear, Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth, Day(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')) As orderDate, OrderID as orders, PaymentAmount as paymentAmount,QuoteNo as conertedOrdersFromQuote, SalesTax1 as totalTax, Affiliate_Commissionable_Value as commissionableValue, TotalShippingCost as shippingCost FROM orders where (OrderStatus <> 'Cancelled' "+ where +" ) and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) and Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + year + " and Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + month + " and Day(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')) = " + date)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByDate, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};
exports.ReportByCountry = function (country, callback) {
	Mysql.query("SELECT YEAR(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) as orderYear, Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) As orderMonth, Day(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')) As orderDate, OrderID as orders, PaymentAmount as paymentAmount, SalesTax1 as totalTax, Affiliate_Commissionable_Value as commissionableValue, TotalShippingCost as shippingCost FROM orders where OrderStatus <> 'Cancelled' and country = " + ShipCountry)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ReportByCountry, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});
};
exports.ProductSalesReport = function (params, callback) {
	let year = parseInt(params.year);
	let where = '';
	if (params.year !== "2007-2021") {
		where = where + " and Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = " + year
	}
	if (params.country.length) {
		where = where + " and ShipCountry IN ('" + (params.country.toString()).replace( ",", "', '") + "') "
	}
	if (params.company.length) {
		where = where + " and BillingCompanyName IN ('" + (params.company.toString()).replace( ",", "', '") + "') "

		console.log(where, "QUERY")
	}
	Mysql.query("select od.ProductID,ShipCountry, ShipCompanyName,od.OrderID, od.ProductName, od.ProductCode, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 1  " +
			" then Quantity else 0 end) jan, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 1  " +
			" then od.TotalPrice else 0 end) janAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 2  " +
			" then Quantity else 0 end) feb, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 2  " +
			" then od.TotalPrice else 0 end) febAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 3  " +
			" then Quantity else 0 end) mar, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 3  " +
			" then od.TotalPrice else 0 end) marAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 4  " +
			" then Quantity else 0 end) apr, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 4  " +
			" then od.TotalPrice else 0 end) aprAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 5  " +
			" then Quantity else 0 end) may, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 5  " +
			" then od.TotalPrice else 0 end) mayAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 6  " +
			" then Quantity else 0 end) jun, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 6  " +
			" then od.TotalPrice else 0 end) junAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 7  " +
			" then Quantity else 0 end) jul, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 7  " +
			" then od.TotalPrice else 0 end) julAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 8  " +
			" then Quantity else 0 end) aug, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 8  " +
			" then od.TotalPrice else 0 end) augAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 9  " +
			" then Quantity else 0 end) sep, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 9  " +
			" then od.TotalPrice else 0 end) sepAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 10 " +
			" then Quantity else 0 end) oct, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 10 " +
			" then od.TotalPrice else 0 end) octAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 11 " +
			" then Quantity else 0 end) nov, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 11 " +
			" then od.TotalPrice else 0 end) novAmount, " +

			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 12 " +
			" then Quantity else 0 end) des, " +
			" sum(case when Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = 12 " +
			" then od.TotalPrice else 0 end) desAmount, " +

			" sum(od.TotalPrice) as totalAmount, " +

			" sum(od.Quantity) as totalQty " +

			" from order_details od " +
			" join orders o on od.OrderID = o.OrderID " +
			" where OrderStatus <> 'Cancelled'  and (DATE(InvoiceableOn) <= CURDATE() or InvoiceableOn IS NULL) " + where +
			" group by od.ProductCode " +
			" order by totalAmount desc;")
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: report.js, \nAction: ProductSalesReport, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			reject(err);
		});

};