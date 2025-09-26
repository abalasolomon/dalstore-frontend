import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  //Card,
  Button,
  Badge,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import {
  StarFill,
  StarHalf,
  Star as StarEmpty,
  Heart,
  Share,
  ArrowLeft,
  Truck,
  ShieldCheck,
  ArrowRepeat,
  CheckCircleFill,
  Cart,
} from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { getProductDetails } from "../../redux/actions/productActions";
import {
  listProductReviews,
  createProductReview,
} from "../../redux/actions/reviewActions";

import { addToCart, listCart } from "../../redux/actions/cartActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { reviews, loading: reviewLoading } = useSelector(
    (state) => state.productReviews
  );
  //const { related, loading: relatedLoading } = useSelector((state) => state.relatedProducts);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(getProductDetails(slug));
    dispatch(listProductReviews(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      if (product.images?.length > 0) {
        setSelectedImage(product.images[0]);
      }
      setIsFavorited(product.is_favorited);
    }
  }, [product]);

  const renderStars = (rating) => {
    if (rating === null || rating === undefined) {
      return Array(5).fill(<StarEmpty className="star-icon" />);
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarFill key={`full-${i}`} className="star-icon" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="star-icon" />);
    }

    while (stars.length < 5) {
      stars.push(
        <StarEmpty key={`empty-${stars.length}`} className="star-icon" />
      );
    }

    return stars;
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setImageLoaded(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    dispatch(createProductReview(product.slug, { rating, comment }));
    setRating(0);
    setComment("");
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically dispatch an action to update favorite status
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const getAvailableStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock;
    }
    return product.stock;
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Reset quantity to 1 when variant changes
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      // Add variant to cart
      dispatch(addToCart(product.id, quantity, selectedVariant.id));
    } else {
      // Add product to cart (no variant selected)
      dispatch(addToCart(product.id, quantity));
    }
    dispatch(listCart());
    setShowCartModal(true);
  };

  const handleCloseCartModal = () => {
    setShowCartModal(false);
  };

  const getProductPrice = () => {
    return product.promo_price &&
      parseFloat(product.promo_price) < parseFloat(product.price)
      ? parseFloat(product.promo_price)
      : parseFloat(product.price);
  };

  const gotoCart = () => {
    window.location.href = "/cart";
  };

  const calculateTotal = () => {
    const price = getProductPrice();
    return (price * quantity).toFixed(2);
  };

  return (
    <Container className="product-details-container">
      <Button
        variant="light"
        onClick={() => window.history.back()}
        className="back-button mb-4"
      >
        <ArrowLeft className="me-2" /> Back to Products
      </Button>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        product && (
          <>
            <Row className="g-5">
              <Col lg={6}>
                <div className="image-gallery">
                  <div className="main-image-container">
                    <div
                      className={`image-loading-placeholder ${
                        imageLoaded ? "d-none" : ""
                      }`}
                    ></div>
                    <img
                      src={selectedImage?.image}
                      alt={selectedImage?.alt_text || product.name}
                      className={`main-image ${imageLoaded ? "loaded" : ""}`}
                      onLoad={handleImageLoad}
                    />
                    {product.tags && product.tags.includes("offer") && (
                      <Badge bg="danger" className="discount-badge">
                        OFFER
                      </Badge>
                    )}
                    {product.tags && product.tags.includes("limited") && (
                      <Badge bg="warning" className="limited-badge">
                        LIMITED
                      </Badge>
                    )}
                    <Button
                      variant="light"
                      className={`favorite-button ${
                        isFavorited ? "active" : ""
                      }`}
                      onClick={toggleFavorite}
                    >
                      <Heart
                        className={isFavorited ? "text-danger" : ""}
                        fill={isFavorited ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>

                  <div className="thumbnail-container">
                    {product.images?.map((img, idx) => (
                      <div
                        key={img.id || idx}
                        className={`thumbnail ${
                          selectedImage?.id === img.id ? "active" : ""
                        }`}
                        onClick={() => handleImageClick(img)}
                      >
                        <img
                          src={img.image}
                          alt={img.alt_text || `Thumbnail ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              <Col lg={6}>
                <div className="product-info">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h1 className="product-title">{product.name}</h1>
                      <div className="d-flex align-items-center mb-2">
                        <div className="star-rating">
                          {renderStars(product?.average_rating)}
                        </div>
                        <span className="review-count ms-2">
                          ({product?.total_reviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="share-button"
                    >
                      <Share size={16} />
                    </Button>
                  </div>

                  <div className="price-container mb-3">
                    {product.promo_price &&
                    parseFloat(product.promo_price) <
                      parseFloat(product.price) ? (
                      <>
                        <h3 className="current-price">
                          N{formatPrice(product.promo_price)}
                        </h3>
                        <span className="original-price">
                          N{formatPrice(product.price)}
                        </span>
                        <Badge bg="danger" className="ms-2">
                          Save N
                          {(
                            parseFloat(product.price) -
                            parseFloat(product.promo_price)
                          ).toFixed(2)}
                        </Badge>
                      </>
                    ) : (
                      <h3 className="current-price">
                        N{formatPrice(product.price)}
                      </h3>
                    )}
                  </div>

                  <p className="product-description">{product.description}</p>

                  <div className="tags-container mb-4">
                    {product.tags?.map((tag, index) => (
                      <Badge
                        key={index}
                        bg={tag === "limited" ? "warning" : "info"}
                        className="me-2 product-tag"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Variants Section - Users can select their preferred variant */}
                  {product.variants && product.variants.length > 0 && (
                    <div className="variants-section mb-4">
                      <h6>Available Options</h6>
                      <div className="variants-container">
                        {product.variants.map((variant) => (
                          <div
                            key={variant.id}
                            className={`variant-option ${
                              selectedVariant?.id === variant.id ? "active" : ""
                            }`}
                            onClick={() => handleVariantSelect(variant)}
                          >
                            <div className="variant-info">
                              <span className="variant-color">
                                {variant.color}
                              </span>
                              {variant.size && (
                                <span className="variant-size">
                                  Size: {variant.size}
                                </span>
                              )}
                            </div>
                            <div className="variant-stock">
                              {variant.stock > 0 ? (
                                <span className="in-stock">
                                  {variant.stock} in stock
                                </span>
                              ) : (
                                <span className="out-of-stock">
                                  Out of stock
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedVariant && (
                        <div className="selected-variant-info mt-2">
                          <small className="text-muted">
                            Selected: {selectedVariant.color}
                            {selectedVariant.size &&
                              ` - Size: ${selectedVariant.size}`}
                          </small>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity selector - only show if product has stock or variant is selected */}
                  {(product.stock > 0 ||
                    (selectedVariant && selectedVariant.stock > 0)) && (
                    <div className="quantity-selector mb-4">
                      <h6>Quantity</h6>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            quantity > 1 && setQuantity(quantity - 1)
                          }
                          disabled={quantity <= 1}
                          className="quantity-btn"
                        >
                          -
                        </Button>
                        <span className="quantity-input mx-3">{quantity}</span>
                        <Button
                          variant="outline-secondary"
                          onClick={() =>
                            quantity < getAvailableStock() &&
                            setQuantity(quantity + 1)
                          }
                          disabled={quantity >= getAvailableStock()}
                          className="quantity-btn"
                        >
                          +
                        </Button>
                        <span className="stock-info ms-3">
                          {getAvailableStock()} available
                          {selectedVariant &&
                            ` (${selectedVariant.color}${
                              selectedVariant.size
                                ? ` - ${selectedVariant.size}`
                                : ""
                            })`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="delivery-info mb-4">
                    <h6>Delivery</h6>
                    <p className="delivery-price">
                      <Truck className="me-2" />N
                      {formatPrice(product.delivery_price)} delivery
                    </p>
                  </div>

                  <div className="action-buttons">
                    <Button
                      variant="dark"
                      size="lg"
                      className="add-to-cart-btn me-3"
                      disabled={getAvailableStock() === 0}
                      onClick={handleAddToCart}
                    >
                      <Cart className="me-2" />
                      {getAvailableStock() === 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </Button>
                  </div>

                  <div className="product-meta mt-4">
                    <div className="meta-item">
                      <strong>Category:</strong> {product.category || "N/A"}
                    </div>
                    {/* <div className="meta-item">
                    <strong>SKU:</strong> {product.id || 'N/A'}
                  </div> */}
                    <div className="meta-item">
                      <strong>Status:</strong>
                      <Badge
                        bg={product.is_active ? "success" : "secondary"}
                        className="ms-2"
                      >
                        {product.is_active ? "Available" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  <div className="trust-badges mt-4">
                    <div className="d-flex">
                      <div className="trust-item me-4">
                        <Truck size={24} className="text-primary" />
                        <span>12/7</span>
                      </div>
                      <div className="trust-item me-4">
                        <ShieldCheck size={24} className="text-primary" />
                        <span> warranty</span>
                      </div>
                      <div className="trust-item">
                        <ArrowRepeat size={24} className="text-primary" />
                        <span>30-day exchange</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

          

            {/* REVIEWS SECTION */}
            <Row className="mt-5">
              <Col md={8}>
                <h3 className="mb-4">Customer Reviews</h3>

                {/* Average Rating Summary */}
                <div
                  className="d-flex align-items-center mb-4 p-3 bg-light rounded shadow-sm"
                  aria-label="Product rating summary"
                >
                  <div className="me-3">
                    <h1
                      className="mb-0 text-primary"
                      aria-label={`Average rating: ${
                        product?.average_rating || "0.0"
                      } out of 5`}
                    >
                      {product?.average_rating ? product.average_rating : "0.0"}
                    </h1>
                  </div>
                  <div>
                    <div
                      className="fs-4"
                      aria-label={`${Math.round(
                        product?.average_rating || 0
                      )} out of 5 stars`}
                    >
                      {renderStars(product.average_rating)}
                    </div>
                    <small
                      className="text-muted"
                      aria-label={`${product.total_reviews || 0} reviews`}
                    >
                      {product.total_reviews || 0} review
                      {product.total_reviews !== 1 ? "s" : ""}
                    </small>
                  </div>
                </div>

                {/* Reviews List */}
                {reviewLoading ? (
                  <Loader />
                ) : reviews && reviews.length > 0 ? (
                  <div className="list-group mb-4">
                    {reviews.map((r) => (
                      <div key={r.id} className="list-group-item p-3">
                        <div className="d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            <div
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                              style={{ width: "40px", height: "40px" }}
                            >
                              {r.user?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>{r.user}</strong>
                              <div className="star-rating small">
                                {renderStars(r.rating)}
                              </div>
                            </div>
                          </div>
                          <small className="text-muted">
                            {new Date(r.created_at).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mt-2 mb-0">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert variant="info">
                    No reviews yet. Be the first to review!
                  </Alert>
                )}

                {/* Write a Review */}
                {product.has_purchased && (
                  <div className="p-4 bg-light rounded shadow-sm">
                    <h5 className="mb-3">Write a Review</h5>
                    <Form onSubmit={handleReviewSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          <option value="">Select...</option>
                          <option value="1">⭐ Poor</option>
                          <option value="2">⭐⭐ Fair</option>
                          <option value="3">⭐⭐⭐ Good</option>
                          <option value="4">⭐⭐⭐⭐ Very good</option>
                          <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          placeholder="Share your thoughts..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type="submit" variant="dark">
                        Submit Review
                      </Button>
                    </Form>
                  </div>
                )}
              </Col>
            </Row>


            {/* Add to Cart Success Modal */}
            <Modal show={showCartModal} onHide={handleCloseCartModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>
                  <CheckCircleFill className="text-success me-2" />
                  Added to Cart
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="d-flex">
                  <div className="modal-product-image me-3">
                    <img
                      src={selectedImage?.image}
                      alt={product.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="modal-product-info">
                    <h6>{product.name}</h6>
                    {selectedVariant && (
                      <p className="mb-1">
                        <small>
                          {selectedVariant.color}
                          {selectedVariant.size &&
                            ` - Size: ${selectedVariant.size}`}
                        </small>
                      </p>
                    )}
                    <p className="mb-1">Quantity: {quantity}</p>
                    <p className="mb-0 fw-bold">Total: N{calculateTotal()}</p>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="outline-secondary"
                  onClick={handleCloseCartModal}
                >
                  Continue Shopping
                </Button>
                <Button variant="dark" onClick={gotoCart}>
                  View Cart
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
      )}
    </Container>
  );
};

export default ProductDetails;
