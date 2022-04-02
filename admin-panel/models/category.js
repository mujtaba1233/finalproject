var Mysql = require('../helpers/database-manager')
const { slack } = require('../helpers/slack-helper');

exports.Get = function (callback) {
	var query = "select * from categories order by id desc;"
	Mysql.query(query).then(function (results) {
		if(results.length > 0){
			callback({status:true,msg:"Categories Fetched",result:results});
		}else {
			slack(`File: category.js, \nAction: Get, \nError Categories Not Found \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			callback({status:true,msg:"Categories Not Found",result:[]});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: category.js, \nAction: Get, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({status:false,msg:err.message,result:[]});
	});
};
exports.Save = function (data, callback) {
	Mysql.insertUpdate('categories', data, data).then(function (result) {
		if(result.affectedRows == 2 || result.insertId == 0){
			callback({status:true,msg:"Category Updated.",result:result});
		}else if(result.insertId > 0) {
			callback({status:true,msg:"Category Saved.",result:result});
		}
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: category.js, \nAction: Get, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), err.message);
		callback({ status: false, msg: err.message });
	});
}
exports.remove = function (data, callback) {
	Mysql.delete('categories', { id: data.id }).then(function (result) {
		callback({ status: true, msg: "Category Deleted.", result: result });
	}).catch(function (err) {
		error = JSON.stringify(err.message)
		slack(`File: category.js, \nAction: Get, \nError ${error} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error deleting record, mysql error:', err.message);
		callback({ status: false, msg: err.message });
	});
}
