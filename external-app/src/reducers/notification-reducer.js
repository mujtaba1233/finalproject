import { NOTIFICATION, NOTIFICATIONS } from "../helpers/constants";

export default function event(state = {
    notification: {},
    notifications: [],
}, action) {
    switch (action.type) {
        case NOTIFICATION: //on load api call response will store here
            {
                // console.log(action.payload)
                return { ...state, notification: action.payload };
            }
        case NOTIFICATIONS: //on load api call response will store here
            {
                console.log('+++++')
                if (action.payload.constructor.name === "Array") {
                    console.log(action.payload)
                    return { ...state, notifications: action.payload }
                }
                return {
                    ...state, notifications: [
                        ...state.notifications.slice(0, 0),
                        action.payload,
                        ...state.notifications.slice(0)
                    ]
                };
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