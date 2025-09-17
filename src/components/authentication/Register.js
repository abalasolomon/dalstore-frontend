import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { FiLock, FiMail, FiUser } from "react-icons/fi";

import Loader from "../../common/Loader";
// import Message from "../../common/Message";
import { register } from "../../redux/actions/userActions";
import { sendEmailOtp } from "../../redux/actions/emailOtpActions";
//import { axios } from "../../auth/axiosConfig";
//import { API_URL } from "../../config/apiConfig";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, success, error } = userRegister;

  const [successMessage, setSuccessMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  //   const [username, setUsername] = useState("");
  //   const [usernameError, setUsernameError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  //  const [agreeTerms, setAgreeTerms] = useState(false);
  // const [termsConditionsError, setTermsConditionsError] = useState("");

  const [formError, setFormError] = useState("");

  const [referralCode, setReferralCode] = useState("");
  const [selectedCountry] = useState("NG");

  useEffect(() => {
    if (userInfo && userInfo.is_email_verified) {
      // Handle redirect logic...
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, [location.search]);

  const formData = useMemo(
    () => ({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone_number: phoneNumber,
      referral_code: referralCode,
    }),
    [firstName, lastName, email, password, phoneNumber, referralCode]
  );

  useEffect(() => {
    if (success) {
      setSuccessMessage(
        "Registration successful! Please verify your email to continue."
      );
      // Send OTP
      dispatch(sendEmailOtp(email.toLowerCase().trim(), firstName));
      localStorage.setItem("registrationData", JSON.stringify(formData));
      navigate("/verify-email-otp");
    }
    if (error) {
      console.log("Registration error:", error);
      if (error.email) {
        setEmailError(error.email[0]);      
      }
      if (error.first_name) {
        setFirstNameError(error.first_name[0]);
      }
      if (error.last_name) {
        setLastNameError(error.last_name[0]);
      }
      if (error.phone_number) {
        setPhoneNumberError(error.phone_number[0]);
      }
      if (error.password) {
        setPasswordError(error.password[0]);
      }
      if (error.non_field_errors) {
        setFormError(error.non_field_errors[0]);
      }      
    }
  }, [dispatch, success,error, navigate, email, firstName, formData]);

  const validateForm = () => {
    let isValid = true;
    setFormError("");
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPhoneNumberError("");

    if (!firstName.trim()) {
      setFirstNameError("First name is required.");
      isValid = false;
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is required.");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError("Invalid email address.");
      isValid = false;
    }

    if (!phoneNumber) {
      setPhoneNumberError("Phone number is required.");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required.");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password.");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(register(formData));
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0 p-4 rounded-4">
            <h3 className="text-center mb-4">Create Account</h3>
            <Form onSubmit={submitHandler} noValidate>
              {/* First Name */}
              {formError && (
                <div className="alert alert-danger" role="alert">
                  {formError}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiUser />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    isInvalid={!!firstNameError}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="d-block">
                  {firstNameError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Last Name */}
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiUser />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    isInvalid={!!lastNameError}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="d-block">
                  {lastNameError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Email */}
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiMail />
                  </span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!emailError}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="d-block">
                  {emailError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Phone */}
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <PhoneInput
                  defaultCountry={selectedCountry}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  placeholder="Enter phone number"
                  className={`form-control p-0 ${
                    phoneNumberError ? "is-invalid" : ""
                  }`}
                  inputClassName="phone-input-style"
                />
                <Form.Control.Feedback
                  type="invalid"
                  className={phoneNumberError ? "d-block" : ""}
                >
                  {phoneNumberError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Password */}
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!passwordError}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="d-block">
                  {passwordError}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Confirm Password */}
              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FiLock />
                  </span>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    isInvalid={!!confirmPasswordError}
                  />
                </div>
                <Form.Control.Feedback type="invalid" className="d-block">
                  {confirmPasswordError}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading && <Loader />}
                Register
              </Button>
              <div className="text-center small">
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
