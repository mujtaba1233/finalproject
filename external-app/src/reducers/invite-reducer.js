import { GET_INVITE_RES } from "../helpers/constants";

export default function invite(state = {
    invite: {},
}, action) {
    switch (action.type) {
        case GET_INVITE_RES: //on load api call response will store here
            {
                return { ...state, invite: action.payload };
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
