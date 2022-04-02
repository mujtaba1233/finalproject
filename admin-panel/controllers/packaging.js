var express = require('express');
var router = express.Router();
var model = require('../models/packaging');
var uttils = require('../helpers/utilities');

router.get('/:id?', function (req, res, next) {
	uttils.authenticateUser(req,res, () => {
		model.Get(req.params.id,function (response) {
			res.send(response)
		});
	}, () => {
		res.send('Unathorized access')
	})
});
router.post('/', function (req, res, next) {
	model.Save(req.body, function (response) {
		res.send(response)
	});
});
router.delete('/', function (req, res, next) {
	model.remove(req.body, function (result) {
		res.send(result);
	});
});
module.exports = router;
