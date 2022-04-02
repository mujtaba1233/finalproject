import { COUNTRIES, LOGIN_RES, PRODUCTS, QUOTE, QUOTES, USER_RES } from '../../helpers/constants';
import { profile, getProfileByEmail, profileUpdate } from '../../api/user/user-api';
import { logout, setUser, toast } from '../../helpers/utility';
import { countries, listProducts, getListQuotes, saveQuote, getQuote, removeQuote } from '../../api/quote/quote-api';
import store from '../../store';
require('es6-promise').polyfill();

export function GetQuotesAction() {
    return async function (dispatch) {
        const res = await profile()
        // console.log(res);
        if (!res.data.data.error) {
            dispatch({
                type: LOGIN_RES,
                payload: res.data.data.user
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function SaveQuotesAction() {
    return async function (dispatch) {
        const res = await profile()
        // console.log(res);
        if (!res.data.data.error) {
            dispatch({
                type: LOGIN_RES,
                payload: res.data.data.user
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function GetCountries() {
    return async function (dispatch) {
        const res = await countries()
        console.log(res);
        if (!res.data.data.error) {
            dispatch({
                type: COUNTRIES,
                payload: res.data.data
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function GetProducts() {
    return async function (dispatch) {
        const res = await listProducts()
        // console.log(res);
        if (!res.data.error) {
            dispatch({
                type: PRODUCTS,
                payload: res.data
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function GetQuotesList() {
    return async function (dispatch) {
        const res = await getListQuotes()
        console.log(res);
        if (res.data.status) {
            dispatch({
                type: QUOTES,
                payload: res.data.data
            });
        } else {
            console.log(res.data.msg, 'error');
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}

export function GetQuote(QuoteId) {
    return async function (dispatch) {
        const res = await getQuote(QuoteId)
        console.log("quote: ", res.data.quote);

        if (res.data.status) {
            dispatch({
                type: QUOTE,
                payload: res.data.quote
            });
        } else {
            toast(res.data.msg, 'error');
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function RemoveQuote(QuoteId) {
    return async function (dispatch) {
        const res = await removeQuote(QuoteId)
        console.log("quote: ", res.data.quote);
        if (res.data.status) {
            toast(res.data.msg, 'success');
            store.dispatch(GetQuotesList())
            // dispatch(GetQuotesList())
        } else {
            toast(res.data.msg, 'error');
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}

export function SaveExternalQuote(data) {
    return async function (dispatch) {
        const res = await saveQuote(data)
        if (!res.data.error) {
            dispatch({
                type: QUOTES,
                payload: res.data
            });
            toast(res.data.msg)
        } else {
            toast(res.data.error, "error")
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}