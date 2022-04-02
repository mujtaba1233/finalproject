var express = require('express');
var router = express.Router();
var model = require('../models/dashboard');
var uttils = require('../helpers/utilities');

router.get('/search/:query', function (req, res, next) {
    var searchQuery = req.params.query;
    uttils.authenticateUser(req,res, () => {
		model.GeneralSearch(searchQuery,function (records) {
            res.send(JSON.stringify(records));
        });
	}, () => {
		res.send('Unathorized access')
	})
});
router.get('/getWidget1', function (req, res, next) {
    var year = req.params.year;
    model.Widget1(function (records) {
        res.send(JSON.stringify(records));
    });
});
router.get('/getWidget2', function (req, res, next) {
    model.Widget2(function (records) {
        res.send(JSON.stringify(records));
    });
});
router.get('/getWidget3', function (req, res, next) {
    model.Widget3(function (records) {
        res.send(JSON.stringify(records));
    });
});
// Return router
module.exports = router;
