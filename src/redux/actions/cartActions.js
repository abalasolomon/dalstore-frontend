import axios from "../../auth/axiosConfig";
import { API_URL } from "../../config/apiConfig";
import {
  CART_LIST_REQUEST,
  CART_LIST_SUCCESS,
  CART_LIST_FAIL,
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
} from "../constants/cartConstants";

// helper: auth header
const getAuthConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.access}`,
    },
  };
};

// 1. List cart
export const listCart = () => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_LIST_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/cart/`, getAuthConfig(getState));
    dispatch({ type: CART_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CART_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// 2. Add item to cart
export const addToCart = (productId, quantity = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_ADD_ITEM_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/api/cart/add/`,
      { product_id: productId, quantity },
      getAuthConfig(getState)
    );
    dispatch({ type: CART_ADD_ITEM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const clearCart = (productId, quantity = 1) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_ADD_ITEM_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/api/cart/clear/`,
      { },
      getAuthConfig(getState)
    );
    dispatch({ type: CART_ADD_ITEM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CART_ADD_ITEM_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
// 3. Remove item
export const removeFromCart = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_REMOVE_ITEM_REQUEST });
    await axios.delete(`${API_URL}/api/cart/remove/${id}/`, getAuthConfig(getState));
    dispatch({ type: CART_REMOVE_ITEM_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: CART_REMOVE_ITEM_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// 4. Increase item quantity
export const increaseCartItem = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_INCREASE_ITEM_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/api/cart/item/${id}/update/`,
      {action: 'inc'},
      getAuthConfig(getState)
    );
    dispatch({ type: CART_INCREASE_ITEM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CART_INCREASE_ITEM_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// 5. Decrease item quantity
export const decreaseCartItem = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: CART_DECREASE_ITEM_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/api/cart/item/${id}/update/`,
      {action: 'dec'},
      getAuthConfig(getState)
    );
    dispatch({ type: CART_DECREASE_ITEM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CART_DECREASE_ITEM_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
