var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.Get = function (callback) {
	var query = "select * from tax_exemptions where isDeleted = 0 order by id desc;"
	Mysql.query(query).then(function (results) {
		if (results.length > 0) {
			callback({
				status: true,
				msg: "tax_exemptions Fetched",
				result: results
			});
		} else {
			callback({
				status: true,
				msg: "tax_exemptions Not Found",
				result: []
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: tax-exemption.js, \nAction: Get, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
};
exports.Save = function (data, callback) {
	data.dateFrom = new Date(data.dateFrom)
	data.dateTill = new Date(data.dateTill)
	var insert = data
	var update = data
	if (data.id) {
		update.updatedOn = new Date()
	} else {
		insert.createdOn = new Date()
	}
	Mysql.insertUpdate('tax_exemptions', insert, update).then(function (result) {
		if (result.affectedRows == 2 || result.insertId == 0) {
			callback({
				status: true,
				msg: "tax_exemptions Updated.",
				result: result
			});
		} else if (result.insertId > 0) {
			callback({
				status: true,
				msg: "tax_exemptions Saved.",
				result: result
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: tax-exemption.js, \nAction: Save, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err.message);
		callback({
			status: false,
			msg: err.message
		});
	});
}
exports.checkExemption = function (data, callback) {
	data.orderDate = data.orderDate.split('T')[0]
	var query = `select * from tax_exemptions where address1 = "${data.address1}" and address2 =  "${data.address2}" and city = "${data.city}" and state =  "${data.state}" and country = "${data.country}" and postalCode = '${data.postalCode}' and dateFrom <= '${data.orderDate}' and dateTill >= '${data.orderDate}' and isActive = 1`
	// console.log("yoo",query)
	Mysql.query(query).then(function (result) {
		if (result.length) {
			callback({
				status: true,
				msg: "This address have tax exemption",
				result: result,
				isExempt: true
			});
		} else {
			callback({
				status: true,
				msg: "This address not have tax exemption",
				result: [],
				isExempt: false
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: tax-exemption.js, \nAction: checkExemption, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
};
exports.remove = function (data, callback) {
	Mysql.update('tax_exemptions', {
		id: data.id
	}, {
		isDeleted:1,
		deletedOn: new Date()
	}).then(function (result) {
		callback({
			status: true,
			msg: "Tax Exemptions Deleted.",
			result: result
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: tax-exemption.js, \nAction: remove, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error deleting tax_exemptions, mysql error:', err.message);
		callback({
			status: false,
			msg: err.message
		});
	});
}