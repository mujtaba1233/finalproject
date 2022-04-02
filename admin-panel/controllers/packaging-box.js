var express = require('express');
var router = express.Router();
var model = require('../models/packaging-box');
var uttils = require('../helpers/utilities');

router.get('/', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		model.GetPackagingBox(function (response) {
			res.send(response)
		});
	}, () => {
		res.send('Unathorized access')
	})
	
});
module.exports = router;
