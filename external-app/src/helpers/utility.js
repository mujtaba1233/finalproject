import { notify } from 'react-notify-toast';
import { TOAST_DURATION, TOKEN_COOKIE, PATH_COOKIE, USER_COOKIE, IS_LOGIN, COOKIE_EXPIRE } from './constants';
import cookie from 'react-cookies'
import store from '../store';
import moment from "moment"
import { init } from '../api/http';

export const toast = (message = "Success", type = "success") => {
    let options = {}
    if (type === 'info') {
        type = 'custom'
        options = { background: '#0071BB', text: "#FFFFFF" };
    }
    notify.show(message, type, TOAST_DURATION, options)
}

export const setUser = (data) => {
    console.log(data);
    if (data !== undefined) {
        cookie.save(USER_COOKIE, data, { path: PATH_COOKIE, expires: moment().add(COOKIE_EXPIRE, 's')._d })
    }
}
export const getUser = (data) => {
    return cookie.load(USER_COOKIE)
}
export const setToken = (data) => {
    if (data !== undefined) {
        cookie.save(TOKEN_COOKIE, data, { path: PATH_COOKIE, expires: moment().add(COOKIE_EXPIRE, 's')._d })
        init()
    }
}

export const getToken = () => {
    return cookie.load(TOKEN_COOKIE)
}
export const getTimeZone = () => {
    return /\((.*)\)/.exec(new Date().toString())[1].split(" ").map((n) => n[0]).join("");
}

export const logout = () => {
    cookie.remove(TOKEN_COOKIE, { path: PATH_COOKIE })
    cookie.remove(USER_COOKIE, { path: PATH_COOKIE })
    store.dispatch({ type: IS_LOGIN, payload: false })
    // init()
}

export const parseFreeAccessoriesForView = function (product, products) {
    var array = []
    // console.log(product)
    // console.log(products)
    var freeAccessories = product.FreeAccessories
    if (freeAccessories !== null && freeAccessories !== '') {
        //handle with multiple or single freeAccessories
        var parsed = freeAccessories.split(',');
        for (const elem of parsed) {
            var obj = {};
            obj.qty = elem.match(/\(([^)]+)\)/)[1]
            obj.code = elem.split('(')[0];
            array.push(obj);
        }
    } else {
        return [];
    }
    var freeProducts = [];
    for (const accessory of array) {
        for (var i = 0; i < products.length; i++) {
            if (accessory.code.toLowerCase() === products[i].ProductCode.toLowerCase()) {
                freeProducts.push(JSON.parse(JSON.stringify(products[i])));
                freeProducts[freeProducts.length - 1].Qty = accessory.qty;
                freeProducts[freeProducts.length - 1].ProductCode = accessory.code;
                freeProducts[freeProducts.length - 1].ProductName = products[i].ProductName;
                break;
            }
        }
    }
    return freeProducts;
}