var express = require('express');
var router = express.Router();
var request = require('request');
var db = require('../models/db');
var uttils = require('../helpers/utilities');
var path = require('path');
var googleDrive = require('../helpers/googleDrive');
var mailHelper = require('../helpers/mailHelper');
const calculateTax = require('../helpers/utilities').calculateTax;
const calculateUsTax = require('../helpers/utilities').calculateUsTax;
// const { getCode } = require('country-list');

router.post('/get-tax-rate', function (req, res, next) {
    var data = req.body;
    // data.ShipCountry = getCode(data.ShipCountry)?getCode(data.ShipCountry):data.ShipCountry
    calculateTax(data, function (response) {
        res.send(response)
    })
})

router.post('/clone-quote', function (req, res, next) {
    var quoteNo = req.body.quoteNo;
    var userId = req.body.userId;
    let data = { quoteNo, userId }
    db.CloneQuote(data, function (result) {
        if (result && result.length > 0)
            res.send({ success: true, quote: result[0] });
        else
            res.send({ success: false, quote: result });
    });
});

router.get('/get', function (req, res) {
    var quoteId = req.query.quoteId;
    uttils.authenticateUser(req, res, () => {
        db.GetQuote(quoteId, function (result) {
            if (result && result.length > 0)
                res.send({ data: result });
            else
                res.send("");
        });
    }, () => {
        res.send('Unathorized access')
    })

});

router.post('/remove-quote', function (req, res) {
    var quoteId = req.body.quoteId;
    db.RemoveQuote(quoteId, function (result) {
        res.send(result);
    });
});

router.get('/driveCallback', function (req, res) {
    var code = req.query.code;
    var quoteId = req.query.state;
    var callbackUrl = uttils.getProtocol(req) + uttils.getBaseUrl(req) + 'api/quote/driveCallback';
    googleDrive.retrieveNewToken(code, callbackUrl, function () {
        var url = uttils.getProtocol(req) + uttils.getBaseUrl(req) + 'api/quote/GeneratePDF/' + quoteId;
        res.redirect(url);
    });
});

router.get('/list/:duration', function (req, res, next) {
    query = req.params;
    uttils.authenticateUser(req, res, () => {
        db.GetAllQuote(query, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.post('/list-filter', function (req, res, next) {
    query = req.body;
    uttils.authenticateUser(req, res, () => {
        db.GetDateQuote(query, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/listExternal', function (req, res, next) {
    // query = req.params;

    uttils.authenticateUser(req, res, () => {
        db.GetAllExternalQuote(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.post('/get-us-tax-rate', function (req, res, next) {
    query = req.body;
    // console.log(req.body, "req.body")
    uttils.authenticateUser(req, res, () => {
        calculateUsTax(req.body, function (records) {
            res.send(records);
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.post('/save', function (req, res, next) {
    db.SaveQuote(req.body, function (result) {
        res.send(JSON.stringify(result));
    });
});
router.post('/update', async function (req, res, next) {
    const result = await db.UpdateQuote(req.body)
    res.send(result);
});
// Return router
module.exports = router;
