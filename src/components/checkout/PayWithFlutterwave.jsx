// import React from "react";
// import { useSelector } from "react-redux";
// import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

// const PayWithFlutterwave = ({ amount }) => {
//   const { userInfo } = useSelector((state) => state.userLogin);
//         console.log("userinfo from flutterwave",userInfo)

//   const flutterwaveConfig = {
//     public_key: "FLWPUBK_TEST-adba8a6a2cda1599b93ce17b87103b89-X", // replace with your Flutterwave test key
//     tx_ref: Date.now(),
//     amount,
//     currency: "NGN",
//     payment_options: "card, mobilemoney, ussd",
//     customer: {
//       email: userInfo?.email || "guest@example.com",
//       phonenumber: userInfo?.phone || "08012345678",
//       name: userInfo?.first_name + userInfo?.last_name || "Guest User",
//     },
//     customizations: {
//       title: "Dalstore Checkout",
//       description: "Payment for items in cart",
//       logo: "https://via.placeholder.com/150",
//     },
//   };

//   const fwConfig = {
//     ...flutterwaveConfig,
//     text: "Pay with Flutterwave",
//     callback: (response) => {
//       console.log("Flutterwave response:", response);
//       closePaymentModal();
//       alert("Payment successful with Flutterwave!");
//     },
//     onClose: () => {},
//   };

//   return <FlutterWaveButton {...fwConfig} className="btn btn-primary" />;
// };

// export default PayWithFlutterwave;

import React from "react";
import { useSelector } from "react-redux";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

const PayWithFlutterwave = ({ amount, onSuccess }) => {
  const { userInfo } = useSelector((state) => state.userLogin);

  const flutterwaveConfig = {
   // public_key: "FLWPUBK_TEST-adba8a6a2cda1599b93ce17b87103b89-X",
   public_key: "FLWPUBK_TEST-adba8a6a2cda1599b93ce17b87103b89-X", // replace with your Flutterwave test key 
   tx_ref: Date.now(),
    amount,
    currency: "NGN",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: userInfo?.email || "guest@example.com",
      phonenumber: userInfo?.phone || "08012345678",
      name: `${userInfo?.first_name || ""} ${userInfo?.last_name || ""}`.trim() || "Guest User",
    },
    customizations: {
      title: "Dalstore Checkout",
      description: "Payment for items in cart",
      logo: "https://via.placeholder.com/150",
    },
  };

  const fwConfig = {
    ...flutterwaveConfig,
    text: "Pay with Flutterwave",
    callback: (response) => {
      console.log("Flutterwave response:", response);
      closePaymentModal();
      onSuccess(response);
    },
    onClose: () => {
      console.log("Payment modal closed");
    },
  };

  return <FlutterWaveButton {...fwConfig} className="btn btn-primary w-100" />;
};

export default PayWithFlutterwave;