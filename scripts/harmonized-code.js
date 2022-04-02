const csv=require('csvtojson')
var Mysql = require('node-mysql-helper');

var mysqlOptions = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: (process.env.DB_SOCKET_PATH == 'false')? false:process.env.DB_SOCKET_PATH ,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)
};
console.log(mysqlOptions);
Mysql.connect(mysqlOptions);


const run = async ()=>{
    const jsonArray = await csv().fromFile('harmonized.csv');
    try {
        const response = await Promise.all(jsonArray.map(async elem =>{
            try {
                let query  = "UPDATE products SET HarmonizedCode = "+ parseInt(elem.code) +" WHERE ProductCode = '"+ elem.product + "';"
                return Mysql.query(query)
            } catch (error) {
                console.log(error.message);
            }
        }))
        console.log('sasasasas',response);
    } catch (error) {
        console.log(error.message);
    }
}
run()