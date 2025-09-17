import axios from "axios";
import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,

    NOTIFICATION_MARK_READ_REQUEST,
    NOTIFICATION_MARK_READ_SUCCESS,
    NOTIFICATION_MARK_READ_FAIL,

    NOTIFICATION_COUNT_REQUEST,
    NOTIFICATION_COUNT_SUCCESS,
    NOTIFICATION_COUNT_FAIL,
} from "../constants/notificationConstants";
import { API_URL, getAuthConfig } from "../../config/apiConfig";

export const listNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = getAuthConfig(userInfo);

    const { data } = await axios.get(`${API_URL}/api/notifications/`, config);

    dispatch({
      type: NOTIFICATION_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_LIST_FAIL,
      payload:
        error.response?.data?.detail || error.message || "Failed to fetch notifications",
    });
  }
};

// Mark notification as read
export const markNotificationRead = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_MARK_READ_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.access}` },
    };

    const { data } = await axios.patch(
      `${API_URL}/api/notifications/${id}/read/`,
      {},
      config
    );

    dispatch({ type: NOTIFICATION_MARK_READ_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_MARK_READ_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    });
  }
};

// Get unread notification count
export const getNotificationCount = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_COUNT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: { Authorization: `Bearer ${userInfo.access}` },
    };

    const { data } = await axios.get(`${API_URL}/api/notifications/count/`, config);

    dispatch({ type: NOTIFICATION_COUNT_SUCCESS, payload: data.unread_count });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_COUNT_FAIL,
      payload:
        error.response?.data?.detail || error.message,
    });
  }
};