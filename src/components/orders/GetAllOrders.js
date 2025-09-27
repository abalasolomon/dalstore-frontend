import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../redux/actions/orderActions";
import {
  Card,
  Spinner,
  Alert,
  Badge,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaEye,
  FaSort,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaShoppingBag,
} from "react-icons/fa";
import Sidebar from "../../common/Sidebar";

function GetAllOrders() {
  const dispatch = useDispatch();
  const allOrderList = useSelector((state) => state.allOrderList);
  const { loading, error, orders } = allOrderList;

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  // Filter and sort orders
  const filteredOrders =
    orders
      ?.filter((order) => {
        const matchesSearch =
          order.user_details?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.id?.toString().includes(searchTerm) ||
          order.total?.includes(searchTerm);

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

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
      case "completed":
        return "success";
      case "processing":
        return "primary";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const getOrderCountByStatus = (status) => {
    if (!orders) return 0;
    return status === "all"
      ? orders.length
      : orders.filter((order) => order.status === status).length;
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mx-3">
        <strong>Error:</strong> {error}
      </Alert>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h3 mb-1">All Orders</h2>
                <p className="text-muted mb-0">
                  Manage and track customer orders
                </p>
              </div>
              <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                Total: {orders?.length || 0} orders
              </Badge>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="border-0 bg-primary bg-opacity-10">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="text-primary">
                          {getOrderCountByStatus("all")}
                        </h4>
                        <span className="text-muted">Total Orders</span>
                      </div>
                      <FaShoppingBag className="text-primary fs-3" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="border-0 bg-warning bg-opacity-10">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="text-warning">
                          {getOrderCountByStatus("pending")}
                        </h4>
                        <span className="text-muted">Pending</span>
                      </div>
                      <FaCalendarAlt className="text-warning fs-3" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="border-0 bg-info bg-opacity-10">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="text-info">
                          {getOrderCountByStatus("processing")}
                        </h4>
                        <span className="text-muted">Processing</span>
                      </div>
                      <FaUser className="text-info fs-3" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="border-0 bg-success bg-opacity-10">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="text-success">
                          {getOrderCountByStatus("completed")}
                        </h4>
                        <span className="text-muted">Completed</span>
                      </div>
                      <FaShoppingBag className="text-success fs-3" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Filters and Search */}
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
                        placeholder="Search by ID, email, or amount..."
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
                        <FaSort />
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

            {/* Orders Table */}
            <Card className="shadow-sm">
              <Card.Header className="bg-white py-3">
                <h5 className="mb-0">Order List</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0">Order ID</th>
                        <th className="border-0">Customer</th>
                        <th className="border-0 text-end">Amount</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Date</th>
                        <th className="border-0 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="text-muted">
                              <FaSearch className="display-4 opacity-25 mb-2" />
                              <p>No orders found matching your criteria</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <div className="fw-semibold">#{order.id}</div>
                              <small className="text-muted">
                                {order.items?.length || 0} items
                              </small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaUser className="text-muted me-2" />
                                <div>
                                  <div className="fw-semibold">
                                    {order.user_details?.email}
                                  </div>
                                  {order.user_details && (
                                    <small className="text-muted">
                                      {order.user_details.first_name}{" "}
                                      {order.user_details.last_name}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-end">
                              <div className="fw-semibold">
                                {formatCurrency(order.total)}
                              </div>
                              <small className="text-muted">
                                {order.items?.length || 0} items
                              </small>
                            </td>
                            <td>
                              <Badge
                                bg={getStatusVariant(order.status)}
                                className="text-capitalize"
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="text-muted me-2" />
                                <span>{formatDate(order.created_at)}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/admin/orders/${order.id}`}
                                className="btn btn-sm btn-outline-primary"
                                title="View Order Details"
                              >
                                <FaEye className="me-1" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>

            {/* Results Count */}
            {filteredOrders.length > 0 && (
              <div className="mt-3 text-muted text-center">
                Showing {filteredOrders.length} of {orders?.length} orders
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GetAllOrders;
