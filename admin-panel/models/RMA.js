var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.ImportRMADBTable = function(rma,callback){
	var callbackCount = rma.length;
	for (var i = 0; i < rma.length; i++) {
		Mysql.insertUpdate('rmadatabase', rma[i], rma[i])
		.then(function (info) {
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: RMA.js, \nAction: ImportRMADBTable, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), "Err RMADataBase =========== ",err);
			callbackCount--;
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}

exports.ImportProblems = function(problems,callback){
	var callbackCount = problems.length;
	for (var i = 0; i < problems.length; i++) {
		Mysql.insertUpdate('presetproblems', problems[i], problems[i])
		.then(function (info) {
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: RMA.js, \nAction: ImportProblems, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), "Err ImportProblems =========== ",err);
			callbackCount--;
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}

exports.ImporCustomer = function(customer,callback){
	var callbackCount = customer.length;
	for (var i = 0; i < customer.length; i++) {
		Mysql.insertUpdate('presetcustomer', customer[i], customer[i])
		.then(function (info) {
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			error = JSON.stringify(err)
			slack(`File: RMA.js, \nAction: ImporCustomer, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			console.log(new Date(), "Err ImporCustomer =========== ",err);
			callbackCount--;
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}

exports.GetAllRMA = function(callback){
    Mysql.query("SELECT * FROM rmadatabase order by id desc;", {})
    .then(function(records){
        callback(records);
    })
    .catch(function(err){
		error = JSON.stringify(err.message)
			slack(`File: RMA.js, \nAction: GetAllRMA, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'Error fetching record, mysql error:', err.message);
    });
}
exports.GetRMA = function(id,callback){
    Mysql.query("SELECT * FROM rmadatabase where id = "+id, {})
    .then(function(record){
        callback(record);
    })
    .catch(function(err){
		error = JSON.stringify(err.message)
			slack(`File: RMA.js, \nAction: GetRMA, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'Error fetching record, mysql error:', err.message);
    });
}
