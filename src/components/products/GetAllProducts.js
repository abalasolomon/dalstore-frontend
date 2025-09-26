import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Row,
  Col,
  Container,
  Card,
  Badge,
  Form,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaFilter, 
  FaBox, 
  FaStar,
  FaEye,
  FaSort
} from "react-icons/fa";
import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import {
  listProducts,
  deleteProduct,
} from "../../redux/actions/productActions";

function GetAllProducts() {
  const dispatch = useDispatch();

  // Redux state
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch, successDelete]);

  const deleteHandler = (slug, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(deleteProduct(slug));
    }
  };

  // Get unique categories
  const categories = [...new Set(products?.map(product => product.category).filter(Boolean))];

  // Filter and sort products
  const filteredProducts = products
    ?.filter(product => {
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesStock = 
        stockFilter === "all" || 
        (stockFilter === "in_stock" && product.stock > 0) ||
        (stockFilter === "out_of_stock" && product.stock === 0);
      
      return matchesSearch && matchesCategory && matchesStock;
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "price_high":
          return parseFloat(b.price) - parseFloat(a.price);
        case "price_low":
          return parseFloat(a.price) - parseFloat(b.price);
        case "stock_high":
          return b.stock - a.stock;
        case "stock_low":
          return a.stock - b.stock;
        case "rating_high":
          return parseFloat(b.average_rating) - parseFloat(a.average_rating);
        case "newest":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    }) || [];

  const getPriceDisplay = (product) => {
    const price = parseFloat(product.price);
    const promoPrice = parseFloat(product.promo_price);
    
    if (promoPrice && promoPrice > 0 && promoPrice < price) {
      return (
        <div>
          <span className="text-danger fw-bold">₦{promoPrice.toLocaleString()}</span>
          <small className="text-muted text-decoration-line-through ms-2">
            ₦{price.toLocaleString()}
          </small>
        </div>
      );
    }
    return <span className="fw-bold">₦{price.toLocaleString()}</span>;
  };

  const getStockBadge = (stock) => {
    if (stock > 10) return <Badge bg="success">In Stock</Badge>;
    if (stock > 0) return <Badge bg="warning">Low Stock</Badge>;
    return <Badge bg="danger">Out of Stock</Badge>;
  };

  const getRatingStars = (rating) => {
    return (
      <div className="d-flex align-items-center">
        <FaStar className="text-warning me-1" />
        <span className="fw-semibold">{rating || "0.0"}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar />
        <Container fluid className="flex-grow-1 d-flex justify-content-center align-items-center">
          <Loader />
        </Container>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold mb-1">Products Management</h2>
                <p className="text-muted mb-0">
                  Manage your product inventory and listings
                </p>
              </div>
              <Link to="/admin/product/create">
                <Button variant="dark" className="fw-semibold">
                  <FaPlus className="me-2" />
                  Create Product
                </Button>
              </Link>
            </div>
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
                    placeholder="Search products by name or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaFilter />
                  </InputGroup.Text>
                  <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaBox />
                  </InputGroup.Text>
                  <Form.Select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="all">All Stock</option>
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}>
                <InputGroup>
                  <InputGroup.Text>
                    <FaSort />
                  </InputGroup.Text>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="name_asc">Name A-Z</option>
                    <option value="name_desc">Name Z-A</option>
                    <option value="price_high">Price High</option>
                    <option value="price_low">Price Low</option>
                    <option value="stock_high">Stock High</option>
                    <option value="stock_low">Stock Low</option>
                    <option value="rating_high">Rating High</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setStockFilter("all");
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

        {/* Alerts */}
        {loadingDelete && (
          <Alert variant="info" className="d-flex align-items-center">
            <Loader size="sm" className="me-2" />
            Deleting product...
          </Alert>
        )}
        {errorDelete && (
          <Message variant="danger">{errorDelete}</Message>
        )}
        {error && (
          <Message variant="danger">{error}</Message>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <FaBox className="display-1 text-muted opacity-25 mb-3" />
              <h4 className="text-muted">No products found</h4>
              <p className="text-muted mb-4">
                {products?.length === 0 
                  ? "Get started by creating your first product." 
                  : "Try adjusting your search or filters."
                }
              </p>
              {products?.length === 0 && (
                <Link to="/admin/product/create">
                  <Button variant="primary">
                    <FaPlus className="me-2" />
                    Create First Product
                  </Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.slug} xl={4} lg={6} md={6}>
                <Card className="h-100 shadow-sm border-0 product-card">
                  <div className="position-relative">
                    {product.images?.[0] ? (
                      <Card.Img
                        variant="top"
                        src={product.images[0].image}
                        alt={product.images[0].alt_text || product.name}
                        style={{ 
                          height: '200px', 
                          objectFit: 'cover',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center"
                        style={{ height: '200px' }}
                      >
                        <FaBox className="text-muted display-4" />
                      </div>
                    )}
                    <div className="position-absolute top-0 end-0 m-2">
                      {getStockBadge(product.stock)}
                    </div>
                    {product.promo_price && product.promo_price !== "0.00" && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <Badge bg="danger">Sale</Badge>
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg="light" text="dark" className="mb-2">
                        {product.category}
                      </Badge>
                    </div>
                    
                    <Card.Title className="h6 mb-2 line-clamp-2">
                      {product.name}
                    </Card.Title>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="text-primary fw-bold">
                          {getPriceDisplay(product)}
                        </div>
                        <div className="text-muted small">
                          Stock: {product.stock}
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        {getRatingStars(product.average_rating)}
                        <small className="text-muted">
                          {product.total_reviews || 0} reviews
                        </small>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/admin/product/${product.slug}/edit`} 
                          className="flex-fill"
                        >
                          <Button variant="outline-primary" size="sm" className="w-100">
                            <FaEdit className="me-1" />
                            Edit
                          </Button>
                        </Link>
                        <Link 
                          to={`/product/${product.slug}`} 
                          className="flex-fill"
                        >
                          <Button variant="outline-dark" size="sm" className="w-100">
                            <FaEye className="me-1" />
                            View
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteHandler(product.slug, product.name)}
                          className="flex-fill"
                        >
                          <FaTrash className="me-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-4 text-center text-muted">
            Showing {filteredProducts.length} of {products?.length} products
          </div>
        )}
      </Container>

      <style>{`
        .product-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default GetAllProducts;