var express = require('express')
var router = express.Router()
const Authorize = require('../helpers/authorize-net/authorize');
const { slack } = require('../helpers/slack-helper');
const order = require('../models/order')

router.post('/charge', function (req, res, next) {
	var data = req.body
	var orderLineItems = data.order.OrderDetails;
	var payment = data.payment
	var orderUpdate = {
		OrderID: data.order.OrderID,
		Total_Payment_Received: data.order.PaymentAmount,
	}
	// Auth stuff
    // var creditCard = {
    //     cardNumber: payment.number.replace(/ /g,''),
    //     expirationDate: payment.expiry.replace(/ /g,''),
    //     cardCode: payment.cvc
	// }
	var opaqueData = {
        dataDescriptor: payment.dataDescriptor,
        dataValue: payment.dataValue
    }
	
    var userBillInfo = {
        firstName: data.order.BillingFirstName,
        LastName: data.order.BillingLastName,
        company: data.order.BillingCompanyName,
        address: data.order.BillingAddress1,
        city: data.order.BillingCity,
        state: data.order.BillingState,
        zip: data.order.BillingPostalCode,
        country: data.order.BillingCountry
	}
	
    var userShipInfo = {
		// firstName: data.order.BillingFirstName,
        // LastName: data.order.BillingLastName,
        firstName: data.order.ShipFirstName,
        LastName: data.order.ShipLastName,
        company: data.order.ShipCompanyName,
        address: data.order.ShipAddress1,
        city: data.order.ShipCity,
        state: data.order.ShipState,
        zip: data.order.ShipPostalCode,
        country: data.order.ShipCountry
	}
	
	var lineItems = [];

	var orderDetails = {
		invoiceNumber: data.order.OrderID,
		description: data.order.notes,
	}

    orderLineItems.forEach(elem => {
        lineItems.push({
            id: elem.ProductID,
            name: elem.ProductCode,
            description: elem.ProductName,
            qty: elem.Quantity,
            price: elem.ProductPrice
        })
	});

	// console.log(creditCard,userBillInfo,userShipInfo,lineItems,data.order.PaymentAmount,data.order.SalesTax1,data.order.Tax1_Title,data.order.TotalShippingCost,orderDetails);
    var authorize = new Authorize();
	// authorize.setCreditCard(creditCard);
	authorize.setOpaqueData(opaqueData);
    authorize.setBillTo(userBillInfo)
    authorize.setShipTo(userShipInfo)
    authorize.setLineItems(lineItems)
    authorize.setTotalAmount(data.order.PaymentAmount)
    authorize.setTax(data.order.SalesTax1,data.order.Tax1_Title)
	authorize.setShipping(data.order.TotalShippingCost,'Some Shipping')
	authorize.setOrderDetails(orderDetails)
	
	authorize.doTransaction().then((authRes) => {
		orderUpdate.CreditCardAuthorizationDate = new Date().toLocaleString().replace(',','')
		orderUpdate.CreditCardAuthorizationNumber = authRes.transactionResponse.authCode
		orderUpdate.CreditCardTransactionID = authRes.transactionResponse.transId
		orderUpdate.CC_Last4 = authRes.transactionResponse.accountNumber
		orderUpdate.IsPayed = 1
		orderUpdate.CreditCardAuthorizationHash = JSON.stringify(authRes)
		order.update(orderUpdate,function(orderRes) {
			res.send({
				code: 200,
				status: true,
				msg: 'Payment Successfull',
				result: orderRes
			})
		})
	}).catch((err) => {
		if (err.response.getTransactionResponse() != null && err.response.getTransactionResponse().getErrors() != null) {
			error = JSON.stringify(err.errorMessage)
			slack(`File: payment.js, \nAction: /charge, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			res.send({
				code: 400,
				status: false,
				msg: 'Payment Unsuccessfull',
				result: err.errorMessage
			})
		} else {
			error = JSON.stringify(err.errorMessage)
			slack(`File: payment.js, \nAction: /charge, \nError ${error} \n 
				`, 'J.A.R.V.I.S', 'C029PF7DLKE')
			res.send({
				code: 400,
				status: false,
				msg: 'Payment Unsuccessfull',
				result: err.errorMessage
			})
		}
	})
});

router.post('/return', function (req, res, next) {
	var data = req.body
	// console.log(data);
	res.status(404).send('Unavailable!!!')
});
module.exports = router;
