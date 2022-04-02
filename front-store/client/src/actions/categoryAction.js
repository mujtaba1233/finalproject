import {
    CATEGORY_LIST
} from '../helpers/constants';
import { FETCH_CATEGORIES } from '../helpers/actionConstants';

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function fetchCategories() {
    return function (dispatch) {
        fetch(CATEGORY_LIST).then((response) => {
            return response.json();
        }).then((data) => {
            dispatch({
                type: FETCH_CATEGORIES,
                payload: data
            });
        }).catch(error => {
            console.log('error', error);
        });
    };
}