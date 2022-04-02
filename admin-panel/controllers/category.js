var express = require('express');
var router = express.Router();
var model = require('../models/category');
const { slack } = require('../helpers/slack-helper');

router.get('/', function (req, res, next) {
	model.Get(function (response) {
		res.send(response)
	});
});
router.delete('/', function (req, res, next) {
	model.remove(req.body, function (result) {
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
