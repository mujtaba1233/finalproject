require('dotenv').config()
var from = require('node-mysql-helper');
var to = require('node-mysql-helper');
var fs =  require("fs");

var toOption = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false')? false:process.env.DB_SOCKET_PATH ,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};

var fromOption = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'old_intrepidcs',
    socketPath: (process.env.DB_SOCKET_PATH == 'false')? false:process.env.DB_SOCKET_PATH ,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};

from.connect(fromOption);

var counter = 0;
var detailCounter = 0;

var query = "select   ot.title paymenttitle, ot.value as PaymentAmount,  ot2.title as shippingtitle, ot2.value as shipping, ot3.title as taxtitle, ot3.value as tax, sum(od.final_price * od.products_quantity) as AffiliateAmount,c.customers_firstname, c.customers_lastname, c.customers_email_address,c.customers_telephone,  o.*,os.orders_status_name,od.final_price,od.products_name, od.products_model, od.products_quantity,od.products_tax   from orders o   left join orders_products od on o.orders_id = od.orders_id   left join customers c on c.customers_id = o.customers_id  left join orders_status os on o.orders_status = os.orders_status_id    left join orders_total ot ON (ot.orders_id = o.orders_id AND ot.title like 'total%')  left join orders_total ot2 ON (ot2.orders_id = o.orders_id AND ot2.title like '%shipping%') left join orders_total ot3 ON (ot3.orders_id = o.orders_id AND ot3.title like '%tax%') where o.orders_status IN (1,2,3,12,15,28,38,40,41,42) and o.order_to_po_date >= '2007/01/01 00:00:00' AND o.order_to_po_date <= '2012/12/31 23:59:59' group by o.orders_id;";
// console.log('query',query);
var orderDetailQuery = "SELECT orders_id as OrderID, products_model as ProductCode, products_name as ProductName, final_price as ProductPrice, products_tax as ProductTax, products_quantity as Quantity,products_quantity as OnOrder_Qty, products_quantity as QtyShipped FROM `orders_products`;";
var orders = [];
from.query(query, {}).then(function(orders){
    // from.query(orderDetailQuery, {}).then(function(orderDetails){
    //     to.connect(toOption);
    //     detailCounter = orderDetails.length;
    //     for(var j= 0; j < orderDetails.length; j++){
    //         var orderDetail = {
    //             OrderID: orderDetails[j].OrderID,
    //             ProductCode: orderDetails[j].ProductCode  == ''?'ICS-Custom':orderDetails[j].ProductCode,
    //             ProductName: orderDetails[j].ProductName == ''?'Write In':orderDetails[j].ProductName,
    //             ProductPrice: orderDetails[j].ProductPrice,
    //             ProductTax: orderDetails[j].ProductTax,
    //             Quantity: orderDetails[j].Quantity,
    //             OnOrder_Qty: orderDetails[j].OnOrder_Qty,
    //             QtyShipped: orderDetails[j].QtyShipped,
    //             DiscountValue: 0
    //         }
    //         to.insertUpdate('order_details', orderDetail, orderDetail).then(function (orderInfo) {
    //             counter++;
    //             console.log(orderInfo.affectedRows,'  Order Details  ',orderInfo.changedRows);
    //             if(counter === orders.length + orderDetails.length)
    //                 process.exit(0);
    //         }).catch(function (err) {
    //             counter++;
    //             console.log("order details Err ============================================== ",err);
    //             if(counter === orders.length + orderDetails.length)
    //                 process.exit(0);
    //
    //         });
    //     }
    // }).catch(function(err){
    //     console.log('Error fetching orders, mysql error:', err.message);
    //     // exit();
    // });

    // console.log(orders.length);

    to.connect(toOption);
    var array = [];
    for(var i = 0; i < orders.length; i++){
        var inserOrder = {
            'OrderID' : orders[i].orders_id,
            'Affiliate_Commissionable_Value' : orders[i].AffiliateAmount?orders[i].AffiliateAmount:0,
            'BillingAddress1' : orders[i].customers_street_address,
            'BillingAddress2' : orders[i].customers_street_address_2,
            'BillingCity' : orders[i].customers_city,
            'BillingCompanyName' : orders[i].customers_company,
            'BillingCountry' : orders[i].customers_country,
            'BillingFirstName' : orders[i].customers_firstname,
            'BillingLastName' : orders[i].customers_lastname,
            'BillingPhoneNumber' : orders[i].customers_telephone,
            'BillingPostalCode' : orders[i].customers_postcode,
            'BillingState' : orders[i].customers_state,
            'LastModified' : orders[i].last_modified?new Date(orders[i].last_modified).toLocaleString('en-US').replace(',',''):'',
            'Order_Entry_System' : 'OLD_DB',
            'OrderDate' : new Date(orders[i].order_to_po_date).toLocaleString('en-US').replace(',',''),
            'OrderStatus' : orders[i].orders_status_name,
            'PaymentAmount' : orders[i].PaymentAmount?orders[i].PaymentAmount:0,
            'SalesRep_CustomerID' : 4711,
            'SalesTax1' : orders[i].tax?orders[i].tax:0,
            'SalesTaxRate1' : orders[i].tax?6:0,
            'ShipAddress1' : orders[i].delivery_street_address,
            'ShipAddress2' : orders[i].delivery_street_address_2,
            'ShipCity' : orders[i].delivery_city,
            'ShipCompanyName' : orders[i].delivery_company,
            'ShipCountry' : orders[i].delivery_country,
            'ShipFirstName' : orders[i].delivery_name,
            'ShipLastName' : orders[i].delivery_name,
            'ShipPhoneNumber' : orders[i].delivery_telephone,
            'ShipPostalCode' : orders[i].delivery_postcode,
            'ShipState' : orders[i].delivery_state,
            'Tax1_Title' : orders[i].taxtitle,
            'OldOrder' : true,
            'Total_Payment_Authorized' : orders[i].PaymentAmount?orders[i].PaymentAmount:0,
            'Total_Payment_Received' : orders[i].PaymentAmount?orders[i].PaymentAmount:0,
            'TotalShippingCost' : orders[i].shipping?orders[i].shipping:0,
            'PrivateNotes' : orders[i].order_is_rfq + '<br>' + orders[i].rfq_comments + '<br>' + orders[i].rfq_standard_conditions + '<br>' + orders[i].rfq_bank_info + '<br>' + orders[i].rfq_payment_terms + '<br>' +  orders[i].rfq_delivery_terms
        }
        // console.log(inserOrder.OrderID);
        array.push(inserOrder)

        to.insertUpdate('orders', inserOrder, inserOrder).then(function (orderInfo) {
            counter++;
            console.log(orderInfo.affectedRows,'  --  ',orderInfo.changedRows);
            if(counter === orders.length + detailCounter)
                process.exit(0);
        }).catch(function (err) {
            counter++;
            console.log("order Err ============================================== ",err);
            if(counter === orders.length + detailCounter)
                process.exit(0);

        });
        // if(i === orders.length-1){
        //     var pricing = fs.createWriteStream('./old-orders.json', {
        //         flags: 'w'
        //     });
        //     response = JSON.stringify(array);
        //     pricing.write(response);
        //     // fs.appendFile('./old-orders.json', response, 'utf8', function(err){
        //     //     console.log('Done',err);
        //     // });
        // }
    }
}).catch(function(err){
    console.log('Error fetching orders, mysql error:', err.message);
    // exit();
});
