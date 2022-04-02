import React from 'react';
import validator from 'validator';
import Payment from 'payment';

export const STATE_LIST = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "American Samoa", code: "AS" },
    { name: "Arizona", code: "AZ" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "District Of Columbia", code: "DC" },
    { name: "Federated States Of Micronesia", code: "FM" },
    { name: "Flornamea", code: "FL" },
    { name: "Georgia", code: "GA" },
    { name: "Guam", code: "GU" },
    { name: "Hawaii", code: "HI" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Northern Mariana Islands", code: "MP" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Palau", code: "PW" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Puerto Rico", code: "PR" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virgin Islands", code: "VI" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" },
]
export const US_STATE_OBJ = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Federated States Of Micronesia": "FM",
    "Fl": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Marshall Islands": "MH",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Palau": "PW",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY",
}
export const required = (value) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="error text-danger">This field is required.</span>
    }
};
export const email = (value) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (!validator.isEmail(value)) {
        return <span className="error text-danger">`{value}` is not a valid email.</span>
    }
};

export const max20 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length > 20) {
        return <span className="error text-danger">Field is too long.</span>
    }
};
export const max16 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length > 16) {
        return <span className="error text-danger">Field is too long.</span>
    }
};
export const max25 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length > 25) {
        return <span className="error text-danger">Field is too long.</span>
    }
};
export const maxZipLength = (value, props) => {
    if (value.toString().trim().length > 16) {
        return <span className="error text-danger">Field is too long.</span>
    }
};
export const phoneFormat = (value, props) => {
    if (!value.match(/^[a-z0-9]+$/i))
        return <span className="error text-danger">Invalid Format.</span>
};
export const max2 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length > 2) {
        return <span className="error text-danger">Field is too long.</span>
    }
};
export const min3 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length < 3) {
        return <span className="error text-danger">Field is too short.</span>
    }
};

export const min1 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length < 1) {
        return <span className="error text-danger">Name is too short.</span>
    }
};
export const min2 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length < 2) {
        return <span className="error text-danger">Field is too short.</span>
    }
};
export const min8 = (value, props) => {
    if (!value)
        return <span className="error text-danger">This field is required.</span>
    if (value.toString().trim().length < 8) {
        return <span className="error text-danger">Password should contain minmum 8 characters.</span>
    }
};

export const password = (value, props, components) => {
    // console.log(value,components);
    if (!components['password'][0].value.match(/^(?=.{8,128})((?=.*[^a-zA-Z\s])(?=.*[a-z])(?=.*[A-Z])|(?=.*[^a-zA-Z0-9\s])(?=.*\d)(?=.*[a-zA-Z])).*$/)) { // components['password'][0].value !== components['confirm'][0].value
        return <span className="error text-danger">Password must include (one alphabet, One uppercase letter, One lowercase letter, One number, One Special Character, minimum 8 characters and maximum 128 characters)</span>
    }
    if (components['password'][0].value !== components['confirmPassword'][0].value) { // components['password'][0].value !== components['confirm'][0].value
        return <span className="error text-danger">Password not matched.</span>
    }
};



//payment card form validation
export const cardNo = (value, props) => {
    // console.log(Payment.getCardArray())
    if (!Payment.fns.validateCardNumber(value)) {
        return <span className="error text-danger">Invalid card number</span>
    }
};
export const validCard = (value, props) => {
    // Payment.setCardArray(['visa'])
    // console.log(Payment.getCardArray())
    var cardno = value.replace(/\s/g, '')
    // console.log(value.replace(/\s/g, ''))
    var AmericanExpressCardno = /^(?:3[47][0-9]{0})/;
    // var VisaCardno = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var VisaCardno = /^(?:4[0-9]{0}(?:[0-9]{0}))/;
    // var MasterCardno = /^(?:5[1-5][0-9]{14})$/;
    var MasterCardno = /^(?:5[1-5][0-9]{0})/;
    if (cardno.length >= 2) {
        if (!cardno.match(AmericanExpressCardno) && !cardno.match(VisaCardno) && !cardno.match(MasterCardno)) {
            return <span className="error text-danger">Card not supported</span>
        }
    }
    if (cardno.match(AmericanExpressCardno)) {
        if (cardno.length > 15) {
            return <span className="error text-danger">American Express card number length is 15 digits</span>
        }
    }
    if (cardno.match(VisaCardno)) {
        if (cardno.length < 16) {
            return <span className="error text-danger">Card number too short</span>
        }
    }
    if (cardno.match(MasterCardno)) {
        if (cardno.length < 16) {
            return <span className="error text-danger">Card number too short</span>
        }
    }
};
export const cardCVC = (value, props, components) => {
    if (!Payment.fns.validateCardCVC(value)) {
        return <span className="error text-danger">Invalid CVC</span>
    }
};
export const cardExpiry = (value, props) => {
    if (!Payment.fns.validateCardExpiry(value)) {
        return <span className="error text-danger">Invalid expiry</span>
    }
};