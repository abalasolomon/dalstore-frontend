import axios from "axios";
import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
} from "../constants/accountConstants";

import { API_URL, getAuthConfig } from "../../config/apiConfig";

// ✅ Get user profile
export const getUserProfile = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = getAuthConfig(userInfo);
  try {
    dispatch({ type: USER_PROFILE_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/users/profile/`, config);
    dispatch({ type: USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// ✅ Update user profile
export const updateUserProfile = (formData) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = getAuthConfig(userInfo);
  try {
    dispatch({ type: USER_PROFILE_UPDATE_REQUEST });

    const { data } = await axios.put(
      `${API_URL}/api/users/update-profile/`,
      formData,
      config
    );

    dispatch({ type: USER_PROFILE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

// ✅ Update user password
export const updateUserPassword = (formData) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = getAuthConfig(userInfo);
  try {
    dispatch({ type: USER_PASSWORD_UPDATE_REQUEST });

    const { data } = await axios.put(
      `${API_URL}/api/users/update-password/`,
      formData,
      config
    );

    dispatch({ type: USER_PASSWORD_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_PASSWORD_UPDATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
