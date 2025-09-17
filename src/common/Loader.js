import React from "react";
import {
  ClipLoader,
} from "react-spinners";
function Loader() {
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-5">
        <span className="visually-hidden">Loading...</span>
        <ClipLoader color="blue" size={50} />
      </div>
    </>
  );
}

export default Loader;
