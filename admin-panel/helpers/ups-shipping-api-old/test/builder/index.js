var assert = require("assert");
var Builder = require(process.env.src_root + "/builder.js");


describe('object', function(){
    it('should initialize', function(){
        var build = new Builder({unit_system : "imperial"});
    })
})
describe("components", function(){
    describe('address', function(){
        it('should be able to build accurately', function(){
            var build = new Builder({unit_system : "imperial"});
            var orig_address = {
                country_code : "US",
                postal_code : 46280
            };
            var address = build.address(orig_address)
            assert.equal(address["CountryCode"], orig_address.country_code)
            assert.equal(address["PostalCode"], orig_address.postal_code)
        })
        it('should complain if required data is not submitted - country_code', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                var address = build.address({})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "address.country_code must be defined");
            }
        })
        it('should complain if required data is not submitted - postal_code', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                var address = build.address({country_code:"US"})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "address.postal_code must be defined");
            }
        })
    })
    describe('endpoint', function(){
        it('should be able to build accurately', function(){
            var build = new Builder({unit_system : "imperial"});
            var orig_endpoint = {
                address : {
                    "country_code" : "US",
                    "postal_code" : 46280
                },
                name : "a_great_name",
                shipping_number : "optional",
            }
            var endpoint = build.endpoint(orig_endpoint);
            assert.equal(endpoint.Name, orig_endpoint.name);
            assert.equal(endpoint.ShippingNumber, orig_endpoint.shipping_number);
            assert.equal(typeof endpoint.Address, "object");
        })
        it('should complain if required data is not submitted', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.endpoint({})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "endpoint.address must be defined");
            }
        })
    })
    describe('package', function(){
        it('should be able to build accurately', function(){
            var build = new Builder({unit_system : "imperial"});
            var orig_package = {
                weight : 21, // the weight of the package
                dimensions : {
                    length : 2,
                    width : 2,
                    height : 2,
                }
            }
            var package = build.package(orig_package);
            assert.equal(package.PackageWeight.Weight, orig_package.weight);
            assert.equal(package.PackageWeight.UnitOfMeasurement.Code, "LBS");
            assert.equal(package.Dimensions.Length, orig_package.dimensions.length);
            assert.equal(package.Dimensions.Width, orig_package.dimensions.width);
            assert.equal(package.Dimensions.Height, orig_package.dimensions.height);
        })
        it('should complain if required data is not submitted - weight', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.package({})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "package.weight must be defined");
            }
        })
        it('should complain if required data is not submitted - dimensions', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.package({weight:10})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "package.dimensions must be defined");
            }
        })
    })
    describe('shipment', function(){
        it('should be able to build accurately', function(){
            var build = new Builder({unit_system : "imperial"});
            var orig_shipment = {
                shipper : {
                    address : {
                        country_code : "US",
                        postal_code : 42512,
                    },
                    name: "shipper",
                },
                ship_to : {
                    address : {
                        country_code : "US",
                        postal_code : 42512,
                    },
                    name : "shipto",
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
            var shipment = build.shipment(orig_shipment);
            assert.equal(typeof shipment.Shipper, "object");
            assert.equal(typeof shipment.ShipTo, "object");
            assert.equal(typeof shipment.Package, "object");
        })
        it('should complain if required data is not submitted - shipper', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.shipment({})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "shipment.shipper must be defined");
            }
        })
        it('should complain if required data is not submitted - ship_to', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.shipment({shipper:"test"})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "shipment.ship_to must be defined");
            }
        })
        it('should complain if required data is not submitted - package', function(){
            var build = new Builder({unit_system : "imperial"});
            try {
                build.shipment({shipper:"test", ship_to:"test"})
                throw new Error("should not reach here");
            } catch(err){
                assert.equal(err.message, "shipment.package must be defined");
            }
        })
    })
})
