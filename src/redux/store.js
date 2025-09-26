import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import {
  userLoginReducers,
  userRegisterReducers,
  // userRegisterReducers,
   allUsersReducer,
} from "./reducers/usersReducers";
import {
  emailOtpSendReducer,
  emailOtpVerifyReducer,
  emailOtpResendReducer,
} from "./reducers/emailOtpReducers";
import { cartListReducer, cartUpdateReducer } from "./reducers/cartReducers";
import {
  notificationListReducer,
  notificationMarkReadReducer,
  notificationCountReducer,
} from "./reducers/notificationReducers";
// Payment reducers
import {
  paymentCreateReducer,
  userPaymentsReducer,
  allPaymentsReducer,
  paymentVerifyReducer,
} from "./reducers/paymentReducers";
import {
  productListReducer,
  productDetailsReducer,
  productCreateReducer,
  productUpdateReducer,
  productDeleteReducer,
  productRelatedReducer,
  productCategoryReducer,
  productTagReducer,
  

  //  productReviewCreateReducer,
  // productTopRatedReducer,
} from "./reducers/productReducers";
import {
  productReviewListReducer,
  productReviewCreateReducer,
} from "./reducers/reviewReducers";
import {
  categoryListReducer,
  categoryDetailsReducer,
  categoryCreateReducer,
  categoryUpdateReducer,
  categoryDeleteReducer,
} from "./reducers/categoryReducers";
import {
  userOrdersReducer,
  orderDetailReducer,
  allOrderListReducer,
} from "./reducers/orderReducers";
import {
  userProfileReducer,
  userProfileUpdateReducer,
  userPasswordUpdateReducer,
} from "./reducers/accountReducers";
const reducer = combineReducers({
  userLogin: userLoginReducers,
  userRegister: userRegisterReducers,
  userList : allUsersReducer,
  emailOtpSend: emailOtpSendReducer,
  emailOtpVerify: emailOtpVerifyReducer,
  emailOtpResend: emailOtpResendReducer,

  // ✅ Account/Profile
  userProfile: userProfileReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userPasswordUpdate: userPasswordUpdateReducer,
  //categories
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,
  //products
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  productCategory: productCategoryReducer,
  productTag: productTagReducer,
  deleteProductImage: productDeleteReducer,
  productReviews: productReviewListReducer,
  reviewCreate: productReviewCreateReducer,
  relatedProducts: productRelatedReducer,

  cartList: cartListReducer,
  cartUpdate: cartUpdateReducer,

  // Notifications
  notificationList: notificationListReducer,
  notificationMarkRead: notificationMarkReadReducer,
  notificationCount: notificationCountReducer,

  // Payments
  paymentCreate: paymentCreateReducer,
  userPayments: userPaymentsReducer,
  allPayments: allPaymentsReducer,
  paymentVerify: paymentVerifyReducer,

  //ORDERS
  userOrders: userOrdersReducer,
  orderDetail: orderDetailReducer,
  allOrderList: allOrderListReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
