var express = require('express');
var router = express.Router();
var model = require('../models/report');
var uttils = require('../helpers/utilities');

router.get('/intake/:userID', function (req, res, next) {
    var userID = req.params.userID;
    uttils.authenticateUser(req,res, () => {
        model.ReportByYear(userID,function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })

});

router.get('/intake/:year/:userID', function (req, res, next) {
    var year = req.params.year;
    var userID = req.params.userID;
    uttils.authenticateUser(req,res, () => {
        model.ReportByMonth(year,userID, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/intake/:year/:month/:userID', function (req, res, next) {
    var year = req.params.year;
    var month = req.params.month;
    var userID = req.params.userID;
    uttils.authenticateUser(req,res, () => {
        model.ReportByDay(year, month,userID, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/intake/:year/:month/:date/:userID', function (req, res, next) {
    var year = req.params.year;
    var month = req.params.month;
    var date = req.params.date;
    var userID = req.params.userID;
    uttils.authenticateUser(req,res, () => {
        model.ReportByDate(year, month, date,userID, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/ShipByFilters', function (req, res, next) {
    
    uttils.authenticateUser(req,res, () => {
        model.ReportByAllFilter(req.query, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.post('/product-sales', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        model.ProductSalesReport(req.body, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
// Return router
module.exports = router;
