import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
  Alert,
  Container,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  listCategories,
  deleteCategory,
} from "../../redux/actions/categoryActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaBox,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import Sidebar from "../../common/Sidebar";

function GetAllCategories() {
  const dispatch = useDispatch();

  // Redux State
  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories = [] } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = categoryDelete;

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch, successDelete]);

  // Filter and sort categories
  const filteredCategories = categories
    .filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "newest":
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  // Delete handler
  const deleteHandler = (slug, name) => {
    if (
      window.confirm(`Are you sure you want to delete the category "${name}"?`)
    ) {
      dispatch(deleteCategory(slug));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Loader />
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
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h3 mb-1">Categories Management</h2>
                <p className="text-muted mb-0">
                  Manage your product categories ({categories.length} total)
                </p>
              </div>
              <Link to="/admin/category/create">
                <Button variant="dark" className="fw-semibold">
                  <FaPlus className="me-2" />
                  Create Category
                </Button>
              </Link>
            </div>

            {/* Filters and Search */}
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <Row className="g-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Search categories by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col md={4}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaFilter />
                      </InputGroup.Text>
                      <Form.Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="name_asc">Name A-Z</option>
                        <option value="name_desc">Name Z-A</option>
                      </Form.Select>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="outline-secondary"
                      onClick={clearFilters}
                      className="w-100"
                    >
                      <FaTimes className="me-2" />
                      Clear
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Alerts */}
            {error && <Message variant="danger">{error}</Message>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {loadingDelete && (
              <Alert variant="info" className="d-flex align-items-center">
                <Loader size="sm" className="me-2" />
                Deleting category...
              </Alert>
            )}

            {/* Categories Grid */}
            {filteredCategories.length === 0 ? (
              <Card className="text-center py-5 shadow-sm">
                <Card.Body>
                  <FaBox className="display-1 text-muted opacity-25 mb-3" />
                  <h4 className="text-muted">
                    {categories.length === 0
                      ? "No categories found"
                      : "No matching categories"}
                  </h4>
                  <p className="text-muted mb-4">
                    {categories.length === 0
                      ? "Get started by creating your first category."
                      : "Try adjusting your search or filters."}
                  </p>
                  {categories.length === 0 && (
                    <Link to="/admin/category/create">
                      <Button variant="primary">
                        <FaPlus className="me-2" />
                        Create First Category
                      </Button>
                    </Link>
                  )}
                </Card.Body>
              </Card>
            ) : (
              <Row className="g-4">
                {filteredCategories.map((category) => (
                  <Col key={category.id} xl={4} lg={6} md={6}>
                    <Card className="h-100 shadow-sm border-0 category-card">
                      <div className="position-relative">
                        {category.image ? (
                          <Card.Img
                            variant="top"
                            src={category.image}
                            alt={category.name}
                            style={{
                              height: "200px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                        ) : (
                          <div
                            className="bg-light d-flex align-items-center justify-content-center"
                            style={{ height: "200px" }}
                          >
                            <FaBox className="text-muted display-4" />
                          </div>
                        )}
                        <Badge
                          bg="light"
                          text="dark"
                          className="position-absolute top-0 end-0 m-2"
                        >
                          ID: {category.id}
                        </Badge>
                      </div>

                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h5 mb-3">
                          {category.name}
                        </Card.Title>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <small className="text-muted">
                              Created: {formatDate(category.created_at)}
                            </small>
                            {category.updated_at !== category.created_at && (
                              <small className="text-muted">
                                Updated: {formatDate(category.updated_at)}
                              </small>
                            )}
                          </div>

                          <div className="d-flex gap-2">
                            <Link
                              to={`/admin/category/${category.slug}/edit`}
                              className="flex-fill"
                            >
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="w-100"
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                deleteHandler(category.slug, category.name)
                              }
                              className="flex-fill"
                              disabled={loadingDelete}
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
            {filteredCategories.length > 0 && (
              <div className="mt-4 text-center text-muted">
                Showing {filteredCategories.length} of {categories.length}{" "}
                categories
              </div>
            )}

            <style>{`
        .category-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .category-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
      `}</style>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default GetAllCategories;
