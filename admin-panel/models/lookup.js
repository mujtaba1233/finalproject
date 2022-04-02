var Mysql = require('../helpers/database-manager');
const { slack } = require('../helpers/slack-helper');

exports.GetLocations = function (callback) {

    Mysql.query("select LocationName,LocationID from stock_location where IsActive = 1")
        .then(function (results) {
            if (results.length > 0) {
                callback({ status: true, msg: "success", data: results })
            } else {
               
                callback({ status: true, msg: "success", data: [] })
            }
        })
        .catch(function (err) {
            error = JSON.stringify(err.message)
            slack(`File: lookup.js, \nAction: GetLocations, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({ status: false, msg: err.message })
            reject(err);
        });
};
exports.GetOrderCompanies = function (callback) {

    Mysql.query("select BillingCompanyName from orders group by `BillingCompanyName`")
        .then(function (results) {
            if (results.length > 0) {
                callback({ status: true, msg: "success", data: results })
            } else {
               
                callback({ status: true, msg: "success", data: [] })
            }
        })
        .catch(function (err) {
            error = JSON.stringify(err.message)
            slack(`File: lookup.js, \nAction: GetLocations, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({ status: false, msg: err.message })
            reject(err);
        });
};
exports.getCountryList = function (callback) {
    Mysql.query("select * from countries where active = 1 order by name").then(function (results) {
        if (results.length > 0) {
            let countries = results.filter(country => {
                return country.code != 'CU' && country.code != 'IR' && country.code != 'KP' && country.code != 'US'  
            })
            let filteredCountried = results.filter(country => {
                return country.code == 'US'  
            })
            countries.unshift(filteredCountried[0]);
            callback({ status: true, msg: "success", data: countries })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: getCountryList, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}

exports.GetOrderStatus = function (callback) {
    Mysql.query("select * from order_status where IsActive = 1")
        .then(function (results) {
            if (results.length > 0) {
                callback({ status: true, msg: "success", data: results })
            } else {
                callback({ status: true, msg: "success", data: [] })
            }
        })
        .catch(function (err) {
            error = JSON.stringify(err.message)
            slack(`File: lookup.js, \nAction: GetOrderStatus, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({ status: false, msg: err.message })
            reject(err);
        });
};

exports.GetAllCustomers = function (callback) {
    Mysql.query("select * from customers")
        .then(function (results) {
            if (results.length > 0) {
                callback({ status: true, msg: "success", data: results })
            } else {
                callback({ status: true, msg: "success", data: [] })
            }
        })
        .catch(function (err) {
            error = JSON.stringify(err.message)
            slack(`File: lookup.js, \nAction: GetAllCustomers, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({ status: false, msg: err.message })
            reject(err);
        });
};

exports.GetShippingMethhods = function (callback) {
    
    Mysql.query("select id, name from shipping_methods where isActive=1 ORDER BY displayOrder ASC")
        .then(function (results) {
            // console.log(results)
            if (results.length > 0) {
                callback({ status: true, msg: "success", data: results })
            } else {
                callback({ status: true, msg: "success", data: [] })
            }
        })
        .catch(function (err) {
            error = JSON.stringify(err.message)
            slack(`File: lookup.js, \nAction: GetShippingMethhods, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({ status: false, msg: err.message })
            reject(err);
        });
};

exports.GetShippingAvailabilityStatus = function (callback) {
    Mysql.query("select id, name from shipping_availability where isActive = 1").then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetShippingAvailabilityStatus, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}

exports.GetProducts = function (callback) {
    Mysql.query("select HideProduct as hide,IsFeatured as featured, ProductID as id, ProductCode as name from products where IsCompleted = 1 and IsDeleted = 0 order by PriorityIndex,ProductID asc").then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetProducts, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}

exports.GetCategories = function (callback) {
    Mysql.query("select id , name from categories order by displayOrder").then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetCategories, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}
exports.GetShippingMethodById = function (shippingMethodId, callback) {
    Mysql.query("select name from shipping_methods where id = " + shippingMethodId).then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetShippingMethodById, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}

exports.GetAllUsersForReport = async function (callback) {
    try{
        const users = await Mysql.query("select id,lastname,firstname from user")
        return { status: true, data: users, msg: 'Users fetched.' }
    }catch(err) {
        err = JSON.stringify(error.message)
		slack(`File: lookup.js, \nAction: GetAllUsersForReport, \nError ${err} \n 
			`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'Error getting new users, mysql error:', error.message);
        return { status: false, msg: error.message }
    }
}

exports.GetSerialsByProductIdAndOrderId = function (productId, orderId, callback) {
    Mysql.query("select ProductSerialID as id, SerialNO as name, ProductID from product_serials where (IsSold = 0 OR OrderID = '" + orderId + "') and ProductID = " + productId).then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetSerialsByProductIdAndOrderId, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}
exports.GetSerialsByProductId = function (id, callback) {
    Mysql.query("select ProductSerialID as id, SerialNO as name, ProductID from product_serials where IsSold = 0 and ProductID = " + id).then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetSerialsByProductId, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}

exports.GetAllSerials = function (callback) {
    Mysql.query("select ProductSerialID as id, SerialNO as name, ProductID from product_serials where IsSold = 0").then(function (results) {
        if (results.length > 0) {
            callback({ status: true, msg: "success", data: results })
        } else {
            callback({ status: true, msg: "success", data: [] })
        }
    }).catch(function (err) {
        error = JSON.stringify(err.message)
        slack(`File: lookup.js, \nAction: GetAllSerials, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({ status: false, msg: err.message })
        reject(err);
    });
}