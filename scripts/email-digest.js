require('dotenv').config()
var Mysql = require('node-mysql-helper');
var fs = require('fs');
const {
    send
} = require('../admin-panel/helpers/mailHelper')
module.exports = {
    emailDigest: () => {
        var mysqlOptions = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            socketPath: (process.env.DB_SOCKET_PATH == 'false') ? false : process.env.DB_SOCKET_PATH,
            connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
        };
        Mysql.connect(mysqlOptions);

        let date = new Date().getDate()
        let month = new Date().getMonth() + 1
        let year = new Date().getFullYear()

        var query = `SELECT u.firstname as CreatedByBlueFirstName,o.Order_Type,o.Order_Entry_System,o.ShipCountry,o.ShipDate, u.lastname as CreatedByBlueLastName, s.FirstName as CreatedByVoluFirstName, s.LastName as CreatedByVoluLastName, o.OrderID, c.EmailAddress,o.OrderStatus,PaymentAmount, o.BillingCompanyName as CompanyName, o.BillingFirstName as FirstName,o.BillingLastName as LastName,OrderDate FROM orders o left join customers c on o.CustomerID = c.CustomerID left join customers s on o.SalesRep_CustomerID = s.CustomerID left join quotes q on q.QuoteNo = o.QuoteNo left join user u on u.id = o.UserId 
where OrderStatus <> 'Cancelled' and (
(Year(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = ${year} and 
Month(DATE(STR_TO_DATE(OrderDate, '%c/%e/%Y %r'))) = ${month} and 
Day(STR_TO_DATE(OrderDate, '%c/%e/%Y %r')) = ${date}) OR
(Year(DATE(STR_TO_DATE(ShipDate, '%c/%e/%Y %r'))) = ${year} and 
Month(DATE(STR_TO_DATE(ShipDate, '%c/%e/%Y %r'))) = ${month} and 
Day(STR_TO_DATE(ShipDate, '%c/%e/%Y %r')) = ${date})
)`;
        Mysql.query(query, {}).then(async (orders) => {

            let shippedOrders = orders.filter(order => order.OrderStatus === 'Shipped')
            let newOrders = orders.filter(order => order.OrderStatus === 'New')
            let partiallyShippedOrders = orders.filter(order => order.OrderStatus === 'Partially Shipped')

            let shippedOrdersHtml = ''
            let partiallyShippedOrdersHtml = ''
            let newOrdersHtml = ''
            let noOrderText = `<tr><td colspan="10">No order found</td><tr>`
            console.log('On ', date, month, year, 'Shipped: ', shippedOrders.length, 'Partial: ', partiallyShippedOrders.length, 'New: ', newOrders.length);
            let newOrderTotal = 0
            newOrders.forEach(order => {
                newOrdersHtml = newOrdersHtml + getOrderRowHTML(order)
                newOrderTotal += order.PaymentAmount
            })
            newOrdersHtml = newOrdersHtml + `<tr> <td colspan="9"></td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">Total</td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">$${roundTo2Decimals(newOrderTotal)}</td> <td></td>`
            let shippedOrderTotal = 0
            shippedOrders.forEach(order => {
                shippedOrdersHtml = shippedOrdersHtml + getOrderRowHTML(order)
                shippedOrderTotal += order.PaymentAmount
            })
            shippedOrdersHtml = shippedOrdersHtml + `<tr> <td colspan="9"></td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">Total</td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">$${roundTo2Decimals(shippedOrderTotal)}</td> <td ></td>`
            let partiallydOrderTotal = 0
            partiallyShippedOrders.forEach(order => {
                partiallyShippedOrdersHtml = partiallyShippedOrdersHtml + getOrderRowHTML(order)
                partiallydOrderTotal += order.PaymentAmount
            })
            partiallyShippedOrdersHtml = partiallyShippedOrdersHtml + `<tr> <td colspan="9"></td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">Total</td> <td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">$${roundTo2Decimals(partiallydOrderTotal)}</td> <td ></td>`
            console.log(process.cwd());
            let html = await fs.readFileSync(process.cwd() + '/scripts/emailDigest.html');
            replacementHTML = html.toString();
            replacementHTML = replacementHTML.replace(/NEW_ORDERS_HERE/g, newOrdersHtml || noOrderText);
            replacementHTML = replacementHTML.replace(/PARTIALLY_SHIPPED_ORDERS_HERE/g, partiallyShippedOrdersHtml || noOrderText);
            replacementHTML = replacementHTML.replace(/SHIPPED_ORDERS_HERE/g, shippedOrdersHtml || noOrderText);
            replacementHTML = replacementHTML.replace(/NEW_ORDER_TOTAL_HERE/g, "$" + roundTo2Decimals(newOrderTotal));
            replacementHTML = replacementHTML.replace(/SHIPPED_ORDER_TOTAL_HERE/g, "$" + roundTo2Decimals(shippedOrderTotal));
            replacementHTML = replacementHTML.replace(/PARTIAL_SHIPPED_TOTAL_HERE/g, "$" + roundTo2Decimals(partiallydOrderTotal));

            sendEmail(replacementHTML, date, month, year)

        }).catch(function (err) {
            console.log('Error Occured:', err.message);
        });
        const getOrderRowHTML = (order) => {
            if (order.ShipDate) {
                order.ShipDate = `${new Date(order.ShipDate).getMonth() + 1}/${new Date(order.ShipDate).getDate()}/${new Date(order.ShipDate).getFullYear()}`
            } else {
                order.ShipDate = 'N/A'
            }
            return `<tr>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189); ">${order.OrderID} <br><span style="font-size:8px">${getOrderType(order.Order_Entry_System)}</span></td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.LastName}, ${order.FirstName}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.EmailAddress}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.CompanyName}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.ShipCountry}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.CreatedByBlueLastName ? order.CreatedByBlueLastName + ', ' + order.CreatedByBlueFirstName : order.CreatedByVoluLastName + ', ' + order.CreatedByVoluFirstName}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.OrderStatus}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${new Date(order.OrderDate).getMonth() + 1}/${new Date(order.OrderDate).getDate()}/${new Date(order.OrderDate).getFullYear()}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.ShipDate}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);">${order.Order_Type}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);text-align: right;">$${roundTo2Decimals(order.PaymentAmount)}</td>
<td style="padding: .5em; border: 1px solid rgb(189, 189, 189);"><a class="button" href="${process.env.BASE_URL}/order-new?update=${order.OrderID}">Edit</td>`
        }
    }
}
const sendEmail = (html, date, month, year) => {
    var mailOptions = {
        from: '"Intrepidcs" <no-reply@intrepidcs.com>',
        to: process.env.ORDER_DIGEST.split(','),
        subject: `Order Digest ${month}/${date}/${year}`,
        html: html
    };
    send(mailOptions, (response) => {
        // console.log(response);
        // process.exit()
    })
}
const roundTo2Decimals = (number = 0.00) => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(number)
    // return Math.round((number + Number.EPSILON) * 100) / 100
}
const getOrderType = (type) => {
    if (type === 'ONLINE')
        return 'FrontStore'
    else return type
}