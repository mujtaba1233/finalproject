var express = require('express');
var router = express.Router();
var lookup = require('../models/lookup');
var uttils = require('../helpers/utilities');
const { calculateTax } = require('../helpers/utilities');
const { getUPSShippings, getDHLShippings } = require('../helpers/shipping-helper');



router.get('/stock-location', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetLocations(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/get-companies', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetOrderCompanies(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/shipping-method', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetShippingMethhods(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/order-status', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetOrderStatus(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/shipping-availability-status', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetShippingAvailabilityStatus(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/product', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetProducts(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/category', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetCategories(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/serials/:productId/:orderId', function (req, res, next) {
    var productId = req.params.productId
    var orderId = req.params.orderId
    uttils.authenticateUser(req,res, () => {
        lookup.GetSerialsByProductIdAndOrderId(productId, orderId, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/ShippingMethodById/:shippingMethodId', function (req, res, next) {
    var shippingMethodId = req.params.shippingMethodId
    uttils.authenticateUser(req,res, () => {
        lookup.GetShippingMethodById(shippingMethodId, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});

router.get('/getUsersForRecord', function (req, res, next) {
    uttils.authenticateUser(req, res, async () => {
        const response = await lookup.GetAllUsersForReport();
        // console.log(response)
        res.send(response)
    }, () => {
        res.send('Unathorized access')
    })
});


router.get('/serials/:productId', function (req, res, next) {
    var id = req.params.productId
    uttils.authenticateUser(req,res, () => {
        lookup.GetSerialsByProductId(id, function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/serials', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetAllSerials(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.get('/customers', function (req, res, next) {
    uttils.authenticateUser(req,res, () => {
        lookup.GetAllCustomers(function (records) {
            res.send(JSON.stringify(records));
        });
    }, () => {
        res.send('Unathorized access')
    })
});
router.post('/get-tax-rate', function (req, res, next) {
    var data = req.body;
    calculateTax(data, function (response) {
        res.send(response)
    })
})
router.post('/get-shipping-rates', function (req, res, next) {
    var data = req.body;
    let response = { result: [] }
    getUPSShippings(data, function (ups) {
        response.ups = {
            raw: ups.raw,
            status: ups.status,
            msg: ups.msg,
            code: ups.code,
        }
        response.result = [...ups.result, ...response.result]
        if (response.dhl && response.ups) {
            response.status = response.ups.status || response.dhl.status
            res.send(response)
        }
    })
    getDHLShippings(data, function (dhl) {
        response.dhl = {
            raw: dhl.raw,
            status: dhl.status,
            msg: dhl.msg,
            code: dhl.code,
        }
        response.result = [...dhl.result, ...response.result]
        if (response.dhl && response.ups) {
            response.status = response.ups.status || response.dhl.status
            res.send(response)
        }
    })
})
router.get('/country-list', function (req, res, next) {
    // uttils.authenticateUser(req,res, () => {
        lookup.getCountryList(function (record) {
            res.send(record)
        })
    // }, () => {
    //     res.send('Unathorized access')
    // })
})
// Return router
module.exports = router;
