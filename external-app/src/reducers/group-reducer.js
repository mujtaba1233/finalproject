import { CREATE_GROUP_RES, EVENT_GROUPS, DELETE_GROUPS,EVENT_GROUP_List } from "../helpers/constants";

export default function event(state = {
    group: {},
    groups: [],
    onDelete:{},
    groupList:[]
}, action) {
    switch (action.type) {
        case CREATE_GROUP_RES: //on load api call response will store here
            {
                return { ...state, group: action.payload };
            }
        case EVENT_GROUPS: //on load api call response will store here
            {
                if(action.payload.constructor.name === "Array"){
                    return { ...state, groups:action.payload}
                }
                return { ...state, groups: [...state.groups, action.payload] };
            }
        case EVENT_GROUP_List: //on load api call response will store here
            {
                if(action.payload.constructor.name === "Array"){
                    return { ...state, groupList:action.payload}
                }
                return { ...state, groupList: [...state.groups, action.payload] };
            }
            case DELETE_GROUPS: //on load api call response will store here
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