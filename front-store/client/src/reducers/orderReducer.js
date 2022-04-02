import {
    ORDERS,
    ORDER,
    PREPARE_ORDER,
    ORDER_PROCESS,
    ORDER_ERRORED
} from "../helpers/actionConstants";

export default function category(state = {
        orders: [],
        order: {},
        orderToBePlace: {},
        orderProcess: false,
        orderError: {},
        
    },
    action) {
    switch (action.type) {
        case ORDERS:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    orders: action.payload
                };
            }
            case ORDER_ERRORED:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    orderError: action.payload
                };
            }
        case ORDER:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    order: action.payload
                };
            }
        case PREPARE_ORDER:
            {
                localStorage.setItem('orderHash', action.payload);
                return {
                    ...state,
                    orderToBePlace: action.payload
                };
            }
        case ORDER_PROCESS:
            {
                return {
                    ...state,
                    orderProcess: action.payload
                };
            }
        default:
            {
                if (action.type.indexOf('@@') === -1) {
                    // console.log('case not handled in category reducer: ', action.type);
                }

            }
    }
    return state;
}