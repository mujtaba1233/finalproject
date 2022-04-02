import {
  ADD_TO_CART,
  UPDATE_CART,
  REMOVE_ITEM,
  EMPTY_CART
} from '../helpers/actionConstants';
export default function cart(state = [], action) {
  // Our goal here is to perform actions on cart items using "Immutable update patterns"
  // Mutating the State directly can lead to performance issues as it could unnecessarily 
  // re-render the component.
  switch (action.type) {
    case ADD_TO_CART:
      {
        // This adds new item to the cart array, in this the State without mutating it.
        return [
          ...state,
          action.payload
        ]
      }
    case UPDATE_CART:
      {
        // This finds the item that is already available in the cart array and updates 
        // the item's quantity without mutating directly the State
        return state.map((item, index) => {
          if (index !== action.index) {
            return item;
          }
          return [
            ...state,
            ...action.payload
          ]
        });
      }
    case REMOVE_ITEM:
      {
        // Removes the item from cart array without directly mutating the state.
        // The Array.prototype.filter() method prevents us from mutating the array
        console.log('remove from cart reducer',action.payload);
        const itemIndex = state.findIndex(i => i.ProductCode === action.payload.ProductCode);
        return state.filter((item, index) => index !== itemIndex);
      }
    case EMPTY_CART:
      {
        // This removes items from the cart.
        localStorage.removeItem('cartStatePersist')
        return []
      }
    default:
      {
        if (action.type.indexOf('@@') === -1) {
          // console.log('case not handled in cart reducer: ', action.type);
        }
      }
  }

  return state;
}