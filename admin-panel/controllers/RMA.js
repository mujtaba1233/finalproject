var express = require('express');
var router = express.Router();
var model = require('../models/RMA');
var uttils = require('../helpers/utilities');
var csvtojson = require("csvtojson");
var promise = require('bluebird');
var shell = require('shelljs');
fs = require('fs');

router.get('/list', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		model.GetAllRMA(function (records) {
			res.send(records);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/get/:id', function (req, res, next) {
	var id = req.params.id
	uttils.authenticateUser(req,res, () => {
		model.GetRMA(id, function (record) {
			res.send(record);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/upload', function (req, res, next) {
	req.pipe(req.busboy);
	req.busboy.on('file', function (fieldName, file, fileName) {
		if (fileName.substr(fileName.length - 3) === ".db") {
			var d = new Date().getTime()
			var dir = './admin-panel/files/RMA_Uploads';
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			path = "./admin-panel/files/RMA_Uploads/" + "RMA_db-" + d + "-" + fileName;
			var fstream = fs.createWriteStream(path);
			file.pipe(fstream);
			fstream.on('close', function () {
				res.send({ success: true, message: "Valid file, Press import!", path: path })
			});
		} else {
			res.send({ success: false, message: "Invalid File!", path: fileName });
		}
	});
});

router.post('/save', function (req, res, next) {
	var path = req.body.path;
	var dir = __dirname + '/../files/RMA_CSV';
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	shell.exec('sqlite3 -header -csv ' + __dirname + '/.' + path + ' "select * from RMADataBase;" > ' + __dirname + '/../files/RMA_CSV/RMADataBase.csv');
	shell.exec('sqlite3 -header -csv ' + __dirname + '/.' + path + ' "select * from PreSetCustomer;" > ' + __dirname + '/../files/RMA_CSV/PreSetCustomer.csv');
	shell.exec('sqlite3 -header -csv ' + __dirname + '/.' + path + ' "select * from PreSetProblems;" > ' + __dirname + '/../files/RMA_CSV/PreSetProblems.csv');
	csvtojson().fromFile(__dirname + '/../files/RMA_CSV/RMADataBase.csv').then((rma) => {
		model.ImportRMADBTable(rma, function (err) {
			csvtojson().fromFile(__dirname + '/../files/RMA_CSV/PreSetCustomer.csv').then((customer) => {
				model.ImporCustomer(customer, function (err) {
					csvtojson().fromFile(__dirname + '/../files/RMA_CSV/PreSetProblems.csv').then((problems) => {
						model.ImportProblems(problems, function (err) {
							res.send("Party");
						});
					})
				})
			})
		})
	})
});

module.exports = router;
