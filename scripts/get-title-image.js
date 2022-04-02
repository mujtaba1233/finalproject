require('dotenv').config()
var Mysql = require('node-mysql-helper');
var request = require('request');
var fs = require("fs");
var products = [];
var counter = 0;

var mysqlOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false') ? false : process.env.DB_SOCKET_PATH,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};
Mysql.connect(mysqlOptions);
var download = function (uri, filename, callback) {
    if (uri.indexOf('store.intrepidcs.com') !== -1) {
        request.head(uri, function (err, res, body) {
            if (res && res.headers['content-type'] === 'text/html') {
                counter = counter + 1;
                if (counter < products.length) {
                    nextProduct(products[counter])
                } else {
                    console.log('Done');
                    
                    // process.exit()
                }
            } else {
                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
            }

        });
    } else {
        counter = counter + 1;
        if (counter < products.length) {
            nextProduct(products[counter])
        } else {
            console.log('Done');
        }
    }
};
var nextProduct = function (elem) {
    var imageName = elem.ProductPhotoURL.split('/').pop();
    download(elem.ProductPhotoURL, './uploads/images/' + imageName, function () {
        // counter = counter + 1;
        // if (counter < products.length) {
        //     nextProduct(products[counter])
        // }
        console.log(imageName, elem.ProductID, products.length, counter);
        var data = {
            ProductPhotoURL: imageName
        }
        Mysql.update('products', {
            ProductID: elem.ProductID
        }, data).then(function (updateRes) {
            counter = counter + 1;
            if (counter < products.length) {
                nextProduct(products[counter])
            }
        }).catch(function (err) {
            console.log('Error Occured:', err.message);
            // process.exit()
        });
    });
}

var query = "select ProductID,ProductPhotoURL from products";
Mysql.query(query, {}).then(function (records) {
    records.forEach(elem => {
        if (elem.ProductPhotoURL) {
            products.push(elem)
        }
    });
    nextProduct(products[counter])
}).catch(function (err) {
    console.log('Error Occured:', err.message);
    // process.exit()
});