require('dotenv').config()
var Mysql = require('node-mysql-helper');
var csv = require('csvtojson');
const validateAndUpdateProducts = async () => {
    var mysqlOptions = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        socketPath: (process.env.DB_SOCKET_PATH == 'false') ? false : process.env.DB_SOCKET_PATH,
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
    };
    console.log(process.cwd() + '/scripts/product-export.csv');
    const products = await csv().fromFile(process.cwd() + '/scripts/product-export.csv');
    const productCodes = products.map(product => product.product).join(`','`)
    // console.log(productCodes);
    Mysql.connect(mysqlOptions)

    const productIds = await Mysql.query(`select ProductID from products where ProductCode IN ('${productCodes}')`, {})
    console.log('Total Product:', products.length, 'To Update:', productIds.length);
    await updatePrices(products, productIds);
    process.exit()
}
const updatePrices = async (products, productIds) => {
    const responses = await Promise.all(products.map(product => {
        return Mysql.query(`update products set HarmonizedCode = ${product.code}, UnitOfMeasure = '${product.uom}', CountryOfOrigin= '${product.coo}', ExportDescription='${product.desc}' where ProductCode = '${product.product}'`, {})
    }))
    let count = 0
    responses.map((response, index) => {
        if (response.affectedRows === 0) {
            count = count + 1
            console.log('Not Update',products[index].product, response.affectedRows);
        } else if (response.affectedRows > 1) {
            // console.log('Updated More then 1',products[index].product, response.affectedRows);
        } else {
            // console.log('Normally Updated',products[index].product);
        }
    })
    console.log(count + ' product are not updated where total product was: ' + responses.length + ' and found ' + productIds.length);
    return
}
validateAndUpdateProducts();
