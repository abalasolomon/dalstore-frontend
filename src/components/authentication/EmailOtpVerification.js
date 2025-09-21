import { useState, useRef, useEffect, useMemo } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { Envelope, ArrowLeft, CheckCircle } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { verifyEmailOtp, sendEmailOtp } from "../../redux/actions/emailOtpActions";
import { login} from "../../redux/actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const EmailOtpVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [errorMsg, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const inputRefs = useRef([]);

  const emailOtpVerify = useSelector((state) => state.emailOtpVerify);
  const { loading, success, error } = emailOtpVerify;

  //const userRegisterData = JSON.parse(localStorage.getItem("registrationData")) || {};

  const userRegisterData = useMemo(() => {
    const registrationData = localStorage.getItem("registrationData");
    return registrationData ? JSON.parse(registrationData) : {};
  }, []);
  
  useEffect(() => {
    if (success) {
      setShowSuccessMessage(true);
      const loginData = {
        email: userRegisterData?.email?.toLowerCase().trim(),
        password: userRegisterData?.password?.trim(),
      };
      dispatch(login(loginData));
      setTimeout(() => {
        navigate("/");
        localStorage.removeItem("registrationData");
      }, 2000);
    }

    if (error) {
      setError(error);
    }
  }, [dispatch, success, error, navigate, userRegisterData]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
      setActiveInput(index + 1);
    } else if (index === 5 && value) {
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      setActiveInput(index - 1);
    }
  };

  const handleFocus = (index) => {
    setActiveInput(index);
    inputRefs.current[index].select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (isNaN(pasteData)) return;

    const newOtp = Array(6).fill("");
    for (let i = 0; i < pasteData.length; i++) {
      newOtp[i] = pasteData[i];
    }

    setOtp(newOtp);
    const nextIndex = pasteData.length - 1;
    setActiveInput(nextIndex);
    inputRefs.current[nextIndex]?.focus();

    if (pasteData.length === 6) {
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    if (otp.some((digit) => digit === "")) return;
    setIsLoading(true);
    setError("");
    const otpCode = otp.join("");
    dispatch(verifyEmailOtp(otpCode, userRegisterData.email));
    setIsLoading(false);
  };

  const handleResend = () => {
    setResendDisabled(true);
    try {
      dispatch(sendEmailOtp(userRegisterData.email, userRegisterData.first_name));
      setResendMessage(`OTP resent to ${userRegisterData.email} successfully.`);
    } catch {
      setResendMessage("Error resending OTP. Please try again.");
    }
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setActiveInput(0);
    inputRefs.current[0].focus();
    setError("");
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const inputStyle = {
    width: "3rem",
    height: "3.5rem",
    fontSize: "1.5rem",
    borderRadius: "0.5rem",
    textAlign: "center",
    border: "1px solid #dee2e6",
  };

  const activeInputStyle = {
    ...inputStyle,
    borderColor: "#0d6efd",
    boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
  };

  return (
    <Container style={{ paddingTop: "3rem", paddingBottom: "3rem", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Row className="justify-content-center w-100">
        <Col md={8} lg={8} xl={12}>
          <Card style={{ borderRadius: "1rem", boxShadow: "0 .125rem .25rem rgba(0,0,0,.075)" }}>
            <Card.Body className="p-3">
              {showSuccessMessage ? (
                <div className="text-center py-4">
                  <CheckCircle size={48} className="text-success mb-3" />
                  <h3 className="mb-3">Verification Successful!</h3>
                  <p className="text-muted mb-4">Your email has been successfully verified.</p>
                  <Button as={Link} to="/dashboard" variant="primary" className="w-100 rounded-pill">
                    Continue to Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-4">
                    <div style={{ backgroundColor: "#f8f9fa", borderRadius: "50%", display: "inline-flex", padding: "0.75rem", marginBottom: "1rem" }}>
                      <Envelope size={32} className="text-primary" />
                    </div>
                    <h3>Verify Your Email</h3>
                    <p className="text-muted">
                      Enter the 6-digit code sent to
                      <br />
                      <strong>{userRegisterData.email}</strong>
                    </p>
                  </div>

                  <Form onSubmit={handleVerify}>
                    <div className="d-flex justify-content-center flex-wrap gap-2 mb-3">
                      {otp.map((digit, index) => (
                        <Form.Control
                          key={index}
                          aria-label={`Digit ${index + 1}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onFocus={() => handleFocus(index)}
                          onPaste={handlePaste}
                          ref={(el) => (inputRefs.current[index] = el)}
                          style={activeInput === index ? activeInputStyle : inputStyle}
                          required
                        />
                      ))}
                    </div>

                    {errorMsg && <div className="text-danger text-center mb-2">{errorMsg}</div>}
                    {resendMessage && <div className="text-success text-center mb-2">{resendMessage}</div>}

                    <Button
                      variant="dark"
                      type="submit"
                      className="w-100 rounded-pill mb-3"
                      disabled={isLoading || otp.some((digit) => digit === "")}
                    >
                      {isLoading || loading ? "Verifying..." : "Verify"}
                    </Button>

                    <div className="text-center">
                      <p className="text-muted mb-2">
                        Didn't receive code?{" "}
                        <Button variant="light" className="p-0" onClick={handleResend} disabled={resendDisabled}>
                          Resend {resendDisabled && `(${countdown}s)`}
                        </Button>
                      </p>
                      <Button as={Link} to="/login" variant="light" className="text-muted">
                        <ArrowLeft className="me-1" /> Back to Login
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailOtpVerification;
