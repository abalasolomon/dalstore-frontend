import {
  PAYMENT_CREATE_REQUEST,
  PAYMENT_CREATE_SUCCESS,
  PAYMENT_CREATE_FAIL,
  PAYMENT_CREATE_RESET,
  PAYMENT_LIST_USER_REQUEST,
  PAYMENT_LIST_USER_SUCCESS,
  PAYMENT_LIST_USER_FAIL,
  PAYMENT_LIST_USER_RESET,
  PAYMENT_LIST_ALL_REQUEST,
  PAYMENT_LIST_ALL_SUCCESS,
  PAYMENT_LIST_ALL_FAIL,
  PAYMENT_VERIFY_REQUEST,
  PAYMENT_VERIFY_SUCCESS,
  PAYMENT_VERIFY_FAIL,
  PAYMENT_VERIFY_RESET,
} from "../constants/paymentConstants";

// Create Payment Reducer
export const paymentCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_CREATE_REQUEST:
      return { loading: true };
    case PAYMENT_CREATE_SUCCESS:
      return { loading: false, success: true, payment: action.payload };
    case PAYMENT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

// My Payments Reducer
export const userPaymentsReducer = (state = { payments: [] }, action) => {
  switch (action.type) {
    case PAYMENT_LIST_USER_REQUEST:
      return { loading: true, payments: [] };
    case PAYMENT_LIST_USER_SUCCESS:
      return { loading: false, payments: action.payload };
    case PAYMENT_LIST_USER_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_LIST_USER_RESET:
      return { payments: [] };
    default:
      return state;
  }
};

// All Payments (Admin) Reducer
export const allPaymentsReducer = (state = { payments: [] }, action) => {
  switch (action.type) {
    case PAYMENT_LIST_ALL_REQUEST:
      return { loading: true, payments: [] };
    case PAYMENT_LIST_ALL_SUCCESS:
      return { loading: false, payments: action.payload };
    case PAYMENT_LIST_ALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Verify Payment Reducer (Admin)
export const paymentVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case PAYMENT_VERIFY_REQUEST:
      return { loading: true };
    case PAYMENT_VERIFY_SUCCESS:
      return { loading: false, success: true, payment: action.payload };
    case PAYMENT_VERIFY_FAIL:
      return { loading: false, error: action.payload };
    case PAYMENT_VERIFY_RESET:
      return {};
    default:
      return state;
  }
};
