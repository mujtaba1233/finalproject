import { FETCH_CATEGORIES } from "../helpers/actionConstants";

export default function category(state = {
        categories: []
    },
    action) {
    switch (action.type) {
        case FETCH_CATEGORIES:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    categories: action.payload
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