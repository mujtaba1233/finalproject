// var http = require('http');
var request = require('request');
var url = require('url');
var cookie = require('cookie');
const Taxjar = require('taxjar');
var db = require('../models/db');
const { slack } = require('./slack-helper');
const {
    WebClient
} = require('@slack/web-api');
const web = new WebClient(process.env.SLACK_TOKEN);


exports.currencySymbol = function (currency) {
    switch (currency) {
        case 'USD':
            symbol = '$';
            break;
        default:
            symbol = '$';
            break;
    }
    return symbol;
};

exports.getBaseUrl = function (req) {
    return req.headers.host;
};
exports.getProtocol = function (req) {
    if (req.headers.host.indexOf('blue') >= 0) {
        return `https://`;
    } else {
        return `${req.protocol}://`;
    }
}
exports.getFullUrl = function (req) {
    return `${req.protocol}://${req.headers.host}`
}
exports.ERROR_STRING = function () {
    return "Volusion Password Expired! to update the password in sync URLs, Update password on volusion and get Encrypted Password and paste in .ENV file."
}
exports.authenticateUser = function (req,res, authorize, unauhorize, external) {
    if (req && req.headers && req.headers.cookie) {
        var parsedCookie = cookie.parse(req.headers.cookie)
        if (parsedCookie.user && JSON.parse(parsedCookie.user) && JSON.parse(parsedCookie.user).token === 'verifiedUser' && JSON.parse(parsedCookie.user).active) {
            let user = JSON.parse(parsedCookie.user)
            db.GetUser(user.id,function (res) {
                if(res[0].active){
                    if (['admin', 'user'].includes(user.usertype.toLowerCase())) {
                        authorize(user)
                    } else if (['external'].includes(user.usertype.toLowerCase())) {
                        if (external)
                            external(user)
                        else{
                            res.redirect('/404')}
                    }
                    req.user = res[0]
                }
                else{
                    unauhorize();
                }
            });
        } else {
            // slack(`File: utilities.js, \nAction: authenticateUser, \nError External User can't login  \n 
            //         `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            unauhorize();
        }
    } else {
        // slack(`File: utilities.js, \nAction: authenticateUser, \nError External User can't login  \n 
        //             `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        unauhorize();
    }
}

exports.calculateTax = function (data, callback) {
    const client = new Taxjar({
        apiKey: process.env.TAXJAR_API_KEY,
        apiUrl: Taxjar.TAXJAR_API_URL
    });
    var resposne = {
        code: 200,
        status: true,
        msg: 'Nor EU niether US,AU or CA'
    }
    client.ratesForLocation(data.ShipPostalCode, {
        country: data.ShipCountry,
        city: data.ShipCity,
        street: data.ShipAddress
    }).then(resp => {
        // console.log('tax api res', resp);
        if (data.ShipCountry.toLowerCase() === 'us' || data.ShipCountry.toLowerCase() === 'ca' || data.ShipCountry.toLowerCase() === 'au') {
            resp.combined = true;
            resp.final_tax_rate = resp.rate.combined_rate;
            resposne.msg = "US,AU or CA"
        } else {
            resp.combined = false
            resp.final_tax_rate = resp.rate.standard_rate;
            resposne.msg = "EU Region"
        }
        resposne.result = resp
        callback(resposne)
    }).catch(err => {
        if (err){
            error = JSON.stringify(err)
            slack(`File: utilities.js, \nAction: calculateTax, \nError ${error}  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: true,
                msg: err,
            })}
        else{
            slack(`File: utilities.js, \nAction: calculateTax, \nError Something went wrong.  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: true,
                msg: 'Something went wrong.',
            })}
    });
}
exports.calculateUsTax = function (data, callback) {
    if(data.ShipCountry && "undefined" && data.ShipCountry !== null && data.ShipCountry && data.ShipState !== "undefined" &&  data.ShipState !== null && data.ShipState){
        var country = data.ShipCountry.toLowerCase();
        if ((data.ShipState.toLowerCase() === 'ca' || data.ShipState.toLowerCase() === 'california' ) && country === 'us') {
            url = "http://services.gis.boe.ca.gov/api/taxrate/GetRateByAddress?Address=" + data.ShipAddress + "&City=" + data.ShipCity + "&Zip=" + data.ShipPostalCode;
            request(url, function (err, response, body) {
                if (err) {
                    console.log(err);
                    error = JSON.stringify(err)
                    slack(`File: utils.js, \nAction: calculateUsTax, \nError ${error}  \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    callback({
                        code: 400,
                        status: true,
                        msg: err,
                    })
                    return;
                }
                // console.log("Get response: " + response.statusCode);
                let tax = JSON.parse(body)
                // console.log(tax);
                if (tax.taxRateInfo && !tax.errors) {
                    let res = {};
                    res.combined = true;
                    res.final_tax_rate = tax.taxRateInfo[0].rate;
                    res.msg = "US,AU or CA";
                    res.status = true;
                    res.code = 200;
                    // console.log(res)
                    callback(res)
                } else {
                    error = JSON.stringify(tax.errors)
                    slack(`File: utils.js, \nAction: calculateUsTax, \nError ${error.message}  \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    let res = {};
                    res.combined = false;
                    res.final_tax_rate = 0;
                    res.msg = "A tax rate could not be found at the given location";
                    res.actualError = tax.errors.map(error => error.message).join('\n');
                    res.status = false;
                    res.code = 200;
                    
                    callback(res)
                }
            });
        }else if((data.ShipState.toLowerCase() === 'michigan' || data.ShipState.toLowerCase() === 'mi') && country === 'us'){
            let res = {};
            res.combined = true;
            res.final_tax_rate = 6;
            res.msg = "US,AU or MI";
            res.status = true;
            res.code = 200;
            callback(res)
        }else{
            let res = {};
            res.combined = true;
            res.final_tax_rate = 0;
            res.msg = "US,AU or " + data.ShipState;
            res.status = true;
            res.code = 200;
            callback(res)
        }
    }else{
        url = "http://services.gis.boe.ca.gov/api/taxrate/GetRateByAddress?Address=" + data.ShipAddress + "&City=" + data.ShipCity + "&Zip=" + data.ShipPostalCode;
        request(url, function (err, response, body) {
            if (err) {
                console.log(err);
                error = JSON.stringify(err)
                slack(`File: utils.js, \nAction: calculateUsTax, \nError ${error}  \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    code: 400,
                    status: true,
                    msg: err,
                })
                return;
            }
            let tax = JSON.parse(body)
            if (tax.taxRateInfo && !tax.errors) {
                let res = {};
                res.combined = true;
                res.final_tax_rate = tax.taxRateInfo[0].rate;
                res.msg = "US,AU or CA";
                res.status = true;
                res.code = 200;
                callback(res)
            } else {
                error = JSON.stringify(tax.errors)
                slack(`File: utils.js, \nAction: calculateUsTax, \nError ${error.message}  \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                let res = {};
                res.combined = false;
                res.final_tax_rate = 0;
                res.msg = "A tax rate could not be found at the given location";
                res.actualError = tax.errors.map(error => error.message).join('\n');
                res.status = false;
                res.code = 200;
                callback(res)
            }
        });
    }
    
    
}
exports.orderDateFormat = function (date) {
    if (date)
        return new Date(date).toLocaleString('en-US').replace(',', '')
    else
        return new Date().toLocaleString('en-US').replace(',', '')
}
exports.errorReport = async function (message, from, to) {
    // const res = await web.conversations.list()
    // res.channels.forEach(channel =>{
    //     console.log(channel.id,channel.name);
    // })
    const userId = to || process.env.SEND_TO || 'C01PX9SCTC0'//'CQXBA8BK9'
    if (process.env.ENV_MODE === 'PRODUCTION')
        await web.chat.postMessage({
            channel: userId,
            username: from || 'blue-sky',
            text: message || `${new Date().toLocaleString('en-US')} Something went wrong.`,
        });
    else
        console.log('In dev mode slack alert blocked')
    console.log(new Date().toLocaleString('en-US'), 'Message Posted');
}
