//API Constants
// var API_URL = ''
// if (window.location.host.indexOf('localhost') > -1) {
//     API_URL = 'http://localhost:3004'; //server URL
// } else if (window.location.host.indexOf('store.intrepidcs.com') > -1) {
//     API_URL = 'https://www.yourbluefuture.com'; //server URL
// } else if (window.location.host.indexOf('dev.yourbluefuture.com') > -1) {
//     API_URL = 'https://dev.yourbluefuture.com'; //production URL
// } else if (window.location.host.indexOf('staging.yourbluefuture.com') > -1) {
//     API_URL = 'https://staging.yourbluefuture.com'; //production URL
// } else if (window.location.host.indexOf('yourbluefuture') > -1) {
//     API_URL = 'https://www.yourbluefuture.com'; //production URL
// }
const API_URL = process.env.REACT_APP_SERVER_URL;

export const CLIENT_KEY_RECAPTCHA = process.env.REACT_APP_CLIENT_KEY_RECAPTCHA;

export const GET_IP = 'https://api.ipify.org/?format=json';
export const PRODUCT_LIST = API_URL + '/api/blue-sky/product-list';
export const PRODUCT_OPTIONS = API_URL + '/api/blue-sky/product-options';
export const CATEGORY_LIST = API_URL + '/api/blue-sky/category-list';
export const UPDATE_ACTIVITY_LOG = API_URL + '/api/blue-sky/save-activily-log-data';
export const payment_gateway = API_URL + '/api/blue-sky/payment-gateway';
export const REGISTER_CUSTOMER = API_URL + '/api/blue-sky/register-customer';
export const UPDATE_CUSTOMER = API_URL + '/api/blue-sky/update-customer';
export const UPDATE_PASSWORD_CUSTOMER = API_URL + '/api/blue-sky/update-password-customer';
export const FORGET_PASSWORD_CUSTOMER = API_URL + '/api/blue-sky/forget-password-customer';
export const CHANGE_PASSWORD_CUSTOMER = API_URL + '/api/blue-sky/change-password-customer';
export const LOGIN_CUSTOMER = API_URL + '/api/blue-sky/login-customer';
export const ORDER_LIST = API_URL + '/api/blue-sky/order-list';
export const GET_ORDER = API_URL + '/api/blue-sky/order/';
export const GET_TAX = API_URL + '/api/blue-sky/calculate-tax-rate';
export const GET_SHIPPING_METHODS = API_URL + '/api/blue-sky/get-available-shipping';
export const PLACE_ORDER = API_URL + '/api/blue-sky/place-order';
export const IMAGE_BASE_URL = API_URL + '/files/images/';
export const REGION_CONTROL = API_URL + '/api/blue-sky/region-control/';
export const TOKEN_CONFIRMATION = API_URL + '/api/blue-sky/token-verification/';
export const MINIMUM_ORDER_TOTAL = 99.99;
export const MAXIMUM_ORDER_TOTAL = 24999.00;





//general constants

export const API_LOGIN = process.env.REACT_APP_AUTHORIZE_API_KEY;
export const API_PUBLIC_KEY = process.env.REACT_APP_AUTHORIZE_PUBLIC_KEY;


export const ENVIR0NMENT = process.env.REACT_APP_ENV;
export const DEV_MODE = !!process.env.REACT_APP_DEV_MODE;


// console.log(API_LOGIN, API_PUBLIC_KEY);

export const Store_Title = 'Intrepid Control Systems';
export const CUSTOMER_COOKIE = 'isccustomer';
export const DATE_FORMAT = 'yyyy/mm/dd';
export const NOT_ALLOWED_COUNTRY_CODES = ['SE', 'ES', 'SI', 'SK', 'RO', 'PT', 'PL', 'NL', 'MT', 'LU', 'LT', 'LV', 'IT', 'IE', 'HU', 'GR', 'DE', 'FR', 'FI', 'EE', 'DK', 'CZ', 'CY', 'HR', 'BG', 'BE', 'AT', 'JP', 'IN', 'KR', 'CN', 'UK', 'GB', 'CU', 'KP', 'IR', 'CH', 'IS', 'LI']
export const IP_STACK_PUBLIC_KEY = process.env.REACT_APP_IP_STACK_PUBLIC_KEY
