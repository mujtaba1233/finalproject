var Mysql = require('../helpers/database-manager')
var moment = require('moment');
var async = require('async');
var uttils = require('../helpers/utilities');
var mailHelper = require('../helpers/mailHelper');
const { slack } = require('../helpers/slack-helper');


exports.SyncOrders = function (orders, insertEndCallback) {
	if (orders != undefined && orders[0].OrderDetails != undefined) {
		var OrderCounter = 0;
		var callbackCount = orders.length;
		var InsertOrder = function (order) {
			console.log(new Date(), 'OrderID ', order.OrderID);
			async.waterfall([
				function (callback) {
					OrderDetails = order.OrderDetails;
					order.SalesTaxRate1 = order.SalesTaxRate1 * 100
					order.SalesTaxRate2 = order.SalesTaxRate2 * 100
					order.SalesTaxRate3 = order.SalesTaxRate3 * 100
					delete order.OrderDetails;
					Mysql.insertUpdate('orders', order, order)
						.then(function (info) {
							console.log(new Date(), "order Info *+*+*+*+**+*+*+*+*", info.affectedRows);
							callback(null, OrderDetails);
						})
						.catch(function (err) {
							error = JSON.stringify(err)
							slack(`File: order.js, \nAction:SyncOrders , \nError ${error} \n 
							`, 'J.A.R.V.I.S', 'C029PF7DLKE')
							console.log(new Date(), "order Err ================== ", err);
							callback(null, OrderDetails);
						});
				},
				function (orderDetails, callback) {
					if (OrderDetails) {
						count = OrderDetails.length
						Mysql.query("Delete from order_details where OrderID = " + OrderDetails[0].OrderID)
							.then(function (results) {
								for (var j = 0; j < OrderDetails.length; j++) {
									delete OrderDetails[j].OrderDetailID;
									OrderDetails[j].displayOrder = j;
									Mysql.insertUpdate('order_details', OrderDetails[j], OrderDetails[j])
										.then(function (info) {
											console.log(new Date(), "detail Info *+*+*+*+**+*+*+*+*", info.affectedRows);
											count--;
											if (count == 0)
												callback(null, OrderDetails);
										})
										.catch(function (err) {
											error = JSON.stringify(err)
											slack(`File: order.js, \nAction:SyncOrders , \nError ${error} \n 
											`, 'J.A.R.V.I.S', 'C029PF7DLKE')
											console.log(new Date(), "detail Err ================== ", err);
											count--;
											if (count == 0)
												callback(null, OrderDetails);
										});
								}
							})
							.catch(function (err) {
								error = JSON.stringify(err)
								slack(`File: order.js, \nAction:SyncOrders , \nError ${error} \n 
								`, 'J.A.R.V.I.S', 'C029PF7DLKE')
								console.log(new Date(), err);
							});
					} else {
						callback(null, OrderDetails);
					}
				},
				function (something, callback) {
					callbackCount--;
					if (callbackCount == 0) {
						insertEndCallback();
					} else {
						OrderCounter = OrderCounter + 1;
						InsertOrder(orders[OrderCounter])
					}
				}
			], function (error, success) {
				if (error) {
					error = JSON.stringify(err)
					slack(`File: order.js, \nAction:SyncOrders , \nError ${error} \n 
					`, 'J.A.R.V.I.S', 'C029PF7DLKE')
					console.log(new Date(), error)
				}
				return;
			});
		}
		InsertOrder(orders[OrderCounter]);
	} else {
		// error = JSON.stringify(err)
		slack(`File: order.js, \nAction:SyncOrders , \nError orders undefined \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), "orders undefined");
	}
};


exports.GetOrderTrack = function (orderId, callback) {
	Mysql.query("SELECT *, count(ts.id) countOfLineItems from order_tracking_no ot left join tracking_shipping_lineitems ts on  ts.trackShippingId  =  ot.id where ot.OrderID = " + orderId + " group by ot.id")
		.then(function (results) {
			if (results.length > 0) {
				callback(results);
			} else {
				callback([{}])
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction:GetOrderTrack , \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			// reject(err);
		});
};
exports.deleteOrderTrack = function (Id, callback) {
	Mysql.delete('order_tracking_no', { Id: Id })
		.then(function (result) {
			callback({ status: true, msg: "Deleted.", result: result });
		})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction: deleteOrderTrack, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), 'Error deleting record, mysql error:', err.message);
			callback({ status: false, msg: err.message });
		});
}
exports.GetOrderPackages = function (orderId, callback) {
	Mysql.query("SELECT * from order_packages where OrderID = " + orderId + " ")
		.then(function (results) {
			if (results.length > 0) {
				callback(results);
			} else {
				callback([{
					OrderNotFound: true,
				}])
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction:GetOrderPackages , \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			// reject(err);
		});
};

exports.InsertOrders = async function (order, insertEndCallback) {
	// console.log(order,"model insert order")

	if (order != undefined && order.OrderDetails != undefined) {
		var dataForEmail = JSON.parse(JSON.stringify(order));
		var OrderDetails = order.OrderDetails;
		// console.log(OrderDetails)
		var quoteId = order.QuoteNo;
		let toShippedTotal = 0
		var userId = order.UserId;
		let TrackingNo = "N/A"
		if (order.TrackingNo) {
			TrackingNo = order.TrackingNo
		}
		if (order.parcels && order.OrderID) {
			var parcels = order.parcels
			parcels.map(elem => {
				if (elem.OrderNotFound) delete elem.OrderNotFound
				else delete elem.OrderNotFound
				elem.orderId = order.OrderID
			})
			delete order.parcels
		}
		delete order.OrderDetails;
		try {
			if (order.OrderID === undefined) {
				const record = await Mysql.query("SELECT max(OrderID) as id FROM orders", {})
				if (record.length > 0) {
					var id = record[0].id ? parseInt(record[0].id) : 0;
					if (!id || id < 50000) {
						id = 50001
					} else {
						id = id + 1;
					}
					order.OrderID = id;
				} else {
					var id = 50001
				}
			} else {
				var id = order.OrderID;
			}
		} catch (error) {
			console.log(new Date(), error);
			err = JSON.stringify(error.message)
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		//shipping track
		try {
			OrderDetails.map(async (OrderDetail, index) => {
				toShippedTotal += OrderDetail.qutantityForTrackToShipped ? OrderDetail.qutantityForTrackToShipped : 0
				delete OrderDetail.qutantityForTrackToShipped
			})
			if (order.OrderStatus != undefined && (order.OrderStatus == 'Shipped' || order.OrderStatus == 'Partially Shipped') && toShippedTotal > 0) {
				let Gateway = 'OTHER'
				if (order.ShippingMethodID && order.ShippingMethodID >= 700 && order.ShippingMethodID < 800)
					Gateway = 'UPS'
				else if (order.ShippingMethodID && order.ShippingMethodID >= 400 && order.ShippingMethodID < 500)
					Gateway = 'DHL'
				let trackObj = {
					TrackingNo: TrackingNo,
					Gateway,
					ShipDate: order.ShipDate,
					OrderId: order.OrderID,
					ShipmentCost: order.TotalShippingCost,
					ShippingMethodID: order.ShippingMethodID ? order.ShippingMethodID : 0,
					OrderType: order.OrderStatus,
					updatedBy : order.LastModBy
				}
				let result = await Mysql.insertUpdate('order_tracking_no', trackObj, trackObj)
				try {
					await Promise.all(OrderDetails.map(async (OrderDetail, index) => {
						let trackLineItemObject = {
							trackShippingId : result.insertId,
							orderId : id,
							displayOrder: index,
							quantity : OrderDetail.QtyOnPackingSlip,
							productId : OrderDetail.ProductID,
							productCode : OrderDetail.ProductCode,
							productDescription : OrderDetail.Discription,
							isChild:OrderDetail.isChild,
							createdAt : new Date(),
							createdBy : userId,
							updatedAt : new Date(),
							updatedBy : order.LastModBy
						}
						try {
							const responseOfTrackingShippingLineItems = await Mysql.insert('tracking_shipping_lineitems', trackLineItemObject)
						} catch (error) {
							console.log(error)
						}
					}));
				} catch (error) {
					console.log(error)
				}
			}
		} catch (e) {
			console.log(e)
		}
		//shipping track

		try {
			if (order.OrderStatus != undefined && (order.OrderStatus == 'Shipped' || order.OrderStatus == 'Partially Shipped') && toShippedTotal <= 0)
				delete order.ShipDate
			const OrderToInsert = {};
			for (const key in order) {
				if (order[key] || order[key] == 0 || order[key] == '') {
					OrderToInsert[key] = order[key];
				}
			}
			await Mysql.insertUpdate('orders', OrderToInsert, OrderToInsert)
			var orderStatus = await Mysql.query("SELECT * FROM orders where OrderID = " + order.OrderID)
			if (orderStatus[0].Order_Entry_System == 'ONLINE') {
				if (orderStatus != undefined
					&&
					order.OrderStatus == 'Shipped' ||
					order.OrderStatus == 'Partially Shipped' ||
					order.OrderStatus == 'Processing') {
					var shippingMethod = []
					var customerEmail = await Mysql.query("select * from customers where CustomerID = " + order.CustomerID)
					if (orderStatus[0].ShippingMethodID)
						shippingMethod = await Mysql.query("select * from shipping_methods where id = " + orderStatus[0].ShippingMethodID)
					dataForEmail.EmailAddress = customerEmail[0].EmailAddress
					dataForEmail.OrderStatus = order.OrderStatus
					dataForEmail.CurrencyCode = '$';
					dataForEmail.CC_Last4 = orderStatus[0].CC_Last4 ? orderStatus[0].CC_Last4 : "N/A";
					dataForEmail.Service = shippingMethod[0] ? shippingMethod[0].name : 'N/A';
					sendOrderStatusMail(dataForEmail);
				}
			}
		} catch (error) {
			err = JSON.stringify(error.message)
			console.log(new Date(), error);
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), Mysql.getLastQuery(), "order Err ================== ", error);
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		//packages
		if (parcels && order.OrderID) {

			try {
				await Mysql.query("Delete from order_packages where OrderID = " + order.OrderID)
			} catch (error) {
				err = JSON.stringify(error.message)
				console.log(new Date(), error);
				slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
				console.log(new Date(), error);
				insertEndCallback({
					status: false,
					error: error,
					data: undefined
				});
				return
			}

			try {
				parcels.forEach(async elem => {
					try {
						await Mysql.insert('order_packages', elem)
					} catch (e) {
						console.log("order_packages", e);
					}
				});
			} catch (e) {
				console.log("order_packages", e);
			}


		}
		//packages
		try {
			await Mysql.query("Delete from order_details where OrderID = " + id)
		} catch (error) {
			err = JSON.stringify(error.message)
			console.log(new Date(), error);
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), error);
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		try {
			if (orderStatus != undefined && (order.OrderStatus == 'Partially Shipped' || order.OrderStatus == 'Shipped'))
				await Mysql.update('product_serials', { OrderID: id }, { status: "shipped", OrderID: id })

		} catch (error) {
			err = JSON.stringify(error.message)
			console.log(new Date(), error);
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), 'Error updating product_serials by order, mysql error:', error);
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		try {
			await Mysql.update('quotes', {
				QuoteNo: quoteId
			}, {
				isOrdered: true,
				orderBy: userId,
				orderId: id
			})
		} catch (error) {
			err = JSON.stringify(error.message)
			console.log(new Date(), error);
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), 'Error updating quote for order, mysql error:', error);
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		try {
			await Promise.all(OrderDetails.map(async (OrderDetail, index) => {
				OrderDetail.displayOrder = index;
				OrderDetail.OrderID = id;
				const OrderDetailToInsert = {};
				for (const key in OrderDetail) {
					if (OrderDetail[key] || OrderDetail[key] == 0 || OrderDetail[key] == '') {
						OrderDetailToInsert[key] = OrderDetail[key];
					}
				}
				await Mysql.insert('order_details', OrderDetailToInsert)
			}));
		} catch (error) {
			err = JSON.stringify(error.message)
			console.log(new Date(), error);
			slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), "detail Err ================== ", error);
			insertEndCallback({
				status: false,
				error: error,
				data: undefined
			});
			return
		}
		// try {
		// 	for (const OrderDetail of OrderDetails) {
		// 		var serials = OrderDetail.ProductSerials.split(',');
		// 		console.log("order id for serial : ",id)
		// 		console.log("order serials : ",serials)
		// 		// await Promise.all(serials.map(async (serial) => {
		// 		// 	if (serial)
		// 		// 		await Mysql.insertUpdate('product_serials', { //insert
		// 		// 			SerialNO: serial,
		// 		// 			ProductID: OrderDetail.ProductID,
		// 		// 			IsSold: 1,
		// 		// 			IsStock: 1,
		// 		// 			createdOn: new Date(),
		// 		// 			updatedOn: new Date(),
		// 		// 			OrderID: id
		// 		// 		}, { //update
		// 		// 			SerialNO: serial,
		// 		// 			IsSold: 1,
		// 		// 			updatedOn: new Date(),
		// 		// 			OrderID: id,
		// 		// 		})
		// 		// }));
		// 	}
		// } catch (error) {
		// 	console.log(new Date(), 'Error updating product_serials, mysql error:', error);
		// 	insertEndCallback({ status: false, error: error, data: undefined });
		// 	return
		// }
		insertEndCallback({ status: true, error: undefined, data: { id: id } });
		return
		// Mysql.query("Delete FROM orders where OrderID = " + id, {}).then(function (records) {
		// 	Mysql.query("Delete FROM order_details where OrderID = " + id, {}).then(function (records) {
		// 		insertEndCallback({
		// 			status: false,
		// 			error: err,
		// 		});
		// 	}).catch(function (err) {
		// 		console.log(new Date(), 'Error fetching record, mysql error:', err.message);
		// 	});
		// }).catch(function (err) {
		// 	console.log(new Date(), 'Error fetching record, mysql error:', err.message);
		// });
	} else {
		slack(`File: order.js, \nAction:InsertOrders , \nError orders or order details undefined \n`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), "order undefined");
	}
};

exports.GetOrdersByStatus = function (query, callback) {
	let where = ' where o.OrderID > 0 ';
	let join = ''
	if (query.serialNo) {
		where += " and OrderSerials LIKE '%%%%%" + query.serialNo + "%%%%%' "
	}
	if (query.dates && query.dates.to && query.dates.from)
		where += " and (DATE(STR_TO_DATE(o.OrderDate, '%c/%e/%Y %r')) >= '" + query.dates.from + "' AND DATE(STR_TO_DATE(o.OrderDate, '%c/%e/%Y %r')) <= '" + query.dates.to + "' )"

	if (query.status === 'open')
		where += " && ( `OrderStatus` = 'New' " +
			" or `OrderStatus` = 'Pending'  " +
			" or `OrderStatus` = 'Hold'  " +
			" or `OrderStatus` = 'Accepted'  " +
			" or `OrderStatus` = 'Queue'  " +
			" or `OrderStatus` = 'Partially Shipped'  " +
			" or `OrderStatus` = 'Backordered'  " +
			" or `OrderStatus` = 'Processing' ) "
	if (query.status === 'allIncludeCanceled')
	where += " && ( `OrderStatus` = 'New' " +
		" or `OrderStatus` = 'Pending'  " +
		" or `OrderStatus` = 'Hold'  " +
		" or `OrderStatus` = 'Accepted'  " +
		" or `OrderStatus` = 'Queue'  " +
		" or `OrderStatus` = 'Partially Shipped'  " +
		" or `OrderStatus` = 'Shipped'  " +
		" or `OrderStatus` = 'Backordered'  " +
		" or `OrderStatus` = 'Cancelled'  " +
		" or `OrderStatus` = 'New - See Order Notes'  " +
		" or `OrderStatus` = 'Demo Pending'  " +
		" or `OrderStatus` = 'Demo Returned'  " +
		" or `OrderStatus` = 'Returned'  " +
		" or `OrderStatus` = 'Ready To Shipped'  " +
		" or `OrderStatus` = 'Partially Returned'  " +
		" or `OrderStatus` = 'Payment Declined'  " +
		" or `OrderStatus` = 'Processing' ) "
	if (query.status !== 'open' && query.status !== 'all' && query.status !== 'allIncludeCanceled') {
		where += " and `OrderStatus` = '" + query.status + "'";
	}
	if(query.status === 'all' ){
		where += " and `OrderStatus` <> 'Cancelled'";
	}
	if (query.country !== "all")
		where += " and (o.ShipCountry = '" + query.country + "' )"
	if (query.type !== "all")
		where += " and (o.Order_Type = '" + query.type + "')"
	if (query.productCode.length > 0){
		join += " join order_details od on o.OrderID = od.OrderID and od.ProductID in (" + query.productCode.toString() + ") "
	}
	var columnsForExport = '' //"o.Order_Entry_System, o.BillingAddress1,o.BillingAddress2,o.PONum,o.BillingCity,o.BillingCompanyName,o.BillingCountry,o.BillingFaxNumber,o.BillingFirstName,o.BillingLastName,o.BillingPhoneNumber,o.BillingPostalCode,o.BillingState,o.Order_Comments,o.ShipAddress1,o.ShipAddress2,o.ShipCity,o.ShipCompanyName,o.ShipCountry,o.ShipDate,o.CancelDate,o.ShipFaxNumber,o.ShipFirstName,o.ShipLastName,o.Shipped,o.ShipPhoneNumber,o.ShipPostalCode,o.ShipState,o.OrderNotes, "
	var query = "SELECT IsPayed," + columnsForExport + "o.BillingCompanyName,o.OrderNotes,o.ShipCompanyName,o.Order_Entry_System,u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName,o.OldOrder, s.LastName as CreatedByVoluLastName, o.OrderSerials, o.OrderID,o.QuoteNo,q.IssueDate,  o.InvoiceableOn, o.Order_Comments, c.EmailAddress,o.CustomerID,o.ShipCountry,o.ShipDate,o.OrderStatus,PaymentAmount, o.BillingCompanyName as CompanyName, o.BillingFirstName as FirstName,o.BillingLastName as LastName,OrderDate,o.BillingCity as City FROM orders o "+ join + " left join customers c on o.CustomerID = c.CustomerID left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId " + where + " group by `OrderID` order by `OrderID` desc ";
	Mysql.query(query, {}).then(function (records) {
		// console.log(records)
		callback(records);
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: order.js, \nAction:GetOrdersByStatus , \nError ${error} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error fetching orders, mysql error:', err.message);
		callback({
			err: err
		});
	});
}

exports.GetOrders = function (query, callback) {
	where = '';
	if (query.duration && query.duration !== 'all') {
		where = " where DATE(STR_TO_DATE(o.OrderDate, '%c/%e/%Y %r')) >= now()-interval " + query.duration + " month "
	} else if (query.startTime) {
		where = " where DATE(STR_TO_DATE(o.OrderDate, '%c/%e/%Y %r')) >= '" + query.startTime + "' AND DATE(STR_TO_DATE(o.OrderDate, '%c/%e/%Y %r')) <= '" + query.endTime + "'"
	} else if (query.openStatus) {
		where = " where (o.OrderStatus = 'New'  " +
			" or o.OrderStatus = 'Pending'  " +
			" or `OrderStatus` = 'Hold'  " +
			" or `OrderStatus` = 'Accepted'  " +
			" or `OrderStatus` = 'Queue'  " +
			" or o.OrderStatus = 'Partially Shipped' " +
			" or o.OrderStatus = 'Backordered' " +
			" or o.OrderStatus = 'Proccessing') " +
			" group by o.OrderID " +
			" order by o.OrderID desc; ";
	}
	var columnsForExport = "o.Order_Entry_System,o.OrderNotes, o.BillingAddress1,o.BillingAddress2,o.PONum,o.BillingCity,o.BillingCompanyName,o.BillingCountry,o.BillingFaxNumber,o.BillingFirstName,o.BillingLastName,o.BillingPhoneNumber,o.BillingPostalCode,o.BillingState,o.Order_Comments,o.ShipAddress1,o.ShipAddress2,o.ShipCity,o.ShipCompanyName,o.ShipCountry,o.ShipDate,o.CancelDate,o.ShipFaxNumber,o.ShipFirstName,o.ShipLastName,o.Shipped,o.ShipPhoneNumber,o.ShipPostalCode,o.ShipState,o.OrderNotes, "
	var query = "SELECT IsPayed," + columnsForExport + "u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName,o.OldOrder, s.LastName as CreatedByVoluLastName, o.OrderSerials, o.OrderID,o.QuoteNo,q.IssueDate,  o.InvoiceableOn, o.Order_Comments, c.EmailAddress,o.CustomerID,o.OrderStatus,PaymentAmount, o.BillingCompanyName as CompanyName, o.BillingFirstName as FirstName,o.BillingLastName as LastName,OrderDate,o.BillingCity as City FROM orders o left join customers c on o.CustomerID = c.CustomerID left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId " + where + " order by o.OrderID desc";
	Mysql.query(query, {}).then(function (records) {
		callback(records);
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: order.js, \nAction:GetOrders , \nError ${error} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error fetching orders, mysql error:', err.message);
		callback({
			err: err
		});
	});
}

exports.GetOrdersByOpenStatus = function (callback) {
	var columnsForExport = "o.Order_Entry_System,o.OrderNotes, o.BillingAddress1,o.BillingAddress2,o.PONum,o.BillingCity,o.BillingCompanyName,o.BillingCountry,o.BillingFaxNumber,o.BillingFirstName,o.BillingLastName,o.BillingPhoneNumber,o.BillingPostalCode,o.BillingState,o.Order_Comments,o.ShipAddress1,o.ShipAddress2,o.ShipCity,o.ShipCompanyName,o.ShipCountry,o.ShipDate,o.ShipFaxNumber,o.ShipFirstName,o.ShipLastName,o.Shipped,o.ShipPhoneNumber,o.ShipPostalCode,o.ShipState,o.OrderNotes, "
	var query = "SELECT od.ProductCode, IsPayed," + columnsForExport + "u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName,o.OldOrder, s.LastName as CreatedByVoluLastName, o.OrderSerials, o.OrderID,o.QuoteNo,q.IssueDate,  o.InvoiceableOn, o.Order_Comments, c.EmailAddress,o.CustomerID,o.OrderStatus,PaymentAmount, o.BillingCompanyName as CompanyName, o.BillingFirstName as FirstName,o.BillingLastName as LastName,OrderDate,o.BillingCity as City" +

		" FROM orders o left join customers c on o.CustomerID = c.CustomerID  " +
		" left join customers s on o.SalesRep_CustomerID = s.CustomerID  " +
		" left join order_details od on o.OrderID = od.OrderID " +
		" left join quotes q on q.QuoteNo = o.QuoteNo  " +
		" left join user u on u.id = o.UserId  " +
		" where (o.OrderStatus = 'New'  " +
		" or o.OrderStatus = 'Pending'  " +
		" or `OrderStatus` = 'Hold'  " +
		" or `OrderStatus` = 'Accepted'  " +
		" or `OrderStatus` = 'Queue'  " +
		" or o.OrderStatus = 'Partially Shipped' " +
		" or o.OrderStatus = 'Backordered' " +
		" or o.OrderStatus = 'Proccessing') " +
		" group by o.OrderID " +
		" order by o.OrderID desc; ";

	Mysql.query(query, {}).then(function (records) {
		callback(records);
	})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction:GetOrders , \nError ${error} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), 'Error fetching orders, mysql error:', err.message);
			callback({
				err: err
			});
		});
}

exports.GetOrder = function (orderId, callback) {
	Mysql.query("SELECT Order_Entry_System,o.ShipEmailAddress,o.InsuranceValue,o.endUserId,PONum,TrackingNo,Incoterm,CreditCardAuthorizationHash,o.QuoteNo,Order_Comments,Custom_Field_CarrierAcctNo, IsPayed,o.LastModBy,o.LastModified, OrderTaxExempt,UserId, Order_Entry_System,Total_Payment_Received, CurrentCustomerDiscount, d.Options, d.TaxableProduct, d.QtyOnPackingSlip,d.QtyShipped,d.QtyOnBackOrder, (SELECT count(ProductSerialID) from product_serials where OrderID = " + orderId + " and ProductID = d.ProductID and IsSold = 1) as shippedQty, d.parent,d.parentName,d.ProductSerials, d.isChild,m.firstname as ModifiedByBlueFirstName,m.lastname as ModifiedByBlueLastName, u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName, s.LastName as CreatedByVoluLastName,o.OrderSerials, o.InvoiceableOn ,o.OrderStatus,o.Order_Type,o.ShippingMethodID,o.PrivateNotes,o.TotalShippingCost as Freight,o.OldOrder,SalesTaxRate1 + SalesTaxRate2 + SalesTaxRate3 as TaxShipping, SalesTax1 + SalesTax2 + SalesTax3 as TotalTax,  o.Order_Comments as notes,o.OrderNotes, o.IsCustomerNameShow, o.OrderID,o.CustomerID,PaymentAmount, o.BillingCompanyName as CustomerCompany,o.ShipCompanyName,o.ShipFirstName,o.ShipLastName, o.BillingFirstName as CustomerFName,o.BillingLastName as CustomerLName,OrderDate,o.BillingAddress1 as BillingStreetAddress1, o.BillingAddress2 as BillingStreetAddress2, o.BillingCity as BillingCity1, o.BillingCountry as BillingCountry1, o.BillingState, o.BillingPhoneNumber,IsTaxExempt, o.BillingPostalCode as BillingPostalCode, ShipAddress1, ShipAddress2, ShipCity,ShipCountry, ShipState, ShipPhoneNumber, ShipPostalCode,SalesTaxRate1 + SalesTaxRate2 + SalesTaxRate3 as SalesTaxRate1,SalesTax1,o.IsCustomerEmailShow,d.ProductCode,d.ProductName,d.Discription as description,d.HarmonizedCode,d.ExportControlClassificationNumber,d.ProductWeight,d.UnitOfMeasure,d.CountryOfOrigin,d.ExportDescription, d.Quantity as Qty, d.ProductPrice as Price, d.DiscountValue as Discount FROM orders o left join order_details d on o.OrderID = d.OrderID left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId left join user m on m.id = o.LastModBy where o.OrderID = " + orderId + " order by d.displayOrder")
		.then(function (results) {
			if (results.length > 0) {
				results[0].OrderDatePDF = new Date(results[0].OrderDate);
				results[0].OrderDatePDF = moment(results[0].OrderDatePDF).format('YYYY-MM-DD');
				callback(results);
				// console.log(results)
			} else {
				callback([{
					OrderNotFound: 'OrderNotFound',
					orderId: orderId
				}])
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction:GetOrder , \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			// reject(err);
		});
};
exports.GetTrackShipping = async function (orderId,shippingId, callback) {
	try {
		const results = await Mysql.query("SELECT o.ShipEmailAddress,PONum,TrackingNo,o.CustomerID,o.OrderID,Incoterm,m.firstname as ModifiedByBlueFirstName,m.lastname as ModifiedByBlueLastName, u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName, s.LastName as CreatedByVoluLastName,o.OrderStatus,o.Order_Type,o.ShippingMethodID,PaymentAmount, o.BillingCompanyName as CustomerCompany,o.ShipCompanyName,o.ShipFirstName,o.ShipLastName, o.BillingFirstName as CustomerFName,o.BillingLastName as CustomerLName,OrderDate,o.BillingAddress1 as BillingStreetAddress1, o.BillingAddress2 as BillingStreetAddress2, o.BillingCity as BillingCity1, o.BillingCountry as BillingCountry1, o.BillingState, o.BillingPhoneNumber,o.BillingPostalCode as BillingPostalCode, ShipAddress1, ShipAddress2, ShipCity,ShipCountry, ShipState, ShipPhoneNumber, ShipPostalCode,SalesTaxRate1 + SalesTaxRate2 + SalesTaxRate3 as SalesTaxRate1,SalesTax1,o.IsCustomerEmailShow FROM orders o  left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId left join user m on m.id = o.LastModBy where o.OrderID = " + orderId )
		if (results.length > 0) {
			const resultOfShipping = await Mysql.query("SELECT id,trackShippingId,orderId,quantity as QtyOnPackingSlip,productId as ProductId ,isChild, productCode as ProductCode,productDescription as ProductName,createdAt from tracking_shipping_lineitems where orderId = " + orderId + " and trackShippingId = " + shippingId + " order by displayOrder")
			results[0].OrderDatePDF = new Date(resultOfShipping[0].createdAt);
			results[0].OrderDatePDF = moment(resultOfShipping[0].OrderDatePDF).format('YYYY-MM-DD');
			let data = []
			if(resultOfShipping.length)
			resultOfShipping.forEach((elem,index) => {
				let obj = {
					...results[0],
					...elem
				}
				data.push(obj)
				if(resultOfShipping.length === index+1)
					callback(data);
			});
		} else {
			callback([{
				OrderNotFound: 'OrderNotFound',
				orderId: orderId
			}])
		}
	} catch (err) {
		error = JSON.stringify(err.message)
		slack(`File: order.js, \nAction:GetOrder , \nError ${error} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err);
	}
	
};
exports.GetOrderBySerial = function (serialNo, callback) {
	Mysql.query("SELECT Order_Entry_System, IsPayed, Total_Payment_Received, d.Options, d.QtyOnPackingSlip,d.QtyShipped,d.QtyOnBackOrder, (SELECT count(ProductSerialID) from product_serials where OrderID = (select max(OrderID) from orders where OrderSerials like '%" + serialNo + "%' limit 1) and ProductID = d.ProductID and IsSold = 1) as shippedQty, d.parent,d.parentName,d.ProductSerials, d.isChild, u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName, s.LastName as CreatedByVoluLastName,o.OrderSerials, o.InvoiceableOn ,o.OrderStatus,o.Order_Type,o.ShippingMethodID,o.PrivateNotes,o.TotalShippingCost as Freight,o.OldOrder,SalesTaxRate1 + SalesTaxRate2 + SalesTaxRate3 as TaxShipping,  o.Order_Comments as notes, o.IsCustomerNameShow, o.OrderID,o.CustomerID,PaymentAmount, o.BillingCompanyName as CustomerCompany,o.ShipCompanyName,o.ShipFirstName,o.ShipLastName, o.BillingFirstName as CustomerFName,o.BillingLastName as CustomerLName,OrderDate,o.BillingAddress1 as BillingStreetAddress1, o.BillingAddress2 as BillingStreetAddress2, o.BillingCity as BillingCity1, o.BillingCountry as BillingCountry1, o.BillingState,o.BillingPhoneNumber,IsTaxExempt, o.BillingPostalCode as BillingPostalCode, ShipAddress1, ShipAddress2, ShipCity,ShipCountry, ShipState, ShipPhoneNumber ,ShipPostalCode,SalesTaxRate1 + SalesTaxRate2 + SalesTaxRate3 as SalesTaxRate1 ,SalesTax1,o.IsCustomerEmailShow,d.ProductCode,d.ProductName,d.Discription as description, d.Quantity as Qty, d.ProductPrice as Price, d.DiscountValue as Discount FROM orders o left join order_details d on o.OrderID = d.OrderID left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId where o.OrderID = (select max(OrderID) from orders where OrderSerials like '%" + serialNo + "%' limit 1)")
		.then(function (results) {
			if (results.length > 0) {
				callback(results);
			} else {
				callback([{
					OrderNotFound: 'OrderNotFound',
					orderId: serialNo
				}])
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: order.js, \nAction:GetOrderBySerial , \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err);
			// reject(err);
		});
};

exports.GetOpenOrderByProductID = function (productId, callback) {
	var columnsForExport = "o.Order_Entry_System, o.BillingAddress1,o.BillingAddress2,o.PONum,o.BillingCity,o.BillingCompanyName,o.BillingCountry,o.BillingFaxNumber,o.BillingFirstName,o.BillingLastName,o.BillingPhoneNumber,o.BillingPostalCode,o.BillingState,o.Order_Comments,o.ShipAddress1,o.ShipAddress2,o.ShipCity,o.ShipCompanyName,o.ShipCountry,o.ShipDate,o.ShipFaxNumber,o.ShipFirstName,o.ShipLastName,o.Shipped,o.ShipPhoneNumber,o.ShipPostalCode,o.ShipState,o.OrderNotes, "
	var query = "SELECT od.ProductCode, IsPayed," + columnsForExport + "u.firstname as CreatedByBlueFirstName, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName,o.OldOrder, s.LastName as CreatedByVoluLastName, o.OrderSerials, o.OrderID,o.QuoteNo,q.IssueDate,  o.InvoiceableOn, o.Order_Comments, c.EmailAddress,o.CustomerID,o.OrderStatus,PaymentAmount, o.BillingCompanyName as CompanyName, o.BillingFirstName as FirstName,o.BillingLastName as LastName,OrderDate,o.BillingCity as City" +

		" FROM orders o left join customers c on o.CustomerID = c.CustomerID  " +
		" left join customers s on o.SalesRep_CustomerID = s.CustomerID  " +
		" left join order_details od on o.OrderID = od.OrderID " +
		" left join quotes q on q.QuoteNo = o.QuoteNo  " +
		" left join user u on u.id = o.UserId  " +
		" where od.ProductID = " + productId + " and " +
		" (o.OrderStatus = 'New'  " +
		" or o.OrderStatus = 'Pending'  " +
		" or o.OrderStatus = 'Partially Shipped' " +
		" or `OrderStatus` = 'Hold'  " +
		" or `OrderStatus` = 'Accepted'  " +
		" or `OrderStatus` = 'Queue'  " +
		" or o.OrderStatus = 'Backordered' " +
		" or o.OrderStatus = 'Proccessing') " +
		" group by o.OrderID " +
		" order by o.OrderID desc; ";

	Mysql.query(query, {}).then(function (records) {
		callback(records);
	})
		.catch(function (err) {
			error = JSON.stringify(err.message)
			slack(`File: order.js, \nAction:GetOpenOrderByProductID , \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), 'Error fetching orders, mysql error:', err.message);
			callback({
				err: err
			});
		});


}

exports.update = function (data, callback) {
	var where = {
		OrderID: data.OrderID
	}
	Mysql.update('orders', where, data).then(function (result) {
		callback({
			status: true,
			msg: "Order Updated."
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: order.js, \nAction:update , \nError ${error} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err.message);
		callback({
			status: false,
			msg: err.message
		});
	});
}

exports.importOrderFile = async function (data, callback) {
	// console.log(data )
	try {
		await Mysql.query("Delete from order_tracking_no where IsImported = 1")
	} catch (error) {
		console.log(error)
		err = JSON.stringify(error)
		slack(`File: order.js, \nAction:importOrderFile , \nError ${err} \n 
		`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log("Deleting order track error: ", new Date(), error);
		callback({
			status: false,
			error: error,
			data: undefined
		});
		return
	}
	var callbackCount = data.length;
	try {
		var data = await data.map(async elem => {
			elem.TrackingNo = elem.trackingnumber[0],
				elem.Gateway = elem.gateway[0],
				elem.ShipDate = elem.shipdate[0],
				elem.OrderId = elem.orderid[0],
				elem.ShipmentCost = elem.shipment_cost[0] ? elem.shipment_cost[0] : 0,
				elem.ShippingMethodID = elem.shippingmethodid[0],
				elem.Package = elem.package[0],
				elem.Form = elem.form[0],
				elem.isImported = 1

			delete elem.trackingnumber
			delete elem.gateway
			delete elem.shipdate
			delete elem.orderid
			delete elem.shipment_cost
			delete elem.shippingmethodid
			delete elem.package
			delete elem.form
			var status = true;
			try {
				let result = await Mysql.insertUpdate('order_tracking_no', elem, elem)
				callbackCount--;
				if (callbackCount == 0)
					callback(status);
			} catch (e) {
				console.log(err)
				error = JSON.stringify(err.message)
				slack(`File: order.js, \nAction: importOrderFile, \nError ${error} \n 
					`, 'J.A.R.V.I.S', 'C029PF7DLKE')
				console.log(new Date(), "Err =========== ", err.message);
				callbackCount--;
				status = false;
				if (callbackCount == 0)
					callback(status);
			}
		})
	} catch (e) { console.log(e) }

}

function sendOrderStatusMail(generalDetails) {
	mailHelper.sendOrderStatusMail(generalDetails);
}