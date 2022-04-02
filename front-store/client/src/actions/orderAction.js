import axios from 'axios';
import {
    ORDER_LIST,
    GET_ORDER,
    GET_TAX,
    GET_SHIPPING_METHODS,
    PLACE_ORDER
} from '../helpers/constants';
import {
    ORDERS,
    ORDER_ERROR,
    ORDER,
    TAX_ERROR,
    TAX_RATE,
    TAX_RESPONSE,
    SHIPPING_METHODS,
    SHIPPING_ERROR,
    IN_PROCESS,
    ORDER_PLACED,
    ORDER_ERRORED,
    ORDER_PROCESS
} from '../helpers/actionConstants';


require('es6-promise').polyfill();
require('isomorphic-fetch');

export function getOrders(customer) {
    return function (dispatch) {
        axios.post(ORDER_LIST, {
            CustomerID: customer.CustomerID
        }).then(function (response) {
            // console.log(response);
            if (response.data.status && response.data.code === 200) {
                dispatch({
                    type: ORDERS,
                    payload: response.data.result
                });
            } else {
                dispatch({
                    type: ORDER_ERROR,
                    payload: response.data
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
}


export function placeOrder(data) {
    return function (dispatch) {
        axios.post(PLACE_ORDER, data).then(function (response) {
            console.log('order place response', response);
            dispatch({
                type: ORDER_PROCESS,
                payload: false
            })
            if (response.data.status) {
                dispatch({
                    type: ORDER_PLACED,
                    payload: true
                });
                dispatch({
                    type: ORDER_ERRORED,
                    payload: {}
                });
            } else {
                dispatch({
                    type: ORDER_ERRORED,
                    payload: response.data
                });
                alert(response.data.msg)
            }
            if (response.data.code !== 200) {
                dispatch({
                    type: ORDER_ERRORED,
                    payload: response.data
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function getTax(data) {
    let dataToSend = {
        ShipPostalCode: data.ShipPostalCode,
        ShipCity: data.ShipCity,
        ShipAddress: data.ShipAddress1,
        ShipCountry: data.ShipCountry,
        ShipState: data.ShipState,
    }
    return function (dispatch) {
        console.log(dataToSend);

        dispatch({
            type: TAX_RESPONSE,
            payload: {}
        });
        if (data.ShipCountry && data.ShipCountry.toLowerCase() !== 'us') {
            dispatch({
                type: TAX_RATE,
                payload: 0
            });
            dispatch({
                type: TAX_RESPONSE,
                payload: { date: new Date().getTime(), status: true }
            });
        }
        else if (data.ShipCountry && data.ShipCountry.toLowerCase() === 'us' && (data.ShipState.toLowerCase() === 'mi' || data.ShipState.toLowerCase() === 'michigan')) {
            dispatch({
                type: TAX_RATE,
                payload: 6
            });
            dispatch({
                type: TAX_RESPONSE,
                payload: { date: new Date().getTime(), status: true }
            });
        }
        else if (data.ShipCountry && data.ShipCountry.toLowerCase() === 'us' && (data.ShipState.toLowerCase() === 'ca' || data.ShipState.toLowerCase() === 'california')) {
            dispatch({
                type: IN_PROCESS,
                payload: true
            });
            axios.post(GET_TAX, dataToSend).then(function (response) {
                // console.log(response);
                dispatch({
                    type: IN_PROCESS,
                    payload: false
                });
                if (response.data) {
                    response.data.date = new Date().getTime()
                }
                if (response.data.status) {
                    dispatch({
                        type: TAX_RATE,
                        payload: response.data.final_tax_rate * 100
                    });
                    dispatch({
                        type: TAX_RESPONSE,
                        payload: response.data
                    });
                } else {
                    dispatch({
                        type: TAX_RATE,
                        payload: -1
                    });
                    dispatch({
                        type: TAX_RESPONSE,
                        payload: response.data
                    });
                }
                if (response.data.code !== 200) {
                    dispatch({
                        type: TAX_ERROR,
                        payload: response.data
                    });
                }
            }).catch(function (error) {
                console.log(error);
            });
        }
        else {
            dispatch({
                type: TAX_RATE,
                payload: 0
            });
            dispatch({
                type: TAX_RESPONSE,
                payload: { date: new Date().getTime(), status: true }
            });
        }
    };
}

export function getShippings(data) {
    let weight = 0;
    data.OrderDetails && data.OrderDetails.forEach(elem => {
        weight = elem.ProductWeight + weight;
    });
    var dataToSend = {
        ShipCountry: data.ShipCountry,
        ShipPostalCode: data.ShipPostalCode,
        weight: weight
    }
    return function (dispatch) {
        axios.post(GET_SHIPPING_METHODS, dataToSend).then(function (response) {
            if (response.data.status) {
                dispatch({
                    type: SHIPPING_METHODS,
                    payload: response.data.result
                });
                dispatch({
                    type: IN_PROCESS,
                    payload: false
                })
            } else {
                dispatch({
                    type: SHIPPING_METHODS,
                    payload: []
                });
                dispatch({
                    type: IN_PROCESS,
                    payload: false
                })
            }
            if (response.data.code !== 200) {
                dispatch({
                    type: SHIPPING_ERROR,
                    payload: response.data
                });
                dispatch({
                    type: IN_PROCESS,
                    payload: false
                })
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
}

export function getOrder(orderId,CustomerID) {
    return function (dispatch) {
        axios.get(GET_ORDER + orderId+'/'+CustomerID).then(function (response) {
            if (response.data.status) {
                dispatch({
                    type: ORDER,
                    payload: response.data.result
                });
            } else {
                dispatch({
                    type: ORDER,
                    payload: {}
                });
            }
            if (response.data.code !== 200) {
                dispatch({
                    type: ORDER_ERROR,
                    payload: response.data
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
}