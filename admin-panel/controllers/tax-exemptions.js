var express = require('express');
var router = express.Router();
var model = require('../models/tax-exemption');
var uttils = require('../helpers/utilities');

router.get('/', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		model.Get(function (response) {
			res.send(response)
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.delete('/', function (req, res, next) {
	model.remove(req.body, function (result) {
		res.send(result);
	});
});
router.post('/check', function (req, res, next) {
	model.checkExemption(req.body, function (result) {
		res.send(result);
	});
});
router.post('/', function (req, res, next) {
	var data = req.body
	model.Save(data, function (response) {
		res.send(response)
	});
});
module.exports = router;
