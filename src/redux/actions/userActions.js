//userActions.js
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LOGIN_REQUEST,
  USER_REGISTER_FAIL,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_REQUEST,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAIL,
} from "../constants/userContants";
// import axios from "axios";
import axios from "../../auth/axiosConfig";

import { API_URL } from "../../config/apiConfig";

export const login = (loginData) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/users/login/`,
      loginData,
      config
    );

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data
           ? error.response.data.detail ||
        error.response.data.error ||
        error.response.data.message ||
        error.message
      : error.message,
    });
  }
};

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST,
    });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/users/register/`,
      formData,
      config
    );

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data,
    });

    localStorage.setItem("registrationData", JSON.stringify(formData));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data
          ? error.response.data
          : error.message,
    });
  }
};

export const refreshToken = (refreshToken) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/token/refresh/`,
      { refresh: refreshToken },
      config
    );

    localStorage.setItem("userInfo", JSON.stringify(data));

    let refreshTokenTime = 1000 * 60 * 60 * 24 * 7; // ms * hr * mins
    setTimeout(() => {
      dispatch(refreshToken(data.refresh));
    }, refreshTokenTime);
  } catch (error) {
    console.log("Error refreshing token:", error);
    if (error.response && error.response.status === 401) {
      dispatch(logout());
    } else {
      dispatch(logout());
    }
  }
};

export const logout = () => async (dispatch) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };
    await axios.post(
      `${API_URL}/api/users/logout/`,
      { refresh: userInfo.refresh },
      config
    );
  } catch (error) {
    console.log("Error logging out:", error);
  }
  // Remove access token from Axios headers
  delete axios.defaults.headers.common["Authorization"];
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
  window.location.href = "/login";
};

//getting all users
export const getAllUsers = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo?.access}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/api/users/all-users/`, config);

    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ALL_USERS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

