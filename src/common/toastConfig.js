// toastConfig.js
import { toast } from "react-toastify";

// Default options
const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    ...defaultOptions,
    className: "bg-success text-white rounded shadow-sm",
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    ...defaultOptions,
    className: "bg-danger text-white rounded shadow-sm",
  });
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, {
    ...defaultOptions,
    className: "bg-primary text-white rounded shadow-sm",
  });
};

// Warning toast
export const showWarning = (message) => {
  toast.warn(message, {
    ...defaultOptions,
    className: "bg-warning text-dark rounded shadow-sm",
  });
};
