import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Form, Card, Badge, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { 
  FaShoppingCart, 
  FaTruck, 
  FaStore, 
  FaCreditCard, 
  FaLock, 
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import PayWithPaystack from "./PayWithPaystack";
import PayWithFlutterwave from "./PayWithFlutterwave";
import { createOrder } from "../../redux/actions/orderActions"; 

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cartList) || { cart: { items: [] } };
  
  const [pickup, setPickup] = useState(false);
  const [activePayment, setActivePayment] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  
  const [shipping, setShipping] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
  });

  const items = cart?.items || [];

  // Calculate prices with promotional logic
  const calculatePrices = () => {
    const subtotal = items.reduce((acc, item) => {
      const regularPrice = parseFloat(item.product?.price) || 0;
      const promoPrice = parseFloat(item.product?.promo_price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      
      const unitPrice = promoPrice > 0 && promoPrice < regularPrice ? promoPrice : regularPrice;
      
      return acc + (quantity * unitPrice);
    }, 0);

    // Calculate delivery fee - use product delivery price or default
    const deliveryFee = items.reduce((acc, item) => {
      if (pickup) return 0;
      
      const itemDeliveryPrice = parseFloat(item.product?.delivery_price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      
      return acc + (itemDeliveryPrice * quantity);
    }, 0);

    const finalAmount = subtotal + deliveryFee;

    return { subtotal, deliveryFee, finalAmount };
  };

  const { subtotal, deliveryFee, finalAmount } = calculatePrices();

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!pickup) {
      if (!shipping.fullName.trim()) errors.fullName = "Full name is required";
      if (!shipping.address.trim()) errors.address = "Address is required";
      if (!shipping.city.trim()) errors.city = "City is required";
      if (!shipping.state.trim()) errors.state = "State is required";
      if (!shipping.postalCode.trim()) errors.postalCode = "Postal code is required";
    }
    
    if (!activePayment) errors.payment = "Please select a payment method";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pickup, shipping, activePayment]);

  const handleFieldBlur = (fieldName) => {
    setTouchedFields(prev => ({ ...prev, [fieldName]: true }));
  };

  // const isFieldValid = (fieldName) => {
  //   return !formErrors[fieldName] || !touchedFields[fieldName];
  // };

  const handlePaymentSuccess = useCallback(
    async (response, provider) => {
      if (!validateForm()) {
        // Mark all fields as touched to show errors
        setTouchedFields({
          fullName: true, address: true, city: true, 
          state: true, postalCode: true, payment: true
        });
        return;
      }
      
      setIsProcessing(true);
      const reference = response?.reference || response?.tx_ref || "dev-reference";
      
      if (!reference || !subtotal) {
        setIsProcessing(false);
        return;
      }
      
      const PROVIDER_DISPLAY_MAP = {
        flutterwave: "Flutterwave",
        paystack: "Paystack",
      };
      
      const payment_method = response?.payment_type || "card";
      const payment_provider = PROVIDER_DISPLAY_MAP[provider] || "Unknown";

      const payload = {
        amount: finalAmount,
        currency: "NGN",
        method: payment_method,
        provider: payment_provider,
        reference,
        fulfillment_method: pickup ? "pickup" : "delivery",
        ...(pickup ? {} : shipping),
      };

      try {
        await dispatch(createOrder(payload));
        dispatch({ type: "CART_LIST_RESET" });
        navigate("/orders", { 
          state: { 
            message: "Order placed successfully!", 
            orderId: reference 
          } 
        });
      } catch (error) {
        console.error("Order creation failed:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [validateForm, subtotal, finalAmount, pickup, shipping, dispatch, navigate]
  );

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

  const canProceedToPayment = () => {
    if (!pickup) {
      const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode'];
      return requiredFields.every(field => shipping[field]?.trim());
    }
    return true;
  };

  if (items.length === 0) {
    return (
      <Container className="my-5">
        <Card className="text-center py-5">
          <Card.Body>
            <FaShoppingCart className="display-1 text-muted mb-3" />
            <h3>Your cart is empty</h3>
            <p className="text-muted mb-4">Add some items to your cart before checkout</p>
            <Button variant="primary" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold text-primary">Checkout</h1>
        <p className="text-muted">Complete your purchase securely</p>
      </div>

      <Row>
        {/* Left Column - Shipping & Payment */}
        <Col lg={8}>
          {/* Delivery Method */}
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <FaTruck className="text-primary me-2" />
                Delivery Method
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                <Form.Check
                  type="radio"
                  id="delivery"
                  name="deliveryMethod"
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <strong>Home Delivery</strong>
                        <div className="text-muted small">Get your order delivered to your address</div>
                        {deliveryFee > 0 && (
                          <small className="text-info">
                            Delivery fee calculated per product
                          </small>
                        )}
                      </div>
                      <Badge bg="light" text="dark">
                        {deliveryFee > 0 ? formatCurrency(deliveryFee) : "FREE"}
                      </Badge>
                    </div>
                  }
                  checked={!pickup}
                  onChange={() => setPickup(false)}
                  className="p-3 border rounded"
                />
                <Form.Check
                  type="radio"
                  id="pickup"
                  name="deliveryMethod"
                  label={
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <strong>Store Pickup</strong>
                        <div className="text-muted small">Pick up your order from our store</div>
                      </div>
                      <Badge bg="success">FREE</Badge>
                    </div>
                  }
                  checked={pickup}
                  onChange={() => setPickup(true)}
                  className="p-3 border rounded"
                />
              </div>
            </Card.Body>
          </Card>

          {/* Shipping Details */}
          {!pickup && (
            <Card className="shadow-sm border-0 mb-4">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center justify-content-between">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaStore className="text-primary me-2" />
                    Shipping Address
                  </h5>
                  {!canProceedToPayment() && (
                    <Badge bg="warning" className="d-flex align-items-center">
                      <FaExclamationTriangle className="me-1" />
                      Complete shipping details
                    </Badge>
                  )}
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shipping.fullName}
                        onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                        onBlur={() => handleFieldBlur('fullName')}
                        isInvalid={!!formErrors.fullName && touchedFields.fullName}
                        placeholder="Enter your full name"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.fullName}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shipping.address}
                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                        onBlur={() => handleFieldBlur('address')}
                        isInvalid={!!formErrors.address && touchedFields.address}
                        placeholder="Street address"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.address}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        onBlur={() => handleFieldBlur('city')}
                        isInvalid={!!formErrors.city && touchedFields.city}
                        placeholder="City"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.city}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        onBlur={() => handleFieldBlur('state')}
                        isInvalid={!!formErrors.state && touchedFields.state}
                        placeholder="State"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.state}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Postal Code *</Form.Label>
                      <Form.Control
                        type="text"
                        value={shipping.postalCode}
                        onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                        onBlur={() => handleFieldBlur('postalCode')}
                        isInvalid={!!formErrors.postalCode && touchedFields.postalCode}
                        placeholder="Postal code"
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.postalCode}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                    placeholder="Country"
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          )}

          {/* Payment Methods */}
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0 d-flex align-items-center">
                  <FaCreditCard className="text-primary me-2" />
                  Payment Method
                </h5>
                {!pickup && !canProceedToPayment() && (
                  <Badge bg="danger" className="d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    Complete shipping first
                  </Badge>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {formErrors.payment && <Alert variant="danger" className="py-2">{formErrors.payment}</Alert>}
              
              <div className="d-grid gap-3">
                <Card className={`border ${activePayment === 'paystack' ? 'border-primary' : ''}`}>
                  <Card.Body>
                    <Form.Check
                      type="radio"
                      id="paystack"
                      name="paymentMethod"
                      label="Pay with Paystack"
                      checked={activePayment === 'paystack'}
                      onChange={() => setActivePayment('paystack')}
                      className="fw-bold"
                      disabled={!pickup && !canProceedToPayment()}
                    />
                    <div className="mt-2">
                      <PayWithPaystack
                        amount={finalAmount}
                        onSuccess={(ref) => handlePaymentSuccess(ref, "paystack")}
                        disabled={!activePayment || isProcessing || (!pickup && !canProceedToPayment())}
                        isProcessing={isProcessing}
                      />
                    </div>
                  </Card.Body>
                </Card>

                <Card className={`border ${activePayment === 'flutterwave' ? 'border-primary' : ''}`}>
                  <Card.Body>
                    <Form.Check
                      type="radio"
                      id="flutterwave"
                      name="paymentMethod"
                      label="Pay with Flutterwave"
                      checked={activePayment === 'flutterwave'}
                      onChange={() => setActivePayment('flutterwave')}
                      className="fw-bold"
                      disabled={!pickup && !canProceedToPayment()}
                    />
                    <div className="mt-2">
                      <PayWithFlutterwave
                        amount={finalAmount}
                        onSuccess={(ref) => handlePaymentSuccess(ref, "flutterwave")}
                        disabled={!activePayment || isProcessing || (!pickup && !canProceedToPayment())}
                        isProcessing={isProcessing}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>

              {/* Security Badge */}
              <div className="mt-4 text-center">
                <div className="d-flex justify-content-center align-items-center text-muted small">
                  <FaLock className="me-2" />
                  <span>Your payment is secure and encrypted</span>
                  <FaShieldAlt className="ms-3 me-2" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Order Summary */}
        <Col lg={4}>
          <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <FaShoppingCart className="text-primary me-2" />
                Order Summary
              </h5>
            </Card.Header>
            <Card.Body>
              {/* Items List */}
              <div className="mb-3">
                {items.map((item) => {
                  const regularPrice = parseFloat(item.product?.price) || 0;
                  const promoPrice = parseFloat(item.product?.promo_price) || 0;
                  const itemDeliveryPrice = parseFloat(item.product?.delivery_price) || 0;
                  const quantity = parseInt(item.quantity) || 0;
                  
                  const unitPrice = promoPrice > 0 && promoPrice < regularPrice ? promoPrice : regularPrice;
                  const itemSubtotal = quantity * unitPrice;
                  //const itemDeliveryTotal = pickup ? 0 : quantity * itemDeliveryPrice;

                  return (
                    <div key={item.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.product.images?.[0]?.image || '/placeholder-image.jpg'} 
                            alt={item.product.name}
                            className="rounded me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-semibold small">{item.product.name}</div>
                            <div className="text-muted small">Qty: {quantity}</div>
                          </div>
                        </div>
                        <strong className="text-primary">{formatCurrency(itemSubtotal)}</strong>
                      </div>
                      
                      {/* Price breakdown per item */}
                      <div className="small text-muted">
                        <div className="d-flex justify-content-between">
                          <span>Unit Price:</span>
                          <span>
                            {promoPrice > 0 && promoPrice < regularPrice ? (
                              <>
                                <span className="text-decoration-line-through me-1">
                                  ₦{regularPrice.toLocaleString()}
                                </span>
                                <span className="text-danger fw-bold">
                                  ₦{promoPrice.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              `₦${regularPrice.toLocaleString()}`
                            )}
                          </span>
                        </div>
                        {!pickup && itemDeliveryPrice > 0 && (
                          <div className="d-flex justify-content-between">
                            <span>Delivery:</span>
                            <span>₦{itemDeliveryPrice.toLocaleString()} × {quantity}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee</span>
                  <span>{pickup ? formatCurrency(0) : formatCurrency(deliveryFee)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary h5">{formatCurrency(finalAmount)}</strong>
                </div>
              </div>

              {/* Security Note */}
              <div className="text-center small text-muted mt-3">
                <FaCheckCircle className="text-success me-1" />
                Secure checkout guaranteed
              </div>
            </Card.Body>
          </Card>

          {/* Back to Cart */}
          <Button 
            variant="outline-secondary" 
            className="w-100 mt-3"
            onClick={() => navigate("/cart")}
          >
            <FaArrowLeft className="me-2" />
            Back to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;