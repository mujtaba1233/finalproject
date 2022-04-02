const randtoken = require('rand-token');
const UPS = require('./ups-shipping-api/lib/index');
const CONSTANTS = require('./ups-shipping-api/json/ups_constants_all.json');
const request = require("request");
const Easypost = require('@easypost/api');
const api = new Easypost(process.env.DHL_EASY_POST_API_KEY);
const settings = require("../models/settings");
const { slack } = require('./slack-helper');

exports.getUPSShippings = function (data, callback) {
    var ups = new UPS({
        environment: 'live', // or sandbox
        access_key: process.env.UPS_ACCESS_KEY,
        username: process.env.UPS_USERNAME,
        password: process.env.UPS_PASSWORD,
        imperial: true // set to false for metric
    });
    let packages = []
    if (data.packages instanceof Array) {
        data.packages.forEach(elem => {
            if (elem.length && elem.width && elem.height)
                packages.push({
                    description: randtoken.generate(16),
                    weight: parseFloat(elem.weight),   //integers: 0-70 for imperial, 0-150 for metric
                    dimensions: { // optional, integers: 0-108 for imperial, 0-270 for metric
                        length: parseFloat(elem.length),
                        width: parseFloat(elem.width),
                        height: parseFloat(elem.height)
                    }
                })
            else
                packages.push({
                    description: randtoken.generate(16),
                    weight: parseFloat(elem.weight),   //integers: 0-70 for imperial, 0-150 for metric
                })
            // console.log(packages);
        })
    } else {
        packages.push({
            description: randtoken.generate(16),
            weight: parseFloat(data.weight),   //integers: 0-70 for imperial, 0-150 for metric
        })
    }
    var shipment = {
        shipper: {
            address: {
                country_code: process.env.SHIP_FROM_COUNTRY || "US",
                postal_code: process.env.SHIP_FROM_ZIP_CODE || "48083",
            },
        },
        ship_to: {
            address: {
                country_code: data.ShipCountry,
                postal_code: data.ShipPostalCode,
            },
        },
        packages: packages,
    }
    try {
        ups.rates(shipment, function (err, response) {
            // console.log(err,response);
            if (!err && response) {
                var shippings = []
                settings.Get(setting => {
                    response.RatedShipment.forEach(elem => {
                        if (parseInt(CONSTANTS['id_mapping'][elem.Service[0].Code[0].toString()])) {

                            if (data.ShipCountry.toLowerCase() !== 'us') {
                                shippings.push({
                                    service: CONSTANTS['default_services'][elem.Service[0].Code[0].toString()],
                                    actualRate: elem.TotalCharges[0].MonetaryValue[0],
                                    charges: (Math.round((parseFloat(elem.TotalCharges[0].MonetaryValue[0]) + (parseFloat(elem.TotalCharges[0].MonetaryValue[0]) * (setting.result.upsPercentage / 100)) + setting.result.upsOffset) / 5) * 5).toFixed(2),
                                    id: parseInt(CONSTANTS['id_mapping'][elem.Service[0].Code[0].toString()]),
                                    currency: elem.TotalCharges[0].CurrencyCode[0],
                                    guaranteed: elem.GuaranteedDaysToDelivery ? elem.GuaranteedDaysToDelivery[0] : '',
                                    type: 'UPS'
                                })
                            } else {
                                shippings.push({
                                    service: CONSTANTS['default_services'][elem.Service[0].Code[0].toString()],
                                    actualRate: elem.TotalCharges[0].MonetaryValue[0],
                                    charges: elem.Service[0].Code.toString() === '03' ? '20.00' : (Math.round((parseFloat(elem.TotalCharges[0].MonetaryValue[0]) + (parseFloat(elem.TotalCharges[0].MonetaryValue[0]) * (setting.result.upsPercentage / 100)) + setting.result.upsOffset) / 5) * 5).toFixed(2),
                                    id: parseInt(CONSTANTS['id_mapping'][elem.Service[0].Code[0].toString()]),
                                    currency: elem.TotalCharges[0].CurrencyCode[0],
                                    guaranteed: elem.GuaranteedDaysToDelivery ? elem.GuaranteedDaysToDelivery[0] : '',
                                    type: 'UPS'
                                })
                            }
                            shippings.map(elem => {
                                if (parseFloat(elem.charges) < 25 && elem.service != 'UPS Ground') {
                                    elem.charges = (25).toFixed(2)
                                }
                            })
                        }
                    });
                    callback(
                        {
                            status: true,
                            code: 200,
                            msg: 'shipping methods fetched.',
                            result: shippings.sort((a, b) => a.charges - b.charges),
                            raw: response
                        })
                })
            } else {
                var error = JSON.stringify(err)
                console.log(new Date(), err);
                slack(`File: shipping-helper.js, \nAction: getUPSShippings, \nError ${error}  \n 
            `, 'J.A.R.V.I.S', 'C029PF7DLKE')
                callback({
                    status: false,
                    code: 400,
                    msg: err && err.ErrorDescription ? err.ErrorDescription : 'Something went wrong!',
                    result: []
                })
            }
        });
    } catch (error) {
        callback({
            status: false,
            code: 400,
            msg: error.message,
            result: []
        })
    }
}
exports.getDHLShippings = function (data, callback) {
    // console.log(data)
    const fromAddress = new api.Address({
        id: 'adr_41b7e0b7322d4279a2a40e3755b9ad3b' //saved address id
        // company: 'Intrepid Control Systems',
        // street1: '1850 Research Drive',
        // street2: '',
        // city: 'Troy',
        // state: 'MI',
        // zip: process.env.SHIP_FROM_ZIP_CODE || "48083",
        // country: process.env.SHIP_FROM_COUNTRY || "US",
        // phone: '415-528-7555'
    });
    const toAddress = new api.Address({
        // name: 'George Costanza',
        // company: 'Client Company',
        // street1: '1 E 161st St.',
        city: data.ShipCity,
        // state: 'Beijing',
        zip: data.ShipPostalCode,
        country: data.ShipCountry,
    });
    //test data start
    const customsItem1 = new api.CustomsItem({
        description: 'Automotive Controls',
        quantity: 5,
        value: 10000,
        weight: 4,
        hs_tariff_number: '8471.80.10',
        origin_country: 'US'
    });
    const customsInfo = new api.CustomsInfo({
        eel_pfc: 'NOEEI 30.37(a)',
        customs_certify: true,
        customs_signer: 'Jon Doe',
        contents_type: 'other',
        contents_explanation: 'Sale of Products',
        customs_items: [customsItem1]
    });
    //test data end
    let parcels = []
    data.packages.forEach(elem => {
        elem.weight = elem.weight * 16
        parcels.push(
            new api.Shipment({
                parcel: {
                    "weight": parseFloat(elem.weight),
                    "width": parseFloat(elem.width),
                    "height": parseFloat(elem.height),
                    "length": parseFloat(elem.length),
                },
                customs_info: customsInfo,
            })
        )
    })
    const shipment = new api.Order({
        to_address: toAddress,
        from_address: fromAddress,
        shipments: parcels
    });
    let shippings = []
    shipment.save().then((response) => {
        // console.log(response)
        if(data.InsuranceValue !== null || data.InsuranceValue !== "undefined" || data.InsuranceValue){
            data.insuranceValue = data.InsuranceValue
        }
        settings.Get(setting => {
            response.rates.map(elem => {
                if (CONSTANTS['default_services'][elem.service.toString()]) {
                    if (data.ShipCountry.toLowerCase() !== 'us') {
                        insauranceValPer = ((1.05 / 100) * parseFloat(data.insuranceValue)).toFixed(2);
                        if (data.insuranceValue <= 300 && data.insuranceValue > 0) {
                            elem.rate = parseFloat(elem.rate) + 3.15;
                        } else if (data.insuranceValue > 0) {
                            elem.rate = parseFloat(elem.rate) + parseFloat(insauranceValPer);

                        }
                        shippings.push({
                            service: CONSTANTS['default_services'][elem.service.toString()],
                            actualRate: elem.rate,
                            charges: Math.round((parseFloat(elem.rate) + (parseFloat(elem.rate) * (setting.result.dhlPercentage / 100)) + setting.result.dhlOffset) / 5) * 5,
                            id: parseInt(CONSTANTS['id_mapping'][elem.service.toString()]),
                            currency: elem.currency,
                            guaranteed: elem.delivery_days ? elem.GuaranteedDaysToDelivery : '',
                            type: 'DHL'
                        })
                    } else {
                        shippings.push({
                            service: CONSTANTS['default_services'][elem.service.toString()],
                            actualRate: elem.rate,
                            charges: Math.round((parseFloat(elem.rate) + (parseFloat(elem.rate) * (setting.result.dhlPercentage / 100)) + setting.result.dhlOffset) / 5) * 5,
                            id: parseInt(CONSTANTS['id_mapping'][elem.service.toString()]),
                            currency: elem.currency,
                            guaranteed: elem.delivery_days ? elem.GuaranteedDaysToDelivery : '',
                            type: 'DHL'
                        })
                    }
                }
            })
            callback({
                status: true,
                code: 200,
                msg: 'dhl shipping methods fetched.',
                result: shippings.sort((a, b) => a.charges - b.charges),
                raw: response
            })
        })
    }, error => {
        err = JSON.stringify(error.error.error.message)
        slack(`File: utilities.js, \nAction: authenticateUser, \nError ${err}  \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(error);
        callback({
            status: false,
            code: 400,
            msg: error.error.error.message,
            result: []
        })
    });
}
exports.getDHLShippingsOld = function (data, callback) {
    let parcels = []
    let totalWeight = 0
    data.packages.forEach(elem => {
        elem.weight = elem.weight / 2.205
        totalWeight = totalWeight + elem.weight
        parcels.push({
            // "description": "Automotive Parts",
            "box_type": "custom",
            "weight": {
                "value": parseFloat(elem.weight),
                "unit": "kg"
            },
            "dimension": {
                "width": parseFloat(elem.width),
                "height": parseFloat(elem.height),
                "depth": parseFloat(elem.length),
                "unit": "in"
            },
            "items": [
                {
                    "description": randtoken.generate(16),
                    "origin_country": "USA",
                    "quantity": 1,
                    "price": {
                        "amount": parseFloat(elem.valueAmount) || 5000,
                        "currency": "USD"
                    },
                    "weight": {
                        "value": parseFloat(elem.weight),
                        "unit": "kg"
                    },
                    // "sku": "PS4-2015"
                }
            ]
        })
    })
    let body = {
        "async": false,
        "shipper_accounts": [
            {
                "id": "5f9e97f1-6fc5-4331-b007-3d88f1f6d4e5"
            }
        ],
        "shipment": {
            "parcels": parcels,
            "ship_from": {
                // "contact_name": "Jon Doe",
                // "street1": "1850 Research Drive",
                "city": "Troy",
                "state": "MI",
                "country": process.env.SHIP_FROM_COUNTRY || "US",
                // "phone": "1234567890",
                // "email": "test@mail.com",
                // "type": "business",
                "postal_code": process.env.SHIP_FROM_ZIP_CODE || "48083",
                // "company_name": "ABC Company",
            },
            "ship_to": {
                // "contact_name": "Mike Carunchia",
                // "street1": "9504 W Smith ST",
                "city": data.ShipCity,
                // "state": "Punjab",
                "postal_code": data.ShipPostalCode,
                "country": data.ShipCountry,
                // "phone": "7657168649",
                // "email": "test@test.test",
                // "type": "residential"
            }
        }
    }
    var options = {
        method: 'POST',
        url: 'https://sandbox-api.postmen.com/v3/rates',
        headers: {
            'content-type': 'application/json',
            'postmen-api-key': '3a41afe1-2d82-4a33-bab6-3df2478a5e9d'
        },
        body: JSON.stringify(body)
    };
    try {
        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var shippings = []
            JSON.parse(body).data.rates.forEach(elem => {
                if (elem.service_name) {
                    shippings.push({
                        service: CONSTANTS['default_services'][elem.service_name.toString()],
                        // charges: parseFloat(basePrice) + parseFloat(fuelPrice),
                        charges: elem.total_charge.amount,
                        id: parseInt(CONSTANTS['id_mapping'][elem.service_name.toString()]),
                        currency: elem.total_charge.currency,
                        guaranteed: elem.GuaranteedDaysToDelivery ? elem.GuaranteedDaysToDelivery : '',
                        type: 'DHL'
                    })
                }
            });
            callback({
                status: true,
                code: 200,
                msg: 'dhl shipping methods fetched.',
                result: shippings,
                raw: JSON.parse(body)
            })
        });
    } catch (error) {
        console.log(error);
        err = JSON.stringify(error.ErrorDescription)
        slack(`File: utilities.js, \nAction: authenticateUser, \nError ${err}  \n 
                    `, 'J.A.R.V.I.S', 'C029PF7DLKE')
        callback({
            status: false,
            code: 400,
            msg: error.ErrorDescription,
            result: []
        })
    }
}

