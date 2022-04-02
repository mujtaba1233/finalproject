require('dotenv').config()
var Mysql = require('node-mysql-helper');
var express = require('express');
var router = express.Router();
// var model = require('./admin-panel/models/RMA');
var csvtojson = require("csvtojson");
var shell = require('shelljs');
var mailHelper = require('./admin-panel/helpers/mailHelper');
fs = require('fs');

var mysqlOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false')? false:process.env.DB_SOCKET_PATH ,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};
Mysql.connect(mysqlOptions);

var rmaPromiss = false;
var customerPromiss = false;
var problemsPromiss = false;
var errorArray = [];

var exitProcess = function(){
	if(rmaPromiss && customerPromiss && problemsPromiss){
		if(errorArray.length > 0){
			errorArray.toString().replace(/,/g,"/n")
			mailHelper.errorReport({
				subject: "RMA Import Status",
				error: errorArray
			});
		}
		setTimeout(function(){
			process.exit();
		},10000)
	}else {
		console.log("Continue");
	}
}
var ImporCustomer = function(customer,callback){
	var callbackCount = customer.length;
	for (var i = 0; i < customer.length; i++) {
		Mysql.insertUpdate('presetcustomer', customer[i], customer[i])
		.then(function (info) {
			// console.log("Info *+*+*+*+**+*+*+*+*");
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			console.log("Err ImporCustomer =========== ",err);
			callbackCount--;
			errorArray.push(err);
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}
var ImportProblems = function(problems,callback){
	var callbackCount = problems.length;
	for (var i = 0; i < problems.length; i++) {
		Mysql.insertUpdate('presetproblems', problems[i], problems[i])
		.then(function (info) {
			// console.log("Info *+*+*+*+**+*+*+*+*");
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			console.log("Err ImportProblems =========== ",err);
			callbackCount--;
			errorArray.push(err);
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}
var ImportRMADBTable = function(rma,callback){
	var callbackCount = rma.length;
	for (var i = 0; i < rma.length; i++) {
		Mysql.insertUpdate('rmadatabase', rma[i], rma[i])
		.then(function (info) {
			// console.log("Info *+*+*+*+**+*+*+*+*");
			callbackCount--;
			if (callbackCount == 0)
			callback();
		})
		.catch(function (err) {
			console.log("Err RMADataBase =========== ",err);
			callbackCount--;
			errorArray.push(err);
			if (callbackCount == 0)
			callback("Complete with errors");
		});
	}
}

var path = "/home/webdev/RMA_DB_Uploads/ICSRMA_C.db";
var dir = __dirname + '/admin-panel/files/RMA_CSV';
if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}
if(shell.exec('sqlite3 -header -csv ' + path +' "select * from RMADataBase;" > ' + __dirname + '/admin-panel/files/RMA_CSV/RMADataBase.csv').code == 0){
	csvtojson().fromFile(__dirname + '/admin-panel/files/RMA_CSV/RMADataBase.csv').then((rma)=>{
		// console.log(rma.length);
		ImportRMADBTable(rma,function (err) {
			rmaPromiss = true;
			if(err){
				console.log("Error ====> ",err);
				errorArray.push(err);
			}else {
				console.log("rma success");
			}
			exitProcess();
		})
	})
}
if(shell.exec('sqlite3 -header -csv ' + path +' "select * from PreSetCustomer;" > ' + __dirname + '/admin-panel/files/RMA_CSV/PreSetCustomer.csv').code == 0){
	csvtojson().fromFile(__dirname + '/admin-panel/files/RMA_CSV/PreSetCustomer.csv').then((customer)=>{
		// console.log(customer.length);
		ImporCustomer(customer,function (err) {
			customerPromiss = true;
			if(err){
				console.log("Error ====> ",err);
				errorArray.push(err);
			}else {
				console.log("customer success");
			}
			exitProcess();
		})
	})
}
if(shell.exec('sqlite3 -header -csv ' + path +' "select * from PreSetProblems;" > ' + __dirname + '/admin-panel/files/RMA_CSV/PreSetProblems.csv').code == 0){
	csvtojson().fromFile(__dirname + '/admin-panel/files/RMA_CSV/PreSetProblems.csv').then((problems)=>{
		console.log(problems.length);
		ImportProblems(problems,function (err) {
			problemsPromiss = true;
			if(err){
				console.log("Error ====> ",err);
				errorArray.push(err);
			}else {
				console.log("problems success");
			}
			exitProcess();
		})
	})
}
