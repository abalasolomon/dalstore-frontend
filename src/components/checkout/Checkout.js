import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import PayWithPaystack from "./PayWithPaystack";
import PayWithFlutterwave from "./PayWithFlutterwave";
import { createOrder } from "../../redux/actions/orderActions"; 
import { useNavigate } from "react-router-dom"; 

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cartList) || {
    cart: { items: [] },
  };
  const [pickup, setPickup] = useState(false);
//  const [activeTab, setActiveTab] = useState(""); // Track active payment method
 // const [paymentData, setPaymentData] = useState(null); // Store payment data
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const items = cart?.items || [];
  const totalAmount = cart?.total || 0;

  const handlePaymentSuccess = useCallback(
    (response, provider) => {
      const reference =
        response?.reference || response?.tx_ref || "dev-reference";
      if (!reference || !totalAmount) return;
      
      const PROVIDER_DISPLAY_MAP = {
        flutterwave: "Flutterwave",
        paystack: "Paystack",
      };
      
      // Default method is "card" unless we can extract from response
      const payment_method = response?.payment_type || "card";
      const payment_provider = PROVIDER_DISPLAY_MAP[provider] || "Unknown";

      const payload = {
        amount: totalAmount,
        currency: "NGN",
        method: payment_method,
        provider: payment_provider,
        reference,
        ...shipping,
      };

      // Dispatch backend funding call
      
      dispatch(createOrder(payload)).then(() => {
        navigate("/orders"); // Redirect to success page
      });

    },
    [totalAmount, dispatch,shipping, navigate]
  );

  return (
    <Container className="my-5">
      <Row>
        {/* Shipping Details */}
        <Col md={6}>
          <Card className="p-4 shadow-sm rounded-3">
            <h4 className="mb-3">Shipping Details</h4>
            <Form>
              <Form.Check
                type="switch"
                id="pickup"
                label="Pickup Order Instead of Delivery"
                checked={pickup}
                onChange={(e) => setPickup(e.target.checked)}
                className="mb-3"
              />
              {!pickup && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) =>
                        setShipping({ ...shipping, fullName: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={shipping.address}
                      onChange={(e) =>
                        setShipping({ ...shipping, address: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping({ ...shipping, city: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          value={shipping.state}
                          onChange={(e) =>
                            setShipping({ ...shipping, state: e.target.value })
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          value={shipping.postalCode}
                          onChange={(e) =>
                            setShipping({
                              ...shipping,
                              postalCode: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      value={shipping.country}
                      onChange={(e) =>
                        setShipping({ ...shipping, country: e.target.value })
                      }
                    />
                  </Form.Group>
                </>
              )}
            </Form>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col md={6}>
          <Card className="p-4 shadow-sm rounded-3">
            <h4 className="mb-3">Order Summary</h4>
            {items.length === 0 ? (
              <p>Your cart is empty</p>  
              
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center mb-2"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <strong>₦{item.subtotal.toLocaleString()}</strong>
                  </div>
                ))}
                <hr />
                <h5 className="d-flex justify-content-between">
                  <span>Total:</span>
                  <strong>₦{totalAmount.toLocaleString()}</strong>
                </h5>
                <div className="mt-4 d-grid gap-2">
                  <PayWithPaystack
                    amount={totalAmount}
                    onSuccess={(ref) => handlePaymentSuccess(ref, "paystack")}
                  />
                  <PayWithFlutterwave
                    amount={totalAmount}
                    onSuccess={(ref) => handlePaymentSuccess(ref, "flutterwave")}
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;