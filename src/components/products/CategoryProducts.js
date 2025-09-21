import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { listProductsByCategory } from "../../redux/actions/productActions";
//import StarRating from "../../components/StarRating"; // ⭐ rating component
import { addToCart } from "../../redux/actions/cartActions";
//import "./ProductCard.css"; // optional extra styling
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

function CategoryProducts() {
  const { slug } = useParams(); // category slug from URL
  const dispatch = useDispatch();

  const { loading, error, products } = useSelector(
    (state) => state.productCategory
  );

  console.log("Category Products:", products);

  const StarRating = ({ rating }) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          stars.push(<BsStarFill key={i} className="text-warning" />);
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
          stars.push(<BsStarHalf key={i} className="text-warning" />);
        } else {
          stars.push(<BsStar key={i} className="text-warning" />);
        }
      }
      return <div className="mb-2">{stars}</div>;
    };

  useEffect(() => {
    dispatch(listProductsByCategory(slug));
  }, [dispatch, slug]);

  const addToCartHandler = (id) => {
    dispatch(addToCart(id));
  };

  return (
    <div className="py-4">
      <h2 className="mb-4 text-capitalize">{slug} Products</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="dark" />
        </div>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : products?.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <Row className="g-4">
          {products?.map((product) => (
            <Col key={product.id} xs={6} md={3} lg={3}>
              <Card className="h-100 border-0 shadow-sm product-card">
                {/* --- Product Image Section --- */}
                {product.images && product.images.length > 0 && (
                  <div className="product-image-container">
                    <Link
                      to={`/product/${product.slug}`}
                      className="stretched-link text-decoration-none text-dark"
                    ></Link>
                    <Card.Img
                      variant="top"
                      src={product?.images[0].image}
                      alt={product?.name}
                      className="product-image"
                    />

                    {/* Tag Badge */}
                    {product?.tags && product?.tags.length > 0 && (
                      <Badge bg="danger" className="product-tag">
                        {product.tags[0]}
                      </Badge>
                    )}
                  </div>
                )}

                {/* --- Product Info Section --- */}
                <Card.Body className="d-flex flex-column p-3">
                  <Link
                    to={`/product/${product.slug}`}
                    className="stretched-link text-decoration-none text-dark"
                  ></Link>
                  <Card.Title className="fs-6 mb-1">{product?.name}</Card.Title>
                  <StarRating rating={product?.average_rating} />

                  {/* --- Price Display --- */}
                  <div className="mt-auto">
                    {product?.promo_price &&
                    Number(product?.promo_price) > 0 &&
                    Number(product?.promo_price) < Number(product?.price) ? (
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold fs-5 text-primary">
                          ₦{product.promo_price}
                        </span>
                        <span className="text-muted text-decoration-line-through">
                          ₦{product?.price}
                        </span>
                      </div>
                    ) : (
                      <span className="fw-bold fs-5">₦{product?.price}</span>
                    )}
                  </div>
                </Card.Body>

                {/* --- Add to Cart Button --- */}
                <Card.Footer className="bg-white border-0 py-3">
                  <Button
                    variant="dark"
                    onClick={() => addToCartHandler(product.id)}
                    className="mt-3 w-100"
                  >
                    Add to Cart
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default CategoryProducts;
