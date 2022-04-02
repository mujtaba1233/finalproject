"use strict"
var ApiContracts = require('authorizenet').APIContracts
var ApiControllers = require('authorizenet').APIControllers
var SDKConstants = require('authorizenet').Constants
var API_RES_CONSTANTS = require('./auth-constants/res-constants.json')
var extendedAmountType = new ApiContracts.ExtendedAmountType()

// ApiControllers.setEnvironment(SDKConstants.endpoint.production);


// console.log(process.env.API_LOGIN_KEY,'====================');
// console.log(process.env.TRANSACTION_KEY,'====================');
// console.log(process.env.IS_PRODUCTION,'====================');

class Authorize {
    constructor() {
        //TODO SECURE THIS:
        this.apiLoginKey = process.env.API_LOGIN_KEY
        this.transactionKey = process.env.TRANSACTION_KEY
        this.creditCard = null
        this.paymentType = null
        this.orderDetails = null
        this.billTo = null
        this.shipTo = null
        this.lineItems = null
        this.amount = null
        this.tax = 0
        this.shipping = 0
    }
    
    setTotalAmount(amount){
        this.amount = parseFloat(amount)
    }
    setTax(amount,detail){
        var extendedAmountType = new ApiContracts.ExtendedAmountType()
        extendedAmountType.setAmount(parseFloat(amount))
        extendedAmountType.setName('Sales')
        extendedAmountType.setDescription(detail)
        this.tax = extendedAmountType
    }
    setShipping(amount,detail){
        var extendedAmountType = new ApiContracts.ExtendedAmountType()
        extendedAmountType.setAmount(parseFloat(amount))
        extendedAmountType.setName('UPS')
        extendedAmountType.setDescription(detail.service)
        this.shipping = extendedAmountType
    }
    // setCreditCard(creditCard) {
    //     this.creditCard = new ApiContracts.CreditCardType()
    //     this.creditCard.setCardNumber(creditCard.cardNumber)
    //     this.creditCard.setExpirationDate(creditCard.expirationDate)
    //     this.creditCard.setCardCode(creditCard.cardCode)
    //     this.paymentType = new ApiContracts.PaymentType()
    //     this.paymentType.setCreditCard(this.creditCard)
    // }
    setOpaqueData(opaqueData) {
        this.opaqueDataType = new ApiContracts.OpaqueDataType()
        this.opaqueDataType.setDataValue(opaqueData.dataValue)
        this.opaqueDataType.setDataDescriptor(opaqueData.dataDescriptor)
        // console.log(opaqueData , "opaquedataaaa")
        this.paymentType = new ApiContracts.PaymentType()
        this.paymentType.setOpaqueData(this.opaqueDataType)
    }

    setOrderDetails(orderDetails) {
        this.orderDetails = new ApiContracts.OrderType()
        this.orderDetails.setInvoiceNumber(orderDetails.invoiceNumber)
        this.orderDetails.setDescription(orderDetails.description)
    }

    setBillTo(userInfo){
        this.billTo = new ApiContracts.CustomerAddressType()
         this.billTo.setFirstName(userInfo.firstName)
         this.billTo.setLastName(userInfo.LastName)
         this.billTo.setCompany(userInfo.company)
         this.billTo.setAddress(userInfo.address)
         this.billTo.setCity(userInfo.city)
         this.billTo.setState(userInfo.state)
         this.billTo.setZip(userInfo.zip)
         this.billTo.setCountry(userInfo.country)
    }

    setShipTo(userInfo) {
        this.shipTo = new ApiContracts.CustomerAddressType()
         this.shipTo.setFirstName(userInfo.firstName)
         this.shipTo.setLastName(userInfo.LastName)
         this.shipTo.setCompany(userInfo.company)
         this.shipTo.setAddress(userInfo.address)
         this.shipTo.setCity(userInfo.city)
         this.shipTo.setState(userInfo.state)
         this.shipTo.setZip(userInfo.zip)
         this.shipTo.setCountry(userInfo.country)
    }

    setLineItems(lineItems){
        let lineItem_id1;
        let lineItemList = []
        for(let i in lineItems){
            lineItem_id1 = new ApiContracts.LineItemType()
            lineItem_id1.setItemId(lineItems[i].id)
            lineItem_id1.setName(lineItems[i].name)
            lineItem_id1.setDescription(lineItems[i].description)
            lineItem_id1.setQuantity(lineItems[i].qty)
            lineItem_id1.setUnitPrice(parseFloat(lineItems[i].price))
            lineItemList.push(lineItem_id1)
        }
      
        this.lineItems = new ApiContracts.ArrayOfLineItem()
        this.lineItems.setLineItem(lineItemList)
    }

    doTransaction() {
        let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType()
        merchantAuthenticationType.setName(this.apiLoginKey)
        merchantAuthenticationType.setTransactionKey(this.transactionKey)

        var transactionRequestType = new ApiContracts.TransactionRequestType()
        transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION)
        transactionRequestType.setPayment(this.paymentType)
        transactionRequestType.setAmount(this.amount)
        transactionRequestType.setLineItems(this.lineItems)
        // transactionRequestType.setUserFields(userFields)
        transactionRequestType.setOrder(this.orderDetails)
        transactionRequestType.setTax(this.tax)
        // transactionRequestType.setDuty(duty)
        transactionRequestType.setShipping(this.shipping)
        // transactionRequestType.setOpaqueData(this.opaqueDataType)
        transactionRequestType.setBillTo(this.billTo)
        transactionRequestType.setShipTo(this.shipTo)
        // transactionRequestType.setTransactionSettings(transactionSettings)
        var createRequest = new ApiContracts.CreateTransactionRequest()
        createRequest.setMerchantAuthentication(merchantAuthenticationType)
        createRequest.setTransactionRequest(transactionRequestType)

        //pretty print request
        // console.log(JSON.stringify(createRequest.getJSON(), null, 2), "=========================")
        var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON())
        if(!process.env.DEV_MODE && process.env.ENV_MODE === 'PRODUCTION'){
            ctrl.setEnvironment(SDKConstants.endpoint.production)
            console.log('authorize production');
        }else{
            console.log('authorize statgging');
        }
        //Defaults to sandbox
        return new Promise((resolve, reject) => {
            ctrl.execute(function () {

                var apiResponse = ctrl.getResponse()

                var response = new ApiContracts.CreateTransactionResponse(apiResponse)

                //pretty print response
                // console.log(JSON.stringify(response, null, 2), "====================================")
                // console.log(JSON.stringify(apiResponse, null, 2), "------------------")
                if (response != null) {
                    if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {
                        if (response.getTransactionResponse().getMessages() != null) {
                            resolve(response)
                            console.log(new Date(),'Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId())
                            console.log('Response Code: ' + response.getTransactionResponse().getResponseCode())
                            console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode())
                            console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription())
                        } else {
                            console.log(new Date(),'Failed Transaction with OK.')

                            reject({
                                errorCode:response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                                errorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
                                response: response,
                            })
                            if (response.getTransactionResponse().getErrors() != null) {
                                console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode())
                                console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText())
                            }
                        }
                    } else {
                        console.log(new Date(),'Failed Transaction.')
                        if (response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null) {
                            reject({
                                errorCode:response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
                                errorMessage: response.getTransactionResponse().getErrors().getError()[0].getErrorText(),
                                response: response,
                            })
                            console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode())
                            console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText())
                            console.log('Description: ' + response.messages.message[0].text)

                        } else {
                            reject({
                                errorCode: response.getMessages().getMessage()[0].getCode(),
                                errorMessage: response.getMessages().getMessage()[0].getText(),
                                response: response,
                            })
                            console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode())
                            console.log('Error message: ' + response.getMessages().getMessage()[0].getText())
                        }
                    }
                } else {
                    console.log('Null Response.')
                    reject({
                        errorCode: 500,
                        errorMessage: 'Try Agian!',
                        response: null,
                    })
                }

            })
        })
    }
}

// let auth = new Authorize()
// auth.doTransaction()

module.exports = Authorize