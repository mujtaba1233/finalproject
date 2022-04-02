import { IN_PROCESS, SHOW_RESET_PASSWORD_FORM } from "../helpers/constants";

export default function event(state = {
    inProcess: false,
    showResetPasswordForm:''
}, action) {
    switch (action.type) {
        case IN_PROCESS: //on load api call response will store here
            {
                return { ...state, inProcess: action.payload };
            }
        case SHOW_RESET_PASSWORD_FORM:
            {
                return { ...state, showResetPasswordForm: action.payload };
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