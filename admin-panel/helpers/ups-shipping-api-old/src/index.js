var Builder = require("./builder");
var Api = require("./api");

/**
    define UPS
    @class
*/
var UPS = function(orig_config){
    // normalize input
    if(typeof orig_config == "undefined") orig_config = {};
    let config = Object.assign({}, orig_config); // redefine config so as to not mutate original config object

    // apply config defaults
    if(typeof config.unit_system != "string") config.unit_system = "imperial";

    // validate config
    if(!["imperial","metric"].includes(config.unit_system)) throw new Error("unit_system is invalid")

    // define options
    this.unit_system = config.unit_system;

    // define build methods
    this.build = new Builder({unit_system : this.unit_system});

    // define the api
    this.api = new Api({live : config.live, username : config.username, password : config.password, access_key:config.access_key});
}

UPS.prototype = {
    /**
        request_rates retreives rates from UPS
        @param shipment - an object describing the shipment that you want rates for
    */
    retreive_rates : function(shipment,callback){
        // 1. build request object
        var request_object = {
            'Request': {
                'RequestOption': 'Shop', // retreive all rates
            },
            'Shipment': this.build.shipment(shipment),
        };

        // 2. send request
        this.api.post("/Rate", {"RateRequest" : request_object},function(err,res,body){
            // console.log(err,body);
            if(err){
                callback(err)
            }else{
                if(body.Fault){
                    callback(body.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode)
                }else{
                    callback(null,body)
                }
            }
        });
        
    },

}


module.exports = UPS;
