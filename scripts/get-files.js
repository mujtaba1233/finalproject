require('dotenv').config()
var Mysql = require('node-mysql-helper');
var request = require('request');
var fs = require("fs");
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html></html>`);
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
    request.head(uri, function (err, res, body) {
        if (res.headers['content-type'] === 'text/html') {
            counter = counter + 1;
            if (counter < products.length) {
                nextProduct(products[counter])
            } else {
                // process.exit()
            }
        } else {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        }

    });
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

var query = "select ProductID,ProductCode,ProductDetailURL from products where ProductDetailURL like '%<ul>%'";
Mysql.query(query, {}).then(function (records) {
    records.forEach(elem => {
        products.push(elem)
        var string = elem.ProductDetailURL
        var hrefs = string.match(/href="([^"]*)/g);
        var names = string.replace(/<[^>]*>/g, "").trim().split('\n');
        console.log(elem.ProductCode);
        
        hrefs.forEach((href, index) => {
            console.log(href.split('"')[1].trim(), '----', names[index].trim());
        });
    });
    // console.log(products);



    // nextProduct(products[counter])
}).catch(function (err) {
    console.log('Error Occured:', err.message);
    // process.exit()
});