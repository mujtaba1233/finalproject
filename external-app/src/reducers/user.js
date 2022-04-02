import { LOGIN_RES, USER_RES, REGISTER_RES, LOGIN_MESSAGE, REGISTER_FAIL, IS_LOGIN, RESET_USER, CONFIRM_SIGNUP_RES, COUNTRIES, PRODUCTS, QUOTES, QUOTE } from "../helpers/constants";

export default function user(state = {
    user: {},
    publicUser: {},
    loginMessage: '',
    confirmSignUpMessage: '',
    isLoggedIn: false,
    registerMessage: '',
    isRegistered: '',
    cards: [],
    notConfirm: true,
    countries: '',
    quotes: [],
    quote:{},
    products:[]
}, action) {
    switch (action.type) {
        case LOGIN_RES:
            {
                return { ...state, user: action.payload };
            }
        case USER_RES:
            {
                console.log(action.payload)
                return { ...state, publicUser: action.payload };
            }
        case REGISTER_RES:
            {
                return { ...state, registerMessage: action.payload, isRegistered: true };
            }
        case IS_LOGIN:
            {
                if (action.payload) {
                    return { ...state, isLoggedIn: action.payload };
                } else {
                    return { state: {}, isLoggedIn: action.payload };

                }
            }
        case REGISTER_FAIL:
            {
                return { ...state, registerMessage: action.payload, isRegistered: false };
            }
        case LOGIN_MESSAGE:
            {
                return { ...state, loginMessage: action.payload };
            }
        case RESET_USER:
            {
                return {
                    user: {},
                    loginMessage: '',
                    isLoggedIn: '',
                    registerMessage: '',
                    isRegistered: '',
                };
            }
        case CONFIRM_SIGNUP_RES:
            {
                console.log(action.payload)
                return { ...state, confirmSignUpMessage: action.payload, notConfirm: action.notConfirm };
            }
        case COUNTRIES:
            {
                console.log(action.payload)
                return { ...state, countries: action.payload };
            }
        case PRODUCTS:
            {
                // console.log(action.payload)
                return { ...state, products: action.payload };
            }
        case QUOTES:
            {
                // console.log('QUOTES',action.payload)
                return { ...state, quotes: action.payload || [] };
            }
        case QUOTE:
            {
                console.log(action.payload)
                return { ...state, quote: action.payload || [] };
            }
        default:
            {
                if (action.type.indexOf('@@') === -1) {
                    // console.log('case not handled in reducer: ', action.type);
                }
            }
    }
    return state;
}