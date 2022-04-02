//Base URL
export const BASE_URL = process.env.REACT_APP_API_SERVER;


//api URL
export const LOGIN_API = BASE_URL + '/api/user/login-auth'
export const SET_PASSWORD = BASE_URL + '/api/user/set-pass'
export const RECOVER_PASSWORD = BASE_URL + '/api/user/forgot-password'
export const VERIFY_TOKEN = BASE_URL + '/api/user/token-verify'
export const LOGIN_WITH_GOOGLE = BASE_URL + '/api/user/google-auth'


export const PROFILE_API = BASE_URL + '/users/profile'
export const GET_USER_BY_MAIL_API = BASE_URL + '/users-byMail'
export const REGISTER_API = BASE_URL + '/register'

export const COUNTRIES_API = BASE_URL + '/api/lookup/country-list'
export const GET_PRODUCTS_API = BASE_URL + '/api/product/list'
export const GET_QUOTES_API = BASE_URL + '/api/external/external/list'
export const SAVE_EXTERNAL_QUOTE = BASE_URL + '/api/external/save-external-quote'
export const GET_QUOTE_API = BASE_URL + '/api/external/external/quote'