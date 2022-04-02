var express = require('express');
var router = express.Router();
var model = require('../models/inventory');
var uttils = require('../helpers/utilities');

router.get('/list', function (req, res) {
	uttils.authenticateUser(req,res, () => {
		model.GetInventories(function (result) {
			if (result && result.length > 0)
				res.send(result);
			else
				res.send([]);
		});
	}, () => {
		res.send('Unathorized access')
	})

});

router.post('/update', function (req, res, next) {
	var data = req.body;
	model.UpdateInventory(data, function (result) {
		res.send(result);
	});
});

// Return router
module.exports = router;
