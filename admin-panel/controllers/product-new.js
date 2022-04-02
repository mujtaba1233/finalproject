var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var db = require('../models/db');
var uttils = require('../helpers/utilities');
var mailHelper = require('../helpers/mailHelper');
var randtoken = require('rand-token');


router.get('/list', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
		db.GetAllUsers(function (records) {
            res.send(JSON.stringify(records));
        });
	}, () => {
		res.send('Unathorized access')
	})
});

router.post('/save', function (req, res, next) {
    if(req.body.data.id){
        db.UpdateUser(req.body.data, function (result) {
            res.send(JSON.stringify(result));
        });
    }else {
        var token = randtoken.generate(16);
        req.body.data.token = token;
        db.SaveUser(req.body.data, function (result) {
            user = req.body.data;
            mailHelper.sendMail({
                to:user.email,
                fname:user.firstname,
                lname:user.lastname,
                link: uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/auth/'+token
            });
            res.send(JSON.stringify(result));
        });
    }
});

router.post('/set-pass', function (req, res, next) {
    db.SetPass(req.body.data, function (result) {
        res.send(JSON.stringify(result));
    });
});

router.post('/login-auth', function (req, res, next) {
    db.loginAuth(req.body.data, function (records) {
        res.send(JSON.stringify(records));
    });
});
// Return router
module.exports = router;
