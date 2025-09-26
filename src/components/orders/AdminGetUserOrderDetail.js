import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserOrderDetail, updateOrderStatus } from "../../redux/actions/orderActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import {Image, Button, Form, Card, Badge, Row, Col } from "react-bootstrap";
import { showSuccess } from "../../common/toastConfig";
import { FaUser, FaShoppingBag, FaTruck, FaCalendar, FaPhone, FaEnvelope, FaBox } from "react-icons/fa";

const AdminGetUserOrderDetail = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetail = useSelector((state) => state.orderDetail || {});
  const { loading, error, order } = orderDetail;

  const orderUpdate = useSelector((state) => state.orderUpdate || {});
  const { success: updateSuccess, loading: updateLoading } = orderUpdate;

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (orderId) {
      dispatch(getUserOrderDetail(orderId));
    }
  }, [dispatch, orderId, updateSuccess]);

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
    }
    if (updateSuccess) {
      showSuccess("Order status updated successfully");
    }
  }, [order, updateSuccess]);

  const updateStatusHandler = (e) => {
    e.preventDefault();
    if (status && status !== order.status) {
      dispatch(updateOrderStatus(orderId, { status }));
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'primary';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return <Message variant="info">Order not found</Message>;

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Order Details</h2>
          <p className="text-muted mb-0">Order #{order.id}</p>
        </div>
        <Badge bg={getStatusVariant(order.status)} className="fs-6 px-3 py-2">
          {order.status_display}
        </Badge>
      </div>

      <Row>
        {/* Left Column - Order & User Info */}
        <Col lg={8}>
          {/* Order Summary Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaShoppingBag className="text-primary me-2" />
                <h5 className="mb-0">Order Summary</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted">Order Date</small>
                    <div className="d-flex align-items-center">
                      <FaCalendar className="text-muted me-2" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted">Fulfillment Method</small>
                    <div className="d-flex align-items-center">
                      <FaTruck className="text-muted me-2" />
                      <span className="text-capitalize">{order.fulfillment_method || 'Delivery'}</span>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="mb-3">
                <small className="text-muted">Total Amount</small>
                <h4 className="text-primary mb-0">₦{order.total}</h4>
              </div>
            </Card.Body>
          </Card>

          {/* User Information Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaUser className="text-primary me-2" />
                <h5 className="mb-0">Customer Information</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {order.user_details && (
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted">Full Name</small>
                      <p className="mb-0 fw-semibold">
                        {order.user_details.first_name} {order.user_details.last_name}
                      </p>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Email</small>
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="text-muted me-2" />
                        <span>{order.user_details.email}</span>
                        {order.user_details.is_email_verified && (
                          <Badge bg="success" className="ms-2">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <small className="text-muted">Phone Number</small>
                      <div className="d-flex align-items-center">
                        <FaPhone className="text-muted me-2" />
                        <span>{order.user_details.phone_number}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted">Member Since</small>
                      <p className="mb-0">{formatDate(order.user_details.date_joined)}</p>
                    </div>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Order Items Card */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaBox className="text-primary me-2" />
                <h5 className="mb-0">Order Items</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Product</th>
                      <th className="border-0">Variant</th>
                      <th className="border-0 text-end">Price</th>
                      <th className="border-0 text-center">Qty</th>
                      <th className="border-0 text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product?.images?.[0] && (
                              <Image
                                src={item.product.images[0].image} 
                                alt={item.product.images[0].alt_text || item.product_name}
                                className="rounded me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <div className="fw-semibold">{item.product_name}</div>
                              {item.product?.category && (
                                <small className="text-muted">{item.product.category}</small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={item.variant_name ? "text-dark" : "text-muted"}>
                            {item.variant_name || "Standard"}
                          </span>
                        </td>
                        <td className="text-end">₦{item.price}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end fw-semibold">₦{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Actions & Additional Info */}
        <Col lg={4}>
          {/* Status Update Card */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <h5 className="mb-0">Update Status</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={updateStatusHandler}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Order Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
                <Button 
                  type="submit" 
                  variant="dark" 
                  disabled={updateLoading || status === order.status}
                  className="w-100"
                >
                  {updateLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
                {status === order.status && (
                  <div className="text-muted text-center mt-2 small">
                    Status is already {order.status_display}
                  </div>
                )}
              </Form>
            </Card.Body>
          </Card>

          {/* Shipping Information Card */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaTruck className="text-primary me-2" />
                <h5 className="mb-0">Shipping Information</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {order.shipping_address ? (
                <div>
                  <div className="mb-2">
                    <small className="text-muted">Address</small>
                    <p className="mb-0">{order.shipping_address}</p>
                  </div>
                  <Row>
                    <Col sm={6}>
                      <small className="text-muted">City</small>
                      <p className="mb-0">{order.shipping_city}</p>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted">Postal Code</small>
                      <p className="mb-0">{order.shipping_postal_code}</p>
                    </Col>
                  </Row>
                  <div className="mt-2">
                    <small className="text-muted">State/Country</small>
                    <p className="mb-0">
                      {order.shipping_state}{order.shipping_country ? `, ${order.shipping_country}` : ''}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  <FaTruck className="display-4 opacity-25 mb-2" />
                  <p className="mb-0">No shipping information available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminGetUserOrderDetail;