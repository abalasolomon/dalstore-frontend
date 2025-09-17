// src/redux/actions/serviceActions.js

import axios from 'axios';
import {
  SERVICE_LIST_REQUEST,
  SERVICE_LIST_SUCCESS,
  SERVICE_LIST_FAIL,

  PROFESSIONAL_SERVICES_REQUEST,
  PROFESSIONAL_SERVICES_SUCCESS,
  PROFESSIONAL_SERVICES_FAIL,

  SERVICE_CREATE_REQUEST,
  SERVICE_CREATE_SUCCESS,
  SERVICE_CREATE_FAIL,
  SERVICE_UPDATE_REQUEST,
  SERVICE_UPDATE_SUCCESS,
  SERVICE_UPDATE_FAIL,

  SERVICE_DELETE_REQUEST,
  SERVICE_DELETE_SUCCESS,
  SERVICE_DELETE_FAIL,

  SERVICE_DETAIL_REQUEST,
  SERVICE_DETAIL_SUCCESS,
  SERVICE_DETAIL_FAIL,

  TRENDING_SERVICE_LIST_REQUEST,
  TRENDING_SERVICE_LIST_SUCCESS,
  TRENDING_SERVICE_LIST_FAIL,

  FEATURED_SERVICE_LIST_REQUEST,
  FEATURED_SERVICE_LIST_SUCCESS,
  FEATURED_SERVICE_LIST_FAIL
} from '../constants/serviceConstants';
import { API_URL, getAuthConfigMultipart, getAuthConfig } from "../../config/apiConfig";

export const listServices = () => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_LIST_REQUEST });

    // Make an API call to your backend to get the list of services
    // IMPORTANT: Adjust this endpoint '/api/services/' to your actual backend API endpoint for services
    const { data } = await axios.get(`${API_URL}/api/get-all-services/`,);


    dispatch({
      type: SERVICE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: SERVICE_LIST_FAIL,
      payload:
        error.response && error.response.data.detail // For DRF/Django, 'detail' is common
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProfessionalServices = () => async (dispatch, getState) => {
  try {
    dispatch({ type: PROFESSIONAL_SERVICES_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const { data } = await axios.get(`${API_URL}/api/get-professional-services/`, getAuthConfig(userInfo));

    dispatch({
      type: PROFESSIONAL_SERVICES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PROFESSIONAL_SERVICES_FAIL,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const createService = (formData) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_CREATE_REQUEST });

    const { data } = await axios.post(
      `${API_URL}/api/create-service/`,
      formData,
      getAuthConfigMultipart() // Using your existing config function
    );

    dispatch({
      type: SERVICE_CREATE_SUCCESS,
      payload: data,
    });

    return data; // Return created service data

  } catch (error) {
    const errorPayload = error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;

    dispatch({
      type: SERVICE_CREATE_FAIL,
      payload: errorPayload,
    });

    // Re-throw to handle in component
    throw new Error(errorPayload);
  }
};

export const deleteService = (id) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_DELETE_REQUEST });

    await axios.delete(
      `${API_URL}/api/professional/services/${id}/`,
      getAuthConfig()
    );

    dispatch({
      type: SERVICE_DELETE_SUCCESS,
      payload: id
    });

  } catch (error) {
    const errorPayload = error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;

    dispatch({
      type: SERVICE_DELETE_FAIL,
      payload: errorPayload
    });

    throw error;
  }
};


export const updateService = (slug, formData) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_UPDATE_REQUEST });

    if (formData.has('price')) {
      formData.append('studio_price', formData.get('price'));
      formData.delete('price');
    }

    const { data } = await axios.put(
      `${API_URL}/api/edit-service/${slug}/`,
      formData,
      getAuthConfigMultipart()
    );

    dispatch({
      type: SERVICE_UPDATE_SUCCESS,
      payload: data
    });

    return data;

  } catch (error) {
    const errorPayload = error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message;

    dispatch({
      type: SERVICE_UPDATE_FAIL,
      payload: errorPayload
    });

    throw error;
  }
};


// In your serviceActions.js file
export const getServiceDetail = (slug) => async (dispatch) => {
  try {
    dispatch({ type: SERVICE_DETAIL_REQUEST });

    const { data } = await axios.get(`/api/services/get-service-detail/${slug}/`);

    dispatch({
      type: SERVICE_DETAIL_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: SERVICE_DETAIL_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const listTrendingServices = () => async (dispatch) => {
  try {
    dispatch({ type: TRENDING_SERVICE_LIST_REQUEST });

    const { data } = await axios.get(`${API_URL}/api/get-trending-services/`);

    dispatch({
      type: TRENDING_SERVICE_LIST_SUCCESS,
      payload: data.trending_services || []
    });
  } catch (error) {
    dispatch({
      type: TRENDING_SERVICE_LIST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};

export const featuredlistServices = () => async (dispatch) => {
  try {
    dispatch({ type: FEATURED_SERVICE_LIST_REQUEST });
    const { data } = await axios.get(`${API_URL}/api/get-featured-services/`);

    dispatch({
      type: FEATURED_SERVICE_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: FEATURED_SERVICE_LIST_FAIL,
      payload: error.response?.data?.message || error.message
    });
  }
};