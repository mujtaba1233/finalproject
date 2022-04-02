import { EVENT_ORGANIZERS } from "../helpers/constants";

export default function organizer(state = {
    organizer: {},
    organizers: [],
}, action) {
    switch (action.type) {
        
        case EVENT_ORGANIZERS: //on load api call response will store here
            {
                if(action.payload.constructor.name === "Array"){
                    return { ...state, organizers:action.payload}
                }
                return { ...state, organizers: [...state.organizers, action.payload] };
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
