import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  Button,
  Image,
  ListGroup,
  Alert,
  Modal,
  Container,
} from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import {
  listCart,
  removeFromCart,
  increaseCartItem,
  decreaseCartItem,
  clearCart,
} from "../../redux/actions/cartActions";
import Message from "../../common/Message";
import Loader from "../../common/Loader";
import { useNavigate } from "react-router-dom";

const GetCart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartDetails = useSelector((state) => state.cartList);
  const { loading, error, cart } = cartDetails;

  const [showConfirm, setShowConfirm] = useState(false); // modal state

  useEffect(() => {
    dispatch(listCart());
  }, [dispatch]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const increaseQtyHandler = (id, qty) => {
    dispatch(increaseCartItem(id, qty + 1));
  };

  const decreaseQtyHandler = (id, qty) => {
    if (qty > 1) {
      dispatch(decreaseCartItem(id, qty - 1));
    }
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
    dispatch(listCart())
    setShowConfirm(false); // close modal after clearing
  };

  const checkoutHandler = () => {
    navigate("/checkout");
  };

  const items = cart?.items || [];
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  return (
    <>
    <Container className="mt-4">
      <Row>
        <Col md={8}>
          <h2 className="mb-4">Your Cart</h2>
          {loading ? (
            <Loader />
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : items.length === 0 ? (
            <>
            <h4 className="text-center">Your cart is empty</h4>
            <p className="text-center">
              <Button
                variant="dark"
                onClick={() => navigate("/")}
              > Browse Products</Button>
            </p>
            </>
          ) : (
            <ListGroup variant="flush">
              {items.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="d-flex align-items-center"
                >
                  <Image
                    src={item.product.images[0]?.image}
                    alt={item.product.images[0]?.alt_text || item.product.name}
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                    rounded
                  />

                  <div className="ms-3 flex-grow-1">
                    <h5>{item.product.name}</h5>
                    {item.variant && <small>Variant: {item.variant.name}</small>}
                    <div className="d-flex align-items-center mt-2">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() =>
                          decreaseQtyHandler(item.id, item.quantity)
                        }
                      >
                        -
                      </Button>
                      <span className="mx-2">{item.quantity}</span>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() =>
                          increaseQtyHandler(item.id, item.quantity)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-end">
                    <p>
                      ₦{item.product.price} × {item.quantity} ={" "}
                      <strong>₦{item.product.price * item.quantity}</strong>
                    </p>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCartHandler(item.id)}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>
                  Subtotal ({totalItems}) items
                </h4>
                ₦{subtotal.toFixed(2)}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="w-100 mb-2"
                  variant="danger"
                  disabled={items.length === 0}
                  onClick={() => setShowConfirm(true)} // open modal
                >
                  Clear Cart
                </Button>
                <Button
                  className="w-100"
                  variant="primary"
                  disabled={items.length === 0}
                  onClick={checkoutHandler}
                >
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Confirm Clear Cart Modal */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove all items from your cart?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearCartHandler}>
            Yes, Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </>
  );
};

export default GetCart;
