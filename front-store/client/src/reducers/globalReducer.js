import {
    CART_SUB_TOTAL,
    CART_TOTAL,
    IS_LOGGED_IN,
    TOTAL_SHIPPING,
    TOTAL_TAX,
    IS_UPDATED,
    ORDER_ERROR,
    PASSWORD_UPDATE_STATUS,
    IN_PROCESS,
    TAX_ERROR,
    TAX_RATE,
    TAX_RESPONSE,
    SHIPPING_METHODS,
    ORDER_ERRORED,
    CART_ACCESS,
    ORDER_PLACED,
    REGION_FAILED
} from "../helpers/actionConstants";

export default function product(state = {
    cartSubTotal: '',
    cartTotal: '',
    totalShipping: 0,
    totalTax: 0,
    isLoggedIn: '',
    isUpdated: false,
    inProcess: false,
    orderError: {},
    passwordUpdateStatus: {},
    taxRate: 0.00,
    taxError: {},
    taxResponse: {},
    shippingMethods: [],
    orderPlaced: false,
    cartAccess: false,
    regionFaild: false,
    orderPlaceError: {},
}, action) {
    switch (action.type) {
        case ORDER_ERRORED:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    orderPlaceError: action.payload
                };
            }
        case ORDER_PLACED:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    orderPlaced: action.payload
                };
            }
        case SHIPPING_METHODS:
            {
                return {
                    ...state,
                    shippingMethods: action.payload
                };
            }
        case TAX_ERROR:
            {
                return {
                    ...state,
                    taxError: action.payload
                };
            }
        case TAX_RATE:
            {
                return {
                    ...state,
                    taxRate: action.payload
                };
            }
        case TAX_RESPONSE:
            {
                return {
                    ...state,
                    taxResponse: action.payload
                };
            }
        case CART_SUB_TOTAL:
            {
                return {
                    ...state,
                    cartSubTotal: action.payload
                };
            }
        case CART_TOTAL:
            {
                return {
                    ...state,
                    cartTotal: action.payload
                };
            }
        case IS_LOGGED_IN:
            {
                return {
                    ...state,
                    isLoggedIn: action.payload
                };
            }
        case TOTAL_SHIPPING:
            {
                return {
                    ...state,
                    totalShipping: action.payload
                };
            }
        case TOTAL_TAX:
            {
                return {
                    ...state,
                    totalTax: action.payload
                };
            }
        case IS_UPDATED:
            {
                return {
                    ...state,
                    isUpdated: action.payload
                };
            }
        case ORDER_ERROR:
            {
                return {
                    ...state,
                    orderError: action.payload
                };
            }
        case PASSWORD_UPDATE_STATUS:
            {
                return {
                    ...state,
                    passwordUpdateStatus: action.payload
                };
            }
        case IN_PROCESS:
            {
                return {
                    ...state,
                    inProcess: action.payload
                };
            }
        case CART_ACCESS:
            {
                return {
                    ...state,
                    cartAccess: action.payload
                };
            }
        case REGION_FAILED:
            {
                return {
                    ...state,
                    regionFaild: action.payload
                };
            }
        default:
            {
                if (action.type.indexOf('@@') === -1) {
                    // console.log('case not handled in product reducer: ', action.type);
                }
            }
    }
    return state;
}