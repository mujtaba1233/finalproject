var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');
exports.Save = function (data, timeStamp, callback) {
	var counter = 0;
	data.pdfs.forEach(function (elem) {
		delete elem.$$hashKey
		elem.URL = timeStamp + '-' + elem.URL
		Mysql.insert('product_details', elem).then(function (result) {
			counter += 1;
			if (counter == data.pdfs.length) {
				console.log(new Date(), "save Done");
				callback({ status: true, msg: "product_details saved.", result: result });
			} else {
				console.log(new Date(), "Processing");
			}
		}).catch(function (err) {
			error = JSON.stringify(err.message)
		slack(`File: product-detail.js, \nAction: Save, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), err.message);
			callback({ status: false, msg: err.message });
		});
	});
}

exports.remove = function (data, callback) {
	Mysql.delete('product_details', {ProductDetailID:data.ProductDetailID}).then(function (result) {
		callback({ status: true, msg: "PDF Deleted Succesfully", result: result });
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: product-detail.js, \nAction: remove, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error deleting record, mysql error:', err.message);
		console.log(new Date(), Mysql.getLastQuery());
		callback({ status: false, msg: err.message });
	});
}
