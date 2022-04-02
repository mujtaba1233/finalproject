import { LOGGED_IN_CUSTOMER,CUSTOMER_IP,REGISTER_CUSTOMER_RES,TOKEN_VERIFICATION } from "../helpers/actionConstants";

export default function category(state = {
        customer: {},
        regiterCustomer: {},
        ip: '',
        tokenVerification:false
    },
    action) {
    switch (action.type) {
        case CUSTOMER_IP:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    ip: action.payload
                };
            }
        case LOGGED_IN_CUSTOMER:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    customer: action.payload
                };
            }
        case REGISTER_CUSTOMER_RES:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    regiterCustomer: action.payload
                };
            }
            case TOKEN_VERIFICATION:
                {
                    // console.log('dispatch in reducer',action.payload);
                    return {
                        ...state,
                        tokenVerification: action.payload
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