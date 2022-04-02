var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.Get = function (productId, callback) {
	if(productId)
	var query = "select id, productId, quantity, dimensions from product_packaging where isActive = 1 and productId = " + productId + " order by quantity asc";
	else
	var query = "select id, productId, quantity, dimensions from product_packaging where isActive = 1 order by quantity asc";
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
				msg: "Packging Not Found",
				result: []
			});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: packaging.js, \nAction: Get, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(),err);
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
};
exports.Save = async function (data, callback) {
	if(Array.isArray(data)){
		try {
			await Promise.all(data.map(async (elem) => {
				await Mysql.insertUpdate('product_packaging', elem, elem)
			})).then((response) => {
			});
			var query = "select id, productId, quantity, dimensions from product_packaging where isActive = 1 and productId = " + data[0].productId;
			const results = await Mysql.query(query)
			callback({ status: true, msg: "product_packaging Saved.", result: results });
		} catch (error) {
			err = JSON.stringify(error)
			slack(`File: packaging.js, \nAction: Save, \nError ${err} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log('*+*+*+*+**+*+*',error);
		}
	}else{
		callback({ status: false, msg: "invalid data.", result: data });
	}
}
exports.remove = function (data, callback) {
	Mysql.delete('product_packaging', { id: data.id }).then(function () {
		callback({ status: true, msg: "Packaging deleted successfully." });
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: packaging.js, \nAction: remove, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error deleting record from Product_packaging, mysql error:', err.message);
		callback({ status: false, msg: err.message });
	});
}
