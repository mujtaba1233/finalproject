var express = require('express');
var router = express.Router();
var randtoken = require('rand-token');
var request = require('request');
var parseString = require('xml2js').parseString;
var db = require('../models/db');
var uttils = require('../helpers/utilities');
var mailHelper = require('../helpers/mailHelper');
var bcrypt = require('bcrypt-nodejs');

router.get('/list', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		db.GetAllCustomers(function (records) {
			res.send(JSON.stringify(records));
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/getRecord/:customerID', function (req, res, next) {
	Id = req.params;
	// console.log(Id)
	uttils.authenticateUser(req,res, () => {
		db.GetCustomersRecord(Id, function (records) {
			// console.log(records)
			res.send(JSON.stringify(records));
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/modal-list', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		db.GetAllModalCustomers(function (records) {
			res.send(JSON.stringify(records));
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/sync', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		var customerUrl = "http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=" + process.env.VOLUSION_PASSWORD + "&EDI_Name=Generic\\Customers&SELECT_Columns=CustomerID,BillingAddress1,BillingAddress2,City,CompanyName,Country,EmailAddress,FirstName,LastName,PostalCode,State,PhoneNumber";
		var opt = {
			url: customerUrl
		};
		function callback(error, result, body) {
			parseString(body, function (err, result) {
				if (!err && result && result.xmldata != undefined) {
					if (result.xmldata.Customers != undefined) {
						db.InsertCustomers(result.xmldata.Customers, function () {
							res.send(JSON.stringify({ status: 'updated' }));
						});
					} else {
						res.send(JSON.stringify({ status: 'already updated' }));
					}
				} else {
					mailHelper.errorReport({
						subject: "RMA Import Status",
						error: uttils.ERROR_STRING()
					});
					res.send(JSON.stringify({ status: 'volusion password expired' }));
				}
			});
		}
		request(opt, callback);
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/save', function (req, res, next) {
	// console.log(req.body.data, " ssdsad")
	uttils.authenticateUser(req,res, () => {
		db.SaveCustomer(req.body.data, function (result) {
			user = req.body.data;
			res.send(JSON.stringify(result));
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/update',  function (req, res, next) {
	// console.log(req.body.data, " ssdsad")
	uttils.authenticateUser(req,res, async () => {
	let result = await	db.UpdateCustomer(req.body.data)
		res.send(JSON.stringify(result));
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/update-token',  function (req, res, next) {
	req.body.token = randtoken.generate(64);
	uttils.authenticateUser(req,res, async () => {
		let result = await	db.UpdatePasswordLink(req.body)
		res.send(JSON.stringify(result));
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/update-password',  function (req, res, next) {
	uttils.authenticateUser(req,res, async () => {
		bcrypt.hash(req.body.password, null, null, async function (err, hash) {
            req.body.password = hash;
            let result = await	db.UpdatePasswordCustomerFromDashboard(req.body)
			res.send(JSON.stringify(result));
        });
	}, () => {
		res.send('Unathorized access')
	})
});
// Return router
module.exports = router;
