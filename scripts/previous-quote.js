require('dotenv').config()
var Mysql = require('node-mysql-helper');
var async = require('async');
var fs =  require("fs");

var mysqlOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false')? false:process.env.DB_SOCKET_PATH ,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};
Mysql.connect(mysqlOptions);
var callback = function(err,strm,r){
    console.log(err,strm,r);
}
var totalLength = 91;
for (let index = 1; index <= totalLength; index++) {
    var query = "select * from quotelineitems where QuoteNo = " + index;
    Mysql.query(query, {}).then(function(records){
        quotes = records; 
        saveQuoteLineItems(index,quotes);
    }).catch(function(err){
        console.log('Error fetching queries, mysql error:', err.message);
        callback({err:err});
    });
}


function saveQuoteLineItems(quoteNo , quotes) {
    if(quotes[0].QuoteNo){
        var where = {
            QuoteNo: quoteNo
        };
        Mysql.delete('quotelineitems', where)
        .then(function (record) {
            var quoteID = where.QuoteNo;
            var query = "INSERT into quotelineitems (isChild,parentName,parent,QuoteNo,ProductCode,Qty,ProductName,Price,Discount,isTaxable,description,display_order) VALUES ";
            for (var i = 0; i < quotes.length; i++) {
                if (quotes[i].Discount === undefined)
                    quotes[i].Discount = 0;
                    console.log(quotes[i].display_order)
                query += "(" + quotes[i].isChild + ",\'" + quotes[i].parentName + "\',\'" + quotes[i].parent + "\'," + quoteID + ", \'" + quotes[i].ProductCode + "\' ," + quotes[i].Qty + ", \"" + quotes[i].ProductName + "\", " + quotes[i].Price + ", " + quotes[i].Discount + ", " + quotes[i].isTaxable + ", '" + quotes[i].description + "',"+i+")";
                if (i != quotes.length - 1) {
                    query += ",";
                }
            }

            // console.log(query);
            Mysql.query(query, {})
            .then(function (results) {
                callback({ 'status': 'ok', 'quoteNo': quoteID });
            })
            .catch(function (err) {
                console.log(new Date(), err);
                reject(err);
                callback({ 'status': 'error' });
            });
        })
        .catch(function (err) {
            console.log(new Date(), 'Error deleting record, mysql error:', err.message);
        });
        console.log(quoteNo,quotes[0].QuoteNo)
    }
}

// fs.appendFile('./order-serial-logs.txt', "*+*+*+*+*+*+*+*+*+*+*+* Order serial script start *+*+*+*+*+*+*+*+*+*+*+*\n\n\n", 'utf8', callback1);
// console.log('query',query);
// var orders = [];


