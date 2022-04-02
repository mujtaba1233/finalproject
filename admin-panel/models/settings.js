var Mysql = require('../helpers/database-manager')

exports.Get = function (callback) {
	var query = "select * from settings;"
	Mysql.query(query).then(function (results) {
		if (results.length > 0) {
			callback({
				status: true,
				msg: "settings Fetched",
				result: results[0]
			});
		} else {
			callback({
				status: true,
				msg: "settings Not Found",
				result: []
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
			slack(`File: settings.js, \nAction: Get, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
};
exports.Save = function (data, callback) {
	Mysql.insertUpdate('settings', data, data).then(function (result) {
		if (result.affectedRows == 2 || result.insertId == 0) {
			callback({
				status: true,
				msg: "settings Updated.",
				result: result
			});
		} else if (result.insertId > 0) {
			callback({
				status: true,
				msg: "settings Saved.",
				result: result
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: settings.js, \nAction: Save, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err.message);
		callback({
			status: false,
			msg: err.message
		});
	});
}
