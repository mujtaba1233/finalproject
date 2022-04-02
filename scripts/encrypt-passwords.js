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

var counter = 0;
var query = "select * from user where token = 'verifiedUser'";
// console.log('query',query);
var recursion = function (users) {
    bcrypt.hash(users[counter].password, null, null, function (err, hash) {
        from.update('user', {
            id: users[counter].id
        }, {
            password: hash
        }).then(function (orderInfo) {
            console.log(orderInfo.affectedRows, '  --  ', orderInfo.changedRows);
            counter++
            if (counter === users.length)
                process.exit(0);
            recursion(users)
        }).catch(function (err) {
            console.log("user Err ============================================== ", err);
            counter++
            if (counter === users.length)
                process.exit(0);
            recursion(users)
        });
    });
}
from.query(query, {}).then(function (users) {
    recursion(users)
}).catch(function (err) {
    console.log('Error fetching users, mysql error:', err.message);
    // exit();
});