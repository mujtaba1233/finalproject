var express = require('express');
var router = express.Router();
var model = require('../models/order');
var request = require('request');
var parseString = require('xml2js').parseString;
var uttils = require('../helpers/utilities');
var mailHelper = require('../helpers/mailHelper');
var Client = require('node-rest-client').Client;
var client = new Client();

router.post('/order-on-volusion', function (req, res) {
	var xmlData = req.body.data;
	var args = {
		headers: {
			"MIME-Version": "1.0",
			"Content-type": "text/xml; charset=utf-8",
			"Content-length": xmlData.length.toString(),
			"Content-transfer-encoding": "text",
			"Request-number": "1",
			"Document-type": "Request",
			"Interface-Version": "Test 1.4",
			"Connection": "close"
		},
		data: xmlData
	};
	client.post("http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=" + process.env.VOLUSION_PASSWORD + "&Import=Insert",
		args,
		function (data, response) {
			res.send(data)
		});
});
router.get('/sync', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		var orderUrl = "http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=" + process.env.VOLUSION_PASSWORD + "&EDI_Name=Generic\\Orders&SELECT_Columns=*";
		var opt = {
			url: orderUrl
		};

		function callback(error, result, body) {
			parseString(body, function (err, result) {
				if (!err && result && result.xmldata != undefined) {
					if (result.xmldata.Orders != undefined && result.xmldata.Orders.length > 0) {
						console.log(new Date(), 'Orders Length: ', result.xmldata.Orders.length);
						// res.send(JSON.stringify(result.xmldata.Orders));
						model.SyncOrders(result.xmldata.Orders, function () {
							res.send(JSON.stringify({
								status: 'updated',
								length: result.xmldata.Orders.length
							}));
						});
					} else {
						res.send(JSON.stringify({
							status: 'already updated'
						}));
					}
				} else {
					mailHelper.errorReport({
						subject: "RMA Import Status",
						error: uttils.ERROR_STRING()
					});
					res.send(JSON.stringify({
						status: 'volusion password expired'
					}));
				}
			});
		}
		request(opt, callback);
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/order-on-blue-sky', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		req.body.InvoiceableOn = new Date(req.body.InvoiceableOn);
		if (req.body.OrderID) {
			model.InsertOrders(req.body, function (result) {
				res.send(JSON.stringify(result));
			});
		} else {
			model.InsertOrders(req.body, function (result) {
				res.send(JSON.stringify(result));
			});
		}
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/order-packages/:orderId', function (req, res, next) {
	
	var orderId = req.params.orderId;
	uttils.authenticateUser(req,res, () => {
		model.GetOrderPackages(orderId, function (result) {
			if (result && result.length > 0)
				res.send(result);
			else
				res.send("Order not Found");
		});
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/order-track/:orderId', function (req, res, next) {
	
	var orderId = req.params.orderId;
	uttils.authenticateUser(req,res, () => {
		model.GetOrderTrack(orderId, function (result) {
			if (result && result.length > 0)
				res.send(result);
			else
				res.send("Track not Found");
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.delete('/delete-order-track', function (req, res, next) {
	var id = req.body.Id;
	model.deleteOrderTrack(id, function (result) {
		res.send(result);
	});
});
router.get('/lists', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		model.GetOrdersByOpenStatus( function (records) {
			res.send(JSON.stringify(records));
		});
	}, () => {
		res.send('Unathorized access')
	})

});
router.get('/list/:duration', function (req, res, next) {
	query = req.params;
	uttils.authenticateUser(req,res, () => {
		model.GetOrders(query, function (records) {
			res.send(JSON.stringify(records));
		});
	}, () => {
		res.send('Unathorized access')
	})

});
router.post('/list', function (req, res, next) {
	startDate = new Date(req.body.startDate.split('T')[0]);
	endDate = new Date(req.body.endDate.split('T')[0]);
	startDate = startDate.getFullYear() + '/' + (startDate.getMonth() + 1) + '/' + startDate.getDate() + ' 12:00:00 AM';
	endDate = endDate.getFullYear() + '/' + (endDate.getMonth() + 1) + '/' + endDate.getDate() + ' 11:59:59 PM';
	query = { 'startTime': startDate, 'endTime': endDate };
	model.GetOrders(query, function (records) {
		res.send(JSON.stringify(records));
	});
});
router.post('/listByStatus', function (req, res, next) {
	let query = req.body;
	model.GetOrdersByStatus(query, function (records) {
		res.send(JSON.stringify(records));
	});
});
router.get('/list/open/:productId', function (req, res, next) {
	var productId = req.params.productId;
	uttils.authenticateUser(req,res, () => {
		model.GetOpenOrderByProductID(productId, function (records) {
			res.send(records);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/get/:orderId', function (req, res, next) {
	
	var orderId = req.params.orderId;
	uttils.authenticateUser(req,res, () => {
		model.GetOrder(orderId, function (result) {
			if (result && result.length > 0)
				res.send(result);
			else
				res.send("Order not Found");
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/get-by-serial/:serialNo', function (req, res, next) {
	var orderId = req.params.serialNo;
	uttils.authenticateUser(req,res, () => {
		model.GetOrderBySerial(orderId, function (result) {
			if (result && result.length > 0)
				res.send(result);
			else
				res.send("Order not Found");
		});
	}, () => {
		res.send('Unathorized access')
	})
});
// router.post('/update-parent-only', function (req, res, next) {
// 	model.update(req.body, function (result) {
// 		res.send(result);
// 	});
// });
// Return router
module.exports = router;