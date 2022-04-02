var Mysql = require('../helpers/database-manager')

exports.GetPasswordHistory = function (id, callback) {
	Mysql.query("SELECT password,id FROM `password_history` where userId = " + id + " ORDER BY id DESC LIMIT 4").then(function (results) {
		if (results.length > 0) {  
			callback({ status: true, msg: "password history of the given user Fetched", results: results });
		} else {
			callback({ status: true, msg: "password history of the given user Not Found",results: []});
		}
	}).catch(function (err) {
        console.log(new Date(), 'Error retrieving all passwords, mysql error:', err.message);
		callback({error:err.message});
	});
};

exports.SavePasswordHistory = function (data, callback) {
    // console.log(data)
    Mysql.insert('password_history', data)
    .then(function (result) {
        createdAt = new Date();
        callback(result);
    })
    .catch(function(err){
        console.log(new Date(), 'Error creating new password, mysql error:', err.message);
        callback({error:err.message});
    });
};