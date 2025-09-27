import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Button,
  Image,
  Alert,
  Modal,
  Container,
  Badge,
  //InputGroup,
  Form,
} from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft, FaCreditCard } from "react-icons/fa";
import {
  listCart,
  removeFromCart,
  increaseCartItem,
  decreaseCartItem,
  clearCart,
} from "../../redux/actions/cartActions";
import Loader from "../../common/Loader";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "../../common/toastConfig";

const GetCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartDetails = useSelector((state) => state.cartList);
  const { loading, error, cart } = cartDetails;

  const [showConfirm, setShowConfirm] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    dispatch(listCart());
  }, [dispatch]);

  const removeFromCartHandler = async (id) => {
    setUpdatingItem(id);
    await dispatch(removeFromCart(id));
    setUpdatingItem(null);
    showSuccess("Item removed from cart");
  };

  const updateQuantityHandler = async (id, newQty) => {
    if (newQty < 1) return;
    
    setUpdatingItem(id);
    if (newQty > cart.items.find(item => item.id === id)?.quantity) {
      await dispatch(increaseCartItem(id, newQty));
    } else {
      await dispatch(decreaseCartItem(id, newQty));
    }
    setUpdatingItem(null);
  };

  const clearCartHandler = async () => {
    await dispatch(clearCart());
    dispatch(listCart());
    showSuccess("Cart cleared successfully");
    setShowConfirm(false);
  };

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  const continueShoppingHandler = () => {
    navigate("/");
  };

  const items = cart?.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = items.reduce((acc, item) => {
    const regularPrice = parseFloat(item.product?.price) || 0;
    const promoPrice = parseFloat(item.product?.promo_price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    
    const unitPrice = promoPrice > 0 && promoPrice < regularPrice ? promoPrice : regularPrice;
    
    return acc + (quantity * unitPrice);
  }, 0);

  const PriceDisplay = ({ item }) => {
    const regularPrice = parseFloat(item.product?.price) || 0;
    const promoPrice = parseFloat(item.product?.promo_price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    
    const hasPromo = promoPrice > 0 && promoPrice < regularPrice;
    const unitPrice = hasPromo ? promoPrice : regularPrice;
    const totalPrice = unitPrice * quantity;

    return (
      <div className="text-end">
        {hasPromo && (
          <div className="mb-1">
            <span className="text-decoration-line-through text-muted me-2 small">
              ₦{regularPrice.toLocaleString()}
            </span>
            {/* <Badge bg="danger" className="small">Save ₦{(regularPrice - promoPrice).toLocaleString()}</Badge> */}
          </div>
        )}
        <div className="d-flex flex-column">
          <span className={hasPromo ? "text-danger fw-bold" : "fw-bold"}>
            ₦{unitPrice.toLocaleString()} × {quantity}
          </span>
          <strong className="text-primary h6 mb-0">
            ₦{totalPrice.toLocaleString()}
          </strong>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Loader />
        </div>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Shopping Cart</h1>
          <p className="text-muted mb-0">
            {items.length > 0 
              ? `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'
            }
          </p>
        </div>
        <Button variant="outline-secondary" onClick={continueShoppingHandler}>
          <FaArrowLeft className="me-2" />
          Continue Shopping
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <FaShoppingBag className="display-1 text-muted opacity-25 mb-3" />
            <h3 className="text-muted">Your cart is empty</h3>
            <p className="text-muted mb-4">Add some amazing products to your cart</p>
            <Button variant="primary" size="lg" onClick={continueShoppingHandler}>
              Start Shopping
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {/* Cart Items */}
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-white py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Cart Items ({totalItems})</h5>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => setShowConfirm(true)}
                  >
                    <FaTrash className="me-2" />
                    Clear Cart
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {items.map((item) => (
                  <div key={item.id} className="border-bottom p-4">
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image
                          src={item.product.images?.[0]?.image || '/placeholder-image.jpg'}
                          alt={item.product.images?.[0]?.alt_text || item.product.name}
                          className="rounded-3"
                          fluid
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover'
                          }}
                        />
                      </Col>
                      
                      <Col md={4}>
                        <h6 className="fw-bold mb-1">{item.product.name}</h6>
                        <p className="text-muted small mb-1">{item.product.category}</p>
                        {item.variant && (
                          <Badge bg="light" text="dark" className="small">
                            {item.variant.name}
                          </Badge>
                        )}
                      </Col>
                      
                      <Col md={3}>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantityHandler(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updatingItem === item.id}
                          >
                            <FaMinus />
                          </Button>
                          
                          <Form.Control
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantityHandler(item.id, parseInt(e.target.value) || 1)}
                            className="mx-2 text-center"
                            style={{ width: '70px' }}
                            min="1"
                            disabled={updatingItem === item.id}
                          />
                          
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantityHandler(item.id, item.quantity + 1)}
                            disabled={updatingItem === item.id}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        {updatingItem === item.id && (
                          <small className="text-muted">Updating...</small>
                        )}
                      </Col>
                      
                      <Col md={2}>
                        <PriceDisplay item={item} />
                      </Col>
                      
                      <Col md={1}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeFromCartHandler(item.id)}
                          disabled={updatingItem === item.id}
                          className="rounded-circle"
                          style={{ width: '35px', height: '35px' }}
                        >
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 sticky-top" style={{ top: '100px' }}>
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items ({totalItems})</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery</span>
                  <span className="text-muted">Calculated at checkout</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Subtotal</strong>
                  <strong className="text-primary h5">₦{subtotal.toLocaleString()}</strong>
                </div>
                
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 mb-2"
                  onClick={checkoutHandler}
                >
                  <FaCreditCard className="me-2" />
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  className="w-100"
                  onClick={continueShoppingHandler}
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Confirm Clear Cart Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaTrash className="display-4 text-muted mb-3" />
            <h5>Are you sure?</h5>
            <p className="text-muted">
              This will remove all {totalItems} item{totalItems !== 1 ? 's' : ''} from your cart. 
              This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearCartHandler}>
            <FaTrash className="me-2" />
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GetCart;