import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_RELATED_REQUEST,
  PRODUCT_RELATED_SUCCESS,
  PRODUCT_RELATED_FAIL,
  PRODUCT_TAG_REQUEST,
  PRODUCT_TAG_SUCCESS,
  PRODUCT_TAG_FAIL,
  PRODUCT_CATEGORY_REQUEST,
  PRODUCT_CATEGORY_SUCCESS,
  PRODUCT_CATEGORY_FAIL,

   PRODUCT_IMAGE_DELETE_REQUEST,
  PRODUCT_IMAGE_DELETE_SUCCESS,
  PRODUCT_IMAGE_DELETE_FAIL,
} from "../constants/productConstants";
import { API_URL } from "../../config/apiConfig";

export const listProducts =
  (page = 1) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_LIST_REQUEST });

      const { data } = await axios.get(`${API_URL}/api/products/?page=${page}`);

      dispatch({
        type: PRODUCT_LIST_SUCCESS,
        payload: {
          products: data.results, // Assuming paginated response with 'results'
          page,
          hasMore: data.next !== null,
        },
      });
    } catch (error) {
      dispatch({
        type: PRODUCT_LIST_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const getProductDetails = (slug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/products/${slug}/`);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/api/products/`,
      product,
      config
    );
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL,
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

export const updateProduct =
  (id, updatedProduct) => async (dispatch, getState) => {
    try {
      dispatch({ type: PRODUCT_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.access}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/products/${id}/`,
        updatedProduct,
        config
      );
      dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: PRODUCT_UPDATE_FAIL,
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

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DELETE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    await axios.delete(`${API_URL}/api/products/${id}/`, config);
    dispatch({ type: PRODUCT_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
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

export const listRelatedProducts = (categorySlug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_RELATED_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/products/?category=${categorySlug}`
    );

    dispatch({
      type: PRODUCT_RELATED_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_RELATED_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const listProductsByCategory = (categorySlug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_CATEGORY_REQUEST });

    const { data } = await axios.get(
      `${API_URL}/api/products/category/${categorySlug}/`
    );

    dispatch({
      type: PRODUCT_CATEGORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CATEGORY_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

// Get products by tag
export const listProductsByTag = (tagSlug) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TAG_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/products/tag/${tagSlug}/`);

    dispatch({
      type: PRODUCT_TAG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_TAG_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};
export const deleteProductImage = (slug, imageId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_IMAGE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
      },
    };

    await axios.delete(`${API_URL}/api/products/${slug}/images/${imageId}/`, config);

    dispatch({
      type: PRODUCT_IMAGE_DELETE_SUCCESS,
      payload: imageId, // so reducer knows which image to remove
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_IMAGE_DELETE_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};