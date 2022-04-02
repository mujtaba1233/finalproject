import { CREATE_SEGMENT_RES, EVENT_SEGMENTS, DELETE_SEGMENTS,EVENT_SEGMENT_List } from "../helpers/constants";

export default function event(state = {
    segment: {},
    segments:[],
    segmentList:[],
    onDelete:{},
}, action) {
    switch (action.type) {
        case CREATE_SEGMENT_RES: //on load api call response will store here
            {
                return { ...state, segment: action.payload };
            }
        case EVENT_SEGMENTS: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, segments: action.payload }
                }
                return { ...state, segments: [...state.segments, action.payload] };
            }
        case EVENT_SEGMENT_List: //on load api call response will store here
            {
                if (action.payload.constructor.name === "Array") {
                    return { ...state, segmentList: action.payload }
                }
                return { ...state, segmentList: [...state.segmentList, action.payload] };
            }
            case  DELETE_SEGMENTS: //on load api call response will store here
            {
                
                return { ...state, onDelete: action.payload };
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