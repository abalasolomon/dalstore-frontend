import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Card,
  Badge,
  Alert,
  InputGroup,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { createProduct } from "../../redux/actions/productActions";
import { listCategories } from "../../redux/actions/categoryActions";
import { PRODUCT_CREATE_RESET } from "../../redux/constants/productConstants";
import { 
  FaTrash, 
  FaPlus, 
  FaTimes, 
  FaImage, 
  FaTag, 
  FaBox, 
  FaMoneyBillWave,
  FaInfoCircle,
  FaUpload,
  // FaPalette,
  // FaRuler,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle
} from "react-icons/fa";
import { showSuccess } from "../../common/toastConfig";

function CreateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  // Local state
  const [activeTab, setActiveTab] = useState("basic");
  const [visitedTabs, setVisitedTabs] = useState(new Set(["basic"]));
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("0");
  const [stock, setStock] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [variants, setVariants] = useState([]);

  // Tab order configuration
  const tabOrder = ["basic", "pricing", "media", "variants", "tags"];
  const tabTitles = {
    basic: { icon: FaInfoCircle, label: "Basic Info" },
    pricing: { icon: FaMoneyBillWave, label: "Pricing" },
    media: { icon: FaImage, label: "Media" },
    variants: { icon: FaBox, label: "Variants" },
    tags: { icon: FaTag, label: "Tags" }
  };

  // Fetch categories
  useEffect(() => {
    dispatch(listCategories());
  }, [dispatch]);

  // Validate current tab
  const validateCurrentTab = () => {
    const errors = {};

    switch (activeTab) {
      case "basic":
        if (!name.trim()) errors.name = "Product name is required";
        if (!category) errors.category = "Please select a category";
        break;
      
      case "pricing":
        if (!price || parseFloat(price) <= 0) errors.price = "Valid price is required";
        if (promoPrice && parseFloat(promoPrice) >= parseFloat(price)) {
          errors.promoPrice = "Promo price must be less than regular price";
        }
        break;
      
      case "media":
        if (images.length === 0) errors.images = "Please upload at least one product image";
        break;
      
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigation functions
  const goToNextTab = () => {
    if (!validateCurrentTab()) return;

    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      const nextTab = tabOrder[currentIndex + 1];
      setActiveTab(nextTab);
      setVisitedTabs(prev => new Set([...prev, nextTab]));
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  const canProceedToNext = () => {
    return tabOrder.indexOf(activeTab) < tabOrder.length - 1;
  };

  const canGoBack = () => {
    return tabOrder.indexOf(activeTab) > 0;
  };

  const isTabValid = (tabKey) => {
    // Basic validation for required fields in each tab
    switch (tabKey) {
      case "basic":
        return name.trim() && category;
      case "pricing":
        return price && parseFloat(price) > 0 && 
               (!promoPrice || parseFloat(promoPrice) < parseFloat(price));
      case "media":
        return images.length > 0;
      default:
        return true;
    }
  };

  // Handle tab change with validation
  const handleTabSelect = (tabKey) => {
    if (tabOrder.indexOf(tabKey) > tabOrder.indexOf(activeTab)) {
      // Trying to go forward - validate current tab first
      if (!validateCurrentTab()) return;
    }
    
    setActiveTab(tabKey);
    setVisitedTabs(prev => new Set([...prev, tabKey]));
  };

  // Handle images with drag & drop
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
  };

  const handleImageFiles = (files) => {
    let validFiles = [...images];
    let filePreviews = [...previews];
    const errors = { ...validationErrors };

    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) {
        errors.images = "Each image must be less than 10MB";
        setValidationErrors(errors);
        return;
      }
      if (!file.type.startsWith('image/')) {
        errors.images = "Please upload only image files";
        setValidationErrors(errors);
        return;
      }
      validFiles.push(file);
      filePreviews.push(URL.createObjectURL(file));
    }

    delete errors.images;
    setValidationErrors(errors);
    setImages(validFiles);
    setPreviews(filePreviews);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleImageFiles(files);
  };

  // Handle tags
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(e);
    }
  };

  // Variants management
  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: "" }]);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  // Final validation before submission
  const validateForm = () => {
    const errors = {};

    if (!name.trim()) errors.name = "Product name is required";
    if (!category) errors.category = "Please select a category";
    if (!price || parseFloat(price) <= 0) errors.price = "Valid price is required";
    if (promoPrice && parseFloat(promoPrice) >= parseFloat(price)) {
      errors.promoPrice = "Promo price must be less than regular price";
    }
    if (images.length === 0) errors.images = "Please upload at least one product image";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit handler
  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Go to the first tab with errors
      const firstErrorTab = tabOrder.find(tab => {
        switch (tab) {
          case "basic": return !name.trim() || !category;
          case "pricing": return !price || parseFloat(price) <= 0 || 
            (promoPrice && parseFloat(promoPrice) >= parseFloat(price));
          case "media": return images.length === 0;
          default: return false;
        }
      });
      if (firstErrorTab) setActiveTab(firstErrorTab);
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("price", price);
    formData.append("promo_price", promoPrice || "0");
    formData.append("delivery_price", deliveryPrice || "0");
    formData.append("stock", stock || "0");
    formData.append("is_active", isActive);
    formData.append("tags", tags.join(","));

    images.forEach((img) => {
      formData.append("images", img);
    });

    if (variants.length > 0) {
      formData.append("variants", JSON.stringify(variants.filter(v => v.size || v.color)));
    }

    dispatch(createProduct(formData));
  };

  // Reset after success
  useEffect(() => {
    if (success) {
      showSuccess("Product created successfully!");
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate("/admin/products");
    }
  }, [success, dispatch, navigate]);

  // Custom tab title component for better mobile display
  const TabTitle = ({ tabKey }) => {
    const { icon: Icon, label } = tabTitles[tabKey];
    const isValid = isTabValid(tabKey);
    const isVisited = visitedTabs.has(tabKey);
    
    return (
      <span className="d-flex align-items-center">
        <Icon className="me-2 d-none d-sm-inline" />
        <span className="d-none d-md-inline">{label}</span>
        <span className="d-md-none">
          {isValid && isVisited ? <FaCheckCircle className="text-success" /> : <Icon />}
        </span>
        {isValid && isVisited && (
          <FaCheckCircle className="text-success ms-1 small d-none d-md-inline" />
        )}
      </span>
    );
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-3 p-md-4">
        <Row>
          <Col lg={10} className="mx-auto">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="fw-bold mb-1">Create New Product</h2>
                <p className="text-muted mb-0">Add a new product to your store</p>
              </div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate("/admin/products")}
                size="sm"
              >
                ← Back
              </Button>
            </div>

            {error && <Message variant="danger">{error}</Message>}
            {loading && <Loader />}

            <Card className="shadow-sm border-0">
              <Card.Body className="p-0">
                <Tabs
                  activeKey={activeTab}
                  onSelect={handleTabSelect}
                  className="px-3 px-md-4 pt-3 pt-md-4 border-bottom"
                  fill
                >
                  {tabOrder.map(tabKey => (
                    <Tab 
                      key={tabKey} 
                      eventKey={tabKey} 
                      title={<TabTitle tabKey={tabKey} />}
                    >
                      <div className="p-3 p-md-4">
                        {/* Basic Info Tab */}
                        {tabKey === "basic" && (
                          <Row>
                            <Col md={8}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Product Name *
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter product name"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  isInvalid={!!validationErrors.name}
                                  size="lg"
                                />
                                <Form.Control.Feedback type="invalid">
                                  {validationErrors.name}
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Category *
                                </Form.Label>
                                <Form.Select
                                  value={category}
                                  onChange={(e) => setCategory(e.target.value)}
                                  isInvalid={!!validationErrors.category}
                                >
                                  <option value="">Select a category</option>
                                  {categories?.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                  {validationErrors.category}
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Description
                                </Form.Label>
                                <Form.Control
                                  as="textarea"
                                  rows={4}
                                  placeholder="Describe your product..."
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Status
                                </Form.Label>
                                <div className="border rounded p-3">
                                  <Form.Check
                                    type="switch"
                                    id="active-switch"
                                    label="Active Product"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="fw-normal"
                                  />
                                </div>
                              </Form.Group>
                            </Col>
                          </Row>
                        )}

                        {/* Pricing Tab */}
                        {tabKey === "pricing" && (
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Regular Price *
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>₦</InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    isInvalid={!!validationErrors.price}
                                  />
                                </InputGroup>
                                <Form.Control.Feedback type="invalid">
                                  {validationErrors.price}
                                </Form.Control.Feedback>
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Promotional Price
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>₦</InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={promoPrice}
                                    onChange={(e) => setPromoPrice(e.target.value)}
                                    isInvalid={!!validationErrors.promoPrice}
                                  />
                                </InputGroup>
                                <Form.Control.Feedback type="invalid">
                                  {validationErrors.promoPrice}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Delivery Price
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text>₦</InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={deliveryPrice}
                                    onChange={(e) => setDeliveryPrice(e.target.value)}
                                  />
                                </InputGroup>
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">
                                  Stock Quantity
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="0"
                                  value={stock}
                                  onChange={(e) => setStock(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        )}

                        {/* Media Tab */}
                        {tabKey === "media" && (
                          <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                              Product Images *
                            </Form.Label>
                            
                            <div
                              className={`border-2 border-dashed rounded-3 p-4 p-md-5 text-center ${
                                validationErrors.images ? 'border-danger' : 'border-light'
                              }`}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              style={{ cursor: 'pointer', background: '#fafafa' }}
                              onClick={() => document.getElementById('image-upload').click()}
                            >
                              <FaUpload className="display-4 text-muted mb-3" />
                              <h5>Drag & Drop images here</h5>
                              <p className="text-muted mb-3">or click to browse</p>
                              <small className="text-muted">
                                Supports JPG, PNG, WEBP • Max 10MB per image
                              </small>
                              <Form.Control
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="d-none"
                              />
                            </div>
                            {validationErrors.images && (
                              <Alert variant="danger" className="mt-2 py-2">
                                {validationErrors.images}
                              </Alert>
                            )}

                            {previews.length > 0 && (
                              <div className="mt-4">
                                <h6 className="fw-semibold mb-3">
                                  Uploaded Images ({previews.length})
                                </h6>
                                <Row>
                                  {previews.map((img, idx) => (
                                    <Col key={idx} xs={6} sm={4} md={3} lg={2} className="mb-3">
                                      <div className="position-relative">
                                        <img
                                          src={img}
                                          alt={`Preview ${idx + 1}`}
                                          className="img-thumbnail w-100"
                                          style={{ height: '100px', objectFit: 'cover' }}
                                        />
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          className="position-absolute top-0 end-0 m-1 rounded-circle"
                                          style={{ width: '30px', height: '30px' }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(idx);
                                          }}
                                        >
                                          <FaTimes />
                                        </Button>
                                      </div>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            )}
                          </Form.Group>
                        )}

                        {/* Variants Tab */}
                        {tabKey === "variants" && (
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                              <div>
                                <h6 className="fw-semibold mb-1">Product Variants</h6>
                                <p className="text-muted mb-0">
                                  Add size and color variations
                                </p>
                              </div>
                              <Button variant="outline-primary" onClick={addVariant} size="sm">
                                <FaPlus className="me-2" />
                                Add Variant
                              </Button>
                            </div>

                            {variants.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-bordered">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Size</th>
                                      <th>Color</th>
                                      <th>Stock</th>
                                      <th width="80"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {variants.map((variant, index) => (
                                      <tr key={index}>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            placeholder="e.g., M, L, XL"
                                            value={variant.size}
                                            onChange={(e) =>
                                              handleVariantChange(index, "size", e.target.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="text"
                                            placeholder="e.g., Red, Blue"
                                            value={variant.color}
                                            onChange={(e) =>
                                              handleVariantChange(index, "color", e.target.value)
                                            }
                                          />
                                        </td>
                                        <td>
                                          <Form.Control
                                            type="number"
                                            placeholder="0"
                                            value={variant.stock}
                                            onChange={(e) =>
                                              handleVariantChange(index, "stock", e.target.value)
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => removeVariant(index)}
                                          >
                                            <FaTrash />
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <Alert variant="info" className="text-center py-4">
                                <FaBox className="display-4 opacity-25 mb-3" />
                                <h6>No variants added</h6>
                                <p className="mb-0">
                                  Add variants if your product comes in different sizes or colors
                                </p>
                              </Alert>
                            )}
                          </div>
                        )}

                        {/* Tags Tab */}
                        {tabKey === "tags" && (
                          <div>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-semibold">
                                Product Tags
                              </Form.Label>
                              <InputGroup>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter a tag and press Enter"
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={handleTagInputKeyDown}
                                />
                                <Button variant="outline-primary" onClick={addTag}>
                                  <FaPlus className="me-2" />
                                  Add
                                </Button>
                              </InputGroup>
                            </Form.Group>

                            {tags.length > 0 ? (
                              <div className="d-flex flex-wrap gap-2">
                                {tags.map((tag, idx) => (
                                  <Badge
                                    bg="primary"
                                    pill
                                    key={idx}
                                    className="d-flex align-items-center fs-6 px-3 py-2"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => removeTag(tag)}
                                  >
                                    {tag}
                                    <FaTimes className="ms-2" />
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <Alert variant="light" className="text-center py-3">
                                No tags added yet. Add tags to help customers find your product.
                              </Alert>
                            )}
                          </div>
                        )}
                      </div>
                    </Tab>
                  ))}
                </Tabs>

                {/* Navigation Buttons */}
                <div className="p-3 p-md-4 border-top bg-light">
                  <Row className="align-items-center">
                    <Col md={4}>
                      {canGoBack() && (
                        <Button
                          variant="outline-secondary"
                          onClick={goToPreviousTab}
                          className="d-flex align-items-center"
                        >
                          <FaArrowLeft className="me-2" />
                          Previous
                        </Button>
                      )}
                    </Col>
                    
                    <Col md={4} className="text-center">
                      <small className="text-muted">
                        Step {tabOrder.indexOf(activeTab) + 1} of {tabOrder.length}
                      </small>
                    </Col>
                    
                    <Col md={4} className="text-end">
                      {canProceedToNext() ? (
                        <Button
                          variant="primary"
                          onClick={goToNextTab}
                          className="d-flex align-items-center ms-auto"
                        >
                          Next
                          <FaArrowRight className="ms-2" />
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={submitHandler}
                          disabled={loading}
                          className="d-flex align-items-center"
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle className="me-2" />
                              Create Product
                            </>
                          )}
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateProduct;