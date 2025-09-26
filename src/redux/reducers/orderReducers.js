import {
  USER_ORDERS_REQUEST,
  USER_ORDERS_SUCCESS,
  USER_ORDERS_FAIL,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
  ALL_ORDER_LIST_REQUEST,
  ALL_ORDER_LIST_SUCCESS,
  ALL_ORDER_LIST_FAIL,
  
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAIL,
  ORDER_UPDATE_RESET,
} from "../constants/orderConstants";
const initialState = {
  loading: false,
  order: {},
  error: null,
};

export const userOrdersReducer = (state = { ...initialState }, action) => {
  switch (action.type) {
    case USER_ORDERS_REQUEST:
      return { loading: true, orders: [] };
    case USER_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload };
    case USER_ORDERS_FAIL:
      return { loading: false, error: action.payload, orders: [] };
    default:
      return state;
  }
};
export const orderDetailReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case ORDER_DETAIL_REQUEST:
      return { loading: true, ...state };
    case ORDER_DETAIL_SUCCESS:
      return { loading: false, order: action.payload };
    case ORDER_DETAIL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const allOrderListReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case ALL_ORDER_LIST_REQUEST:
      return { loading: true, orders: [] };
    case ALL_ORDER_LIST_SUCCESS:
      return { loading: false, orders: action.payload };
    case ALL_ORDER_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const orderUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_UPDATE_REQUEST:
      return { loading: true };
    case ORDER_UPDATE_SUCCESS:
      return { loading: false, success: true, order: action.payload };
    case ORDER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case ORDER_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};