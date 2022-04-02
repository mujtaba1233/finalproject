var Mysql = require('../helpers/database-manager')
const { slack } = require('../helpers/slack-helper')
var mailHelper = require('../helpers/mailHelper');
exports.getExternalQuote = async (quoteNo, userId) => {
    try {
        console.log("quoteNo : ", quoteNo, userId)
        const quote = await Mysql.record('quotes', { QuoteNo: quoteNo, isExternal: 1, isApproved: 0, createdBy: userId })
        // console.log(quote)
        if (quote !== null) {
            const quotelineitems = await Mysql.query(`select * from quotelineitems where QuoteNo= ${quoteNo}`)
            // console.log(quotelineitems)
            return { status: true, quote: { ...quote, lineItems: quotelineitems } }
        } else {
            return { status: false, quote: {}, msg: 'Quote not found' }
        }


    } catch (error) {
        err = JSON.stringify(error.message)
        slack(`File: external-app.js, \nAction: getExternalQuote, \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        return { status: false, quote: {}, msg: error.message }
    }
}
exports.SaveExternalQuote = async function (quote, callback) {
    // return console.log(quote.lineItems);
    let lineItems = JSON.parse(JSON.stringify(quote.lineItems))
    let isSendEmail = quote.isSendEmail
    let emailData = {}
    emailData = {
        ...quote
    }
    delete quote.isSendEmail
    delete quote.lineItems
    delete quote.QuoteLines
    delete quote.quote
    let savedQuote = {}
    quote.isExternal = 1;
    try {
        const custmer = await Mysql.query('select * from customers where EmailAddress = "' + quote.CustomerEmail + '" limit 1')
        // const custmer = await Mysql.record('customers', { EmailAddress: quote.CustomerEmail })
        if (custmer.length > 0) {
            quote.CustomerID = custmer[0].CustomerID ? custmer[0].CustomerID : 0
        } else {
            quote.CustomerID = 0
        }
        // console.log();
        if (!quote.CustomerID) {
            quote.CustomerID = null
        }
        // slack(`File: external-app.js \nAction: SaveExternalQuote, \Customer ID: ${JSON.stringify(custmer)} \n`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        savedQuote = await Mysql.insertUpdate('quotes', { ...quote, createdOn: new Date() }, { ...quote, createdOn: new Date() })
        emailData.QuoteNo = quote.QuoteNo? quote.QuoteNo : savedQuote.insertId
        await Mysql.delete('quotelineitems', { QuoteNo: quote.QuoteNo })
        await Promise.all(lineItems.map(async (lineItem, index) => {
            lineItem.display_order = index;
            lineItem.display_order = index;
            lineItem.Discount = custmer.length > 0 ? custmer[0].CustomerDiscount : 0
            lineItem.QuoteNo = savedQuote.insertId || quote.QuoteNo;
            await Mysql.insert('quotelineitems', lineItem)
        }));
        if(isSendEmail){
            let user = await Mysql.query('select * from user where id = "' + emailData.createdBy + '" limit 1')
           let emailSent = await sendOderEmail(emailData,user)
           console.log(emailSent)
        }
        return { status: true, msg: 'Succefully Saved', 'quoteNo': savedQuote.insertId };
    } catch (error) {
        err = JSON.stringify(error.message)
        slack(`File: external-app.js, \nAction: SaveExternalQuote, \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'Error creating new quote, mysql error:', error.message);
        return { status: false, msg: error.message }
    }
};

exports.getExternalQuotes = async function (userId, callback) {
    //for external app
    try {
        const quotes = await Mysql.query(`select QuoteNo,CONCAT(CustomerLName,", ", CustomerFName) as CustomerName,CustomerEmail,IssueDate,ShippingCompany,ShippingCountry,createdOn from quotes where isExternal = 1 and isApproved = 0 and createdBy = ${userId} order by QuoteNo desc`)
        return { status: true, data: quotes, msg: 'quoutes fetched.' }
    } catch (error) {
        err = JSON.stringify(error.message)
        slack(`File: external-app.js, \nAction: getExternalQuotes, \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        return { status: false, msg: error.message, data: [] }
    }
}

exports.RemoveQuote = async function (quoteId, userId) {
    console.log(quoteId, userId);
    try {
        const quote = await Mysql.record('quotes', { QuoteNo: quoteId, isExternal: 1, isApproved: 0, createdBy: userId })
        if (quote) {
            await Mysql.delete('quotes', { QuoteNo: quoteId })
            await Mysql.delete('quotelineitems', { QuoteNo: quoteId })
            return { status: true, msg: 'Quote removed successfully' };
        } else {
            return { status: false, msg: 'Quote does not exist' };
        }
    } catch (error) {
        err = JSON.stringify(error.message)
        slack(`File: external-app.js, \nAction: RemoveQuote, \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(error.message, Mysql.getLastQuery());
        return { status: false, msg: error.message }
    }

};
async function sendOderEmail(generalDetails,user) {
    console.log(generalDetails,user[0].email)
    let emailSent = await mailHelper.sendMailFromExternalApp(generalDetails,user[0]);
    return emailSent
}