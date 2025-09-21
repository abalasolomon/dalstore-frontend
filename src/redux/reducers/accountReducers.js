import {
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAIL,
  USER_PROFILE_UPDATE_REQUEST,
  USER_PROFILE_UPDATE_SUCCESS,
  USER_PROFILE_UPDATE_FAIL,
  USER_PROFILE_UPDATE_RESET,
  USER_PASSWORD_UPDATE_REQUEST,
  USER_PASSWORD_UPDATE_SUCCESS,
  USER_PASSWORD_UPDATE_FAIL,
  USER_PASSWORD_UPDATE_RESET,
} from "../constants/accountConstants";

// ✅ Profile reducer
export const userProfileReducer = (state = { profile: {} }, action) => {
  switch (action.type) {
    case USER_PROFILE_REQUEST:
      return { loading: true, ...state };
    case USER_PROFILE_SUCCESS:
      return { loading: false, profile: action.payload };
    case USER_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// ✅ Update profile reducer
export const userProfileUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PROFILE_UPDATE_REQUEST:
      return { loading: true };
    case USER_PROFILE_UPDATE_SUCCESS:
      return { loading: false, success: true, profile: action.payload };
    case USER_PROFILE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_PROFILE_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};

// ✅ Update password reducer
export const userPasswordUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_UPDATE_REQUEST:
      return { loading: true };
    case USER_PASSWORD_UPDATE_SUCCESS:
      return { loading: false, success: true, message: action.payload };
    case USER_PASSWORD_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case USER_PASSWORD_UPDATE_RESET:
      return {};
    default:
      return state;
  }
};
