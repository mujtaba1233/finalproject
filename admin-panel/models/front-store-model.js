require('dotenv').config()
var Mysql = require('../helpers/database-manager')
var bcrypt = require('bcrypt-nodejs');
const { slack } = require('../helpers/slack-helper');

exports.GetProductOptions = function (optIDs, callback) {
    var sql = "select options.*, option_categories.optionCategoriesDesc from options LEFT JOIN option_categories ON options.optionCatId = option_categories.id where options.id IN (" + optIDs + ") ORDER BY optionCatId ASC";
    var groupOptions = {}, finalArray = [];
    Mysql.query(sql).then(function (options) {
        options.forEach(option => {
            if (groupOptions[option.optionCategoriesDesc]) {
                groupOptions[option.optionCategoriesDesc].unshift(option);
            } else {
                groupOptions[option.optionCategoriesDesc] = [];
                groupOptions[option.optionCategoriesDesc].push(option);
            }
        });
        for (const key in groupOptions) {
            const element = groupOptions[key];
            finalArray.push({
                key: key.replace(/ /g, '').toLowerCase(),
                label: key,
                options: element
            })
        }

        callback(finalArray);
    }).catch(function (err) {
        error= JSON.stringify(err)
        slack(`File: front-store-model.js, \nAction: GetProductOptions, \nError ${error}  \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        callback(err);
    });
}

exports.GetProducts = function (callback) {
    var query = "select p.* , GROUP_CONCAT(pc.CategoryID) CategoryIDs from products p left join product_category pc on p.ProductID = pc.ProductID where p.IsDeleted = 0 and p.isCompleted = 1 GROUP by p.ProductID order by PriorityIndex,ProductID asc";
    Mysql.query(query).then(function (products) {
        if (products.length > 0) {
            var count = products.length;
            products.forEach(elem => {
                var query = "select ID,ImageURL from images where IsThumb = 0 and TableName = 'Product' and TableID = " + elem.ProductID + " order by DisplayOrder";
                Mysql.query(query).then(function (images) {
                    images.forEach(function (elem) {
                        elem.ext = elem.ImageURL.split('.').pop();
                        elem.ImageURL = elem.ImageURL.split(".").slice(0, -1).join('.');
                    })
                    count = count - 1;
                    elem.ProductImages = images
                    if (count === 0) {
                        callback(products);
                    }
                }).catch(function (err) {
                    console.log(new Date(), err);
                    count = count - 1;
                    if (count === 0) {
                        error= JSON.stringify(err)
                        slack(`File: front-store-model.js, \nAction: GetProducts, \nError ${error}  \n 
                            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                        callback(err);
                    }
                });
            });
        } else {
            callback(products);
        }
    }).catch(function (err) {
        console.log(new Date(), err);
        error= JSON.stringify(err)
        slack(`File: front-store-model.js, \nAction: GetProducts, \nError ${error}  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback(err);
    });
}

exports.GetCategories = function (callback) {
    var query = "SELECT c.id,c.name ,count(p.ProductID) as totalProducts FROM `product_category` pc join categories c on c.id = pc.CategoryID join products p on p.ProductID = pc.ProductID where p.HideProduct <> 'Y' and c.isActive = 1 GROUP by c.id order by displayOrder asc";
    Mysql.query(query).then(function (results) {
        callback(results);
    }).catch(function (err) {
        error= JSON.stringify(err)
        slack(`File: front-store-model.js, \nAction: GetCategories, \nError ${error}  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        callback(err);
    });
}

exports.GetOrders = function (id, callback) {
    var query = "select OrderID, OrderDate, OrderStatus, PaymentAmount from orders where CustomerID = " + id + " order by OrderID desc;";
    Mysql.query(query).then(function (results) {
        callback({
            code: 200,
            status: true,
            msg: 'Order fetched.',
            result: results
        });
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: GetOrders, \nError ${error}  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err);
        callback({
            code: 400,
            status: false,
            msg: err.message,
        });
    });
}

exports.GetOrder = function (orderId,id, callback) {
    Mysql.query("select * from orders where OrderID = " + orderId +" and CustomerID = " + id + " ").then(function (order) {
        if (order.length > 0) {
            Mysql.query("select od.*, p.ProductPhotoURL from order_details od join products p on od.ProductID = p.ProductID where od.OrderID = " + orderId + " order by displayOrder").then(function (orderDetails) {
                if (orderDetails.length > 0) {
                    order[0].orderDetails = orderDetails;
                    // error= JSON.stringify(err.message)
                    
                    callback({
                        code: 200,
                        status: true,
                        msg: 'Order fetched.',
                        result: order[0]
                    });
                } else {
                    // error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: GetOrder, \nError No Product Found. \n 
                        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    order[0].orderDetails = []
                    callback({
                        code: 400,
                        status: true,
                        msg: 'No Product Found',
                        result: order[0]
                    });
                }
            }).catch(function (err) {
                error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: GetOrder, \nError ${error} \n 
                        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                console.log(new Date(), err.message);
                callback({
                    code: 400,
                    status: false,
                    msg: err.message,
                });
            });
        } else {
            // error= JSON.stringify(err.message)
            slack(`File: front-store-model.js, \nAction: GetOrder, \nError Order Not Found \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: true,
                msg: 'Order Not Found',
            });
        }
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: GetOrder, \nError ${error} \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err.message);
        callback({
            code: 400,
            status: false,
            msg: err.message,
        });
    });
};

exports.GetCustomerId = function (customer, callback) {
    var query = "select CustomerID, EmailAddress from customers where EmailAddress = '" + customer.email + "' limit 1";
    Mysql.query(query).then(function (results) {
        if (results.length > 0) {
            callback({
                status: true,
                msg: 'exist',
                id: results[0].CustomerID
            });
        } else {
            var data = {
                BillingAddress1: '',
                BillingAddress2: '',
                City: '',
                Country: '',
                CompanyName: '',
                State: '',
                PostalCode: '',
                FirstName: customer.firstName,
                LastName: customer.lastName,
                EmailAddress: customer.email,
            }
            Mysql.query("SELECT max(CustomerID) as id FROM customers", {})
                .then(function (record) {
                    var id = parseInt(record[0].id);
                    if (id < 20000) {
                        id = 20001
                    } else {
                        id = id + 1;
                    }
                    data.CustomerID = id;
                    Mysql.insert('customers', data).then(function (result) {
                        callback({
                            status: true,
                            msg: 'new',
                            id: id
                        });
                    }).catch(function (err) {
                        error= JSON.stringify(err.message)
                        slack(`File: front-store-model.js, \nAction: GetCustomerId, \nError ${error} \n 
                        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                        callback({
                            code: 400,
                            status: false,
                            msg: err.message
                        });
                    })
                }).catch(function (err) {
                    error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: GetCustomerId, \nError ${error} \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    console.log(new Date(), 'Error fetching record, mysql error:', err.message);
                });

        }
    }).catch(function (err) {
        console.log(new Date(), err.message);
        callback(results);
    });
}
exports.GetEmailForgetPass = function (customer, callback) {
    var query = "select register_customer_id, email,isActive from register_customer where email = '" + customer.email + "' limit 1";
    Mysql.query(query).then(function (results) {
        if (results.length > 0) {
            if(!results[0].isActive){
                slack(`File: front-store-model.js, \nAction: GetEmailForgetPass, \nError: Provided email address is not confirmed. \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    code: 400,
                    status: true,
                    msg: 'Password reset will only work once you confirm your email. Please check your e-mail.'
                });
                return
            }
            var where = {
                register_customer_id: results[0].register_customer_id
            };
            var data = {
                token: customer.token
            }
            Mysql.update('register_customer', where, data).then(function (result) {
                callback({
                    status: true,
                    code: 200,
                    msg: 'Reset password link has been sent to provided email address.',
                });
            }).catch(function (err) {
                error= JSON.stringify(err.message)
                slack(`File: front-store-model.js, \nAction: GetEmailForgetPass, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    code: 400,
                    status: false,
                    msg: err.message
                });
            })
        } else if (results.length === 0) {
            // error= JSON.stringify(err.message)
            slack(`File: front-store-model.js, \nAction: GetEmailForgetPass, \nError Incorrect email address. \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: true,
                msg: 'If the account is found, and email will be sent to the account holder to complete the reset request.'
            });
        } else {
            // error= JSON.stringify(err.message)
            slack(`File: front-store-model.js, \nAction: GetEmailForgetPass, \nError something went wrong \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: false,
                msg: 'something went wrong'
            });
        }
    }).catch(function (err) {
        console.log(new Date(), err.message);
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: GetEmailForgetPass, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    });
}

exports.SavePassword = function (data, callback) {
    Mysql.query('select * from register_customer where customerId = ' + data.customerId).then(function (result) {
        if (result.length > 0) {
            delete result[0].password
            delete result[0].token
            callback({
                code: 202,
                status: true,
                msg: 'Already registered!',
                result: result[0]
            });
        } else {
            data.isActive = false;
            Mysql.insert('register_customer', data).then(function (result) {
                callback({
                    code: 200,
                    status: true,
                    msg: 'A confirmation Email has been sent to the address you provided.',
                    result: result
                });
            }).catch(function (err) {
                console.log(new Date(), err.message);
                error= JSON.stringify(err.message)
                slack(`File: front-store-model.js, \nAction: SavePassword, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    code: 400,
                    status: false,
                    msg: err.message
                });
            })
        }
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: SavePassword, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err.message);
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    })
}

exports.ConfirmEmail = function (token, callback) {
    Mysql.query('select * from register_customer where isActive = 0 and token = "' + token + '"').then(function (result) {
        if (result.length > 0) {
            Mysql.update('register_customer', {
                token: token,
                isActive: 0
            }, {
                confirmedOn: new Date(),
                isActive: true
            }).then(function (result) {
                callback({
                    code: 200,
                    status: true,
                    msg: 'Email has been Confirmed'
                });
            }).catch(function (err) {
                console.log(new Date(), err.message);
                error= JSON.stringify(err.message)
                slack(`File: front-store-model.js, \nAction: ConfirmEmail, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    code: 400,
                    status: false,
                    msg: err.message
                });
            })
        } else {
            // error= JSON.stringify(err.message)
                slack(`File: front-store-model.js, \nAction: ConfirmEmail, \nError Invalid Token or Used Alredy \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: false,
                msg: 'Invalid Token or Used Alredy'
            });
        }
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: ConfirmEmail, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err.message);
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    })
}

exports.ConfirmToken = function (token, callback) {
    Mysql.query(`select * from register_customer where isActive = 1 and token = '${token.token}'`).then(function (customer) {
        if (customer.length > 0) {
            callback({
                code: 200,
                status: true,
                msg: 'Token has been Confirmed',
                data: customer
            });
        } else {
            // error= JSON.stringify(err.message)
            slack(`File: front-store-model.js, \nAction: ConfirmToken, \nError Invalid Token or Used Alredy \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: false,
                msg: 'Invalid Token or Used Alredy'
            });
        }
    }).catch(function (err) {
        console.log(new Date(), err.message);
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: ConfirmToken, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    })
}

exports.Login = function (data, callback) {
    Mysql.record('register_customer', {
        email: data.email
    }).then(function (record) {
        console.log(record)
        if (record && record.isActive && record.AdminActiveFlag) {
            bcrypt.compare(data.password, record.password, function (err, res) {
                if (res) {
                    callback({
                        status: true,
                        code: 200,
                        msg: 'LoggedIn Successfully',
                        result: record
                    });
                } else {
                    // error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: Login, \nError Whoops! Incorrect email or password \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    callback({
                        status: true,
                        code: 400,
                        msg: 'Whoops! Incorrect email or password'
                    });
                }
            });
        } else {
            if (!record) {
                 // error= JSON.stringify(err.message)
                 slack(`File: front-store-model.js, \nAction: Login, \nError Whoops! Incorrect email or password \n 
                 `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    status: true,
                    code: 400,
                    msg: 'Whoops! Incorrect email or password'
                });
            } else if (record.isActive == 0) {
                
                callback({
                    status: true,
                    code: 400,
                    msg: 'Email Confirmation Required'
                });
            } else if (record.AdminActiveFlag == 0) {
                 // error= JSON.stringify(err.message)
                 slack(`File: front-store-model.js, \nAction: Login, \nError Whoops! Incorrect email or password \n 
                 `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    status: true,
                    code: 400,
                    msg: 'Whoops! Incorrect email or password'
                });
            }
        }
    }).catch(function (err) {
         error= JSON.stringify(err.message)
         slack(`File: front-store-model.js, \nAction: Login, \nError ${error} \n 
         `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'Error fetching record login, mysql error:', err);
        callback({
            status: false,
            code: 400,
            msg: err.message
        });
    });
}

exports.GetCustomer = function (id, callback) {
    Mysql.record('customers', {
        CustomerID: id
    }).then(function (record) {
        callback({
            status: true,
            code: 200,
            msg: 'Customer Fetched',
            result: record
        })
    }).catch(function (err) {
        console.log(new Date(), 'Error fetching record Customer by ID, mysql error:', err.message);
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: GetCustomer, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            status: false,
            code: 400,
            msg: err.message
        });
    })
}

exports.UpdatePassword = function (data, callback) {
    Mysql.record('register_customer', {
        email: data.email
    }).then(function (record) {
        if (record && record.password) {
            bcrypt.compare(data.oldPassword, record.password, function (err, res) {
                if (res) {
                    console.log(new Date(), "err res", err, res);
                    delete record.password;
                    bcrypt.hash(data.password, null, null, function (err, hash) {
                        var where = {
                            register_customer_id: record.register_customer_id
                        };
                        var update = {
                            password: hash
                        };
                        Mysql.update('register_customer', where, update).then(function (result) {
                            if (result.changedRows > 0) {
                                callback({
                                    code: 200,
                                    status: true,
                                    msg: "Password updated successfully"
                                });
                            } else {
                                // error= JSON.stringify(err.message)
                                slack(`File: front-store-model.js, \nAction: UpdatePassword, \nError Nothing to change \n 
                                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                                callback({
                                    code: 400,
                                    status: true,
                                    msg: "Nothing to change, try again"
                                });
                            }
                        }).catch(function (err) {
                            error= JSON.stringify(err.message)
                            slack(`File: front-store-model.js, \nAction: UpdatePassword, \nError ${error} \n 
                            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                            console.log(new Date(), 'Error updating password, mysql error:', err.message);
                            callback({
                                code: 400,
                                status: false,
                                msg: err.message
                            });
                        });
                    });
                } else {
                    // error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: UpdatePassword, \nError Current password missmatch \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    callback({
                        code: 400,
                        status: true,
                        msg: "Current password missmatch"
                    });
                }
            });
        } else {
            //  error= JSON.stringify(err.message)
             slack(`File: front-store-model.js, \nAction: UpdatePassword, \nError Invalid request \n 
             `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            callback({
                code: 400,
                status: false,
                msg: "Invalid request"
            });
        }
        if (record != null) {

        }
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: UpdatePassword, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    });
};
exports.ChangePassword = function (data, callback) {
    Mysql.record('register_customer', {
        token: data.token
    }).then(function (record) {
        bcrypt.hash(data.passwords.password, null, null, function (err, hash) {
            var where = {
                register_customer_id: record.register_customer_id
            };
            var update = {
                password: hash,
                token: ''
            };
            Mysql.update('register_customer', where, update).then(function (result) {
                if (result.changedRows > 0) {
                    callback({
                        code: 200,
                        status: true,
                        msg: "Password updated successfully"
                    });
                } else {
                    // error= JSON.stringify(err.message)
                    slack(`File: front-store-model.js, \nAction: ChangePassword, \nError Nothing to change, try again \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    callback({
                        code: 400,
                        status: true,
                        msg: "Nothing to change, try again"
                    });
                }
            }).catch(function (err) {
                  error= JSON.stringify(err.message)
                  slack(`File: front-store-model.js, \nAction: ChangePassword, \nError ${error} \n 
                  `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                console.log(new Date(), 'Error updating password, mysql error:', err.message);
                callback({
                    code: 400,
                    status: false,
                    msg: err.message
                });
            });
        });
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: ChangePassword, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            code: 400,
            status: false,
            msg: err.message
        });
    });
};

exports.UpdateCustomer = function (data, callback) {
    Mysql.update('customers', {
        CustomerID: data.CustomerID
    }, data).then(function (result) {
        if (result.affectedRows > 0) {
            Mysql.record('customers', {
                CustomerID: data.CustomerID
            }).then(function (record) {
                callback({
                    status: true,
                    code: 200,
                    msg: 'Personal details changed successfully.',
                    result: record
                })
            }).catch(function (err) {
                error= JSON.stringify(err.message)
                slack(`File: front-store-model.js, \nAction: UpdateCustomer, \nError ${error} \n 
                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                console.log(new Date(), 'Error fetching record Customer by ID in update customer, mysql error:', err.message);
                callback({
                    code: 400,
                    status: true,
                    msg: err.message,
                    result: data
                });
            })
        } else {
            callback({
                code: 400,
                status: true,
                msg: 'Invalid Request',
                result: data
            });
        }
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: UpdateCustomer, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err.message);
        callback({
            code: 400,
            status: false,
            msg: err.message,
            result: data
        });
    })
}

exports.GetCustomerById = async function (customerId, cb) {
    const customer = await Mysql.query("select * from customers where CustomerID = " + customerId)
    if (customer.length === 0)
        cb('Error')
    cb(null, customer)
}
exports.InsertOrder = function (order, insertEndCallback) {
    if (order != undefined && order.OrderDetails != undefined) {
        var OrderDetails = order.OrderDetails;
        delete order.OrderDetails;
        Mysql.query("SELECT max(OrderID) as id FROM orders", {}).then(function (record) {
            if (order.OrderID === undefined) {
                var id = parseInt(record[0].id);
                if (id < 50000) {
                    id = 50001
                } else {
                    id = id + 1;
                }
                order.OrderID = id;
            } else {
                var id = order.OrderID;
            }
            Mysql.insertUpdate('orders', order, order).then(function (orderInfo) {
                var callbackCount = OrderDetails.length;
                // Mysql.query("Delete from order_details where OrderID = " + id).then(function (results) {
                for (var j = 0; j < OrderDetails.length; j++) {
                    OrderDetails[j].displayOrder = j;
                    OrderDetails[j].OrderID = id;
                    Mysql.insertUpdate('order_details', OrderDetails[j], OrderDetails[j]).then(function (info) {
                        callbackCount--;
                        if (callbackCount == 0) {
                            insertEndCallback({
                                status: true,
                                code: 200,
                                msg: 'order details saved successfully.',
                                result: {
                                    orderId: id
                                }
                            });
                        }
                    }).catch(function (err) {
                        j = OrderDetails.length;
                        Mysql.query("Delete FROM orders where OrderID = " + id, {}).then(function (records) {
                            Mysql.query("Delete FROM order_details where OrderID = " + id, {}).then(function (records) {
                                error= JSON.stringify(err.message)
                                slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error}, \n 
                                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                                insertEndCallback({
                                    code: 400,
                                    status: false,
                                    msg: err.message,
                                    result: {}
                                });
                            }).catch(function (err) {
                                error= JSON.stringify(err.message)
                                slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error},  \n 
                                `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                                console.log(new Date(), 'Error fetching record, mysql error:', err.message);
                            });
                        }).catch(function (err) {
                            error= JSON.stringify(err.message)
                            slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error},  \n 
                            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                            console.log(new Date(), 'Error fetching record, mysql error:', err.message);
                        });
                        error= JSON.stringify(err.message)
                        slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error}, \n 
                        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                        console.log(new Date(), "detail Err ================== ", err);
                    });
                }

            }).catch(function (err) {
                console.log(new Date(), Mysql.getLastQuery(), "order Err ================== ", err);
                callbackCount--;
                if (callbackCount == 0){
                    error= JSON.stringify(err.message)
                        slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error},  \n 
                        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                    insertEndCallback({
                        code: 400,
                        status: true,
                        msg: err.message,
                        result: {}
                    });}
            });
        }).catch(function (err) {
            error= JSON.stringify(err.message)
            slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error},  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            console.log(new Date(), 'Error fetching record, mysql error:', err.message);
            insertEndCallback({
                code: 400,
                status: true,
                msg: err.message,
                result: {}
            });
        });

    } else {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: InsertOrder, \nError ${error}, \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), "order undefined");
        callback({
            code: 400,
            status: true,
            msg: 'Invalid Request',
            result: data
        });
    }
};

exports.update = function (data, callback) {
    var where = {
        OrderID: data.OrderID
    }
    Mysql.update('orders', where, data).then(function (result) {
        callback({ status: true, msg: "Order Updated." });
    }).catch(function (err) {
        error= JSON.stringify(err.message)
        slack(`File: front-store-model.js, \nAction: update, \nError ${error} \n 
        `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), err.message);
        callback({ status: false, msg: err.message });
    });
}
