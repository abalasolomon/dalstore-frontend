import axios from "axios";
import { API_URL, getAuthConfig } from "../../config/apiConfig";
import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_FAIL,
  PAYMENT_LIST_USER_REQUEST,
  PAYMENT_LIST_USER_SUCCESS,
  PAYMENT_LIST_USER_FAIL,
  PAYMENT_LIST_ALL_REQUEST,
  PAYMENT_LIST_ALL_SUCCESS,
  PAYMENT_LIST_ALL_FAIL,
  PAYMENT_VERIFY_REQUEST,
  PAYMENT_VERIFY_SUCCESS,
  PAYMENT_VERIFY_FAIL,
} from "../constants/paymentConstants";

// Create Payment
export const createPayment = (paymentData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_CREATE_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/api/payments/create/`,
      paymentData,
      getAuthConfig(getState)
    );

    dispatch({ type: PAYMENT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_CREATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Get My Payments
export const listMyPayments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_LIST_USER_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/payments/my/`,
      getAuthConfig(getState)
    );

    dispatch({ type: PAYMENT_LIST_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_LIST_USER_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Get All Payments (Admin only)
export const listAllPayments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_LIST_ALL_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/payments/`,
      getAuthConfig(getState)
    );

    dispatch({ type: PAYMENT_LIST_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_LIST_ALL_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// Verify Payment (Admin only)
export const verifyPayment = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAYMENT_VERIFY_REQUEST });

    const { data } = await axios.put(
      `${API_URL}/api/payments/${id}/verify/`,
      {},
      getAuthConfig(getState)
    );

    dispatch({ type: PAYMENT_VERIFY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAYMENT_VERIFY_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
