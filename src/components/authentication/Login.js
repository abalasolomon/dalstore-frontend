

import { FiLock, FiMail } from "react-icons/fi";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Link, 
  useLocation, 
  useNavigate, 
  // useLocation
 } from "react-router-dom";
import { Row, Col, Form, Container, Button,
     //Alert, 
     Card } from "react-bootstrap";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { login } from "../../redux/actions/userActions";
//import { Envelope, Lock, Google } from 'react-bootstrap-icons';
import { getRedirectPath } from "../../utils/redirectByRole";


function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const [passwordVisible, setPasswordVisible] = useState(false); 
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo, success } = userLogin;
  const redirectPath = new URLSearchParams(location.search).get("next") || false;

  // Memoize login data
  const loginData = useMemo(() => {
    return {
      email: email.toLowerCase().trim(),
      password: password.trim(),
    };
  }, [email, password]);

  // Effect for already logged-in users
  // useEffect(() => {
  //   if (success && userInfo) {
  //     const redirect = async () => {
  //       const destination = await getRedirectPath(userInfo);
  //       const timer = setTimeout(() => {
  //         navigate(destination);
  //       }, 3000);
  
  //       return () => clearTimeout(timer);
  //     };
  
  //    redirect(); // Call the async function
  //   }
  // }, [success, userInfo, navigate]);

    // Effect for already logged-in users
  useEffect(() => {
    if (success && userInfo) {
      const redirect = async () => {
        const destination = redirectPath || (await getRedirectPath(userInfo.user));
        console.log("Redirecting to:", destination);

        const timer = setTimeout(() => {
          navigate(destination);
        }, 3000);

        return () => clearTimeout(timer);
      };

      redirect(); // Call the async function
    }
  }, [success, userInfo, navigate, redirectPath]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(loginData)); // Dispatch login action with memoized data
  };
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg border-0 p-4 rounded-4">
            <h3 className="text-center mb-4">Welcome Back</h3>
          {/* Messages for loading, error, success */}
          {loading && <Loader />}
          {error && <Message variant="danger">{error === "Invalid token" ? " Invalid Username or Password ": error}</Message>}
          {success && userInfo && userInfo.user.is_email_verified && <Message variant="success">Login successful! Redirecting...</Message>}
          {success && userInfo && !userInfo.user.is_email_verified && <Message variant="warning">Login successful! Please verify your email. Redirecting...</Message>}
            <Form onSubmit={submitHandler}>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email address</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FiMail /></span>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-group">
                  <span className="input-group-text"><FiLock /></span>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <Button type="submit" variant="dark" className="w-100 mb-3">
                Log In
              </Button>
              <div className="text-center small">
                Don't have an account? <Link to="/register" className="text-dark" >Register</Link>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
