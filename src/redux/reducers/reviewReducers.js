import {
  PRODUCT_REVIEW_LIST_REQUEST,
  PRODUCT_REVIEW_LIST_SUCCESS,
  PRODUCT_REVIEW_LIST_FAIL,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_REVIEW_CREATE_RESET,
} from "../constants/reviewConstants";

export const productReviewListReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case PRODUCT_REVIEW_LIST_REQUEST:
      return { loading: true, reviews: [] };
    case PRODUCT_REVIEW_LIST_SUCCESS:
      return { loading: false, reviews: action.payload.results };
    case PRODUCT_REVIEW_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_REVIEW_CREATE_REQUEST:
      return { loading: true };
    case PRODUCT_REVIEW_CREATE_SUCCESS:
      return { loading: false, success: true };
    case PRODUCT_REVIEW_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PRODUCT_REVIEW_CREATE_RESET:
      return {};
    default:
      return state;
  }
};
