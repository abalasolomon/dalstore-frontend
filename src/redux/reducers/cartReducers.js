import {
  CART_LIST_REQUEST,
  CART_LIST_SUCCESS,
  CART_LIST_FAIL,
  CART_LIST_RESET,
  CART_ADD_ITEM_REQUEST,
  CART_ADD_ITEM_SUCCESS,
  CART_ADD_ITEM_FAIL,
  CART_REMOVE_ITEM_REQUEST,
  CART_REMOVE_ITEM_SUCCESS,
  CART_REMOVE_ITEM_FAIL,
  CART_INCREASE_ITEM_REQUEST,
  CART_INCREASE_ITEM_SUCCESS,
  CART_INCREASE_ITEM_FAIL,
  CART_DECREASE_ITEM_REQUEST,
  CART_DECREASE_ITEM_SUCCESS,
  CART_DECREASE_ITEM_FAIL,
  CART_UPDATE_RESET,
} from "../constants/cartConstants";
const initialState = {
  loading: false,
  cart: { items: [] },
  error: null,
};
// 🛒 Reducer for listing all cart items
export const cartListReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_LIST_REQUEST:
      return { ...state, cart: [] };
    case CART_LIST_SUCCESS:
      return { loading: false, cart: action.payload.cart };
    case CART_LIST_FAIL:
      return { loading: false, error: action.payload, cart: { items: [] }  };
    case CART_LIST_RESET:
      return { cart: [] };
    default:
      return state;
  }
};

// 🛒 Reducer for add/remove/increase/decrease
export const cartUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CART_ADD_ITEM_REQUEST:
    case CART_REMOVE_ITEM_REQUEST:
    case CART_INCREASE_ITEM_REQUEST:
    case CART_DECREASE_ITEM_REQUEST:
      return { loading: true };

    case CART_ADD_ITEM_SUCCESS:
    case CART_REMOVE_ITEM_SUCCESS:
    case CART_INCREASE_ITEM_SUCCESS:
    case CART_DECREASE_ITEM_SUCCESS:
      return { loading: false, success: true, item: action.payload };

    case CART_ADD_ITEM_FAIL:
    case CART_REMOVE_ITEM_FAIL:
    case CART_INCREASE_ITEM_FAIL:
    case CART_DECREASE_ITEM_FAIL:
      return { loading: false, error: action.payload };

    case CART_UPDATE_RESET:
      return {};

    default:
      return state;
  }
};
