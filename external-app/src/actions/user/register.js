import { REGISTER_RES, REGISTER_FAIL, RESET_USER, CONFIRM_SIGNUP_RES } from '../../helpers/constants';
import { register, confirmSignUp } from '../../api/user/user-api';
require('es6-promise').polyfill();

export function RegisterAction(data) {
    return async function (dispatch) {
        dispatch({
            type: RESET_USER,
            payload: true
        });
        const res = await register(data)
        // console.log(res);
        if (!res.data.data.error) {
            dispatch({
                type: REGISTER_RES,
                payload: res.data.data.message
            });
        } else {
            dispatch({
                type: REGISTER_FAIL,
                payload: res.data.data.message
            });
        }
    };
}
export function ConfirmSignUpAction(token) {
    return async function (dispatch) {
        const res = await confirmSignUp(token)
        // console.log(res);
        if (!res.data.data.error && res.data.data.code === 205) {
            dispatch({
                type: CONFIRM_SIGNUP_RES,
                payload: res.data.message,
                notConfirm: false
            });
        } else if (!res.data.data.error) {
            dispatch({
                type: CONFIRM_SIGNUP_RES,
                payload: res.data.message,
                notConfirm: true
            });
        } else {
            console.log(res);
        }
    };
}