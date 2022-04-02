var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.GetPackagingBox = function (callback) {
	var query = "select * from packaging_box where isActive = 1 order by length,width,height;"
	Mysql.query(query).then(function (results) {
		if (results.length > 0) {
			callback({ status: true, msg: "packaging_box Fetched", result: results });
		} else {
			error = JSON.stringify(err.message)
			slack(`File: packaging-box.js, \nAction: GetPackagingBox, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			callback({ status: true, msg: "packaging_box Not Found", result: [] });
		}
	}).catch(function (err) {
		callback({ status: false, msg: err.message, result: [] });
	});
};