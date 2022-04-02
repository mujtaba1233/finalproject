import {
    ADD_TO_CART,
    UPDATE_CART,
    REMOVE_ITEM,
    UPDATE_QUANTITY
} from '../helpers/actionConstants';
export function addToCart(payload) {
    return {
        type: ADD_TO_CART,
        payload: payload
    }
}
export function updateCart(payload) {
    let cartItems = JSON.parse(localStorage.getItem('cartStatePersist'))
    cartItems.forEach((elem) => {
        if (elem.ProductCode === payload.ProductCode) {
            elem.Quantity = payload.Quantity;
        }
    });
    localStorage.setItem('cartStatePersist', JSON.stringify(cartItems))
    return {
        type: UPDATE_CART,
        payload: payload
    }
}
export function removeItem(payload) {
    // console.log('remove from cart action');
    let cartItems = JSON.parse(localStorage.getItem('cartStatePersist'))
    const itemIndex = cartItems.findIndex(i => i.ProductCode === payload.ProductCode);
    cartItems.splice(itemIndex, 1)
    localStorage.setItem('cartStatePersist', JSON.stringify(cartItems))
    return {
        type: REMOVE_ITEM,
        payload: payload
    }
}
export function updateQuantity(payload) {
    return {
        type: UPDATE_QUANTITY,
        payload: payload
    }
}