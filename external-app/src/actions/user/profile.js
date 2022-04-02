import { LOGIN_RES, USER_RES } from '../../helpers/constants';
import { profile, getProfileByEmail, profileUpdate } from '../../api/user/user-api';
import { logout, setUser } from '../../helpers/utility';
require('es6-promise').polyfill();

export function GetProfileAction() {
    return async function (dispatch) {
        const res = await profile()
        // console.log(res);
        if (!res.data.data.error) {
            dispatch({
                type: LOGIN_RES,
                payload: res.data.data.user
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}
export function GetUserByEmailAction(data) {
    // console.log(data);
    return async function (dispatch) {
        const res = await getProfileByEmail(data)
        // console.log(res.data.data);
        if (!res.data.data.error) {
            // console.log(res.data.data)
            if (!res.data.data.user) {
                dispatch({
                    type: USER_RES,
                    payload: res.data.data
                });
            } else {
                dispatch({
                    type: USER_RES,
                    payload: res.data.data.user
                });
            }
        }
        else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
    
}
export function UpdateProfileAction(data) {
    return async function (dispatch) {
        const res = await profileUpdate(data)
        // console.log(res);
        if (!res.data.data.error) {
            setUser(res.data.data.user)
            dispatch({
                type: LOGIN_RES,
                payload: res.data.data.user
            });
        } else {
            console.log(res);
        }
        if(res.data === "Unathorized access"){
            logout()
        }
    };
}