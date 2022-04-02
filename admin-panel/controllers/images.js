var express = require('express');
var router = express.Router();
var model = require('../models/image');
var fs = require('fs');
const { slack } = require('../helpers/slack-helper');

router.delete('/', function (req, res, next) {
	fs.unlink("./uploads/images/" + req.body.ImageURL, function (err) {
		if (err && err.message.indexOf('no such file or directory') === -1) {
			console.log(new Date(), err);
			error = JSON.stringify(err.message)
			slack(`File: images.js, \nAction: delete, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			res.send({ status: false, msg: err.message })
		} else {
			model.remove(req.body, function (result) {
				res.send(result);
			});
		}
	});
});
router.post('/', async function (req, res, next) {
	const result = await model.update(req.body);
	res.send(result);
});

module.exports = router;
