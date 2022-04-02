import { CREATE_PARTNER_RES,EVENT_PARTNERS } from "../helpers/constants";

export default function event(state = {
    partner: {},
    partners: [],
}, action) {
    switch (action.type) {
        case CREATE_PARTNER_RES: //on load api call response will store here
            {
                return { ...state, partner: action.payload };
            }
        case EVENT_PARTNERS: //on load api call response will store here
            {
                if(action.payload.constructor.name === "Array"){
                    return { ...state, partners:action.payload}
                }
                return { ...state, partners: [...state.partners, action.payload] };
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
