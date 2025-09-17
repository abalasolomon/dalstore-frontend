
// emailOtpReducers.js
import {
    EMAIL_OTP_SEND_REQUEST,
    EMAIL_OTP_SEND_SUCCESS,
    EMAIL_OTP_SEND_FAIL,
    EMAIL_OTP_VERIFY_REQUEST,
    EMAIL_OTP_VERIFY_SUCCESS,
    EMAIL_OTP_VERIFY_FAIL,
    EMAIL_OTP_RESEND_REQUEST,
    EMAIL_OTP_RESEND_SUCCESS,
    EMAIL_OTP_RESEND_FAIL,
  } from "../constants/emailOtpConstants";    
  
  const initialState = {
    loading: false,
    success: false,
    error: null,
  };
   
  export const emailOtpSendReducer = (state = initialState, action) => {
    switch (action.type) {
      case EMAIL_OTP_SEND_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case EMAIL_OTP_SEND_SUCCESS: 
        return {
          loading: false,
          success: true,
        };
      case EMAIL_OTP_SEND_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export const emailOtpVerifyReducer = (state = initialState, action) => {
    switch (action.type) {
      case EMAIL_OTP_VERIFY_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case EMAIL_OTP_VERIFY_SUCCESS:
        return {
          loading: false,
          success: true,
        };
      case EMAIL_OTP_VERIFY_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export const emailOtpResendReducer = (state = initialState, action) => {
    switch (action.type) {
      case EMAIL_OTP_RESEND_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case EMAIL_OTP_RESEND_SUCCESS:
        return {
          loading: false,
          success: true,
        };
      case EMAIL_OTP_RESEND_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  