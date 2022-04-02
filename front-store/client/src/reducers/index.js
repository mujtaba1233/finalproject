import { combineReducers } from 'redux';
import  product from "./productReducer";
import  category from "./categoryReducer";
import  cart from "./cartReducer";
import  global from "./globalReducer";
import  customer from "./customerReducer";
import  order from "./orderReducer";

export default combineReducers({
    product,
    category,
    global,
    cart,
    customer,
    order
});