import { http } from "../http";
import {
	LOGIN_API,
	SAVE_EXTERNAL_QUOTE,
	GET_USER_BY_MAIL_API,
	GET_QUOTES_API,
	REGISTER_API,
	PROFILE_API,
	COUNTRIES_API,
	GET_PRODUCTS_API,
	GET_QUOTE_API,
} from "../constants";
import { getUser } from "../../helpers/utility";


export const getQuotes = async (data) => {
	return http.post(LOGIN_API, data);
};
export const countries = async () => {
	return http.get(COUNTRIES_API);
};
export const listProducts = async () => {
	return http.get(GET_PRODUCTS_API);
};
export const getListQuotes = async () => {
	return http.get(GET_QUOTES_API + "/" + getUser().id);
};
export const saveQuote = async (data) => {
	return http.post(SAVE_EXTERNAL_QUOTE,data);
};
export const getQuote = async (QuoteId) => {
	return http.get(GET_QUOTE_API+ "/" + QuoteId);
};
export const removeQuote = async (QuoteId) => {
	return http.delete(GET_QUOTE_API+ "/" + QuoteId);
};