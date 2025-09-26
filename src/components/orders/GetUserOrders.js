import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../redux/actions/orderActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { Link } from "react-router-dom";
import { Card, Row, Col, Badge, Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch, FaEye, FaBox, FaCalendar, FaTruck, FaFilter, FaShoppingBag } from "react-icons/fa";

const GetUserOrders = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector((state) => state.userOrders || {});
  const { loading, error, orders } = userOrders;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Filter and sort orders
  const filteredOrders = orders
    ?.filter(order => {
      const matchesSearch = 
        order.id?.toString().includes(searchTerm) ||
        order.total?.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "amount_high":
          return parseFloat(b.total) - parseFloat(a.total);
        case "amount_low":
          return parseFloat(a.total) - parseFloat(b.total);
        default:
          return 0;
      }
    }) || [];

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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const getTotalItems = (order) => {
    return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getOrderCountByStatus = (status) => {
    if (!orders) return 0;
    return status === 'all' 
      ? orders.length 
      : orders.filter(order => order.status === status).length;
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

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">My Orders</h2>
          <p className="text-muted mb-0">Track and manage your orders</p>
        </div>
        <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
          {orders?.length || 0} orders
        </Badge>
      </div>

      {/* Stats Cards */}
      {orders && orders.length > 0 && (
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="border-0 bg-primary bg-opacity-10 h-100">
              <Card.Body className="text-center">
                <FaShoppingBag className="text-primary fs-1 mb-2" />
                <h4 className="text-primary">{getOrderCountByStatus('all')}</h4>
                <span className="text-muted">Total Orders</span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 bg-warning bg-opacity-10 h-100">
              <Card.Body className="text-center">
                <FaCalendar className="text-warning fs-1 mb-2" />
                <h4 className="text-warning">{getOrderCountByStatus('pending')}</h4>
                <span className="text-muted">Pending</span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 bg-info bg-opacity-10 h-100">
              <Card.Body className="text-center">
                <FaTruck className="text-info fs-1 mb-2" />
                <h4 className="text-info">{getOrderCountByStatus('processing')}</h4>
                <span className="text-muted">Processing</span>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="border-0 bg-success bg-opacity-10 h-100">
              <Card.Body className="text-center">
                <FaBox className="text-success fs-1 mb-2" />
                <h4 className="text-success">{getOrderCountByStatus('completed')}</h4>
                <span className="text-muted">Completed</span>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Search */}
      {orders && orders.length > 0 && (
        <Card className="shadow-sm mb-4">
          <Card.Body>
            <Row className="g-3">
              <Col md={4}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by order ID or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={3}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaCalendar />
                  </InputGroup.Text>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="amount_high">Amount: High to Low</option>
                    <option value="amount_low">Amount: Low to High</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setSortBy("newest");
                  }}
                  className="w-100"
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Orders List */}
      {orders?.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <FaShoppingBag className="display-1 text-muted opacity-25 mb-3" />
            <h4 className="text-muted">No orders yet</h4>
            <p className="text-muted mb-4">You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </Card.Body>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card className="shadow-sm text-center py-5">
          <Card.Body>
            <FaSearch className="display-1 text-muted opacity-25 mb-3" />
            <h4 className="text-muted">No orders found</h4>
            <p className="text-muted mb-4">Try adjusting your search or filters.</p>
            <Button
              variant="outline-primary"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setSortBy("newest");
              }}
            >
              Clear Filters
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="row g-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="col-12">
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={3}>
                      <div className="d-flex align-items-center">
                        <div className="bg-light rounded p-3 me-3">
                          <FaBox className="text-primary fs-4" />
                        </div>
                        <div>
                          <h6 className="mb-1">Order #{order.id}</h6>
                          <small className="text-muted">
                            {getTotalItems(order)} items
                          </small>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={2}>
                      <div>
                        <small className="text-muted d-block">Date</small>
                        <div className="d-flex align-items-center">
                          <FaCalendar className="text-muted me-1 small" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={2}>
                      <div>
                        <small className="text-muted d-block">Total</small>
                        <strong className="text-primary">{formatCurrency(order.total)}</strong>
                      </div>
                    </Col>
                    
                    <Col md={2}>
                      <div>
                        <small className="text-muted d-block">Status</small>
                        <Badge bg={getStatusVariant(order.status)} className="text-capitalize">
                          {order.status}
                        </Badge>
                      </div>
                    </Col>
                    
                    <Col md={2}>
                      <div>
                        <small className="text-muted d-block">Type</small>
                        <div className="d-flex align-items-center">
                          <FaTruck className="text-muted me-1 small" />
                          <span className="text-capitalize">{order.fulfillment_method}</span>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={1}>
                      <Link
                        to={`/orders/${order.id}`}
                        className="btn btn-outline-primary btn-sm w-100"
                        title="View Order Details"
                      >
                        <FaEye className="me-1" />
                        View
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-center text-muted">
          Showing {filteredOrders.length} of {orders?.length} orders
        </div>
      )}
    </div>
  );
};

export default GetUserOrders;