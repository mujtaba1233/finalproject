var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.Save = function (data, date, callback) {
	var counter = 0;
	var fileResponse = []
	timeStamp = date.getTime()
	data.files.forEach(function (elem) {
		if (elem.FileExt !== 'zip') {
			delete elem.$$hashKey
			elem.createdAt = new Date()
			elem.FileURL = timeStamp + '/' + elem.FileURL
			Mysql.insert('files', elem).then(function (result) {
				data.files[counter].FileID = result.insertId
				fileResponse.push(data.files[counter])
				counter += 1;
				if (counter === data.files.length) {
					console.log(new Date(), "save Done");
					callback({
						status: true,
						msg: "files saved.",
						result: fileResponse
					});
				}
			}).catch(function (err) {
				fileResponse.push(data.files[counter])
				counter += 1;
				console.log(new Date(), err.message);
				console.log(counter, data.files.length);

				if (counter === data.files.length) {
					console.log(new Date(), "save Done with errors");
					callback({
						status: false,
						msg: err.message,
						result: fileResponse
					});
				}
			});
		} else {
			counter += 1;
			if (counter === data.files.length) {
				console.log(new Date(), "save Done");
				callback({
					status: true,
					msg: "files saved.",
					result: fileResponse
				});
			}
		}
	});
}

exports.SaveDescFile = function (data, url, date, callback) {
	var counter = 0;
	var fileResponse = []
	data.files.forEach(function (elem) {
		delete elem.$$hashKey;
		elem.createdAt = new Date();
		elem.FileURL = `${url}/bs-files/${date}-${elem.FileURL}`;
		Mysql.insert('files', elem).then(function (result) {
			data.files[counter].FileID = result.insertId
			fileResponse.push(data.files[counter])
			counter += 1;
			if (counter === data.files.length) {
				console.log(new Date(), "save Done");
				callback({
					status: true,
					msg: "files saved.",
					result: fileResponse
				});
			}
		}).catch(function (err) {
			fileResponse.push(data.files[counter])
			counter += 1;
			console.log(new Date(), err.message);
			console.log(counter, data.files.length);
			if (counter === data.files.length) {
				console.log(new Date(), "save Done with errors");
				error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: SaveDescFile, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
				callback({
					status: false,
					msg: err.message,
					result: fileResponse
				});
			}
		});

	});
}

exports.remove = function (data, callback) {
	Mysql.delete('files', {
		FileID: data.FileID
	}).then(function (result) {
		Mysql.delete('excel_sheets', {
			FileID: data.FileID
		}).then(function (result) {
			callback({
				status: true,
				msg: "File Deleted Succesfully",
				result: result
			});
		}).catch(function (err) {
			console.log(new Date(), 'Error deleting record, mysql error:', err.message);
			error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: remove, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			callback({
				status: false,
				msg: err.message
			});
		});
	}).catch(function (err) {
		console.log(new Date(), 'Error deleting record, mysql error:', err.message);
		error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: remove, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		callback({
			status: false,
			msg: err.message
		});
	});
}

exports.getFiles = function (data, callback) {
	var query = `select f.* ,u.firstname,u.lastname from files f join user u on u.id = f.createdBy where f.IsActive = 1 AND f.TableName = '${data.tableName}' order by FileID desc`;
	Mysql.query(query).then(function (result) {
		callback({
			status: true,
			msg: "Fetch Success",
			result: result
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: getFiles, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error fetching files:', err.message);
		console.log(new Date(), Mysql.getLastQuery());
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
}


exports.saveSheet = function (data, callback) {
	Mysql.insert('excel_sheets', data).then(function (result) {
		callback({
			status: true,
			msg: "Saved successfully",
			result: result
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: saveSheet, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error excel_sheets insertion, mysql error:', err.message);
		callback({
			status: false,
			msg: err.message,
		});
	});
}

exports.getSheetsDetails = function (data, callback) {
	var query = `select SheetID, SheetName from excel_sheets where FileID = ${data.id} order by DisplayOrder asc`;
	Mysql.query(query).then(function (result) {
		callback({
			status: true,
			msg: "Fetch Success",
			result: result
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: getSheetsDetails, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error fetching sheets:', err.message);
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
}

exports.getSheetsData = function (data, callback) {
	var query = `select SheetID, SheetName, SheetData from excel_sheets where FileID = ${data.id} order by DisplayOrder asc`;
	Mysql.query(query).then(function (result) {
		callback({
			status: true,
			msg: "Fetch Success",
			result: result
		});
	}).catch(function (err) {
		error = JSON.stringify(err.message)
			slack(`File: files.js, \nAction: getSheetsData, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
		console.log(new Date(), 'Error fetching sheets:', err.message);
		console.log(new Date(), Mysql.getLastQuery());
		callback({
			status: false,
			msg: err.message,
			result: []
		});
	});
}