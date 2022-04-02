var express = require('express');
var router = express.Router();
var model = require('../models/inventory-detail');
var uttils = require('../helpers/utilities');
const { product } = require('puppeteer');

router.get('/list', function (req, res) {
	uttils.authenticateUser(req,res, () => {
		model.GetList(undefined, undefined, function (result) {
			res.send(result);
		}, function () {
			res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/list/:productId', function (req, res) {
	var id = req.params.productId;
	uttils.authenticateUser(req,res, () => {
		model.GetList(id, undefined, function (result) {
			res.send(result);
		}, function () {
			res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/list/:OrderID/:productId', function (req, res) {
	var id = req.params.productId;
	var OrderID = req.params.OrderID;
	uttils.authenticateUser(req,res, () => {
		model.GetList(id, OrderID, function (result) {
			res.send(result);
		}, function () {
			res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/list/:OrderID/:productId/:count', function (req, res) {
	var id = req.params.productId;
	var OrderID = req.params.OrderID;
	var count = req.params.count;
	uttils.authenticateUser(req,res, () => {
		model.GetList(id, OrderID,count, function (result) {
			res.send(result);
		}, function () {
			res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/detail-list/:productId/:type', function (req, res) {
	var id = req.params.productId;
	var type = req.params.type;
	console.log(type)
	uttils.authenticateUser(req,res, () => {
		model.GetProductInventoryList(id, type,function (result) {
			res.send(result);
		}, function () {
			res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})
});

router.delete('/delete', function (req, res, next) {
	var id = req.body.ProductSerialID;
	model.delete(id, function (result) {
		res.send(result);
	});
});

router.delete('/order/unAllocated', function (req, res, next) {
	var id = req.body.ProductSerialID;
	uttils.authenticateUser(req, res, async (user) => {
		const result = await model.UnAllocated(id)
		res.send(result);
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});

router.post('/save', function (req, res, next) {
	uttils.authenticateUser(req, res, async (user) => {
		const result = await model.Save(req.body)
		res.send(result);
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});

router.post('/order/inventory-save', function (req, res, next) {
	uttils.authenticateUser(req, res, async (user) => {
		const result = await model.OrderInventoryAllocatedSave(req.body)
		res.send(result);
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});

router.get('/order/allocated-list/:OrderID', function (req, res, next) {
	var orderId = req.params.OrderID;
	uttils.authenticateUser(req, res, async (user) => {
		const result = await model.getAllocatedList(orderId)
		res.send(result);
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});
router.get('/order/allSerialsOfOrder/:OrderID', function (req, res, next) {
	var orderId = req.params.OrderID;
	uttils.authenticateUser(req, res, async (user) => {
		const result = await model.getAllSerialList(orderId)
		res.send(result);
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});
// Return router
module.exports = router;
