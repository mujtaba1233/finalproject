import { combineReducers } from 'redux';
import user from "./user";
import global from "./global";
import { IS_LOGIN } from '../helpers/constants';
const appReducer = combineReducers({
    user,
    global,
})

const rootReducer = (state, action) => {
    if (action.type === IS_LOGIN) {
        if (!action.payload)
            state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer;