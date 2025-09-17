import React from "react";
import { useSelector } from "react-redux";
import { PaystackButton } from "react-paystack";

const PayWithPaystack = ({ amount, onSuccess }) => {
  const { userInfo } = useSelector((state) => state.userLogin);

  const paystackConfig = {
    reference: new Date().getTime().toString(),
    email: userInfo?.email || "guest@example.com",
    amount: amount * 100, // in kobo
    publicKey: "pk_test_8f8bba41c278c6468f465b207bbe88f7a941f34f", // replace with your Paystack test key
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
