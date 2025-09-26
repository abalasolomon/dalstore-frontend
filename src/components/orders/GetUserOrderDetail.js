import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserOrderDetail } from "../../redux/actions/orderActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { FaShoppingBag, FaCreditCard, FaBox, FaTruck, FaCalendar, FaUser, FaHome, FaPrint } from "react-icons/fa";

const GetUserOrderDetail = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetail = useSelector((state) => state.orderDetail || {});
  const { loading, error, order } = orderDetail;

  useEffect(() => {
    if (orderId) {
      dispatch(getUserOrderDetail(orderId));
    }
  }, [dispatch, orderId]);

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

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <Message variant="danger">{error}</Message>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-4">
        <Message variant="info">Order not found</Message>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Order Details</h2>
          <p className="text-muted mb-0">Order #{order.id}</p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg={getStatusVariant(order.status)} className="fs-6 px-3 py-2 text-capitalize">
            {order.status}
          </Badge>
          <Button variant="outline-primary" size="sm" onClick={handlePrint}>
            <FaPrint className="me-2" />
            Print
          </Button>
        </div>
      </div>

      <Row>
        {/* Main Order Information */}
        <Col lg={8}>
          {/* Order Summary */}
          <Card className="shadow-sm mb-4">
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
                  <div className="mb-3">
                    <small className="text-muted">Fulfillment Method</small>
                    <div className="d-flex align-items-center">
                      <FaTruck className="text-muted me-2" />
                      <span className="text-capitalize">{order.fulfillment_method || 'Delivery'}</span>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <small className="text-muted">Total Amount</small>
                    <h4 className="text-primary mb-0">{formatCurrency(order.total)}</h4>
                  </div>
                  {order.fulfillment_method === 'delivery' && (
                    <div className="mb-3">
                      <small className="text-muted">Delivery Fee</small>
                      <p className="mb-0">{formatCurrency(order.delivery_fee || '0.00')}</p>
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Order Items */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaBox className="text-primary me-2" />
                <h5 className="mb-0">Order Items ({order.items?.length || 0})</h5>
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
                      <th className="border-0 text-center">Quantity</th>
                      <th className="border-0 text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.product?.images?.[0] && (
                              <img 
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
                        <td className="text-end">{formatCurrency(item.price)}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end fw-semibold">{formatCurrency(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-light">
                    <tr>
                      <td colSpan="4" className="text-end fw-semibold border-0">Total:</td>
                      <td className="text-end fw-bold border-0">{formatCurrency(order.total)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar Information */}
        <Col lg={4}>
          {/* Payment Information */}
          {order.payment && (
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center">
                  <FaCreditCard className="text-primary me-2" />
                  <h5 className="mb-0">Payment Information</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Payment Method</small>
                  <p className="mb-0 text-capitalize">{order.payment.method}</p>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Payment Status</small>
                  <div>
                    <Badge 
                      bg={order.payment.status === 'success' ? 'success' : 'warning'} 
                      className="text-capitalize"
                    >
                      {order.payment.status}
                    </Badge>
                  </div>
                </div>
                {order.payment.reference && (
                  <div className="mb-3">
                    <small className="text-muted">Reference Number</small>
                    <p className="mb-0 font-monospace">{order.payment.reference}</p>
                  </div>
                )}
                <div className="mb-3">
                  <small className="text-muted">Amount Paid</small>
                  <p className="mb-0 fw-semibold">{formatCurrency(order.payment.amount)}</p>
                </div>
                {order.payment.paid_at && (
                  <div className="mb-3">
                    <small className="text-muted">Paid At</small>
                    <p className="mb-0">{formatDate(order.payment.paid_at)}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Shipping Information */}
          <Card className="shadow-sm">
            <Card.Header className="bg-white py-3">
              <div className="d-flex align-items-center">
                <FaHome className="text-primary me-2" />
                <h5 className="mb-0">Shipping Information</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {order.shipping_address ? (
                <>
                  <div className="mb-3">
                    <small className="text-muted">Shipping Address</small>
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
                </>
              ) : (
                <div className="text-center text-muted py-3">
                  <FaHome className="display-4 opacity-25 mb-2" />
                  <p className="mb-0">No shipping information available</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Customer Information */}
          {order.user_details && (
            <Card className="shadow-sm mt-4">
              <Card.Header className="bg-white py-3">
                <div className="d-flex align-items-center">
                  <FaUser className="text-primary me-2" />
                  <h5 className="mb-0">Customer Information</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <small className="text-muted">Full Name</small>
                  <p className="mb-0 fw-semibold">
                    {order.user_details.first_name} {order.user_details.last_name}
                  </p>
                </div>
                <div className="mb-3">
                  <small className="text-muted">Email</small>
                  <p className="mb-0">{order.user_details.email}</p>
                </div>
                {order.user_details.phone_number && (
                  <div className="mb-3">
                    <small className="text-muted">Phone Number</small>
                    <p className="mb-0">{order.user_details.phone_number}</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Print Styles */}
      <style>{`
        @media print {
          .btn, .badge {
            display: none !important;
          }
          .card {
            border: 1px solid #000 !important;
            break-inside: avoid;
          }
          .container-fluid {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GetUserOrderDetail;