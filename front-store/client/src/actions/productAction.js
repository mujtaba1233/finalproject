import {
    PRODUCT_LIST, PRODUCT_OPTIONS
} from '../helpers/constants';
import { FETCH_PRODUCTS, FETCH_PRODUCT_OPTIONS, FETCH_PRODUCT_OPTIONS_ERRORED } from '../helpers/actionConstants';
import axios from 'axios';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function fetchProducts() {
    return function (dispatch) {
        return fetch(PRODUCT_LIST).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch({
                type: FETCH_PRODUCTS,
                payload: data
            });
        }).catch(error => {
            console.log('error', error);
        });
    };
}

export function fetchProductOptions(optionID) {
    return function (dispatch) {
        if(optionID)
        axios.post(PRODUCT_OPTIONS, {
            OptIDs: optionID || ''
        }).then(function (response) {
            // console.log(response);
            if (response.data.status && response.data.code === 200) {
                dispatch({
                    type: FETCH_PRODUCT_OPTIONS,
                    payload: response.data
                });
            } else {
                dispatch({
                    type: FETCH_PRODUCT_OPTIONS_ERRORED,
                    payload: response.data
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
        else
        dispatch({
            type: FETCH_PRODUCT_OPTIONS,
            payload: []
        });

    };
}