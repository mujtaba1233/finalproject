var express = require('express');
var router = express.Router();
var model = require('../models/front-store-model');
var db = require('../models/db');
var order = require('../models/order');
var utility = require('../helpers/utilities')
var bcrypt = require('bcrypt-nodejs');
var randtoken = require('rand-token');
const { calculateUsTax } = require('../helpers/utilities');
const { getUPSShippings } = require('../helpers/shipping-helper');
var uttils = require('../helpers/utilities');
const Authorize = require('../helpers/authorize-net/authorize');
var request = require('request');
const requestIp = require('request-ip');

var mailHelper = require('../helpers/mailHelper');
const { slack } = require('../helpers/slack-helper');
router.post('/save-activily-log-data', function (req, res, next) {
    // console.log(req.body)
    uttils.authenticateUser(req,res, () => {
		db.SaveActivityLogData(req.body, function (records) {
            // if(records.error){}
            res.send(JSON.stringify(records));
        });
	}, () => {
		res.send('Unathorized access')
	})
    
});
router.post('/get-available-shipping', function (req, res, next) {
    var data = req.body;
    getUPSShippings(data, function (response) {
        res.send(response)
    })
});
router.post('/calculate-tax-rate', function (req, res, next) {
    var data = req.body;
    calculateUsTax(data, function (response) {
        res.send(response)
    })
});
router.get('/product-list', function (req, res, next) {
    model.GetProducts(function (records) {
        res.send(JSON.stringify(records));
    });
});
router.get('/category-list', function (req, res, next) {
    model.GetCategories(function (records) {
        res.send(JSON.stringify(records));
    });
});
router.post('/place-order', function (req, res, next) {
    try{
        var data = req.body;
        if(data.BillingCountry === "RU" || 	data.BillingCountry === 'BY' || data.BillingCountry ==="KZ" || data.BillingCountry ==="AM" || data.BillingCountry ==="KG"){
            slack(`File: front-store.js, \nAction: /place-order, \n Order from ${data.BillingCountry} is temporarily off  \n `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            res.send({
                code: 200,
                status: false,
                msg: `Order from ${data.BillingCountry} is temporarily closed `,
                // result: response
            })
        }else if (data.ShipCountry === "RU" || 	data.ShipCountry === 'BY' || data.ShipCountry ==="KZ" || data.ShipCountry ==="AM" || data.ShipCountry ==="KG"){
            slack(`File: front-store.js, \nAction: /place-order, \n Order from ${data.ShipCountry} is temporarily off  \n `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            res.send({
                code: 200,
                status: false,
                msg: `Order from ${data.ShipCountry} is temporarily closed `,
                // result: response
            })
        }else{
            console.log(data)
            var dataForSlack = JSON.parse(JSON.stringify(data));
            console.log(dataForSlack.Total_Payment_Authorized,"yoo")
            slack(`Order is going to be placed by this  \n Order# : ${dataForSlack.OrderID} \n CustomerID: ${dataForSlack.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n`, 'Breach', 'C01PDD760JG')
            // return console.log("place-order",req.body)   
            var dataForEmail = JSON.parse(JSON.stringify(data));
            // data.IsFreeOrder = 
            // var payment = JSON.stringify(data.paymentInfo);
            var payment = {}
            if(!data.IsFreeOrder){
                payment = JSON.stringify(data.opaqueData);
                payment = JSON.parse(payment);
            }
            var orderLineItems = data.OrderDetails;
            // delete data.paymentInfo;
            delete data.EmailAddress;
            delete data.opaqueData;
    
            var opaqueData = {
                dataDescriptor: payment.dataDescriptor,
                dataValue: payment.dataValue
            }
            var userBillInfo = {
                firstName: data.BillingFirstName,
                LastName: data.BillingLastName,
                company: data.BillingCompanyName,
                address: data.BillingAddress1,
                city: data.BillingCity,
                state: data.BillingState,
                zip: data.BillingPostalCode,
                country: data.BillingCountry,
                BillingPhoneNumber: data.BillingPhoneNumber
            }
            var userShipInfo = {
                firstName: data.ShipFirstName,
                LastName: data.ShipLastName,
                company: data.ShipCompanyName,
                address: data.ShipAddress1,
                city: data.ShipCity,
                state: data.ShipState,
                zip: data.ShipPostalCode,
                country: data.ShipCountry,
                ShipPhoneNumber: data.ShipPhoneNumber
            }
    
            var lineItems = [];
            orderLineItems.forEach(elem => {
                lineItems.push({
                    id: elem.ProductID,
                    name: elem.ProductCode,
                    description: elem.ProductName,
                    qty: elem.Quantity,
                    price: elem.ProductPrice
                })
            });
            // console.log('Line items',lineItems);
            // console.log('tax and shipping',data.SalesTax1,data.TotalShippingCost);
            var authorize = new Authorize();
            // authorize.setCreditCard(creditCard);
            authorize.setOpaqueData(opaqueData);
            authorize.setBillTo(userBillInfo)
            authorize.setShipTo(userShipInfo)
            authorize.setLineItems(lineItems)
            authorize.setTotalAmount(data.PaymentAmount)
            authorize.setTax(data.SalesTax1, data.Tax1_Title)
            if(!data.IsFreeOrder){
                authorize.setShipping(data.TotalShippingCost, data.ShippingDetails)
            }
            delete data.ShippingDetails;
            delete data.TaxDetails;
            req.body.OrderDate = utility.orderDateFormat(req.body.OrderDate)
            req.body.LastModified = utility.orderDateFormat(req.body.LastModified)
            if (data.OrderID) {
                var orderDetails = {
                    invoiceNumber: data.OrderID,
                    description: data.notes,
                }
                var response = {
                    status: true,
                    code: 200,
                    msg: 'order details saved successfully.',
                }
    
                transaction(orderDetails, data, authorize, function (err, authRes) {
                    if (!err) {
                        model.GetCustomerById(dataForEmail.CustomerID, (err, customer) => {
                            if (!err)
                                dataForEmail.EmailAddress = customer[0].EmailAddress
                            dataForEmail.CurrencyCode = req.app.get('currency');
                            dataForEmail.OrderID = orderDetails.invoiceNumber;
                            dataForEmail.CC_Last4 = authRes.transactionResponse.accountNumber;
                            dataForEmail.CardType = authRes.transactionResponse.accountType;
    
                            sendOderEmail(dataForEmail)
                            response.payment = authRes
                            res.send(response);
                            slack(`Order is successfully placed by this  \n Order# : ${ dataForEmail.OrderID } \n CustomerID: ${dataForEmail.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n  `, 'Breach', 'C01Q6URBYGY')
                        })
                    } else {
                        // console.log(authorize)
                        error= JSON.stringify(err.message)
                        slack(`File: front-store.js, \nAction: /place-order, \nError Order Unsuccessfull \n `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                        response.payment = err
                        res.send({
                            code: 400,
                            status: false,
                            msg: 'Order Unsuccessfull',
                            result: response
                        })
                        var responseForSlack = JSON.stringify(response)
                        slack(`
                            Order is failed by this  \n Order# : ${ dataForEmail.OrderID } \n CustomerID: ${dataForEmail.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n 
                            error: ${ responseForSlack}`, 'Breach', 'C01PH4CKJ1G')
                    }
                })
            console.log("proccessing 3 completed")
    
            } else {
    
                model.InsertOrder(req.body, function (response) {
    
                    if (response.code === 200 && response.status) {
                        slack(`Order is ready for payment with this  \n Order# : ${dataForSlack.OrderID} \n CustomerID: ${dataForSlack.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n`, 'Breach', 'C01PDD760JG')
                        var orderDetails = {
                            invoiceNumber: response.result.orderId,
                            description: data.notes,
                        }
    
                        transaction(orderDetails, data, authorize, function (err, authRes) {
    
                            if (!err) {
                                paymentSuccess(authRes,dataForEmail,response,res,dataForSlack,req,orderDetails)
                            } else {
                                paymentFailed(response,res,dataForEmail,dataForSlack,req,orderDetails,err) 
                            }
                        })
    
                    } else {
                        res.send(response);
                    }
                });
            }
        }
        
    }catch(e){
        console.log(e,"error++++++++")
    }
});
function paymentSuccess(authRes,dataForEmail,response,res,dataForSlack,req,orderDetails) {
    model.GetCustomerById(dataForEmail.CustomerID, (err, customer) => {
        if (!err)
            dataForEmail.EmailAddress = customer[0].EmailAddress
        dataForEmail.CurrencyCode = req.app.get('currency');
        dataForEmail.OrderID = orderDetails.invoiceNumber;
        dataForEmail.CC_Last4 = authRes.transactionResponse.accountNumber;
        dataForEmail.CardType = authRes.transactionResponse.accountType;
        sendOderEmail(dataForEmail)
        response.payment = authRes
        slack(`Order is successfully placed and payment has been complete on this  \n Order# : ${ dataForEmail.OrderID } \n CustomerID: ${dataForEmail.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n`, 'Breach', 'C01Q6URBYGY')
        res.send(response);
    })
}

function paymentFailed(response,res,dataForEmail,dataForSlack,req,orderDetails,err) {
    response.payment = err
    res.send({
        code: 400,
        status: false,
        msg: 'Order Unsuccessfull',
        result: response
    })
    var responseForSlack = JSON.stringify(response)
    slack(`
        Order is failed by this  \n Order# : ${ dataForEmail.OrderID } \n CustomerID: ${dataForEmail.CustomerID} \n Payment Amount: ${dataForSlack.Total_Payment_Authorized}  \n 
        error: ${ responseForSlack}`, 'Breach', 'C01PH4CKJ1G')
}
function transaction(orderDetails, data, authorize, callback) {
    if (process.env.DEV_MODE && process.env.ENV_MODE === 'DEVELOPMENT' || data.IsFreeOrder) {
        console.log("is Free order?",data.IsFreeOrder,process.env.ENV_MODE)
        var orderUpdate = {}
        orderUpdate.IsPayed = 1
        orderUpdate.OrderID = orderDetails.invoiceNumber
        orderUpdate.OrderStatus = "New"
        // orderUpdate.CreditCardAuthorizationHash = JSON.stringify(authRes)
        model.update(orderUpdate, function (orderRes) {
            callback(null, { transactionResponse: {} })
        })
    } else {
        authorize.setOrderDetails(orderDetails)
        authorize.doTransaction().then((authRes) => {
            var orderUpdate = {}
            orderUpdate.OrderID = orderDetails.invoiceNumber
            orderUpdate.Total_Payment_Received = data.PaymentAmount
            orderUpdate.CreditCardAuthorizationDate = utility.orderDateFormat()
            orderUpdate.CreditCardAuthorizationNumber = authRes.transactionResponse.authCode
            orderUpdate.CreditCardTransactionID = authRes.transactionResponse.transId
            orderUpdate.CC_Last4 = authRes.transactionResponse.accountNumber
            orderUpdate.IsPayed = 1
            orderUpdate.OrderStatus = "New"
            orderUpdate.CancelReason = ""
            orderUpdate.CreditCardAuthorizationHash = JSON.stringify(authRes)
            model.update(orderUpdate, function (orderRes) {
                callback(null, authRes)
            })
        }).catch((err) => {
            error= JSON.stringify(err)
            slack(`File: front-store.js, \nAction: transaction, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            var orderUpdate = {}
            orderUpdate.OrderID = orderDetails.invoiceNumber
            orderUpdate.OrderStatus = "Cancelled"
            orderUpdate.CancelReason = "Cancelled due to unsuccessfull payment."
            orderUpdate.CreditCardAuthorizationHash = JSON.stringify(err)
            orderUpdate.CancelDate = utility.orderDateFormat();
            model.update(orderUpdate, function (orderRes) {
                callback(err)
            })
        })
    }
}
router.post('/order-list', function (req, res, next) {
    var id = req.body.CustomerID
    model.GetOrders(id, function (response) {
        res.send(response);
    });
});
router.get('/order/:orderId/:CustomerID', function (req, res, next) {
    var orderId = req.params.orderId;
    var CustomerID = req.params.CustomerID
    model.GetOrder(orderId,CustomerID, function (result) {
        res.send(result);
    });
});
router.get('/email-confirm/:token', function (req, res, next) {
    model.ConfirmEmail(req.params.token, function (response) {
        // console.log(response)
        res.send(response);
    })
});
router.post('/register-customer', function (req, res, next) {
    var data = req.body;
    model.GetCustomerId(data, function (response) {
        data.customerId = response.id;
        data.token = randtoken.generate(64);
        data.createdAt = new Date();
        var mailObj = JSON.stringify(data);
        delete data.firstName;
        delete data.lastName;
        bcrypt.hash(data.password, null, null, function (err, hash) {
            data.password = hash;
            if (response.msg === 'exist') {
                data.isActive = false
                model.SavePassword(data, function (result) {
                    if (result.code == 200)
                        sendEmail(mailObj, req)
                    res.send(result);
                });
            } else if (response.msg === 'new') {
                data.isActive = true
                model.SavePassword(data, function (result) {
                    if (result.code == 200)
                        sendEmail(mailObj, req)
                    res.send(result);
                });
            } else {
                res.send(response);
            }
        });
    });
});
router.post('/update-customer', function (req, res, next) {
    var data = req.body;
    model.UpdateCustomer(data, function (response) {
        res.send(response)
    });
});
router.post('/update-password-customer', function (req, res, next) {
    var data = req.body;
    model.UpdatePassword(data, function (response) {
        res.send(response)
    });
});
router.post('/change-password-customer', function (req, res, next) {
    var data = req.body;
    model.ChangePassword(data, function (response) {
        res.send(response)
    });
});
router.post('/forget-password-customer', function (req, res, next) {
    var data = req.body;
    data.token = randtoken.generate(64);
    model.GetEmailForgetPass(data, function (response) {
        var mailObj = JSON.stringify(data);
        if (response.status && response.code === 200) {
            sendEmailForPassword(mailObj, req)
            res.send(response)
        } else {
            res.send(response)
        }

    });
});
router.post('/login-customer', function (req, res, next) {
    model.Login(req.body, function (response) {
        if (response.code === 200) {
            model.GetCustomer(response.result.customerId, function (customer) {
                if (response.code === 200) {
                    response.result = customer.result;
                    res.send(response);
                } else {
                    res.send(customer);
                }
            })
        } else {
            res.send(response);
        }
    });
});
router.post('/region-control/:ip?', (req, res, next) => {
		let data = req.body
        const ip = requestIp.getClientIp(req);
        if (data.ip && data.country_name && !req.body.isAllowed) {
            slack(`Access Not Granted to IP: ${data.ip}, Country: ${data.country_name} ${data.location.country_flag_emoji} \n 
            `, 'Breach', 'C01P85SGJKX')
        } else if (data.ip && data.country_name && req.body.isAllowed) {
            slack(`Access Granted to IP: ${data.ip}, Country: ${data.country_name} ${data.location.country_flag_emoji}  \n 
            `, 'Smash','C01P7E7549H')
        } else if (req.body.isBlocked) {
            slack(`Failed to fetch, region fetch call blocked by cllient, Customer: ${JSON.stringify(data.customer)}  \n 
            `, 'Busted','C01PB8DTH2N')
        } else {
            slack(`IP stack API not responding correctly, response: ${JSON.stringify(req.body)}  \n Request IP: ${ip}`, 'IP Stack Error', 'C01PX9SCTC0')
        }
        res.send()
	})
router.post('/alert', (req, res, next) => {
    slack(`Random Alert: ${JSON.stringify(req.body)}`, 'Alert')
    res.send()
})
router.get('/region-control/:ip?', function (req, res, next) {
		const ip = requestIp.getClientIp(req);
        console.log(ip);
        // const ip = req.params.ip
        var access_granted = {
            access_granted: false
        };
        // console.log(ip, "ip of user")
        if (ip) {
            request('http://api.ipstack.com/' + ip + '?access_key=' + process.env.IPSTACK_ACCESS_KEY + '&format=1', function (error, response, body) {
                //console.log(JSON.parse(body));
                if (!error && response.statusCode == 200) {
                    if (!body.hasOwnProperty('success')) {
                        const { country_code } = JSON.parse(body);
                        console.log('++++++++', country_code, ip, '++++++++');
                        if (country_code &&
                            country_code !== 'SE' && country_code !== 'ES' && country_code !== 'SI' &&
                            country_code !== 'SK' && country_code !== 'RO' && country_code !== 'PT' &&
                            country_code !== 'PL' && country_code !== 'NL' && country_code !== 'MT' &&
                            country_code !== 'LU' && country_code !== 'LT' && country_code !== 'LV' &&
                            country_code !== 'IT' && country_code !== 'IE' && country_code !== 'HU' &&
                            country_code !== 'GR' && country_code !== 'DE' && country_code !== 'FR' &&
                            country_code !== 'FI' && country_code !== 'EE' && country_code !== 'DK' &&
                            country_code !== 'CZ' && country_code !== 'CY' && country_code !== 'HR' &&
                            country_code !== 'BG' && country_code !== 'BE' && country_code !== 'AT' &&
                            country_code !== 'JP' && country_code !== 'IN' && country_code !== 'KR' &&
                            country_code !== 'CN' && country_code !== 'UK' && country_code !== 'GB' &&
                            country_code !== 'CU' && country_code !== 'KP' && country_code !== 'IR' &&
                            country_code !== 'CH' && country_code !== 'IS' && country_code !== 'LI') {
                            access_granted.access_granted = true;
                        }
                    }
                }
                res.send(access_granted)
            });
        } else {
            res.send(access_granted)
        }
});
router.post('/product-options', function (req, res, next) {

    model.GetProductOptions(req.body.OptIDs, function (response) {
        if (response.code === 200) {
            // console.log(response);
            res.send(response);
        } else {
            res.send(response);
        }
    });
});
router.post('/token-verification', function (req, res, next) {
    model.ConfirmToken(req.body, function (response) {
        if (response.code === 200) {
            res.send(response);
        } else {
            res.send(response);
        }
    });
});
router.post('/payment-gateway', function (req, res, next) {
    // console.log(req.body)
});
function sendEmail(customer, req) {
    customer = JSON.parse(customer)
    mailHelper.sendMailToCustomer({
        to: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        link: req.headers.origin + '/email/confirm/' + customer.token,
    });
}
function sendEmailForPassword(customer, req) {
    customer = JSON.parse(customer)
    mailHelper.sendMailToConfirmPassword({
        to: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        link: req.headers.origin + '/customer/confirm-password/' + customer.token,
    });
}

function sendOderEmail(generalDetails) {
    mailHelper.sendMailToCustomerOnOrderPlace(generalDetails);
}

module.exports = router;