
import { axios } from "../../auth/axiosConfig";
import { API_URL } from "../../config/apiConfig";
import {
  PRODUCT_REVIEW_LIST_REQUEST,
  PRODUCT_REVIEW_LIST_SUCCESS,
  PRODUCT_REVIEW_LIST_FAIL,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
} from "../constants/reviewConstants";


export const listProductReviews = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_REVIEW_LIST_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/reviews/${slug}/`);

    dispatch({
      type: PRODUCT_REVIEW_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_LIST_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const createProductReview = (slug, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PRODUCT_REVIEW_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    await axios.post(`${API_URL}/api/reviews/${slug}/`, review, config);

    dispatch({ type: PRODUCT_REVIEW_CREATE_SUCCESS });
    // re-fetch reviews
    dispatch(listProductReviews(slug));
  } catch (error) {
    dispatch({
      type: PRODUCT_REVIEW_CREATE_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};
