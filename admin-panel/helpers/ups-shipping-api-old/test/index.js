
// define root dir
process.env.root = __dirname + "/../src"; // define as root to keep uniform to what content in src will expect
process.env.src_root = __dirname + "/../src";
process.env.config_root = __dirname + "/_config";


var assert = require("assert");
var UPS = require("./../src/index.js");
var auth_config = require(process.env.config_root + "/auth.json")

describe('builder', function(){
    require("./builder")
})
describe('api', function(){
    require("./api")
})

var thorough_test = false; // true if you want to hit the UPS endpoint

describe('interface', function(){
    describe('initialization', function(){
        it('should initialize', function(){
            var ups = new UPS(auth_config);
        })
        it('should not mutate original config object', function(){
            var orig_config = JSON.stringify(auth_config);
            var ups = new UPS(auth_config);
            var new_config = JSON.stringify(auth_config);
            assert.equal(orig_config, new_config);
        })
        it('should initialize with imperial units by default', function(){
            var ups = new UPS(auth_config);
            assert.equal(ups.unit_system, "imperial");
        })
        it('should be possible to change unit system to metric', function(){
            var config = Object.assign({},{unit_system : "metric"}, auth_config);
            var ups = new UPS(config);
            assert.equal(ups.unit_system, "metric");
        })
        it('should not be possible to change unit system to random value', function(){
            try{
                var ups = new UPS(Object.assign({},{unit_system : "asfasdf"}, auth_config));
                throw new Error("should not reach here");
            } catch (err){
                assert.equal(err.message, "unit_system is invalid")
            }
        })
    })
    describe('retreive_rates', function(){
        it('should be able to retreive rates', async function(){
            if(!thorough_test) this.skip();
            var ups = new UPS(Object.assign({}, {live:true}, auth_config)); // use live mode, since takes forever with sandbox server
            var test_shipment = {
                shipper : {
                    address : {
                        country_code : "US",
                        postal_code : 42512,
                    },
                },
                ship_to : {
                    address : {
                        country_code : "US",
                        postal_code : 42512,
                    },
                },
                package : {
                    weight : 21, // the weight of the package
                    dimensions : {
                        length : 2,
                        width : 2,
                        height : 2,
                    }
                }
            }
            var rates = await ups.retreive_rates(test_shipment);
            assert(Array.isArray(rates));
        })
    })
})
