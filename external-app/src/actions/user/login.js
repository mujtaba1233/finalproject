import {
	LOGIN_RES,
	IS_LOGIN,
	FORGET_PASSWORD,
	LOGIN_MESSAGE,
	IN_PROCESS,
	SHOW_RESET_PASSWORD_FORM,
	TO_LOGIN,
	LOGIN_WITH_GOOGLE,
} from "../../helpers/constants";
import { login, recoverPassword, setPassword, verifyToken, googleAuth } from "../../api/user/user-api";
import { setToken, setUser, toast } from "../../helpers/utility";
import { BASE_URL } from "../../api/constants";
require("es6-promise").polyfill();
const Joi = require('@hapi/joi');
const {OAuth2Client} = require('google-auth-library');
const {auth} = require('google-auth-library');

export function LoginAction(data) {

	return async function (dispatch) {
		dispatch({
			type: IN_PROCESS,
			payload: true,
		});
		dispatch({
			type: LOGIN_MESSAGE,
			payload: "",
		});
		const res = await login({ data });
		console.log(res.data.message);
		dispatch({
			type: IN_PROCESS,
			payload: false,
		});
		if (res.data.error || res.data.dbError) {
			toast(res.data.error || res.data.dbError, "error");
		} else if (res.data.is_expire) {
			toast(
				"Password is expired kindly check your mail to reset your password.",
				"error"
			);
		} else if (res.data.isBlocked) {
			toast(
				"Your account is blocked for attempting too many failed attemps. Kindly Check your provided email.",
				"error"
			);
		} else if (res.data.active) {
			if (res.data.usertype === "external") {
				dispatch({
					type: LOGIN_RES,
					payload: res.data,
				});
				dispatch({
					type: IS_LOGIN,
					payload: true,
				});
				dispatch({
					type: LOGIN_MESSAGE,
					payload: "Success",
				});
			} else {
				setUser(res.data);
				var next = window.location.href.split('login?')
				if (next.length == 2 && next[1].indexOf('next') > -1) {
					// console.log('Next Route',next);
					next = next[1].split('next=')[1]
					// console.log('Next Route final',next);
					window.location = BASE_URL + next;
				} else {
					window.location = BASE_URL + "/order-search";
				}
				// window.location = BASE_URL + "/order-search";
			}
		}
	};
}

 export function googleAction(data) {
	return async function (dispatch){
            const schema = Joi.object().keys({
			accessToken:Joi.string().required(),
			email: 	    Joi.string().email({tlds: {allow: false}}).required(),
			familyName: Joi.string().required(),
			givenName:  Joi.string().required(),
			googleId:   Joi.string().max(21).required(),
			imageUrl:   Joi.string().required(),
			name:       Joi.string().required()
		});
		const response  = schema.validate(data);
		if(response.error){
			toast(
				response.error,
				"error"
			);
			return
		}else{
		    const res = await googleAuth({ response });
			if (res.data.error || res.data.dbError) {
				toast(res.data.error || res.data.dbError, "error");
			} else if (res.data.active) {
				if (res.data.usertype === "external") {
					dispatch({
						type: LOGIN_RES,
						payload: res.data,
					});
					dispatch({
						type: IS_LOGIN,
						payload: true,
					});
					dispatch({
						type: LOGIN_MESSAGE,
						payload: "Success",
					});
				} else {
					// return
					await setUser(res.data);
					await setToken(res.data.token)
					var next = window.location.href.split('login?')
					if (next.length == 2 && next[1].indexOf('next') > -1) {
						next = next[1].split('next=')[1]
						window.location = BASE_URL + next;
					} else {
						window.location = BASE_URL + "/order-search";
					}
					// window.location = BASE_URL + "/order-search";	
				}
			}else if (res.data.success === false){
				toast(res.data.message, "error");
			}
			
		}
	};
	
}


export function SetPasswordAction(data) {

	return async function (dispatch) {
		dispatch({
			type: IN_PROCESS,
			payload: true,
		});
		dispatch({
			type: LOGIN_MESSAGE,
			payload: "",
		});
		const res = await setPassword(data);
		if (res.data.status) {
			toast("Password successfully changed");
			setTimeout(() => { window.location = BASE_URL + TO_LOGIN }, 3000)

		}
		else
			toast(res.data.msg, "error");

		dispatch({
			type: IN_PROCESS,
			payload: false,
		});
	};
}

export function VerifyToken(data) {

	return async function (dispatch) {
		dispatch({
			type: IN_PROCESS,
			payload: true,
		});
		dispatch({
			type: LOGIN_MESSAGE,
			payload: "",
		});
		const res = await verifyToken(data);
		console.log(res.data);
		// if(res.data.status)
		dispatch({
			type: SHOW_RESET_PASSWORD_FORM,
			payload: res.data.status,
		});
	};
}

export function RecoverPasswordAction(data) {

	return async function (dispatch) {
		dispatch({
			type: IN_PROCESS,
			payload: true,
		});
		dispatch({
			type: LOGIN_MESSAGE,
			payload: "",
		});
		console.log(data);
		const res = await recoverPassword(data);
		if (res.data.status) toast(res.data.msg);
		else toast(res.data.msg, 'error');
		dispatch({
			type: IN_PROCESS,
			payload: false,
		});
	};
}
