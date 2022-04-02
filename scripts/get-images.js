require('dotenv').config()
var Mysql = require('node-mysql-helper');
var request = require('request');
var fs = require("fs");
var products = [];
var counter = 0;
var imageNo = 2;
var imageCount = 0;
var imageCountCallBack = 0;
var saveCountCallBack = 0;
var thumbImages = false;


var mysqlOptions = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false') ? false : process.env.DB_SOCKET_PATH,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};
Mysql.connect(mysqlOptions);
var download = function (uri, filename, callback, next) {
    request.head(uri, function (err, res, body) {
        // console.log(uri, res.headers['content-type']);

        if (res.headers['content-type'] === 'text/html') {
            // console.log(uri);
            next()
        } else {
            imageCount = imageCount + 1;
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        }

    });
};
var nextProduct = function (elem, imageNo, isThumb) {
    // var imageName = elem.ProductPhotoURL.split('/').pop();
    imageName = elem.ProductPhotoURL;

    var imageNameWithoutExt = imageName.split('.')[0];
    var ext = imageName.split('.')[1]
    var baseName = imageNameWithoutExt.split('-');
    baseName.pop();
    if (isThumb === 1) {
        baseName.push(imageNo + 'S')
    } else {
        baseName.push(imageNo)
    }
    var newName = baseName.join('-') + '.' + ext
    console.log(newName);

    download('https://store.intrepidcs.com/v/vspfiles/photos/' + newName, './uploads/images/' + newName, function () {
        imageCountCallBack = imageCountCallBack + 1;
        var data = {
            TableName: 'Product',
            TableID: elem.ProductID,
            ImageURL: newName,
            IsThumb: isThumb,
            CreatedAt: new Date()
        }
        Mysql.insert('images', data).then(function () {
            saveCountCallBack = saveCountCallBack + 1;
            console.log('img==', imageCount, 'imgCB==', imageCountCallBack, 'imgSv==', saveCountCallBack, products.length, counter);
            imageNo = imageNo + 1
            if (thumbImages) {
                nextProduct(products[counter], imageNo, 1)
            } else {
                nextProduct(products[counter], imageNo, 0)
            }
        }).catch(function (err) {
            console.log('Error Occured:', err.message);
        });
    }, function () {
        counter = counter + 1;
        if (counter < products.length) {
                imageNo = 2;
                if (thumbImages) {
                    nextProduct(products[counter], imageNo, 1)
                } else {
                    nextProduct(products[counter], imageNo, 0)
                }
        } else {
            counter = 0;
            if(!thumbImages){
                thumbImages = true;
                imageNo = 2;
                nextProduct(products[counter], imageNo, 1)
            }else{
                console.log('Done');
                
            }
        }
    });
}

var query = "select ProductID,ProductPhotoURL from products";
Mysql.query(query, {}).then(function (records) {
    records.forEach(elem => {
        if (elem.ProductPhotoURL && elem.ProductPhotoURL.split('/').pop() !== 'nophoto.gif') {
            products.push(elem)
        }
    });
    if (thumbImages) {
        nextProduct(products[counter], imageNo, 1)
    } else {
        nextProduct(products[counter], imageNo, 0)
    }
}).catch(function (err) {
    console.log('Error Occured:', err.message);
});