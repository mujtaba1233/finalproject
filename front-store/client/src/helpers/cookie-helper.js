import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const getCookie = function (key = 'cookieName', parse = false) {
    let options = {}
    if(parse){
        options.doNotParse = false
    }else{
        options.doNotParse = true
    }
    return cookies.get(key,options)
}

export const setCookie = function (key = 'cookieName', data = 'Cookie Data', options = {}) {
    if(window.location.protocol.toLowerCase() === "https:"){
        options.secure = true
    }
    if(!options.maxAge){
        options.maxAge = 60 * 60 * 24 * 15 // sec * minutes * hours * days * year
    }
    options.path = '/'
    cookies.set(key, data, options);
}

export const removeCookie = function (key = 'cookieName', options = {}) {
    if(window.location.protocol.toLowerCase() === "https:"){
        options.secure = true
    }
    options.path = '/'
    cookies.remove(key, options);
}