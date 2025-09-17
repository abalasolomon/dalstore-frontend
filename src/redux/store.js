import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";

import {
  userLoginReducers,
  userRegisterReducers,
  // userRegisterReducers,
  // allUsersReducer,
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
  //  productReviewCreateReducer,
  // productTopRatedReducer,
} from "./reducers/productReducers";
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
} from "./reducers/orderReducers";
const reducer = combineReducers({
  userLogin: userLoginReducers,
  userRegister: userRegisterReducers,
  emailOtpSend: emailOtpSendReducer,
  emailOtpVerify: emailOtpVerifyReducer,
  emailOtpResend: emailOtpResendReducer,

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
  // productReviewCreate: productReviewCreateReducer,
  // productTopRated: productTopRatedReducer,

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
