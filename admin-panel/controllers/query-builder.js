var express = require('express');
var router = express.Router();
var model = require('../models/query-builder');
var uttils = require('../helpers/utilities');

router.get('/order-columns',  function (req, res, next) {
	uttils.authenticateUser(req,res, async () => {
        try{
            var result = await model.GetOrderColumns()
            res.send(result);
        }catch(e){
            res.send("Eroor occured");
        }
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/quote-columns',  function (req, res, next) {
	uttils.authenticateUser(req,res, async () => {
        try{
            var result = await model.GetQuoteColumns()
            res.send(result);
        }catch(e){
            res.send("Eroor occured");
        }
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/list-reports/:user',  function (req, res, next) {
	uttils.authenticateUser(req,res, async () => {
        try{
            var user =  req.params.user
            // console.log(user)
            var result = await model.GetReports(user)
            res.send(result);
        }catch(e){
            res.send("Eroor occured");
        }
	}, () => {
		res.send('Unathorized access')
	})
});

router.get('/get-report/:id',  function (req, res, next) {
	uttils.authenticateUser(req,res, async () => {
        try{
            var reportId =  req.params.id
            var result = await model.GetReport(reportId)
            res.send(result);
        }catch(e){
            res.send("Eroor occured");
        }
	}, () => {
		res.send('Unathorized access')
	})
});

router.post('/query', function (req, res, next) {
	uttils.authenticateUser(req, res, async (user) => {
        try{
            const result = await model.PostQuery(req.body)
            res.send(result);
        }catch(e){
            console.log(e)
            res.send("Eroor occured");
        }
		
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});

router.post('/execute-query', function (req, res, next) {
	uttils.authenticateUser(req, res, async (user) => {
        try{
            const result = await model.ExecuteQuery(req.body)
            res.send(result);
        }catch(e){
            console.log(e)
            res.send("Eroor occured");
        }
		
	}, () => {
		res.redirect(`/login?next=${req.url}`)
	})
});
module.exports = router;