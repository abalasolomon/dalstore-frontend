import axios from "../../auth/axiosConfig";
import { API_URL } from "../../config/apiConfig";
import {
  USER_ORDERS_REQUEST,
  USER_ORDERS_SUCCESS,
  USER_ORDERS_FAIL,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  ORDER_DETAIL_REQUEST,
  ORDER_DETAIL_SUCCESS,
  ORDER_DETAIL_FAIL,
  ALL_ORDER_LIST_REQUEST,
  ALL_ORDER_LIST_SUCCESS,
  ALL_ORDER_LIST_FAIL,
  ORDER_UPDATE_REQUEST,
  ORDER_UPDATE_SUCCESS,
  ORDER_UPDATE_FAIL,
} from "../constants/orderConstants";

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

export const getUserOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_ORDERS_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/order/my-orders/`,
      getAuthConfig(getState)
    );

    dispatch({ type: USER_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_ORDERS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const createOrder = (orderDetails) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });
    const { data } = await axios.post(
      `${API_URL}/api/order/create/`,
      orderDetails,
      getAuthConfig(getState)
    );
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_ORDER_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const getUserOrderDetail = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAIL_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/order/${orderId}/`,
      getAuthConfig(getState)
    );

    dispatch({ type: ORDER_DETAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_DETAIL_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const getAllOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ALL_ORDER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/order/all/`, config);

    dispatch({
      type: ALL_ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ALL_ORDER_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const updateOrderStatus =
  (orderId, data) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_UPDATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.access}`,
        },
      };

      const { data: updatedOrder } = await axios.put(
        `/api/order/${orderId}/update-status/`,
        data,
        config
      );

      dispatch({
        type: ORDER_UPDATE_SUCCESS,
        payload: updatedOrder,
      });
    } catch (error) {
      dispatch({
        type: ORDER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
