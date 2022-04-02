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

var query = "select oh.orders_id as OrderID,GROUP_CONCAT(oh.comments) as Order_Comments  from orders o left join orders_products od on o.orders_id = od.orders_id   left join customers c on c.customers_id = o.customers_id  left join orders_status os on o.orders_status = os.orders_status_id  join orders_status_history oh on o.orders_id = oh.orders_id   where oh.comments like '%s/n%' and o.orders_status IN (1,2,3,12,15,28,38,40,41,42) and o.order_to_po_date >= '2007/01/01 00:00:00' AND o.order_to_po_date <= '2012/12/31 23:59:59' group by o.orders_id;";
// console.log('query',query);
from.query(query, {}).then(function(orders){
    // console.log(orders.length);
    to.connect(toOption);
    var array = [];
    for(var i = 0; i < orders.length; i++){

        to.insertUpdate('orders', orders[i], orders[i]).then(function (orderInfo) {
            counter++;
            console.log(orderInfo.affectedRows,'  --  ',orderInfo.changedRows);
            if(counter === orders.length)
                process.exit(0);
        }).catch(function (err) {
            counter++;
            console.log("order Err ============================================== ",err);
            if(counter === orders.length)
                process.exit(0);

        });
    }
}).catch(function(err){
    console.log('Error fetching orders, mysql error:', err.message);
    // exit();
});
