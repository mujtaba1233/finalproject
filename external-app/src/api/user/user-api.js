
import { http } from "../http";
import { LOGIN_API,VERIFY_TOKEN, GET_USER_BY_MAIL_API, REGISTER_API, PROFILE_API, SET_PASSWORD, RECOVER_PASSWORD, LOGIN_WITH_GOOGLE } from "../constants";

export const login = async (data) => {
    return http.post(LOGIN_API, data)
}
export const setPassword = async (data) => {
    return http.post(SET_PASSWORD,{data})
}
export const verifyToken = async (data) => {
    return http.post(VERIFY_TOKEN,data)
}
export const recoverPassword = async (data) => {
    return http.post(RECOVER_PASSWORD,data)
}
export const googleAuth = async (data) => {
    return http.post(LOGIN_WITH_GOOGLE,data)
}

//not in use yet
export const profile = async () => {
    return http.get(PROFILE_API)
}
export const profileUpdate = async (data) => {
    return http.put(PROFILE_API, data)
}
export const getProfileByEmail = async (data) => {
    return http.post(GET_USER_BY_MAIL_API, data)
}
export const register = async (data) => {
    return http.post(REGISTER_API, data)
}
export const confirmSignUp = async (token) => {
    return http.get(REGISTER_API + '/' + token)
}