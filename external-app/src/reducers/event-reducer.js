import { CREATE_EVENT_RES, EVENT_LIST_RES,EVENT_LOG_ADD, GET_EVENT_USERS, REMOVE_USER_FROM_EVENT_QUEUE, GET_EVENT_GROUPS, EVENT_EXPLORE_LIST_RES, GET_EVENT_LOGS, GET_EVENT_SIMPLE, INVITES_PARTNER_RES, SHOW_MESSAGE, JOIN_EVENT_RES, SAVE_EVENT, DELETE_EVENTLIST, DONT_SHOW_AGAIN, STAY_AT_CALL } from "../helpers/constants";

export default function event(state = {
    event: {},
    events: [],
    exploreEvents: [],
    partnerAndInvitesRes: {},
    joinEventRes: {},
    savedEvent: [],
    showMessage: false,
    stayAtCall: false,
    dontShowItAgain: false

}, action) {
    switch (action.type) {
        case CREATE_EVENT_RES: //on load api call response will store here
            {
                if (Object.keys(action.payload).length === 0) {
                    return { ...state, event: {} };
                }
                return { ...state, event: { ...state.event, ...action.payload, EventLog: state.event.EventLog || [] } };
            }
        case INVITES_PARTNER_RES: //on load api call response will store here
            {
                return { ...state, partnerAndInvitesRes: action.payload };
            }
        case SHOW_MESSAGE: //on load api call response will store here
            {
                return { ...state, showMessage: action.payload };
            }
        case JOIN_EVENT_RES: //on load api call response will store here
            {
                return { ...state, joinEventRes: action.payload };
            }
        case SAVE_EVENT: //on load api call response will store here
            {
                return { ...state, savedEvent: { ...state.savedEvent, ...action.payload } };
            }
        case GET_EVENT_USERS: //on load api call response will store here
            {
                return { ...state, event: { ...state.event, ...action.payload } };
            }
        case GET_EVENT_SIMPLE: //on load api call response will store here
            {
                return { ...state, event: { ...state.event, ...action.payload } };
            }
        case GET_EVENT_LOGS: //on load api call response will store here
            {
                return { ...state, event: { ...state.event, EventLog: action.payload } };
            }
        case EVENT_LOG_ADD: //on load api call response will store here
            {
                console.log({ ...state.event, ...action.payload }, '==========')
                // if (Object.keys(action.payload).length === 0) {
                //     return { ...state, event: {} };
                // }
                return { ...state, event: { ...state.event, EventLog: [...state.event.EventLog, ...action.payload] } };
            }
        case GET_EVENT_GROUPS: //on load api call response will store here
            {
                return { ...state, event: { ...state.event, ...action.payload } };
            }
        case REMOVE_USER_FROM_EVENT_QUEUE: //on load api call response will store here
            {
                let { EventQueue } = state.event
                if (EventQueue) {
                    const index = state.event.EventQueue.findIndex(elem => elem.isAvailable && elem.userId === action.payload.userId);
                    if (index >= 0) {
                        return {
                            ...state, event: {
                                ...state.event, EventQueue: [...state.event.EventQueue.slice(0, index),
                                ...state.event.EventQueue.slice(index + 1)]
                            }
                        }
                    }
                    return { ...state }
                }
                return { ...state };
            }
        case DELETE_EVENTLIST: //on load api call response will store here
            {
                // console.log(action.payload.eventId)
                const index = state.events.findIndex(elem => elem.id === action.payload.eventId);
                console.log(index)
                if (index >= 0) {
                    return {
                        ...state, events: [...state.events.slice(0, index),
                        ...state.events.slice(index + 1)]
                    }
                }
                return {
                    ...state
                }
            }
        case EVENT_LIST_RES: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, events: action.payload }
                }
                return { ...state, events: [...state.events, action.payload] };
            }
        case EVENT_EXPLORE_LIST_RES: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, exploreEvents: action.payload }
                }
                return { ...state, exploreEvents: [...state.exploreEvents, action.payload] };
            }
        case STAY_AT_CALL: //on load api call response will store here
            {
                return { ...state, stayAtCall: action.payload };
            }
        case DONT_SHOW_AGAIN: //on load api call response will store here
            {

                return { ...state, dontShowItAgain: action.payload };
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