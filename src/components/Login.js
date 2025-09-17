import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Link, 
  useHistory, 
  // useLocation
 } from "react-router-dom";
import { Row, Col, Form, Container, Button, Alert } from "react-bootstrap";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { login } from "../../redux/actions/userActions";
import { Envelope, Lock, Google } from 'react-bootstrap-icons';
import { getRedirectPath } from "../../utils/redirectByRole";


function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  // const location = useLocation();

  // Get redirect path from URL, defaults to '/'
  // const redirect = location.search ? location.search.split("=")[1] : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo, success } = userLogin;

  // Memoize login data
  const loginData = useMemo(() => {
    return {
      email: email.toLowerCase().trim(),
      password: password.trim(),
    };
  }, [email, password]);

  // Effect for already logged-in users
  useEffect(() => {
    if ( userInfo) {
      const redirect = async () => {
        const destination = await getRedirectPath(userInfo);
        console.log('Redirecting to:', destination);
  
        const timer = setTimeout(() => {
          history.push(destination);
        }, 3000);
  
        return () => clearTimeout(timer);
      };
  
      redirect(); // Call the async function
    }
  }, [ userInfo, history]);
  
  
  // useEffect(() => {
  //   if (userInfo) {
  //     if (userInfo.is_email_verified) {
  //       // Determine redirect path based on user type
  //       // console.log(userInfo)
  //       // let userTypeRedirectPath;
  //       // if (userInfo.user_type === 'professional') {
  //       //   userTypeRedirectPath = '/brand-setup'; // Professional's dashboard
  //       // } else {
  //       //   userTypeRedirectPath = '/'; // Client's home page or default
  //       // }

  //       // // Use the redirect from URL if it exists, otherwise use the userType-specific path
  //       // const finalRedirect = redirect !== '/' ? redirect : userTypeRedirectPath;

  //       const timer = setTimeout(() => {
  //         //console.log('final destination:',finalRedirect)
  //         //history.push(finalRedirect);
  //       }, 1000); // Shorter delay if already logged in
  //       return () => clearTimeout(timer);
  //     } else {
  //       // Logged in but not verified, redirect to verification
  //       const timer = setTimeout(() => {
  //         history.push("/verify-email-otp");
  //       }, 1000); // Shorter delay for verification redirect
  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [userInfo, history, redirect]);


  // Effect for newly successful login attempts
  // useEffect(() => {
  //   if (success && userInfo) { // Ensure userInfo is available after successful login
  //     if (userInfo.is_email_verified) {
  //       // Login successful and email verified, go to target page
  //       console.log(userInfo)
  //       let userTypeRedirectPath;
  //       if (userInfo.role === 'professional') {
  //         userTypeRedirectPath = '/brand-setup'; // Professional's dashboard
  //       } else if(userInfo.role === 'client') {
  //         userTypeRedirectPath = '/'; // Client's home page or default
  //       }

  //       // Use the redirect from URL if it exists, otherwise use the userType-specific path
  //       const finalRedirect = redirect !== '/' ? redirect : userTypeRedirectPath;

  //       const timer = setTimeout(() => {
  //         history.push(finalRedirect);
  //       }, 3000); // 3-second delay for "Login successful" message
  //       return () => clearTimeout(timer);
  //     } else {
  //       // Login successful but email not verified, redirect to verification
  //       const timer = setTimeout(() => {
  //         history.push("/verify-email-otp");
  //       }, 3000); // 3-second delay for "Please verify email" message
  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [dispatch, success, history, userInfo, redirect]);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(loginData)); // Dispatch login action with memoized data
  };

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <Row className="justify-content-center mb-4">
        <Col className="text-center">
          <h1 className="fw-bold mb-3">Welcome back</h1>
          <p className="text-muted">Log in to book or manage your appointments</p>
        </Col>
      </Row>

      <Row>
        <Col>
          {/* Social login button - consider making it functional */}
          <Button
            variant="outline-secondary"
            className="w-100 mb-3 rounded-pill"
            // onClick handler for Google login would go here
          >
            <Google className="me-2" /> Continue with Google
          </Button>

          {/* Messages for loading, error, success */}
          {loading && <Loader />}
          {error && <Message variant="danger">{error}</Message>}
          {success && userInfo && userInfo.is_email_verified && <Message variant="success">Login successful! Redirecting...</Message>}
          {success && userInfo && !userInfo.is_email_verified && <Message variant="warning">Login successful! Please verify your email. Redirecting...</Message>}

          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <span className="input-group-text">
                  <Envelope />
                </span>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email} // State binding
                  onChange={(e) => setEmail(e.target.value)} // State update
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label>Password</Form.Label>
                <Link to="/reset-password-request" className="text-primary small">Forgot password?</Link>
              </div>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock />
                </span>
                <Form.Control
                  type={passwordVisible ? "text" : "password"} // Dynamic type
                  placeholder="Enter your password"
                  value={password} // State binding
                  onChange={(e) => setPassword(e.target.value)} // State update
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="password-toggle-button"
                  style={{ borderLeft: 'none' }}
                >
                  {passwordVisible ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3 form-check">
              <Form.Check type="checkbox" label="Remember me" />
            </Form.Group>

            <Button
              type="submit" // Set type to submit
              variant="warning"
              className="w-100 rounded-pill py-2 mb-3"
              disabled={loading || !email || !password} // Disable if loading or inputs are empty
            >
              Log In
            </Button>

            <Alert variant="light" className="text-center">
              Don't have an account? <Link to="/select-usertype" className="text-primary">Sign up</Link>
            </Alert>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;