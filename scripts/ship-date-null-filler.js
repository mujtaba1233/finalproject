require('dotenv').config()
var from = require('node-mysql-helper');
var bcrypt = require('bcrypt-nodejs');

var toOption = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false') ? false : process.env.DB_SOCKET_PATH,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};

from.connect(toOption);

var query = "select OrderID,ShipDate,OrderDate,LastModified from orders where OrderID > 50000 and OrderStatus = 'Shipped' and ShipDate is null;";
// console.log('query',query);

var update = function (order) {
    from.update('orders', {
        OrderID: order.OrderID
    }, {
        ShipDate: order.ShipDate
    }).then(function (orderInfo) {
        console.log(orderInfo.affectedRows, '  --  ', orderInfo.changedRows);
    }).catch(function (err) {
        console.log("user Err ============================================== ", err);
    });
}
from.query(query, {}).then(function (orders) {
    orders.forEach(order => {
        order.ShipDate = new Date(order.LastModified).toLocaleString('en-US').replace(',', '')
        console.log(order);
        update(order)
    })
}).catch(function (err) {
    console.log('Error fetching users, mysql error:', err.message);
});