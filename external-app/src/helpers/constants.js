
// routes constants
export const TO_HOME = '/'
export const TO_LOGIN = '/login'
export const TO_EXTERNAL_LOGIN = '/external-quotes'
export const TO_SET_PASSWORD = '/auth/:token'
export const TO_RECOVER_PASSWORD = '/recover-password'
export const TO_CONFIRM_SIGNUP = "/confirm";
export const TO_QUOTE_LIST = '/quote-list'
export const TO_QUOTE_CREATE = '/quote-create'
export const TO_EMAIL_CONFIRM = '/verify-user/:token'

//action constants
export const USER_RES = 'USER_RES'
export const LOGIN_RES = 'LOGIN_RES'
export const IS_LOGIN = 'IS_LOGIN'
export const REGISTER_RES = 'REGISTER_RES'
export const RESET_USER = 'RESET_USER'
export const LOGIN_MESSAGE = 'LOGIN_MESSAGE'
export const REGISTER_FAIL = 'REGISTER_FAIL'
export const CONFIRM_SIGNUP_RES = 'CONFIRM_SIGNUP_RES'
export const COUNTRIES = 'COUNTRIES'
export const PRODUCTS = 'PRODUCTS'
export const QUOTES = 'QUOTES'
export const QUOTE = 'QUOTE'


export const SHOW_RESET_PASSWORD_FORM = 'SHOW_RESET_PASSWORD_FORM'
export const IN_PROCESS = 'IN_PROCESS'
export const FORGET_PASSWORD = 'FORGET_PASSWORD'


export const CLIENT_KEY_RECAPTCHA = process.env.REACT_APP_CLIENT_KEY_RECAPTCHA;
export const CLIENT_KEY_GOOGLE_LOGIN = process.env.REACT_APP_CLIENT_KEY_GOOGLE_LOGIN;

//site constants
export const TOAST_DURATION = 5000
export const ORIGIN = window.location.origin
export const TOKEN_COOKIE = 'BLUE_SKY_TOKEN'
export const USER_COOKIE = 'user'
export const COOKIE_EXPIRE = 60 * 60
export const PATH_COOKIE = '/'
export const DATE_FORMAT = 'DD-MM-YYYY'
export const TIME_FORMAT = 'hh:mm A'
export const TIME_ZONE = "UTC"


