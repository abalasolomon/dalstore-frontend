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

export const notificationListReducer = (state = { notifications: [] }, action) => {
  switch (action.type) {
    case NOTIFICATION_LIST_REQUEST:
      return { loading: true, notifications: [] };
    case NOTIFICATION_LIST_SUCCESS:
      return { loading: false, notifications: action.payload.results };
    case NOTIFICATION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const notificationMarkReadReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_MARK_READ_REQUEST:
      return { loading: true };
    case NOTIFICATION_MARK_READ_SUCCESS:
      return { loading: false, success: true, notification: action.payload };
    case NOTIFICATION_MARK_READ_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const notificationCountReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case NOTIFICATION_COUNT_REQUEST:
      return { loading: true, count: 0 };
    case NOTIFICATION_COUNT_SUCCESS:
      return { loading: false, count: action.payload };
    case NOTIFICATION_COUNT_FAIL:
      return { loading: false, error: action.payload, count: 0 };
    default:
      return state;
  }
};
