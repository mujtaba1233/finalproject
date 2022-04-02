var Mysql = require("../helpers/database-manager");
var bcrypt = require("bcrypt-nodejs");
var moment = require("moment");
var randtoken = require("rand-token");
const { slack } = require("../helpers/slack-helper");
exports.CloneQuote = function (data, callback) {
	let userId = data.userId;
	var counter = 0;
	Mysql.query("select * from quotes where QuoteNo = " + data.quoteNo)
		.then(function (results) {
			var result = results[0];
			delete result.modBy;
			delete result.modifiedOn;
			delete result.createdBy;
			delete result.QuoteNo;
			delete result.IssueDate;
			delete result.ValidTill;
			result.createdBy = userId;
			result.IssueDate = new Date();
			// result.IssueDate = moment(result.IssueDate).format('YYYY-MM-DD');
			result.ValidTill = new Date();
			result.ValidTill.setMonth(result.ValidTill.getMonth() + 1);
			// result.ValidTill = moment(result.ValidTill).format('YYYY-MM-DD');
			Mysql.insert("quotes", result)
				.then(function (newQuoteResult) {
					result.QuoteNo = newQuoteResult.insertId;

					Mysql.query(
						"select * from quotelineitems where QuoteNo = " +
							data.quoteNo +
							" order by display_order ASC"
					)
						.then(function (lineItems) {
							if (lineItems.length > 0) {
								lineItems.forEach((item) => {
									item.QuoteNo = result.QuoteNo;
									delete item.LineID;
									Mysql.insert("quotelineitems", item)
										.then(function (newLineItems) {
											counter = counter + 1;
											if (counter == lineItems.length) {
												Mysql.query(
													"select * from quotes q inner join customers c on q.CustomerID = c.CustomerID where q.QuoteNo = " +
														result.QuoteNo
												)
													.then(function (clonedQuote) {
														callback(clonedQuote);
													})
													.catch(function (err) {
														error = JSON.stringify(err.message);
														slack(
															`File: db.js, \nAction: CloneQuote, \nError while cloning quote lineitems, mysql error: ${error}  \n 
                                                        `,
															"J.A.R.V.I.S",
															"C029PF7DLKE"
														);
														console.log(
															new Date(),
															"Error while cloning quote lineitems, mysql error:",
															err.message
														);
														callback({ error: err.message });
													});
											}
										})
										.catch(function (err) {
											error = JSON.stringify(err.message);
											slack(
												`File: db.js, \nAction: CloneQuote, \nError while cloning quote lineitems, mysql error: ${error}  \n 
                                            `,
												"J.A.R.V.I.S",
												"C029PF7DLKE"
											);
											console.log(
												new Date(),
												"Error while cloning quote lineitems, mysql error:",
												err.message
											);
											callback({ error: err.message });
										});
								});
							} else {
								Mysql.query(
									"select * from quotes q inner join customers c on q.CustomerID = c.CustomerID where q.QuoteNo = " +
										result.QuoteNo
								)
									.then(function (clonedQuote) {
										callback(clonedQuote);
									})
									.catch(function (err) {
										error = JSON.stringify(err.message);
										slack(
											`File: db.js, \nAction: CloneQuote, \nError while cloning quote lineitems, mysql error: ${error}  \n 
                                        `,
											"J.A.R.V.I.S",
											"C029PF7DLKE"
										);
										console.log(
											new Date(),
											"Error while cloning quote lineitems, mysql error:",
											err.message
										);
										callback({ error: err.message });
									});
							}
						})
						.catch(function (err) {
							error = JSON.stringify(err.message);
							slack(
								`File: db.js, \nAction: CloneQuote, \nError ${error}  \n 
                                `,
								"J.A.R.V.I.S",
								"C029PF7DLKE"
							);
							callback({ error: err.message });
						});
				})
				.catch(function (err) {
					error = JSON.stringify(err.message);
					slack(
						`File: db.js, \nAction: CloneQuote, \nError ${error}  \n 
                            `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					console.log(
						new Date(),
						"Error cloning quote, mysql error:",
						err.message
					);
					callback({ error: err.message });
				});
		})
		.catch(function (err) {
			error = JSON.stringify(err);
			slack(
				`File: db.js, \nAction: CloneQuote, \nError ${error}  \n 
                            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			reject(err);
		});
};

exports.GetQuote = function (quoteId, callback) {
	// Mysql.query("select * from quotes q inner join quotelineitems ql on (q.QuoteNo = ql.QuoteNo) where q.QuoteNo = " + quoteId)
	Mysql.query(
		"select *,u.firstname as createdByFirst,u.lastname as createdByLast,m.firstname as modifiedByFirst,m.lastname as modifiedByLast from quotes q inner join quotelineitems ql on (q.QuoteNo = ql.QuoteNo) left join user u on q.createdBy = u.id left join user m on q.modBy = m.id where q.QuoteNo = " +
			quoteId +
			" order by ql.display_order asc"
	)
		.then(function (results) {
			// console.log(results);
			if (results.length > 0) {
				results[0].IssueDatePDF = new Date(results[0].IssueDate);
				results[0].IssueDatePDF = moment(results[0].IssueDatePDF).format(
					"YYYY-MM-DD"
				);

				results[0].ValidTillPDF = new Date(results[0].ValidTill);
				results[0].ValidTillPDF = moment(results[0].ValidTillPDF).format(
					"YYYY-MM-DD"
				);

				callback(results);
			} else {
				// error = JSON.stringify(err.message)
				slack(
					`File: db.js, \nAction: GetQuote, \nError Order Not Found  \n 
                            `,
					"J.A.R.V.I.S",
					"C029PF7DLKE"
				);
				callback([{ OrderNotFound: "OrderNotFound", quoteId: quoteId }]);
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err);
			slack(
				`File: db.js, \nAction: GetQuote, \nError ${error}  \n 
                    `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			callback([{ OrderNotFound: "OrderNotFound", quoteId: quoteId }]);
		});
};

exports.RemoveQuote = function (quoteId, callback) {
	Mysql.delete("quotes", { QuoteNo: quoteId })
		.then(function (record) {
			Mysql.delete("quotelineitems", { QuoteNo: quoteId })
				.then(function (record) {
					callback({ success: true, data: record });
				})
				.catch(function (err) {
					error = JSON.stringify(err.message);
					slack(
						`File: db.js, \nAction: RemoveQuote, \nError ${error} \n 
                            `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					callback({ success: false, data: err.message });
				});
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: RemoveQuote, \nError ${error} \n 
                            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			callback({ success: false, data: err.message });
		});
};

exports.GetQuoteForEmail = function (quoteId, callback) {
	Mysql.query(
		"select c.* from quotes q inner join customers c on q.CustomerID = c.CustomerID where q.QuoteNo = " +
			quoteId
	)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err);
			slack(
				`File: db.js, \nAction: GetQuoteForEmail, \nError ${error} \n 
                            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			reject(err);
		});
};

exports.GetAllQuote = function (query, callback) {
	where = "";
	if (query.duration && query.duration !== "all") {
		where =
			" where DATE(q.IssueDate) >= now()-interval " +
			query.duration +
			" month && isApproved = 1";
	} else {
		where = " where isApproved = 1";
	}
	// return console.log(where)
	// query = "select sum((Price - (Price * Discount/100)) * Qty) + q.Freight + (sum((Price - (Price * Discount/100)) * Qty) * (q.TaxShipping/100)) as total, q.QuoteNo,q.IssueDate,q.ValidTill, c.LastName,c.FirstName,c.EmailAddress,c.CompanyName,c.City, u.firstname as createdByFirst, u.lastname as createdByLast from quotes q inner join customers c on q.CustomerID = c.CustomerID left join user u on q.createdBy = u.id inner join quotelineitems ql on q.QuoteNo = ql.QuoteNo " + where + " Group by ql.QuoteNo ORDER BY QuoteNo DESC";
	query =
		"select *,sum(t.t) + t.Freight total from (select  sum((Price - ROUND((Price * Discount/100),2)) * Qty) + (sum((Price - ROUND((Price * Discount/100),2)) * Qty) * (if (ql.isTaxable = 1, q.TaxShipping/100,0 ))) as t, q.QuoteNo,q.pdfname,q.notes,q.PrivateNotes, q.BillingCompany, q.ShippingCompany,q.IssueDate,q.ValidTill,Freight, c.LastName,c.FirstName,c.EmailAddress,c.CompanyName,c.City, u.firstname as createdByFirst, u.lastname as createdByLast from quotes q inner join customers c on q.CustomerID = c.CustomerID left join user u on q.createdBy = u.id inner join quotelineitems ql on q.QuoteNo = ql.QuoteNo " +
		where +
		" group by LineId) t group by QuoteNo ORDER BY QuoteNo DESC";
	Mysql.query(query)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllQuote, \nError ${error} \n 
                    `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(err.message);
			reject(err);
		});
};
exports.GetDateQuote = function (data, callback) {
	where = "";
	if (data.to && data.from)
		where =
			" where DATE(q.IssueDate) BETWEEN '" +
			new Date(data.from).toISOString() +
			"' AND '" +
			new Date(data.to).toISOString() +
			"'  &&  isApproved = 1 ";
	else where = " where isApproved = 1";
	query =
		"select *,sum(t.t) + t.Freight total from (select  sum((Price - (Price * Discount/100)) * Qty) + (sum((Price - (Price * Discount/100)) * Qty) * (if (ql.isTaxable = 1, q.TaxShipping/100,0 ))) as t, q.QuoteNo,q.pdfname, q.BillingCompany, q.ShippingCompany,q.notes,q.PrivateNotes,q.IssueDate,q.ValidTill,Freight, c.LastName,c.FirstName,c.EmailAddress,c.CompanyName,c.City, u.firstname as createdByFirst, u.lastname as createdByLast from quotes q inner join customers c on q.CustomerID = c.CustomerID left join user u on q.createdBy = u.id inner join quotelineitems ql on q.QuoteNo = ql.QuoteNo " +
		where +
		" group by LineId) t group by QuoteNo ORDER BY QuoteNo DESC";
	Mysql.query(query)
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			console.log(err.message);
			reject(err);
		});
};
exports.GetAllExternalQuote = function (callback) {
	//for internal app

	// query = "select sum((Price - (Price * Discount/100)) * Qty) + q.Freight + (sum((Price - (Price * Discount/100)) * Qty) * (q.TaxShipping/100)) as total, q.QuoteNo,q.IssueDate,q.ValidTill, c.LastName,c.FirstName,c.EmailAddress,c.CompanyName,c.City, u.firstname as createdByFirst, u.lastname as createdByLast from quotes q inner join customers c on q.CustomerID = c.CustomerID left join user u on q.createdBy = u.id inner join quotelineitems ql on q.QuoteNo = ql.QuoteNo " + where + " Group by ql.QuoteNo ORDER BY QuoteNo DESC";
	// sum(t.t) + t.Freight total from (select  sum((Price - (Price * Discount/100)) * Qty) + (sum((Price - (Price * Discount/100)) * Qty) * (if (ql.isTaxable = 1, q.TaxShipping/100,0 ))) as t,
	query =
		"select q.*,concat(CustomerLName,', ',CustomerFName) as CustomerName,concat(u.lastname,', ',u.firstname) as cretedByName  from quotes q left join user u on q.createdBy = u.id where isExternal = 1 and isApproved = 0 ORDER BY QuoteNo DESC";
	Mysql.query(query)
		.then(function (results) {
			// console.log(results)
			callback(results);
		})
		.catch(function (err) {
			console.log(err.message);
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllExternalQuote, \nError ${error} \n 
                    `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			reject(err);
		});
};

exports.GetProducts = function (callback) {
	Mysql.query("select * from products")
		.then(function (results) {
			callback(results);
		})
		.catch(function (err) {
			error = JSON.stringify(err);
			slack(
				`File: db.js, \nAction: GetProducts, \nError ${error} \n 
                    `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			reject(err);
		});
};

exports.InsertCustomers = function (customers, insertEndCallback) {
	if (customers != undefined) {
		var callbackCount = customers.length;
		for (var i = 0; i < customers.length; i++) {
			Mysql.insertUpdate("customers", customers[i], {
				BillingAddress1: customers[i].BillingAddress1,
				BillingAddress2: customers[i].BillingAddress2,
				City: customers[i].City,
				Country: customers[i].Country,
				EmailAddress: customers[i].EmailAddress,
				FirstName: customers[i].FirstName,
				LastName: customers[i].LastName,
				CompanyName: customers[i].CompanyName,
				PhoneNumber: customers[i].PhoneNumber,
			})
				.then(function (info) {
					callbackCount--;
					if (callbackCount == 0) insertEndCallback();
				})
				.catch(function (err) {
					error = JSON.stringify(err);
					slack(
						`File: db.js, \nAction: InsertCustomers, \nError ${error} \n 
                    `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					callbackCount--;
					if (callbackCount == 0) insertEndCallback();
				});
		}
	}
};
exports.InsertEndUser = function (endUser, insertEndCallback) {
	if (customers != undefined) {
		var callbackCount = endUser.length;
		for (var i = 0; i < endUser.length; i++) {
			Mysql.insertUpdate("end_users", endUser[i], {
				// 'BillingAddress1': customers[i].BillingAddress1,
				// 'BillingAddress2': customers[i].BillingAddress2,
				// 'City': customers[i].City,
				// 'Country': customers[i].Country,
				firstName: endUser[i].firstName,
				lastName: endUser[i].lastName,
				compnayName: endUser[i].compnayName,
				emailAddress: endUser[i].emailAddress,
				phoneNumber: endUser[i].phoneNumber,
			})
				.then(function (info) {
					callbackCount--;
					if (callbackCount == 0) insertEndCallback();
				})
				.catch(function (err) {
					error = JSON.stringify(err);
					slack(
						`File: db.js, \nAction: InsertEndUser, \nError ${error} \n 
                    `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					callbackCount--;
					if (callbackCount == 0) insertEndCallback();
				});
		}
	}
};

exports.GetAllModalCustomers = function (callback) {
	Mysql.query("SELECT * FROM `customers` WHERE `hide` = '0'", {})
		.then(function (records) {
			// console.log(records.length , "modal customers")
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllModalCustomers, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetAllModalEndUser = function (callback) {
	Mysql.query("SELECT * FROM `end_users` WHERE `isHide` = '0'", {})
		.then(function (records) {
			// console.log(records.length , "modal customers")
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllModalEndUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetAllCustomers = function (callback) {
	Mysql.query("SELECT * FROM customers", {})
		.then(function (records) {
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllCustomers, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetAllEndUser = function (callback) {
	Mysql.query("SELECT * FROM end_users", {})
		.then(function (records) {
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllEndUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetCustomersRecord = function (Id, callback) {
	// return console.log(Id)
	var query = "SELECT * FROM customers WHERE CustomerID = " + Id.customerID;
	// console.log(query)
	Mysql.query(query, {})
		.then(function (records) {
			delete records[0].CustomerID;
			// console.log(records)
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetCustomersRecord, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetEndUserRecord = function (Id, callback) {
	// return console.log(Id,"yoo")
	var query = "SELECT * FROM end_users WHERE id = " + Id;
	// console.log(query);
	Mysql.query(query, {})
		.then(function (records) {
			delete records[0].endUserid;
			// console.log(records)
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetEndUserRecord, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};

exports.GetUser = function (userId, callback) {
	Mysql.query("SELECT * FROM user where id = " + userId, {})
		.then(function (records) {
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};
exports.GetAllUsers = function (callback) {
	Mysql.query("SELECT * FROM user", {})
		.then(function (records) {
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetAllUsers, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};

exports.SaveQuote = async function (quote, callback) {
	delete quote.Quote.QuoteNo;
	try {
		let quoteToInsert = {};
		for (const key in quote.Quote) {
			if (quote.Quote[key]) {
				quoteToInsert[key] = quote.Quote[key];
			}
		}
		const { insertId } = await Mysql.insert("quotes", quoteToInsert);
		if (!insertId) {
			slack(
				`File: db.js, \nAction: SaveQuote, \nError ${err.message} \n`,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			callback({ status: "error" });
			return;
		}
		const quoteID = insertId;
		// console.log(quote.QuoteLines);
		await Promise.all(
			quote.QuoteLines.map(async (lineItem, index) => {
				lineItem.display_order = index;
				lineItem.QuoteNo = quoteID;
				let item = {};
				for (const key in lineItem) {
					if (lineItem[key]) {
						item[key] = lineItem[key];
					}
				}
				// console.log(item);
				await Mysql.insert("quotelineitems", item);
			})
		);
		callback({ status: "ok", quoteNo: quoteID });
		return;
	} catch (error) {
		console.log(new Date(), error);
		slack(
			`File: db.js, \nAction: SaveQuote, \nError ${JSON.stringify(error)}`,
			"J.A.R.V.I.S",
			"C029PF7DLKE"
		);
		callback({ status: "error" });
		return;
	}
};

exports.SaveUser = function (user, callback) {
	Mysql.insert("user", user)
		.then(function (result) {
			callback(result);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: SaveUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error creating new user, mysql error:",
				err.message
			);
			callback({ error: err.message });
		});
};
exports.GetActivityLogData = function (details, callback) {
	details.to = moment(details.to).format("YYYY-MM-DD:h:mm:ss");
	details.from = moment(details.from).format("YYYY-MM-DD:h:mm:ss");
	// return console.log(details, "details")
	where = "";
	if (details && details.id == null) {
		where =
			" where lastModifyOn >= '" +
			details.from +
			"' AND lastModifyOn <= '" +
			details.to +
			"'";
	}
	if (details && details.id) {
		where =
			" where lastModifyOn >= '" +
			details.from +
			"' AND lastModifyOn <= '" +
			details.to +
			"'" +
			" AND userId = " +
			details.id;
	}
	// if(details && details.type ){
	//     if(details.type == 'all'){
	//         where = " where lastModifyOn >= '" + details.from + "' AND lastModifyOn <= '" + details.to + "'";
	//     }
	//     where = " where lastModifyOn >= '" + details.from + "' AND lastModifyOn <= '" + details.to + "'" + " AND type = '" + details.type + "'";
	// }
	else if (details && details.customerId) {
		where =
			" where lastModifyOn >= '" +
			details.from +
			"' AND lastModifyOn <= '" +
			details.to +
			"'" +
			" AND userId = " +
			details.customerId;
	}
	query = "SELECT * FROM activity_log" + where + " " + "ORDER BY `id` DESC";
	// console.log(query, "query")
	Mysql.query(query)
		.then(function (records) {
			// console.log(records, "records")
			callback(records);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: GetActivityLogData, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
		});
};

exports.SaveActivityLogData = function (user, callback) {
	user.lastModifyOn = moment(user.lastModifyOn).format("YYYY-MM-DD:h:mm:ss");
	Mysql.insert("activity_log", user)
		.then(function (result) {
			if(typeof callback === "function")
				callback(result);
		})
		.catch(function (err) {
			slack(
				`File: db.js, \nAction: SaveActivityLogData, \nError ${err.message}  \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			if(typeof callback === "function")
				callback({ error: err.message });
		});
};
exports.SaveCustomer = function (customer, callback) {
	var where = {
		EmailAddress: customer.EmailAddress,
	};
	Mysql.record("customers", where)
		.then(function (record) {
			if (record) {
				callback({
					status: 202,
					message: "Customer already exist!",
					customer: record,
				});
			} else {
				Mysql.query("SELECT max(CustomerID) as id FROM customers", {})
					.then(function (record) {
						// console.log(record);
						if (record.length > 0) {
							var id = record[0].id ? parseInt(record[0].id) : 0;
							if (id < 20000) {
								id = 20001;
							} else {
								id = id + 1;
							}
						} else {
							var id = 50001;
						}
						customer.CustomerID = id;
						let date = new Date();
						customer.CreatedAt = moment(date).format("YYYY-MM-DD:h:mm:ss");
						Mysql.insert("customers", customer)
							.then(function (result) {
								result.insertId = id;
								callback({
									status: 200,
									message: "Customer Saved",
									data: result,
								});
							})
							.catch(function (err) {
								error = JSON.stringify(err.message);
								slack(
									`File: db.js, \nAction: SaveCustomer, \nError ${error} \n 
                                `,
									"J.A.R.V.I.S",
									"C029PF7DLKE"
								);
								console.log(
									new Date(),
									"Error creating new customer, mysql error:",
									err.message
								);
								callback({ error: err.message });
							});
					})
					.catch(function (err) {
						error = JSON.stringify(err.message);
						slack(
							`File: db.js, \nAction: SaveCustomer, \nError ${error} \n 
                        `,
							"J.A.R.V.I.S",
							"C029PF7DLKE"
						);
						console.log(
							new Date(),
							"Error fetching record, mysql error:",
							err.message
						);
					});
			}
		})
		.catch(function (err) {
			console.log(new Date(), "err", err);
			callback({ dbError: err.message });
		});
};
exports.SaveEndUser = async function (endUser, callback) {
	console.log(endUser,"end user")
	var where = {
		EmailAddress: endUser.emailAddress,
	};
	try {
		const record = await Mysql.record("end_users", where);
		if (record) {
			callback({
				status: 202,
				message: "End User already exist!",
				endUser: record,
			});
		} else {
			try {
				const result = await Mysql.query(
					"SELECT max(id) as id FROM end_users",
					{}
				);
				// console.log(endUser,"HIHELLOHEI")
				if (result.length > 0) {
					var id = result[0].id ? parseInt(result[0].id) : 0;
					if (id < 20000) {
						id = 20001;
					} else {
						id = id + 1;
					}
				} else {
					var id = 50001;
				}
				endUser.id = id;
				let date = new Date();
				endUser.createdAt = moment(date).format("YYYY-MM-DD:h:mm:ss");
				try {
					// console.log(endUser, "in try");
					// console.log(
					// 	"insert into end_users (firstName,lastName,companyName,emailAddress,phoneNumber,isHide,createdAt) values ('" +
					// 		endUser.firstName +
					// 		"', '" +
					// 		endUser.lastName +
					// 		"' , '" +
					// 		endUser.companyName +
					// 		"','" +
					// 		endUser.emailAddress +
					// 		"', '" +
					// 		endUser.phoneNumber +
					// 		"', " +
					// 		endUser.isHide +
					// 		", " +
					// 		new Date() +
					// 		")"
					// );
					var insertRecord = await Mysql.insert("end_users", endUser);
					insertRecord.insertId = id;
					callback({ status: 200, message: "End User Saved test", data: insertRecord });
				} catch (err) {
					error = JSON.stringify(err.message);
					slack(
						`File: db.js, \nAction: SaveEndUser, \nError ${error} \n 
                `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					console.log(
						new Date(),
						"Error creating new End User, mysql error:",
						err.message
					);
					callback({ error: err.message });
				}
				// console.log(insertRecord.sql)
			} catch (err) {
				error = JSON.stringify(err.message);
				slack(
					`File: db.js, \nAction: SaveEndUser, \nError ${error} \n 
            `,
					"J.A.R.V.I.S",
					"C029PF7DLKE"
				);
				console.log(
					new Date(),
					"Error fetching record, mysql error:",
					err.message
				);
			}
		}
	} catch (error) {
		console.log(new Date(), "error", error);
		callback({ dbError: error.message });
	}

	// Mysql.record('endUser', where)
	//     .then(function (record) {
	//         if (record) {
	//             callback({ status: 202, message: 'End User already exist!', endUser: record });
	//         } else {
	//             Mysql.query("SELECT max(id) as id FROM endUser", {})
	//                 .then(function (record) {
	//                     console.log(record);
	//                     if (record.length > 0) {
	//                         var id = record[0].id ? parseInt(record[0].id) : 0;
	//                         if (id < 20000) {
	//                             id = 20001
	//                         } else {
	//                             id = id + 1;
	//                         }
	//                     } else {
	//                         var id = 50001
	//                     }
	//                     endUser.endUserID = id
	//                     console.log(endUser.id, "HEYHEY")
	//                     endUser.endUserID = id;
	//                     let date = new Date()
	//                     endUser.CreatedAt = moment(date).format('YYYY-MM-DD:h:mm:ss');
	//                     Mysql.insert('endUser', endUser)
	//                         .then(function (result) {
	//                             result.insertId = id;
	//                             callback({ status: 200, message: 'End User Saved', data: result });
	//                         })
	//                         .catch(function (err) {
	//                             error = JSON.stringify(err.message)
	//                             slack(`File: db.js, \nAction: SaveEndUser, \nError ${error} \n
	//                             `, 'J.A.R.V.I.S', 'C029PF7DLKE')
	//                             console.log(new Date(), 'Error creating new End User, mysql error:', err.message);
	//                             callback({ error: err.message });
	//                         });
	//                 })
	//                 .catch(function (err) {
	//                     error = JSON.stringify(err.message)
	//                     slack(`File: db.js, \nAction: SaveEndUser, \nError ${error} \n
	//                     `, 'J.A.R.V.I.S', 'C029PF7DLKE')
	//                     console.log(new Date(), 'Error fetching record, mysql error:', err.message);
	//                 });
	//         }
	//     })
	//     .catch(function (err) {
	//         console.log(new Date(), 'err', err);
	//         callback({ dbError: err.message });
	//     });
};
exports.UpdateCustomer = async function (customer, callback) {
	try {
		let result;
		var where = {
			CustomerID: customer.CustomerID,
		};
		var update = customer;

		delete update.CreatedAt;
		result = await Mysql.update("customers", where, update);
		// return result
		var where = {
			email: customer.EmailAddress,
		};
		var update = {
			AdminActiveFlag: customer.Active,
		};
		result = await Mysql.update("register_customer", where, update);
		return result;
	} catch (err) {
		error = JSON.stringify(err.message);
		slack(
			`File: db.js, \nAction: UpdateCustomer, \nError ${error} \n 
        `,
			"J.A.R.V.I.S",
			"C029PF7DLKE"
		);
		console.log(new Date(), "Error updating user, mysql error:", err.message);
		callback({ error: err.message });
	}
};
exports.UpdatePasswordLink = async function (customer) {
    try {
        var query = "select * from register_customer where email = '" + customer.EmailAddress+ "' limit 1";
        const result = await Mysql.query(query);
        if (result.length > 0) {
            let where = {
                register_customer_id: result[0].register_customer_id,
            };
            let data = {
                token: customer.token,
                isActive: true,
                AdminActiveFlag:true,
            };
            try {
                const result_to_return = await Mysql.update("register_customer",where,data);
                return {
                    code: 200,
                    status: true,
                    msg: "Token Has been updated",
                    result: result[0],
                }
            } catch (error) {
                return{
                    code: 400,
                    status: false,
                    msg: "error while saving the token" + error.message
                }
            }
           
        }
        else{
            return{
                code: 407,
                status: false,
                msg: "error while inserting registered customer",
                result: customer
            }
            // try {
            //     let dataToInsert = {
            //         customerId: customer.CustomerID,        
            //         email: customer.EmailAddress,        
            //         token: customer.token,              
            //         isActive: true,
            //         AdminActiveFlag:true,   
            //         createdAt: new Date(),           
            //         confirmedOn: new Date(),
            //         // password:null  
            //     }
            //     const result_to_return = await Mysql.insert("register_customer", dataToInsert)
            //     return {
            //         code: 200,
            //         status: true,
            //         msg: "Token Has been updated",
            //         result: result_to_return,
            //     }
            // } catch (error) {
            //     return{
            //         code: 400,
            //         status: false,
            //         msg: "error while inserting registered customer" + error.message
            //     }
            // }
			
        }
    } catch (error) {
        return{
            code: 400,
            status: false,
            msg: "error while getting the Registered_customer" + error.message
        }
    }
	
};

exports.UpdatePasswordCustomerFromDashboard = async function (data) {
    try{
    var query = "select * from register_customer where email = '" + data.email+ "' limit 1";
        const result = await Mysql.query(query);
        if (result.length > 0) {
            let where = {
                register_customer_id: result[0].register_customer_id,
            };
            let data2 = {
                token: result[0].token,
                isActive: true,
                AdminActiveFlag:true,
                password:data.password
            };
            try {
                const result_to_return = await Mysql.update("register_customer",where,data2);
                return {
                    code: 200,
                    status: true,
                    msg: "Password Has been updated",
                    result: result_to_return,
                }
            } catch (error) {
                return{
                    code: 400,
                    status: false,
                    msg: "error while saving the token" + error.message
                }
            }
        }
        else{
            try {
                let dataToInsert = {
                    customerId: data.id,        
                    email: data.email,        
                    token: data.token,              
                    isActive: true,
                    AdminActiveFlag:true,   
                    createdAt: new Date(),           
                    confirmedOn: new Date(),
                    password:data.password  
                }
                const result_to_return = await Mysql.insert("register_customer", dataToInsert)
                return {
                    code: 200,
                    status: true,
                    msg: "Password has been updated",
                    result: result_to_return,
                }
            } catch (error) {
                return{
                    code: 400,
                    status: false,
                    msg: "error while inserting registered customer" + error.message
                }
            }
			
        }
    } catch (error) {
        return{
            code: 400,
            status: false,
            msg: "error while getting the Registered_customer " + error.message
        }
    }
};

// exports.ConfirmEmailCustomerFromDashboard = function (token, callback) {
// 	Mysql.query('select * from register_customer where token = "' + token + '"')
// 		.then(function (result) {
// 			if (result.length > 0) {
// 				Mysql.update(
// 					"register_customer",
// 					{
// 						token: token,
// 						isActive: 0,
// 					},
// 					{
// 						confirmedOn: new Date(),
// 						isActive: true,
// 					}
// 				)
// 					.then(function (result) {
// 						callback({
// 							code: 200,
// 							status: true,
// 							msg: "Email has been Confirmed",
// 						});
// 					})
// 					.catch(function (err) {
// 						console.log(new Date(), err.message);
// 						error = JSON.stringify(err.message);
// 						slack(
// 							`File: front-store-model.js, \nAction: ConfirmEmail, \nError ${error} \n 
//                 `,
// 							"J.A.R.V.I.S",
// 							"C029PF7DLKE"
// 						);
// 						callback({
// 							code: 400,
// 							status: false,
// 							msg: err.message,
// 						});
// 					});
// 			} else {
// 				// error= JSON.stringify(err.message)
// 				slack(
// 					`File: front-store-model.js, \nAction: ConfirmEmail, \nError Invalid Token or Used Alredy \n 
//                 `,
// 					"J.A.R.V.I.S",
// 					"C029PF7DLKE"
// 				);
// 				callback({
// 					code: 400,
// 					status: false,
// 					msg: "Invalid Token or Used Alredy",
// 				});
// 			}
// 		})
// 		.catch(function (err) {
// 			error = JSON.stringify(err.message);
// 			slack(
// 				`File: front-store-model.js, \nAction: ConfirmEmail, \nError ${error} \n 
//         `,
// 				"J.A.R.V.I.S",
// 				"C029PF7DLKE"
// 			);
// 			console.log(new Date(), err.message);
// 			callback({
// 				code: 400,
// 				status: false,
// 				msg: err.message,
// 			});
// 		});
// };

exports.UpdateEndUser = async function (endUser, callback) {
	try {
		let result;
		var where = {
			EmailAddress: endUser.emailAddress,
		};
		var update = endUser;
		delete update.createdAt;
		result = await Mysql.update("end_users", where, update);
	} catch (err) {
		error = JSON.stringify(err.message);
		slack(
			`File: db.js, \nAction: UpdateEndUser, \nError ${error} \n 
        `,
			"J.A.R.V.I.S",
			"C029PF7DLKE"
		);
		console.log(new Date(), "Error updating user, mysql error:", err.message);
		callback({ error: err.message });
	}
};

exports.UpdateUser = function (user, callback) {
	user.lastPasUpdate = moment(user.lastPasUpdate).format("YYYY-MM-DD:h:mm:ss");
	var where = {
		id: user.id,
	};
	delete user.id;
	var update = user;
	Mysql.update("user", where, update)
		.then(function (result) {
			callback(result);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: UpdateUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(new Date(), "Error updating user, mysql error:", err.message);
			callback({ error: err.message });
		});
};

exports.UpdatePassword = function (user, callback) {
	Mysql.record("user", { email: user.email })
		.then(function (record) {
			if (record && record.password) {
				bcrypt.compare(user.oldPassword, record.password, function (err, res) {
					if (res) {
						console.log(new Date(), "err res", err, res);
						delete record.password;
						bcrypt.hash(user.newPassword, null, null, function (err, hash) {
							var where = {
								id: user.id,
							};
							var update = {
								password: hash,
							};
							Mysql.update("user", where, update)
								.then(function (result) {
									callback({
										success: true,
										msg: "Password updated successfully.",
									});
								})
								.catch(function (err) {
									error = JSON.stringify(err.message);
									slack(
										`File: db.js, \nAction: UpdatePassword, \nError ${error} \n 
                                `,
										"J.A.R.V.I.S",
										"C029PF7DLKE"
									);
									console.log(
										new Date(),
										"Error updating password, mysql error:",
										err.message
									);
									callback({ success: false, msg: err.message });
								});
						});
					} else {
						// error = JSON.stringify(err.message)
						slack(
							`File: db.js, \nAction: UpdatePassword, \nError Current password missmatch \n 
                    `,
							"J.A.R.V.I.S",
							"C029PF7DLKE"
						);
						console.log(new Date(), "err res", err, res);
						callback({ success: false, msg: "Current password missmatch." });
					}
				});
			} else {
				// error = JSON.stringify(err.message)
				slack(
					`File: db.js, \nAction: UpdatePassword, \nError Invalid request. \n 
            `,
					"J.A.R.V.I.S",
					"C029PF7DLKE"
				);
				callback({ success: false, msg: "Invalid request." });
			}
			if (record != null) {
			}
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: UpdatePassword, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			callback({ dbError: err.message });
		});
};

exports.SetPass = function (user, callback) {
	var where = {
		token: user.token,
	};
	var update = {
		password: user.password,
		token: "verifiedUser",
		lastPasUpdate: new Date(),
		isBlocked: false,
		blockMailSent: false,
	};
	Mysql.update("user", where, update)
		.then(function (result) {
			callback(result);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: SetPass, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			console.log(new Date(), "Error updating user, mysql error:", err.message);
			callback({ error: err.message });
		});
};

exports.UpdateQuote = async function (quote, callback) {
	let savedQuote = {};
	var where = {
		QuoteNo: quote.Quote.QuoteNo,
	};
	delete quote.Quote.QuoteNo;
	var update = quote.Quote;
	// console.log(update);
	try {
		savedQuote = await Mysql.update("quotes", where, update);
	} catch (error) {
		err = JSON.stringify(error.message);
		slack(
			`File: db.js, \nAction: UpdateQuote, \nError ${err} \n 
            `,
			"J.A.R.V.I.S",
			"C029PF7DLKE"
		);
		console.log(new Date(), "Error updating record, mysql error:", err.message);
		return { status: false, msg: error.message };
	}
	try {
		await Mysql.delete("quotelineitems", { QuoteNo: where.QuoteNo });
		await Promise.all(
			quote.QuoteLines.map(async (lineItem, index) => {
				lineItem.display_order = index;
				lineItem.QuoteNo = where.QuoteNo;
				if (lineItem.Discount === undefined) lineItem.Discount = 0;
				await Mysql.insert("quotelineitems", lineItem);
			})
		);
		return { status: "ok", quoteNo: where.QuoteNo };
	} catch (error) {
		console.log(
			new Date(),
			"Error creating new quote, mysql error:",
			error.message
		);
		return { status: "error" };
	}
	// Mysql.delete('quotelineitems', where)
	//     .then(function (record) {
	//         var quoteID = where.QuoteNo;
	//         if (quote.QuoteLines != undefined && quote.QuoteLines.length > 0) {
	//             var query = "INSERT into quotelineitems (isChild,parentName,parent,QuoteNo,ProductCode,Qty,ProductName,Price,Discount,isTaxable,description,display_order) VALUES ";
	//             for (var i = 0; i < quote.QuoteLines.length; i++) {
	//                 if (quote.QuoteLines[i].Discount === undefined)
	//                     quote.QuoteLines[i].Discount = 0;
	//                 // console.log(quote.QuoteLines[i].display_order)
	//                 query += "(" + quote.QuoteLines[i].isChild + ",\'" + quote.QuoteLines[i].parentName + "\',\'" + quote.QuoteLines[i].parent + "\'," + quoteID + ", \'" + quote.QuoteLines[i].ProductCode + "\' ," + quote.QuoteLines[i].Qty + ", \"" + quote.QuoteLines[i].ProductName + "\", " + quote.QuoteLines[i].Price + ", " + quote.QuoteLines[i].Discount + ", " + quote.QuoteLines[i].isTaxable + ", '" + quote.QuoteLines[i].description + "'," + i + ")";
	//                 if (i != quote.QuoteLines.length - 1) {
	//                     query += ",";
	//                 }
	//             }

	//             // console.log(query);
	//             Mysql.query(query, {})
	//                 .then(function (results) {
	//                     callback({ 'status': 'ok', 'quoteNo': quoteID });
	//                 })
	//                 .catch(function (err) {
	//                     console.log(new Date(), Mysql.getLastQuery(), err);
	//                     reject(err);
	//                     callback({ 'status': 'error' });
	//                 });

	//         } else {
	//             callback({ 'status': 'norows' });
	//         }
	//     })
	//     .catch(function (err) {
	//         console.log(new Date(), 'Error deleting record, mysql error:', err.message);
	//     });
};
exports.verifiedUser = async function (user,callback){
	var where = {
		token: user.token,
	};
	var update = {
		token: "verifiedUser",
		lastPasUpdate: new Date(),
		isBlocked: false,
		blockMailSent: false,
	};
	try {
		const response = await Mysql.update("user", where, update)
		console.log(response)
		return {
			result:response,
			status:true
		}
	} catch (error) {
		return {
			result:error.message,
			status:false
		}
	}
	
}
exports.verifyUser = function (token, callback) {
	Mysql.record("user", { token: token })
		.then(function (record) {
			callback(record);
		})
		.catch(function (err) {
			error = JSON.stringify(err.message);
			slack(
				`File: db.js, \nAction: verifyUser, \nError ${error} \n 
            `,
				"J.A.R.V.I.S",
				"C029PF7DLKE"
			);
			callback({ dbError: err.message });
		});
};
exports.googleAuth = async function (userObj) {
	user = { email: userObj.email };
	try {
		const record = await Mysql.record("user", user);
		if (record === null || record === undefined || !record) {
			return {
				message: "User doesnot exist in system",
				success: false,
			};
		} else {
			return record;
		}
	} catch (error) {
		console.log(error, "error");
		return {
			message: error.message,
			success: false,
		};
	}
};
exports.loginAuth = function (user, callback) {
	islocked = [];
	user.usertype = "external";
	var password = user.password;
	delete user.password;
	Mysql.record("user", user)
		.then(async function (record) {
			if (record && record.password && record.active) {
				bcrypt.compare(password, record.password, async function (err, res) {
					if (res) {
						// console.log('Password :', res);
						//updating isDeleted field to true in login_attempts table
						try {
							var where = { userId: record.id };
							var update = { isDeleted: true };
							Mysql.update("login_attempts", where, update);
							var lastPasUpdate = moment(record.lastPasUpdate);
							var now = moment();
							if (now.diff(lastPasUpdate, "days") > 90) {
								//check when last password was updated
								record.is_expire = true;
							}
							delete record.password;
							callback(record);
						} catch (error) {
							err = JSON.stringify(error.message);
							slack(
								`File: db.js, \nAction: loginAuth, \nError ${err} \n 
                        `,
								"J.A.R.V.I.S",
								"C029PF7DLKE"
							);
							callback({ error: error.message });
						}
					} else {
						try {
							//inserting data in login_attempts table of current user
							const loginAttempts = await Mysql.query(
								"SELECT * FROM login_attempts WHERE isDeleted = 0 AND userId = " +
									record.id
							);
							if (loginAttempts.length === 5 && !record.isBlocked) {
								var token = randtoken.generate(64);
								record = { ...record, isBlocked: true, token };
								var update = { isBlocked: true, blockMailSent: true, token };
								await Mysql.update("user", { email: user.email }, update);
							} else if (loginAttempts.length < 5) {
								await Mysql.insert("login_attempts", {
									userId: record.id,
									attemptOn: new Date(),
									isDeleted: false,
								});
							}
							if (loginAttempts.length === 5 && record.isBlocked) {
								recordJsonFormat = JSON.stringify(record.id);
								slack(
									`File: db.js, \nAction: loginAuth, \nError Your account is blocked due to too many failed login attemps, please check your email. \n ${recordJsonFormat} \n 
                                `,
									"J.A.R.V.I.S",
									"C029PF7DLKE"
								);
								callback({
									error:
										"Your account is blocked due to too many failed login attemps, please check your email.",
									user: record,
								});
								return;
							}
							callback({ error: "Incorrect password!" });
							return;
						} catch (error) {
							err = JSON.stringify(error.message);
							slack(
								`File: db.js, \nAction: loginAuth, \nError ${err} \n 
                            `,
								"J.A.R.V.I.S",
								"C029PF7DLKE"
							);
							console.log(new Date(), error.message);
							callback({ error: error.message });
						}
					}
				});
			} else {
				if (!record) {
					callback({ error: "Incorrect Credentials!" });
				} else if (record.active == 0) {
					// err = JSON.stringify(error.message)
					slack(
						`File: db.js, \nAction: loginAuth, \nError Login failed \n 
                    `,
						"J.A.R.V.I.S",
						"C029PF7DLKE"
					);
					callback({ error: "Login failed" });
				}
			}
		})
		.catch(function (err) {
			console.log(
				new Date(),
				"Error fetching record, mysql error:",
				err.message
			);
			callback({ dbError: err.message });
		});
};
