var assert = require("assert");
var Api = require(process.env.src_root + "/api.js");
var auth_config = require(process.env.config_root + "/auth.json")

var thorough_test = false;

describe('object', function(){
    it('should initialize', function(){
        var api = new Api(auth_config);
    })
    it('should default to sandbox mode', function(){
        var api = new Api(auth_config);
        assert.equal(api.mode, "sandbox");
        assert.equal(api.api.hosts.default, "wwwcie.ups.com/json", "sandbox mode expects this url")
    })
    it('should default hosts to use ssl', function(){
        var api = new Api(auth_config);
        assert.equal(api.api.defaults.ssl, true)
    })
    it('should create authentication object accurately', function(){
        var api = new Api(auth_config);
        var auth_data = api.authentication.UPSSecurity;
        assert.equal(auth_data.UsernameToken.Username, auth_config.username);
        assert.equal(auth_data.UsernameToken.Password, auth_config.password);
        assert.equal(auth_data.ServiceAccessToken.AccessLicenseNumber, auth_config.access_key);
    })
    it('should complain if config components not defined - no config', function(){
        try{
            var api = new Api();
            throw new Error("should not reach here");
        } catch (err){
            assert.equal(err.message, "config is required");
        }
    })
    it('should complain if config components not defined - username', function(){
        try{
            var api = new Api({});
            throw new Error("should not reach here");
        } catch (err){
            assert.equal(err.message, "username is required");
        }
    })
    it('should complain if config components not defined - password', function(){
        try{
            var api = new Api({username : "test"});
            throw new Error("should not reach here");
        } catch (err){
            assert.equal(err.message, "password is required");
        }
    })
    it('should complain if config components not defined - access_key', function(){
        try{
            var api = new Api({username : "test", password : "test"});
            throw new Error("should not reach here");
        } catch (err){
            assert.equal(err.message, "access_key is required");
        }
    })
})
describe('requests', function(){
    it('should be able to get error for no shipment', async function(){
        if(!thorough_test) this.skip();
        var api = new Api(auth_config);
        var response = await api.post("/Rate");
        assert.equal(typeof response['Fault'], "object");
    })
    it('should be able to get data for basic shipment - Rate', async function(){
        if(!thorough_test) this.skip();
        var api = new Api(auth_config);
        var basic_shipment = {
            "RateRequest": {
                "Request": {
                    "RequestOption": "Rate",
                },
                "Shipment": {
                    "Shipper": {
                        "Address": {
                            "PostalCode": "46280",
                            "CountryCode": "US"
                        }
                    },
                    "ShipTo": {
                        "Address": {
                            "PostalCode": "46280",
                            "CountryCode": "US"
                        }
                    },
                    "Service": {
                        "Code": "03",
                    },
                    "Package": {
                        "PackagingType": {
                            "Code": "00"
                        },
                        "Dimensions": {
                            "UnitOfMeasurement": {
                                "Code": "IN",
                            },
                            "Length": "5",
                            "Width": "4",
                            "Height": "3"
                        },
                        "PackageWeight": {
                            "UnitOfMeasurement": {
                                "Code": "Lbs",
                            },
                            "Weight": "1"
                        }
                    }
                }
            }
        }
        var response = await api.post("/Rate", basic_shipment);
        assert.equal(typeof response["RateResponse"], "object");
    })
    it('should be able to get data for basic shipment - Shop', async function(){
        if(!thorough_test) this.skip();
        var api = new Api(auth_config);
        var basic_shipment = {
            "RateRequest" : {
                "Request": {
                    "RequestOption": "Shop"
                },
                "Shipment": {
                    "Shipper": {
                        "Address": {
                            "CountryCode": "US",
                            "PostalCode": "42512"
                        }
                    },
                    "ShipTo": {
                        "Address": {
                            "CountryCode": "US",
                            "PostalCode": "42512"
                        }
                    },
                    "Package": {
                        "PackagingType": {
                            "Code": "00"
                        },
                        "PackageWeight": {
                            "Weight": "21",
                            "UnitOfMeasurement": {
                                "Code": "LBS"
                            }
                        },
                        "Dimensions": {
                            "Length": "2",
                            "Width": "2",
                            "Height": "2",
                            "UnitOfMeasurement": {
                                "Code": "IN"
                            }
                        }
                    }
                }
            }
        };
        var response = await api.post("/Rate", basic_shipment);
        assert.equal(typeof response["RateResponse"], "object");
    })
})
