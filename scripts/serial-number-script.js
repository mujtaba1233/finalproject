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
var callback1 = function(err,strm,r){
    // console.log(err,strm,r);
}

var query = "select OrderID,Order_Comments from orders where Order_Comments like '%s/n:%'";
// console.log('query',query);
var orders = [];
Mysql.query(query, {})
.then(function(records){
    orders = records;
    fs.appendFile('./order-serial-logs.txt', "*+*+*+*+*+*+*+*+*+*+*+* Order serial script start *+*+*+*+*+*+*+*+*+*+*+*\n\n\n", 'utf8', callback1);
    GetSerials(0);
})
.catch(function(err){
    console.log('Error fetching orders, mysql error:', err.message);
    callback({err:err});
});
var i = 0;
var GetSerials = function(index){
    order = orders[index]
    fs.appendFile('./order-serial-logs.txt', "Order ID: "+order.OrderID+"\n\n", 'utf8', callback1);
    async.waterfall([
        function(callback){
            var lines = order.Order_Comments.split('\n');
            var finalfinalString = '';
            var finalString = '';
            var check = false;
            for (var i = 0; i < lines.length; i++) {
                lines[i] = lines[i].replace("\r\n", "").replace("\r", "")
                if(lines[i].indexOf('s/n:') > 0 || (lines[i].split(',').length > 1 && lines[i].match(/^[A-Z\d,. ]+$/) != null)){
                    var serials = lines[i].split(':');
                    // var multiLineSerial = lines[i].split(',');
                    for(var j = 0; j < serials.length ; j++){
                        if(serials[j].indexOf('s/n') == -1){
                            console.log("..........New serial.........",serials[j]);
                            finalString = finalString + serials[j];
                            // console.log('Serials: ',finalString);
                        }else if (lines[i].split(',').length > 1 && lines[i].match(/^[A-Z\d,. ]+$/) != null) {
                            console.log("..........New serial.........",serials[j]);
                            finalString = finalString + serials[j];
                        }else{
                            fs.appendFile('./order-serial-logs.txt', "xxxx"+serials[j]+"\n", 'utf8', callback1);
                            console.log('+++++++++++++++++++++++++++++++++++++++++++++ invalid paritial rows------',serials[j])
                        }
                    }
                    finalfinalString = finalString + ',' + finalfinalString  ;
                    finalString = '';
                }else {
                    // console.log('===========');
                    fs.appendFile('./order-serial-logs.txt', "xxxx"+lines[i] + "\n", 'utf8', callback1);
                    console.log('+++++++++++++++++++++++++++++++++++++++++++++ invalid rows ..............',lines[i]);
                }
                if(lines.length-1 == i){
                    callback(null, finalfinalString);
                }
            }
        },
        function(OrderSerials, callback) {
            //db call will be here

            OrderSerials = OrderSerials.replace(/([a-z .])/g, "").replace(/,,/g,',').replace(/.$/,"");
            Mysql.update('orders',{OrderID:order.OrderID},{OrderSerials:OrderSerials}).then(function(records){
                console.log('--------------------------------------------------------------------------------------------------------',records.affectedRows);
                fs.appendFile('./order-serial-logs.txt', "\n\nValid Serials:"+"\n"+OrderSerials, 'utf8', function(err){
                    callback (null, OrderSerials);
                });
            })
        },
        function(something, callback) {
            console.log('Final func:  ',something);
            if(orders.length-1 > index){
                fs.appendFile('./order-serial-logs.txt', "\n\n=======================================================================================================\n\n", 'utf8', function(){
                    console.log("\n\n\n\n\n\n\n\n");
                    GetSerials(index+1);
                });
            }else {
                callback (null, something);
            }
        }
    ], function (error, success) {
        if (error) { console.log('Something is wrong!'); }
        return console.log('Done!');
    });
}
