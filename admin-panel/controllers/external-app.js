var express = require('express');
var router = express.Router();
var model = require('../models/external-app');
var uttils = require('../helpers/utilities');


router.delete('/external/quote/:id', function (req, res) {
    var quoteId = req.params.id;
    uttils.authenticateUser(req, res, () => {
        console.log('internal')
    }, () => {
        res.send('Unathorized access')
    }, async (user) => {
        const response = await model.RemoveQuote(quoteId,user.id);
        res.send(response)
    })
});

router.get('/external/quote/:QuoteId', async function (req, res, next) {
    uttils.authenticateUser(req, res, () => {
        console.log('internal')
    }, () => {
        res.send('Unathorized access')
    }, async (user) => {
        console.log('sdasdasd', req.params.QuoteId);
        const quote = await model.getExternalQuote(req.params.QuoteId, user.id);
        res.send(quote)
    })
});
router.get('/external/list/:userId', function (req, res, next) {
    uttils.authenticateUser(req, res, async (user) => {
        console.log('internal')
    }, () => {
        res.send('Unathorized access')
    }, async (user) => {
        let userId = user.id;
        const response = await model.getExternalQuotes(userId);
        res.send(response)
    })
});

router.post('/save-external-quote', function (req, res, next) {
    uttils.authenticateUser(req, res, async (user) => {
        console.log('internal')
    }, () => {
        res.send('Unathorized access')
    }, async (user) => {
        const result = await model.SaveExternalQuote(req.body);
        res.send(result);
    })
});

// Return router
module.exports = router;
