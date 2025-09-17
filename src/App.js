import "./App.css";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Home from "./components/screens/Home";
import PrivateRoute from "./auth/PrivateRoute";
import NotFoundScreen from "./components/screens/NotFoundScreen";
import Unauthorized from "./components/screens/Unauthorized";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import EmailOtpVerification from "./components/authentication/EmailOtpVerification";
import ProductDetails from "./components/products/ProductDetails";
import GetCart from "./components/cart/GetCart";
import Checkout from "./components/checkout/Checkout";
import GetUserOrders from "./components/orders/GetUserOrders";
import GetUserOrderDetail from "./components/orders/GetUserOrderDetail";
import AdvancedSearch from "./components/products/AdvancedSearch";
import Getnotifications from "./components/notifications/Getnotifications";
import GetAccount from "./components/account/GetAccount";
import ChangePassword from "./components/account/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Initialize once in your App.js


function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <Header isMobile={isMobile} />

      <Container fluid>
        <main className="py-3">
          <ToastContainer />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<AdvancedSearch />} />
            <Route
              path="/verify-email-otp"
              element={<EmailOtpVerification />}
            />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <GetCart />
                </PrivateRoute>
              }
            />

            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <Getnotifications />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <GetAccount />
                </PrivateRoute>
              }
            />
            <Route
              path="/account/password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <GetUserOrders />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <GetUserOrderDetail />
                </PrivateRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/unauthorized"
              element={
                <PrivateRoute>
                  <Unauthorized />
                </PrivateRoute>
              }
            />

            {/* Admin Dashboard Example */}
            {/* <Route 
              path="/admin" 
              element={
                <PrivateRoute roles={['admin', 'superadmin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } 
            /> */}

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundScreen />} />
          </Routes>
        </main>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;

