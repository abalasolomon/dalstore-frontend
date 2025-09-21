import React from "react";
import { useSelector } from "react-redux";
import { PaystackButton } from "react-paystack";

const PayWithPaystack = ({ amount, onSuccess }) => {
  const { userInfo } = useSelector((state) => state.userLogin);

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: userInfo?.email || "guest@example.com",
    amount: amount * 100, // in kobo
    publicKey: "pk_test_6f6f116d5666efaed6554f154531dfca64096ff0", // replace with your Paystack test key
  };

  return (
    <PaystackButton
      {...paystackConfig}
      text="Pay with Paystack"
      className="btn btn-success"
      onSuccess={onSuccess}
      onClose={() => alert("Paystack popup closed")}
    />
  );
};

export default PayWithPaystack;
