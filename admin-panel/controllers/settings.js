var express = require('express');
var router = express.Router();
var model = require('../models/settings');
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
router.post('/', function (req, res, next) {
	var data = req.body
	model.Save(data, function (response) {
		res.send(response)
	});
});
module.exports = router;