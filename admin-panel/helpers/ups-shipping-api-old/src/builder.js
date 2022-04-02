/**
    domain knowledge constants
    @const
*/
const constants = {
    units : {
        weight : require("./domain_knowledge/units/weight.json"),
        length : require("./domain_knowledge/units/length.json")
    },
}

/**
    builder object, to be used as:
    @example
        var build = new Builder({...});
        build.package();
        build.address();
    @class
*/
var Builder = function(config){
    this.unit_system = config.unit_system;
}
Builder.prototype = {

    /**
        generates a UPS api ready shipment object
        @param shipment
    */
    shipment : function(shipment){
        /*
            validate endpoint
        */
        if(typeof shipment.shipper == "undefined") throw new Error("shipment.shipper must be defined");
        if(typeof shipment.ship_to == "undefined") throw new Error("shipment.ship_to must be defined");
        if(typeof shipment.package == "undefined") throw new Error("shipment.package must be defined");

        /*
            define mandatory attributes
        */
        var api_ready_shipment = {
            'Shipper': this.endpoint(shipment.shipper),
            'ShipTo': this.endpoint(shipment.ship_to),
            'Package': this.package(shipment.package),
        }

        /*
            return api ready shipment
        */
        return api_ready_shipment;
    },

    /**
        generates a address+names+identification+communication information for a destination or source of a package
        @param package
    */
    endpoint: function (endpoint){
        /*
            validate endpoint
        */
        if(typeof endpoint.address == "undefined") throw new Error("endpoint.address must be defined");

        /*
            define mandatory endpoint attributes
        */
        var api_ready_package_endpoint = {
            'Address' : this.address(endpoint.address),
        }

        /*
            define optional endpoint attributes
        */
        if(typeof endpoint.name == "string") api_ready_package_endpoint["Name"] = endpoint.name;
        if(typeof endpoint.shipping_number == "string") api_ready_package_endpoint["ShippingNumber"] = endpoint.shipping_number;

        /*
            return the endpoint
        */
        return api_ready_package_endpoint;
    },

    /**
        generates a UPS api ready address object
        @param address
    */
    address : function(address){
        /*
            validate address
        */
        if(typeof address.country_code == "undefined") throw new Error("address.country_code must be defined");
        if(typeof address.postal_code == "undefined") throw new Error("address.postal_code must be defined");

        /*
            define mandatory attributes
        */
        var api_ready_address = {
            "CountryCode" : address.country_code,
            "PostalCode" : address.postal_code + "", // cast to string,
        }

        /*
            define optional attributes
        */
        if(Array.isArray(address.lines)) api_ready_address["AddressLine"] = address.lines;
        if(typeof address.city == "string") api_ready_address["City"] = address.city;
        if(typeof address.state == "string") api_ready_address["StateProvinceCode"] = address.state;
        if(typeof address.province == "string") api_ready_address["StateProvinceCode"] = address.province;

        /*
            return api ready address
        */
        return api_ready_address;
    },

    /**
        generates a UPS api ready package object based on user selection
        @param package
    */
    package: function(package){
        /*
            validate package
        */
        if(typeof package.weight == "undefined") throw new Error("package.weight must be defined");
        // if(typeof package.dimensions == "undefined") throw new Error("package.dimensions must be defined");
        // if(typeof package.dimensions.length == "undefined") throw new Error("package.weight.length must be defined");
        // if(typeof package.dimensions.width == "undefined") throw new Error("package.weight.width must be defined");
        // if(typeof package.dimensions.height == "undefined") throw new Error("package.weight.height must be defined");

        /*
            define mandatory components
        */
        var api_ready_package =  {
            'PackagingType' : {
                'Code' : package.packaging_type_code || "00",
            },
            'PackageWeight' : {
                'Weight' : package.weight + "", // cast to string
                'UnitOfMeasurement' : {
                    'Code': constants.units.weight[this.unit_system], // selects weight_unit based on unit_system
                }
            },
            // 'Dimensions' : {
            //     'Length': package.dimensions.length +"", // cast to string
            //     'Width' : package.dimensions.width +"", // cast to string
            //     'Height' : package.dimensions.height +"", // cast to string
            //     'UnitOfMeasurement' : {
            //         'Code' : constants.units.length[this.unit_system], // selects length_unit based on unit_system
            //     }
            // }
        }

        /*
            define optional components
        */
        // TODO - PackageServiceOptions/InsuredValue
        // TODO - PackageServiceOptions/DeliveryConfirmation
        // TODO - ReferenceNumber

        /*
            return the api_ready_package
        */
        return api_ready_package;
    },
}

module.exports = Builder;
