var express = require('express');
var router = express.Router();
var db = require('../models/db');
var passwordHistoryModel = require('../models/password-history');
var uttils = require('../helpers/utilities');
var mailHelper = require('../helpers/mailHelper');
var randtoken = require('rand-token');
var bcrypt = require('bcrypt-nodejs');
var Mysql = require('../helpers/database-manager')
var moment = require('moment');
router.get('/user', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
    var userId = req.query.userId;
        db.GetUser(userId,function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.post('/current-user-record', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        db.SaveActivityLogData(req.body.data, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.post('/get-current-user-record/', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        db.GetActivityLogData(req.body.data, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
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
    if (req.body.data.id) {
        db.UpdateUser(req.body.data, function (result) {
            res.send(JSON.stringify(result));
        });
    } else {
        var token = randtoken.generate(16);
        req.body.data.token = token;
        db.SaveUser(req.body.data, function (result) {
            user = req.body.data;
            mailHelper.sendMail({
                userType: user.usertype,
                to: user.email,
                fname: user.firstname,
                lname: user.lastname,
                link: user.usertype==="external"? uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/auth/' + token : uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/verify-user/' + token,
                siteLink: uttils.getProtocol(req) + uttils.getBaseUrl(req)
            });
            res.send(JSON.stringify(result));
        });
    }
});

router.post('/set-pass', async function (req, res, next) {
    var where = {
        token: req.body.data.token
    };
    var user = await Mysql.record("user", where);
    id = user.id
    passwordHistoryModel.GetPasswordHistory(id, async function (passwords) {
        let isPasswordUsed = false;
        const compareResult = await passwords.results.map(async (elem) => {
            await bcrypt.compare(req.body.data.password, elem.password, function (err, res) {
                // console.log(res);
                // console.log(elem.password, "password from pass history");
                // console.log(req.body.data.password, "password from request.");
                if (err) {
                    console.log(err)
                }
                if (!isPasswordUsed) {
                    isPasswordUsed = res;
                }
            });

        })

        Promise.all(compareResult).then((result) => {
            if (!isPasswordUsed) {
                // console.log(isPasswordUsed, "sdasddaasd");
                bcrypt.hash(req.body.data.password, null, null, async function (err, hash) {
                    req.body.data.password = hash;
                    data = { password: req.body.data.password, userId: user.id, createdAt: new Date() };
                    passwordHistoryModel.SavePasswordHistory(data, function (result) {
                        db.SetPass(req.body.data, function (result) {
                            res.send(JSON.stringify(result, result.status = true));
                        })
                    });
                });
            } else if (isPasswordUsed) {
                return res.send({ status: false, msg: "Password already used, Try a new one!" });
            }
        });

    });
});

router.post('/forgot-password', async function (req, res, next) {
    //ensure that you have a user with this email
    var where = {
        email: req.body.data,
        usertype: "external"
    };
    var user = await Mysql.record("user", where);
    if (user == null) {
        // console.log(Mysql.getLastQuery())
        return res.send({ status: false, msg: "If the account is found, and email will be sent to the account holder to complete the reset request."});

    }
    //Create a random reset token
    var token = randtoken.generate(64);

    var update = {
        token
    };
    await Mysql.update('user', where, update);
    // console.log(user);
    mailHelper.sendResetPasswordMail({
        to: user.email,
        fname: user.firstname,
        lname: user.lastname,
        subject: 'Password Reset Mail',
        link: uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/auth/' + token,
        siteLink: uttils.getProtocol(req) + uttils.getBaseUrl(req)
    }, function (response) {
        res.send(response)
    });

});

router.post('/token-verify', function (req, res, next) {
        db.verifyUser(req.body.data, async function (result) {
            if (result && result.dberror) {
                res.send(result.dberror)
            } else {
                if (result.email){
                    if(result.usertype === "external"){
                        res.send({ status: true });
                    }else{
                        const results = await db.verifiedUser(result);
                        console.log(results);
                        if (results.status) res.send({ status: true });
                        else res.send({ status: false });
                    }
                }else
                    res.send({ status:false })
    
            }
        });
    
});
router.post('/google-auth',async function (req, res, next) {
    let userObject = req.body.response.value
    const idToken = userObject.accessToken // the token received from the JS client
    try {
        const record = await db.googleAuth(userObject)
        if(record.success===false){
            res.send(JSON.stringify(record));
            return record;
        }
        else{
        delete record.password
        let where = {
            email:record.email
        }
        let update = {
            profilePicture: userObject.imageUrl,
            googleId:userObject.googleId,
            googleAcessToken: userObject.accessToken,
        }
        try {
            const response  = await Mysql.update('user', where, update);
            let currentUser = record;
            console.log(currentUser)
			let userData = {firstname: currentUser.firstname, lastname: currentUser.lastname, email: currentUser.email, userId: currentUser.id, lastModifyOn: new Date(), url: "/login"} 
            const resp = await db.SaveActivityLogData(userData)
            res.send(JSON.stringify(record));
        } catch (error) {
            res.send(JSON.stringify(error));
            return error

        }
    }
    } catch (error) {
        console.log(error)
        res.send(JSON.stringify(error));
        return error
    }
   
})
router.post('/login-auth', function (req, res, next) {
    db.loginAuth(req.body.data, async function (record) {
        if (record.user && !record.user.blockMailSent) {
            token = record.user.token;
            mailHelper.sendLockAccountMail({
                to: record.user.email,
                fname: record.user.firstname,
                lname: record.user.lastname,
                subject: 'Account Blocked Notification',
                link: uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/auth/' + token
            }, function (response) {
                delete record.user
                res.send(record)
            });
        } else {
            delete record.user
            res.send(JSON.stringify(record));
        }
        //PASSWORD EXPIRE MAIL
        if(record.is_expire){
        var where = {
            email: req.body.data.email,
            usertype: "external"
        };
        var user = await Mysql.record("user", where);
        if (user == null) {
            return res.send({ status: false, msg: "If the account is found, and email will be sent to the account holder to complete the reset request."});
    
        }
        //Create a random reset token
        var token = randtoken.generate(64);
        var update = {
            token
        };
        await Mysql.update('user', where, update);
        // console.log(user);
        mailHelper.sendResetPasswordMail({
            to: user.email,
            fname: user.firstname,
            lname: user.lastname,
            subject: 'Password Reset Mail',
            link: uttils.getProtocol(req) + uttils.getBaseUrl(req) + '/auth/' + token,
            siteLink: uttils.getProtocol(req) + uttils.getBaseUrl(req)
        }, function (response) {
            res.send(response)
        });
    }
    });
});
// Return router
module.exports = router;