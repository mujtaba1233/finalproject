import { SYNC_QUANTITY, FETCH_PRODUCTS, FETCH_PRODUCT_OPTIONS, FETCH_PRODUCT_OPTIONS_ERRORED } from "../helpers/actionConstants";

export default function product(state = {
        products: [],
        options: [],
    },
    action) {
    switch (action.type) {
        case FETCH_PRODUCTS:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    products: action.payload
                };
            }
        case FETCH_PRODUCT_OPTIONS:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    options: action.payload
                };
            }
        case FETCH_PRODUCT_OPTIONS_ERRORED:
            {
                // console.log('dispatch in reducer',action.payload);
                return {
                    ...state,
                    options: action.payload
                };
            }
        case SYNC_QUANTITY:
            {
                const {
                    Quantity,
                    ProductCode
                } = action.payload;
                state.products.map(thisItem => thisItem.ProductCode === ProductCode ? thisItem.Quantity = Quantity : null)
                return {
                    ...state
                }
            }
        default:
            {
                if (action.type.indexOf('@@') === -1) {
                    // console.log('case not handled in product reducer: ', action.type);
                }
            }

    }
    return state;
}