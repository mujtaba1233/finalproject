import { CREATE_TOPIC_RES,LIST_TOPIC_RES,SEARCH_TOPIC_RES } from "../helpers/constants";

export default function topic(state = {
    topic: {},
    topics:[],
    searchTopics:[]
}, action) {
    switch (action.type) {
        case CREATE_TOPIC_RES: //on load api call response will store here
            {
                return { ...state, topic: action.payload };
            }
            case LIST_TOPIC_RES: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, topics: action.payload }
                }
                return { ...state, topics: [...state.topics, action.payload] };
            }
            case SEARCH_TOPIC_RES: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, searchTopics: action.payload }
                }
                return { ...state, searchTopics: [...state.searchTopics, action.payload] };
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