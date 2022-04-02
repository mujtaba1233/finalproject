import Payment from 'payment';
import store from '../store';
import {
    cartSubTotal,
    cartTotal
} from '../actions/globalActions';

export const doCartMath = function (cartItems, tax = 0, shipping = 0) {
    const total = cartItems.reduce((prev, next) => prev + ((next.ProductPrice * next.Quantity) - (((next.ProductPrice / 100) * next.Discount) * next.Quantity)), 0);
    store.dispatch(cartSubTotal(total))
    store.dispatch(cartTotal(total + tax + shipping))
}

export const strip = function (html) {
    html = html.toString().trim();
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

export const doLineTotalMath = function (item) {
    return roundTo2Decimals((item.ProductPrice * item.Quantity) - (((item.ProductPrice / 100) * item.Discount) * item.Quantity))
}
export const getOptionIds = function (options) {
    let ids = ''
    if (Object.keys(options).length > 0) {
        Object.keys(options).map(key => {
            if (ids)
                ids = `${ids},${options[key].id}`
            else
                ids = `${options[key].id}`
        })
    }
    // console.log('ids',ids);
    return ids
}
export const parseOptions = function (options) {
    if (Object.keys(options).length > 0) {
        return JSON.stringify(options)
    }
    return '';
}

export const checkCartForFreeShipping= function () {
    let checkCart = true
    let cart = store.getState().cart
    if(cart)
    {
        if(cart.length>0){
            cart.forEach(elem => {
                if(elem.IsFreeProduct  === 0){
                    checkCart = false
                }
            });
        }
    }
    return checkCart
}

export const roundTo2Decimals = (number = 0.00) => {
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return parseFloat(formatter.format(number).replace(',',''))
    // return Math.round((number + Number.EPSILON) * 100) / 100
}
export const parseFreeAccessoriesForView = function (product, products) {
    var array = []
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
            if ( products[i].ProductCode && accessory && accessory.code && accessory.code.toLowerCase() ===  products[i].ProductCode.toLowerCase()) {
                freeProducts.push(JSON.parse(JSON.stringify(products[i])));
                freeProducts[freeProducts.length - 1].Quantity = accessory.qty;
                freeProducts[freeProducts.length - 1].ProductCode = accessory.code;
                freeProducts[freeProducts.length - 1].ProductName = products[i].ProductName;
                break;
            }
        }
    }
    return freeProducts;
}
export const parseFreeAccessories = function (product, products) {
    var array = []
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
                freeProducts[freeProducts.length - 1].parent = product.ProductCode;
                freeProducts[freeProducts.length - 1].Quantity = !isNaN(accessory.qty) ? product.Quantity * parseInt(accessory.qty) : product.Quantity * 1;
                freeProducts[freeProducts.length - 1].ProductDescriptionShort = freeProducts[freeProducts.length - 1].ProductDescriptionShort; //.replace(/style="[^"]*"/g, "");
                freeProducts[freeProducts.length - 1].ProductPrice = 0;
                freeProducts[freeProducts.length - 1].isChild = true;
                break;
            }
        }
    }
    return freeProducts;
}

//payment form validations
function clearNumber(value = '') {
    return value.replace(/\D+/g, '');
}

export function formatCreditCardNumber(value) {
    if (!value) {
        return value;
    }

    const issuer = Payment.fns.cardType(value);
    const clearValue = clearNumber(value);
    let nextValue;

    switch (issuer) {
        case 'amex':
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10,)} ${clearValue.slice(10, 15)}`;
            break;
        case 'dinersclub':
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10,)} ${clearValue.slice(10, 14)}`;
            break;
        default:
            nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8,)} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
            break;
    }
    return nextValue.trim();
}

export function formatCVC(value, prevValue, allValues = {}) {
    const clearValue = clearNumber(value);
    let maxLength = 4;

    if (allValues.number) {
        const issuer = Payment.fns.cardType(allValues.number);
        maxLength = issuer === 'amex' ? 4 : 3;
    }
    return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
    const clearValue = clearNumber(value);
    if (clearValue.length >= 3) {
        return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
    }

    return clearValue;
}
export function limitChar(content, length, tail) {
    if (isNaN(length))
        length = 50;

    if (tail === undefined)
        tail = "...";

    if (content && content.length <= length) {
        return content;
    } else {
        return String(content).substring(0, length - tail.length) + tail;
    }
};