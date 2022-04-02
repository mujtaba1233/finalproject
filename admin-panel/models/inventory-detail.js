const { find } = require('async');
const { product } = require('puppeteer');
const { update } = require('../helpers/database-manager');
var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.GetList = function (productId, OrderID,count, callback) {
	var where;
	var query;
	if (productId && OrderID !== "undefined") {
		where =
			" where ps.ProductID = " +
			productId +
			" && ps.OrderID = " +
			OrderID +
			" && (status = 'allocated' || status = 'shipped');";
	} else if (productId && count ==="undefined") {
		where =
			" where ps.ProductID = " + productId + " &&  status = 'unAllocated';";
	}
	else if(count){
		where =
			" where ps.ProductID = " + productId + " ;";
	}
	 else {
		where = " ;";
	}
	query = "select  ps.*,p.ProductCode,p.ProductName,ps.status from product_serials ps join products p on p.ProductID = ps.ProductID" + where;

	Mysql.query(query).then(function (results) {
		if(results.length > 0){
			callback(results);
		}else {
			callback([])
		}
	})
	.catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: inventory-detail.js, \nAction: GetList, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err);
		reject(err);
	});
};

exports.getAllocatedList = async function (OrderID, callback) {
	try {
		const result = await Mysql.query(
			"select * from product_serials where OrderID = " +
				OrderID +
				" and status = 'allocated';"
		);
		return { status: true, Result: result };
	} catch (error) {
		console.log(new Date(), "Error on saving, mysql error:", error.message);
		return { status: false, msg: error.message };
	}
};
exports.getAllSerialList = async function (OrderID, callback) {
	try {
		let query = "select * from product_serials where OrderID = " +
		OrderID +
		" and (status = 'allocated'  or status = 'shipped'  );"
		// console.log(query)

		const result = await Mysql.query(
			query
		);
		return { status: true, Result: result };
	} catch (error) {
		console.log(new Date(), "Error on saving, mysql error:", error.message);
		return { status: false, msg: error.message };
	}
};

exports.GetProductInventoryList = function (productId, type, callback) {
	var where;
	var query;
	if (type == "allocated") {
		where =
			" where ps.ProductID = " + productId + " && ps.status = 'allocated';";
	} else if (type == "unAllocated") {
		where =
			" where ps.ProductID = " + productId + " && ps.status = 'unAllocated';";
	} else if (type == "shipped") {
		where =
			" where ps.ProductID = " + productId + " && ps.status = 'shipped' ;";
	} else {
		where = " ;";
	}
	query = "select  ps.*,p.ProductCode,p.ProductName,ps.status from product_serials ps join products p on p.ProductID = ps.ProductID" + where;
	console.log(query)
	Mysql.query(query).then(function (results) {
		if(results.length > 0){
			callback(results);
		}else {
			callback([])
		}
	})
	.catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: inventory-detail.js, \nAction: GetProductInventoryList, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err);
		reject(err);
	});
};

exports.GetSerials = function (productId, callback) {
	if (productId && type) {
		if (type == "stock") {
			var query =
				"select ps.*,p.ProductCode,p.ProductName from product_serials ps join products p on p.ProductID = ps.ProductID  where IsStock = 1 && ps.ProductID = " +
				productId;
		} else if (type == "production") {
			var query =
				"select  ps.*,p.ProductCode,p.ProductName from product_serials ps join products p on p.ProductID = ps.ProductID   where IsProduction = 1 && ps.ProductID = " +
				productId;
		} else {
			var query =
				"select  ps.*,p.ProductCode,p.ProductName from product_serials ps join products p on p.ProductID = ps.ProductID  where ps.ProductID = " +
				productId;
		}
	} else {
		var query =
			"select  ps.*,p.ProductCode,p.ProductName,ps.isShipped,ps.isAllocated from product_serials ps join products p on p.ProductID = ps.ProductID ;";
	}
	Mysql.query(query).then(function (results) {
		if(results.length > 0){
			callback(results);
		}else {
			callback([])
		}
	})
	.catch(function (err) {
		error = JSON.stringify(err)
		slack(`File: inventory-detail.js, \nAction: GetSerials, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err);
		reject(err);
	});
};

exports.Save = async function (data, callback) {
	arrayOfSerial_Product = [];
	await Promise.all(
		data.SerialNO.map(async (serialNo, SerialNO) => {
			arrayOfSerial_Product.push({ SerialNO: serialNo });
		})
	);
	let createdOn = new Date();
	let UpdatedOn = new Date();
	let SerialProductID = data.ProductID;
	let allSerials = [];
	let duplicateArray = [];

	try {
		allSerials = await Mysql.query(
			"Select SerialNO from product_serials where ProductID = " +
				SerialProductID
		);
		allSerials = Object.values(JSON.parse(JSON.stringify(allSerials)));
		duplicateArray = allSerials.filter((o1) =>
			arrayOfSerial_Product.some((o2) => o1.SerialNO.toUpperCase() === o2.SerialNO.toUpperCase())
		);
		const results = await Promise.all(
			arrayOfSerial_Product.map(async (product, index) => {
				product.createdOn = createdOn;
				product.UpdatedOn = UpdatedOn;
				product.ProductID = SerialProductID;
				if(product.SerialNO  !== ""){
					product.SerialNO = product.SerialNO.split(" ").join("")
					product.SerialNO = product.SerialNO.toUpperCase();
					const result = await Mysql.insert("product_serials", product);
					return result;
				}
			})
		);
		return {
			status: true,
			msg: "Succefully Saved",
			ProductID: SerialProductID,
		};
	} catch (error) {
		if (duplicateArray.length > 0) {
			console.log(new Date(), "Error on saving, mysql error:", error.message);
			return {
				status: false,
				msg: "Serial No's are saved except duplicates",
				duplicateArray: duplicateArray,
			};
		} else {
			return { status: false, msg: error.message };
		}
	}
};

exports.OrderInventoryAllocatedSave = async function (data, callback) {
	arrayOfSerial_Product = [];
	console.log(data.SerialNO.length)
	await Promise.all(
		data.SerialNO.map(async (serialNo, SerialNO) => {
			arrayOfSerial_Product.push({ SerialNO: serialNo });
		})
	);
	let SerialProductID = data.ProductID;
	let OrderID = data.OrderID;

	try {
		console.log(arrayOfSerial_Product)
		if(arrayOfSerial_Product.length>0){
		const results = await Promise.all(
			arrayOfSerial_Product.map(async (product, index) => {
				const result = await Mysql.query(
					"update product_serials set status = 'allocated' , OrderID = " +
						OrderID +
						" where ProductID = " +
						SerialProductID +
						" && SerialNO = '" +
						product.SerialNO +
						"';"
				);
				return result;
			})
		);
		return { status: true, msg: "Succefully Allocated", Result: result };
		}
		else{
			console.log(arrayOfSerial_Product)
			return { status: false, msg: "Nothing change"};
		}
	} catch (error) {
		console.log(new Date(), "Error on saving, mysql error :", error.message);
		return { status: false, msg: error.message };
	}
};
exports.delete = function (id, callback) {
	Mysql.delete("product_serials", { ProductSerialID: id })
		.then(function (result) {
			callback({
				status: true,
				msg: "Product Serial Deleted.",
				result: result,
			});
		})
		.catch(function (err) {
			console.log(
				new Date(),
				"Error deleting record, mysql error:",
				err.message
			);
			callback({ status: false, msg: err.message });
		});
};
exports.UnAllocated = async function (id, callback) {
	try {
		const result = await Mysql.query(
			"update product_serials set status = 'unAllocated' , OrderID = NULL where ProductSerialID = " +
				id +
				" ;"
		);
		return { status: true, msg: "Succefully Un-Allocated", Result: result };
	} catch (error) {
		console.log(new Date(), "Error on saving, mysql error:", error.message);
		return { status: false, msg: error.message };
	}
};
