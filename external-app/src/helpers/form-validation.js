import React from 'react';
import validator from 'validator';
import moment from "moment"


export const required = (value,props,component) => {
    // console.log(props);
    if (!value)
        return <span className="error text-danger pt-1">{props.placeholder?props.placeholder.toLowerCase():''} is required</span>
    if (!value.toString().trim().length) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="error text-danger pt-1">{props.placeholder?props.placeholder.toLowerCase():''} is required</span>
    }
};

export const numbers = (value) => {
    var reg = new RegExp(/^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/);
    if (value.toString().trim().length > 1 && !reg.test(value)) {
        // We can return string or jsx as the 'error' prop for the validated Component
        return <span className="error text-danger pt-1">Only positive numbers are allowed</span>
    }
};

export const onlyFuture = (value) => {
    if (!moment(value).isAfter())
        return <span className="error text-danger pt-1">Date can not be set to past.</span>
};
export const gt0 = (value) => {
    if (!parseInt(value) > 0)
        return <span className="error text-danger pt-1">Number should be greater then 0.</span>
};

export const max300 = (value) => {
    console.log(value);
    if (!value && parseInt(value) > 300)
        return <span className="error text-danger pt-1">Max limit is 300</span>
};
export const max100 = (value) => {
    console.log(value);
    if (!value && parseInt(value) > 100)
        return <span className="error text-danger pt-1">Max limit is 100</span>
};
export const max200 = (value) => {
    // console.log(value);
    if (!value && parseInt(value) > 200)
        return <span className="error text-danger pt-1">Max limit is 200</span>
};
export const max15 = (value) => {
    console.log(value);
    if (!value && parseInt(value) > 15)
        return <span className="error text-danger pt-1">Max limit is 300</span>
};
export const email = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (!validator.isEmail(value)) {
        return <span className="error text-danger pt-1">`{value}` is not a valid email.</span>
    }
};

export const max20 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length > 20) {
        return <span className="error text-danger pt-1">Field is too long.</span>
    }
};

export const max2 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length > 2) {
        return <span className="error text-danger pt-1">Field is too long.</span>
    }
};

export const min3 = (value) => {
    if (value.toString().trim().length > 1 && value.toString().trim().length < 3) {
        return <span className="error text-danger pt-1">Field is too short.</span>
    }
};

export const min1 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length < 1) {
        return <span className="error text-danger pt-1">Name is too short.</span>
    }
};

export const min2 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length < 2) {
        return <span className="error text-danger pt-1">Field is too short.</span>
    }
};

export const min8 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length < 8) {
        return <span className="error text-danger pt-1">Password should contain minmum 8 character.</span>
    }
};
export const max2000 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length > 2000) {
        return <span className="error text-danger pt-1">Max charactors limit is 500.</span>
    }
};
export const max50 = (value) => {
    if (!value)
        return <span className="error text-danger pt-1">This field is required.</span>
    if (value.toString().trim().length > 50) {
        return <span className="error text-danger pt-1">Max charactors limit is 50.</span>
    }
};

export const password = (value, props, components) => {
    // (?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
    // /^(?=.*[a-z]).+$/
    // /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/ //Password must include (one uppercase, one lowercase, one special character, one number and should have 10 characters)
    if (!components['password'][0].value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,128}$/)) { // components['password'][0].value !== components['confirm'][0].value
        return <p className="error text-danger pt-1">Password must include (one alphabet, One uppercase letter, One lowercase letter, One number, One Special Character, minimum 8 characters and maximum 128 characters)</p>
    }
    if (components['confirmPassword'][0].value.length > 1 && components['password'][0].value !== components['confirmPassword'][0].value) { // components['password'][0].value !== components['confirm'][0].value
        return <span className="error text-danger pt-1">Password not matched.</span>
    }
};