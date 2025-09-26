import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Container,
  Form,
  Button,
  Card,
  Image,
  Table,
  Badge,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import {
  deleteProductImage,
  getProductDetails,
  updateProduct,
} from "../../redux/actions/productActions";
import { listCategories } from "../../redux/actions/categoryActions";
import { PRODUCT_UPDATE_RESET } from "../../redux/constants/productConstants";
import { FaTrash, FaPlus, FaTimes } from "react-icons/fa";
import { showSuccess } from "../../common/toastConfig";

function EditProduct() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } =
    productUpdate;

  const deleteImage = useSelector((state) => state.deleteProductImage);
  const {  success: successDeleteImage } =
    deleteImage;

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  // Local state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [stock, setStock] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [validationError, setValidationError] = useState("");

  const [variants, setVariants] = useState([]);

  // Load product + categories
  useEffect(() => {
    if (!product || product.slug !== slug) {
      dispatch(getProductDetails(slug));
      dispatch(listCategories());
    } else {
      setName(product.name);
      setDescription(product.description);
      setCategory(product.category);
      setPrice(product.price);
      setPromoPrice(product.promo_price);
      setDeliveryPrice(product.delivery_price);
      setStock(product.stock);
      setTags(product.tags || []);
      setIsActive(product.is_active);
      setVariants(product.variants || []);
      setImages(product.images || []);
    }
  }, [dispatch, product, slug]);

  // Success redirect
  useEffect(() => {
    if (successUpdate) {
      showSuccess("Product updated successfully");
      dispatch({ type: PRODUCT_UPDATE_RESET });
      //navigate("/admin/products");
    }
  }, [successUpdate, dispatch, navigate]);

  // Handle image change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [...newImages];
    let filePreviews = [];

    for (let file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError("Each image must be less than 10MB");
        return;
      }
      validFiles.push(file);
      filePreviews.push(URL.createObjectURL(file));
    }

    setValidationError("");
    setNewImages(validFiles);
    setPreviews(filePreviews);
  };

  useEffect(() => {
    if (successDeleteImage) {
      // Refetch product details to get updated images
     showSuccess("Image removed successfully");
      //dispatch(getProductDetails(slug));
    }
  }, [successDeleteImage]);


  const removeNewImage = (index,slug) => {
    //DELETE /api/products/<slug>/images/<image_id>/
    
    const updated = [...newImages];
    const updatedPreviews = [...previews];
    updated.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setNewImages(updated);
    setPreviews(updatedPreviews);
    //

  };

  const removeExistingImage = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      dispatch(deleteProductImage(slug, id));
      setImages(images.filter((img) => img.id !== id));
    }
   // setImages(images.filter((img) => img.id !== id));
  };

  // Tags
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Variants
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

  // Submit
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("promo_price", promoPrice);
    formData.append("delivery_price", deliveryPrice);
    formData.append("stock", stock);
    formData.append("is_active", isActive);
    formData.append("tags", JSON.stringify(tags));

   // formData.append("tags", tags.join(","));

    newImages.forEach((img) => {
      formData.append("images", img);
    });

    if (variants.length > 0) {
      formData.append("variants", JSON.stringify(variants));
    }

    dispatch(updateProduct(slug, formData));
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-0">
        <Row className="g-0">
          <Col md={12}>
            <Card className="shadow-sm m-3 m-md-4">
              <Card.Body className="p-3 p-md-4">
                <h2 className="fw-bold mb-4">Edit Product</h2>

                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {validationError && (
                  <Message variant="warning">{validationError}</Message>
                )}
                {(loading || loadingUpdate) && <Loader />}

                <Form onSubmit={submitHandler} encType="multipart/form-data">
                  {/* Basic Info */}
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control-lg"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="">Select category</option>
                      {categories?.map((cat) => (
                        <option key={cat.slug} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Prices - Improved mobile layout */}
                  <Row className="g-2">
                    <Col xs={12} sm={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Promo Price</Form.Label>
                        <Form.Control
                          type="number"
                          value={promoPrice}
                          onChange={(e) => setPromoPrice(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Delivery Price</Form.Label>
                        <Form.Control
                          type="number"
                          value={deliveryPrice}
                          onChange={(e) => setDeliveryPrice(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </Form.Group>

                  {/* Tags - Improved mobile layout */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <Form.Control
                        type="text"
                        placeholder="Enter a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="flex-grow-1"
                      />
                      <Button
                        variant="outline-dark"
                        onClick={addTag}
                        className="flex-shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {tags.map((tag, idx) => (
                        <Badge
                          bg="secondary"
                          pill
                          key={idx}
                          className="d-inline-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() => removeTag(tag)}
                        >
                          <span className="text-truncate" style={{ maxWidth: "120px" }}>
                            {tag}
                          </span>
                          <FaTimes className="ms-1" />
                        </Badge>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Active"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>

                  {/* Images - Improved mobile layout */}
                  <Form.Group className="mb-3">
                    <Form.Label>Existing Images</Form.Label>
                    <Row className="g-2 mt-2">
                      {images.map((img) => (
                        <Col key={img.id} xs={6} sm={4} md={3} className="mb-2">
                          <div className="position-relative">
                            <Image
                              src={img.image}
                              alt="product"
                              thumbnail
                              className="w-100"
                              style={{
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              style={{ 
                                width: "24px", 
                                height: "24px", 
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onClick={() => removeExistingImage(img.id)}
                            >
                              <FaTimes size={10} />
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload New Images</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <Row className="g-2 mt-2">
                      {previews.map((img, idx) => (
                        <Col key={idx} xs={6} sm={4} md={3} className="mb-2">
                          <div className="position-relative">
                            <Image
                              src={img}
                              alt="preview"
                              thumbnail
                              className="w-100"
                              style={{
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 m-1"
                              style={{ 
                                width: "24px", 
                                height: "24px", 
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onClick={() => removeNewImage(idx,slug)}
                            >
                              <FaTimes size={10} />
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  {/* Variants - Mobile-friendly table */}
                  <div className="mb-3">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                      <h5 className="mb-0">Variants</h5>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={addVariant}
                        className="flex-shrink-0"
                      >
                        <FaPlus className="me-1" /> Add Variant
                      </Button>
                    </div>

                    {variants.length > 0 && (
                      <div className="table-responsive">
                        <Table bordered className="align-middle mb-0">
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
                                    value={variant.size}
                                    onChange={(e) =>
                                      handleVariantChange(index, "size", e.target.value)
                                    }
                                    placeholder="S, M, L..."
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="text"
                                    value={variant.color}
                                    onChange={(e) =>
                                      handleVariantChange(index, "color", e.target.value)
                                    }
                                    placeholder="Red, Blue..."
                                  />
                                </td>
                                <td>
                                  <Form.Control
                                    type="number"
                                    value={variant.stock}
                                    onChange={(e) =>
                                      handleVariantChange(index, "stock", e.target.value)
                                    }
                                    placeholder="0"
                                  />
                                </td>
                                <td className="text-center">
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeVariant(index)}
                                    className="d-inline-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                  >
                                    <FaTrash size={12} />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons - Mobile friendly */}
                  <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-4 pt-3 border-top">
                    <Button
                      variant="secondary"
                      onClick={() => navigate("/admin/products")}
                      className="order-2 order-sm-1 mt-2 mt-sm-0"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="dark"
                      className="order-1 order-sm-2"
                    >
                      Update Product
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EditProduct;