import {
    REGISTER_CUSTOMER,
    LOGIN_CUSTOMER,
    UPDATE_CUSTOMER,
    UPDATE_PASSWORD_CUSTOMER,
    CUSTOMER_COOKIE,
    FORGET_PASSWORD_CUSTOMER,
    CHANGE_PASSWORD_CUSTOMER,
    TOKEN_CONFIRMATION,
    GET_IP,
    UPDATE_ACTIVITY_LOG
} from '../helpers/constants';
import axios from 'axios';
import {
    IS_UPDATED, LOGGED_IN_CUSTOMER, REGISTER_CUSTOMER_RES, PASSWORD_UPDATE_STATUS, IN_PROCESS, TOKEN_VERIFICATION
} from '../helpers/actionConstants';
import { setCookie } from '../helpers/cookie-helper';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function saveRecord(userData) {
    return function (dispatch) {
        var data = JSON.stringify(userData);
        data = JSON.parse(data);
        axios.post(UPDATE_ACTIVITY_LOG, data).then(function (response) {
            // console.log(response);
            // dispatch({
            //     type: REGISTER_CUSTOMER_RES,
            //     payload: response.data
            // });
            // dispatch({
            //     type: IN_PROCESS,
            //     payload: false
            // });
        }).catch(function (error) {
            console.log(error);
        });
    };
}
export function customerRegister(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(REGISTER_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: REGISTER_CUSTOMER_RES,
                payload: response.data
            });
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function customerUpdate(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(UPDATE_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: LOGGED_IN_CUSTOMER,
                payload: response.data
            });
            dispatch({
                type: IS_UPDATED,
                payload: true
            })
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
            setCookie(CUSTOMER_COOKIE, response.data)
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function customerPasswordChange(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(UPDATE_PASSWORD_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: response.data
            });
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}
export function forgotPasswordUpdated(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(CHANGE_PASSWORD_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: response.data
            });
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}
export function customerForgetPassword(customer) {
    console.log(customer, "this is function")
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(FORGET_PASSWORD_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: PASSWORD_UPDATE_STATUS,
                payload: response.data
            });
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}


export function setCustomerFromCookie(customer) {
    return function (dispatch) {
        dispatch({
            type: LOGGED_IN_CUSTOMER,
            payload: customer
        });
    }
}

export function customerLoggedIn(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        delete data.confirmPassword;
        axios.post(LOGIN_CUSTOMER, data).then(function (response) {
            // console.log(response);
            dispatch({
                type: LOGGED_IN_CUSTOMER,
                payload: response.data
            });
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}
export function tokenVerification(customer) {
    return function (dispatch) {
        var data = JSON.stringify(customer);
        data = JSON.parse(data);
        // console.log(data,"this is token")
        axios.post(TOKEN_CONFIRMATION, data).then(function (response) {
            // console.log(response);
            if (response.data.status && response.data.code === 200) {
                dispatch({
                    type: TOKEN_VERIFICATION,
                    payload: true
                });
            } else {
                dispatch({
                    type: TOKEN_VERIFICATION,
                    payload: false
                });
            }
            dispatch({
                type: IN_PROCESS,
                payload: false
            });
        }).catch(function (error) {
            console.log(error);
        });
    };
}