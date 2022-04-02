import Axios from "axios";
import { CART_SUB_TOTAL, IS_LOGGED_IN, CART_TOTAL, TOTAL_SHIPPING, TOTAL_TAX, IS_UPDATED, CART_ACCESS, CUSTOMER_IP, REGION_FAILED } from "../helpers/actionConstants";
import { CUSTOMER_COOKIE, IP_STACK_PUBLIC_KEY, NOT_ALLOWED_COUNTRY_CODES, REGION_CONTROL } from "../helpers/constants";
import { getCookie } from "../helpers/cookie-helper";
import { IP_STACK_URL } from "../helpers/routesConstants";

export function cartSubTotal(payload) {
  return {
    type: CART_SUB_TOTAL,
    payload: payload
  }
}

export function cartTotal(payload) {
  return {
    type: CART_TOTAL,
    payload: payload
  }
}

export function isLoggedIn(payload) {
  return {
    type: IS_LOGGED_IN,
    payload: payload
  }
}
export function isUpdated(payload) {
  return {
    type: IS_UPDATED,
    payload: payload
  }
}

export function totalShipping(payload) {
  return {
    type: TOTAL_SHIPPING,
    payload: payload
  }
}

export function totalTax(payload) {
  return {
    type: TOTAL_TAX,
    payload: payload
  }
}

export function checkAccess(ip) {
  let customer = {}
  if (getCookie(CUSTOMER_COOKIE, true) && getCookie(CUSTOMER_COOKIE, true).result) {
    customer = getCookie(CUSTOMER_COOKIE, true).result
  }
  // console.log(ip)
  return function (dispatch) {
    return fetch(IP_STACK_URL + IP_STACK_PUBLIC_KEY).then((response) => {
      return response.json();
    }).then(async (data) => {
      dispatch({
        type: CUSTOMER_IP,
        payload: data.ip
      });
      if (data.country_code && !NOT_ALLOWED_COUNTRY_CODES.includes(data.country_code)) {
        dispatch({
          type: CART_ACCESS,
          payload: true
        });
        await Axios.post(REGION_CONTROL, { ...data, isAllowed: true })
      } else {
        await Axios.post(REGION_CONTROL, { ...data, isAllowed: false })
      }
    }).catch(async error => {
      dispatch({
        type: REGION_FAILED,
        payload: true
      });
      await Axios.post(REGION_CONTROL, { isAllowed: false, isBlocked: true, customer })
    });
  };
}
// export function checkAccess(ip) {
//   // console.log(ip)
//   return function (dispatch) {
//     return fetch(REGION_CONTROL + ip).then((response) => {
//       return response.json();
//     }).then((data) => {
//       dispatch({
//         type: CART_ACCESS,
//         payload: data.access_granted
//       });
//     }).catch(error => {
//       console.log('error', error);
//     });
//   };
// }