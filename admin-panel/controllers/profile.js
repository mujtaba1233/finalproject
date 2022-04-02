var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.put('/', function (req, res, next) {
	db.UpdatePassword(req.body, function (result) {
		res.send(result);
	});
});

module.exports = router;
