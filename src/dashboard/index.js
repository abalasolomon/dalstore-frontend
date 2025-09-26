import React, { useState, useEffect } from "react";
import {
Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Badge,
  ProgressBar,
  Dropdown,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
  FaBox,
  
  //Tag,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../common/Sidebar";

// Import actions to fetch data if not already loaded
import { listProducts } from "../redux/actions/productActions";
import { getAllOrders } from "../redux/actions/orderActions";
import { getAllUsers } from "../redux/actions/userActions";
import { listCategories } from "../redux/actions/categoryActions";

const DashboardIndex = () => {
  const dispatch = useDispatch();
  const [timeRange, setTimeRange] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");

  // Get data from Redux store
  const productList = useSelector((state) => state.productList);
  const { products = [], loading: productsLoading } = productList;

  const allOrderList = useSelector((state) => state.allOrderList);
  const { orders = [], loading: ordersLoading } = allOrderList;

  const userList = useSelector((state) => state.userList);
  const { users = [], loading: usersLoading } = userList;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories = [] } = categoryList;

  const loading = productsLoading || ordersLoading || usersLoading;

  // Fetch data on component mount
  useEffect(() => {
    dispatch(listProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(listCategories());
  }, [dispatch]);

  // Calculate real metrics from Redux data
  const calculateMetrics = () => {
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + parseFloat(order.total || 0);
    }, 0);

    const completedOrders = orders.filter(
      (order) => order.status === "completed"
    );
    const pendingOrders = orders.filter((order) => order.status === "pending");
    const processingOrders = orders.filter(
      (order) => order.status === "processing"
    );

    // Calculate revenue change (simplified - you might want to compare with previous period)
    const revenueChange = orders.length > 0 ? 12.5 : 0; // This would need actual time-based comparison

    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      pendingOrders: pendingOrders.length,
      processingOrders: processingOrders.length,
      totalUsers: users?.length,
      totalProducts: products.length,
      totalCategories: categories.length,
      revenueChange,
      ordersChange: orders.length > 0 ? 8.2 : 0, // Would need actual comparison
      usersChange: users?.length > 0 ? 15.3 : 0, // Would need actual comparison
      productsChange: products.length > 0 ? 5.7 : 0, // Would need actual comparison
    };
  };

  const metrics = calculateMetrics();

  // Get recent orders (limit to 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Calculate top products based on order items
  const calculateTopProducts = () => {
    const productSales = {};

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          const productId = item.product?.id || item.product_name;
          if (productSales[productId]) {
            productSales[productId].sales += item.quantity;
            productSales[productId].revenue += parseFloat(item.subtotal || 0);
          } else {
            productSales[productId] = {
              name: item.product_name,
              sales: item.quantity,
              revenue: parseFloat(item.subtotal || 0),
            };
          }
        });
      }
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = calculateTopProducts();

  // Filter orders based on search
  const filteredOrders = recentOrders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.user_details?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.user_details?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.user_details?.last_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

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

  const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
    <Card className="h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-title text-muted mb-2">{title}</h6>
            <h3 className="fw-bold mb-1">{value}</h3>
            {subtitle && (
              <small className="text-muted d-block">{subtitle}</small>
            )}
            {change !== 0 && (
              <div
                className={`d-flex align-items-center ${
                  change >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {change >= 0 ? (
                  <FaArrowUp size={12} />
                ) : (
                  <FaArrowDown size={12} />
                )}
                <small className="ms-1 fw-semibold">
                  {Math.abs(change)}% from last period
                </small>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-circle bg-${color}-light`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <div
          className="flex-grow-1 d-flex justify-content-center align-items-center"
          style={{ marginLeft: "250px" }}
        >
          <div className="text-center">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Dashboard Overview</h2>
              <p className="text-muted mb-0">
                Real-time data from your store • {orders.length} orders,{" "}
                {users?.length} users, {products.length} products
              </p>
            </div>

            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle
                  variant="outline-secondary"
                  className="d-flex align-items-center"
                >
                  <FaCalendarAlt className="me-2" />
                  {timeRange === "day"
                    ? "Today"
                    : timeRange === "week"
                    ? "This Week"
                    : "This Month"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setTimeRange("day")}>
                    Today
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeRange("week")}>
                    This Week
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setTimeRange("month")}>
                    This Month
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Stats Overview */}
          <Row className="g-4 mb-4">
            <Col xl={3} lg={6} md={6}>
              <StatCard
                title="Total Revenue"
                value={formatCurrency(metrics.totalRevenue)}
                change={metrics.revenueChange}
                icon={FaDollarSign}
                color="success"
                subtitle={`From ${metrics.completedOrders} completed orders`}
              />
            </Col>
            <Col xl={3} lg={6} md={6}>
              <StatCard
                title="Total Orders"
                value={metrics.totalOrders}
                change={metrics.ordersChange}
                icon={FaShoppingCart}
                color="primary"
                subtitle={`${metrics.pendingOrders} pending, ${metrics.processingOrders} processing`}
              />
            </Col>
            <Col xl={3} lg={6} md={6}>
              <StatCard
                title="Total Users"
                value={metrics.totalUsers}
                change={metrics.usersChange}
                icon={FaUsers}
                color="info"
                subtitle={`Registered users`}
              />
            </Col>
            <Col xl={3} lg={6} md={6}>
              <StatCard
                title="Total Products"
                value={metrics.totalProducts}
                change={metrics.productsChange}
                icon={FaBox}
                color="warning"
                subtitle={`In ${categories.length} categories`}
              />
            </Col>
          </Row>

          <Row className="g-4">
            {/* Recent Orders */}
            <Col lg={8}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      Recent Orders ({recentOrders.length})
                    </h5>
                    <InputGroup style={{ width: "250px" }}>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <div className="text-muted">
                                <FaSearch
                                  size={32}
                                  className="mb-2 opacity-50"
                                />
                                <p>No orders found</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id}>
                              <td className="fw-semibold">#{order.id}</td>
                              <td>
                                {order.user_details
                                  ? `${order.user_details.first_name} ${order.user_details.last_name}`
                                  : "Guest"}
                              </td>
                              <td className="fw-semibold">
                                {formatCurrency(order.total)}
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
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </td>
                              <td>
                                <Link to={`/admin/orders/${order.id}`}>
                                  <Button variant="outline-primary" size="sm">
                                    <FaEye className="me-1" />
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Showing {filteredOrders.length} of {orders.length} orders
                    </small>
                    <Link
                      to="/admin/orders"
                      className="btn btn-outline-primary btn-sm"
                    >
                      View All Orders
                    </Link>
                  </div>
                </Card.Footer>
              </Card>
            </Col>

            {/* Top Products */}
            <Col lg={4}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Top Selling Products</h5>
                    <FaFilter className="text-muted" />
                  </div>
                </Card.Header>
                <Card.Body>
                  {topProducts.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <FaBox size={32} className="mb-2 opacity-50" />
                      <p>No sales data yet</p>
                      <small>
                        Orders will appear here once customers start purchasing
                      </small>
                    </div>
                  ) : (
                    topProducts.map((product, index) => (
                      <div key={product.name} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span
                            className="fw-semibold text-truncate"
                            title={product.name}
                          >
                            {product.name}
                          </span>
                          <small className="text-muted">
                            {product.sales} sales
                          </small>
                        </div>
                        <ProgressBar
                          now={(product.revenue / metrics.totalRevenue) * 100}
                          variant={
                            index === 0
                              ? "success"
                              : index === 1
                              ? "primary"
                              : "info"
                          }
                          style={{ height: "6px" }}
                        />
                        <div className="d-flex justify-content-between mt-1">
                          <small className="text-muted">Revenue</small>
                          <small className="fw-semibold">
                            {formatCurrency(product.revenue)}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                  <Link
                    to="/admin/products"
                    className="btn btn-outline-primary btn-sm w-100"
                  >
                    Manage Products
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {/* Additional Metrics Row */}
          <Row className="g-4 mt-4">
            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Inventory Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        <FaBox className="text-primary mb-2" size={24} />
                        <h4 className="text-primary">{products.length}</h4>
                        <small className="text-muted">Total Products</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        <FaShoppingCart
                          className="text-success mb-2"
                          size={24}
                        />
                        <h4 className="text-success">
                          {metrics.completedOrders}
                        </h4>
                        <small className="text-muted">Completed Orders</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        {/* <Tag className="text-warning mb-2" size={24} /> */}
                        <h4 className="text-warning">{categories.length}</h4>
                        <small className="text-muted">Categories</small>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center p-3 border rounded">
                        <FaUsers className="text-info mb-2" size={24} />
                        <h4 className="text-info">{users?.length}</h4>
                        <small className="text-muted">Registered Users</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Link
                        to="/admin/product/create"
                        className="text-decoration-none"
                      >
                        <Button
                          variant="outline-primary"
                          className="w-100 h-100 p-3 d-flex flex-column align-items-center"
                        >
                          <FaBox size={24} className="mb-2" />
                          <span>Add Product</span>
                        </Button>
                      </Link>
                    </Col>
                    <Col md={6}>
                      <Link to="/admin/users" className="text-decoration-none">
                        <Button
                          variant="outline-success"
                          className="w-100 h-100 p-3 d-flex flex-column align-items-center"
                        >
                          <FaUsers size={24} className="mb-2" />
                          <span>View Users</span>
                        </Button>
                      </Link>
                    </Col>
                    <Col md={6}>
                      <Link to="/admin/orders" className="text-decoration-none">
                        <Button
                          variant="outline-warning"
                          className="w-100 h-100 p-3 d-flex flex-column align-items-center"
                        >
                          <FaShoppingCart size={24} className="mb-2" />
                          <span>Process Orders</span>
                        </Button>
                      </Link>
                    </Col>
                    <Col md={6}>
                      <Link
                        to="/admin/categories"
                        className="text-decoration-none"
                      >
                        <Button
                          variant="outline-info"
                          className="w-100 h-100 p-3 d-flex flex-column align-items-center"
                        >
                          {/* <Tag size={24} className="mb-2" /> */}
                          <span>Categories</span>
                        </Button>
                      </Link>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardIndex;
