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
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_RELATED_FAIL,
  PRODUCT_RELATED_SUCCESS,
  PRODUCT_RELATED_REQUEST,
  PRODUCT_TAG_REQUEST,
  PRODUCT_TAG_SUCCESS,
  PRODUCT_TAG_FAIL,
  PRODUCT_CATEGORY_REQUEST,
  PRODUCT_CATEGORY_SUCCESS,
  PRODUCT_CATEGORY_FAIL,
   PRODUCT_IMAGE_DELETE_REQUEST,
  PRODUCT_IMAGE_DELETE_SUCCESS,
  PRODUCT_IMAGE_DELETE_FAIL,
} from '../constants/productConstants'

export const productListReducer = (
  state = { products: [], page: 1, hasMore: true },
  action
) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { ...state, loading: true };

    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        products:
          action.payload.page === 1
            ? action.payload.products
            : [...state.products, ...action.payload.products],
        page: action.payload.page,
        hasMore: action.payload.hasMore,
      };

    case PRODUCT_LIST_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const productDetailsReducer = (state = { product: { variants: [], images: [] } }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { loading: true, ...state }
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const productUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productRelatedReducer = (state = { related: [] }, action) => {
  switch (action.type) {
    case PRODUCT_RELATED_REQUEST:
      return { loading: true, related: [] };
    case PRODUCT_RELATED_SUCCESS:
      return { loading: false, related: action.payload };
    case PRODUCT_RELATED_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const productCategoryReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_CATEGORY_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_CATEGORY_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_CATEGORY_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

// Products by Tag
export const productTagReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_TAG_REQUEST:
      return { loading: true, products: [] };
    case PRODUCT_TAG_SUCCESS:
      return { loading: false, products: action.payload };
    case PRODUCT_TAG_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const productImageDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_IMAGE_DELETE_REQUEST:
      return { loading: true };
    case PRODUCT_IMAGE_DELETE_SUCCESS:
      return { loading: false, success: true, imageId: action.payload };
    case PRODUCT_IMAGE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
