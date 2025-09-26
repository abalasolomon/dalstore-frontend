import React, { useEffect, useRef, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  //  Form,
  //Carousel,
  Badge,
} from "react-bootstrap";
import {
  // Cart3,
  //   Envelope,
  // ArrowRepeat,
  // Heart,
  // HeartFill,
  ArrowRight,
  // Truck,
  // ShieldCheck,
  // Fire,
} from "react-bootstrap-icons";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import {
  showSuccess,
  showError,
  // showInfo
} from "../../common/toastConfig";

import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../redux/actions/productActions";
import { Link } from "react-router-dom";
import { addToCart } from "../../redux/actions/cartActions";
import { listCategories } from "../../redux/actions/categoryActions";
import Loader from "../../common/Loader";
import HeroCarousel from "../../common/HeroCarousel";
//import { addToCart } from "../../redux/actions/cartActions";
const Home = () => {
  const dispatch = useDispatch();
  const observer = useRef();

  const productList = useSelector((state) => state.productList);
  const { products, loading, error, page, pages } = productList;
  const { categories, loading: loadingCategories } = useSelector(
      (state) => state.categoryList || {}
    );
  useEffect(() => {
    dispatch(listCategories());
    dispatch(listProducts());
  }, [dispatch]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < pages) {
          dispatch(listProducts(page + 1));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, pages, dispatch]
  );

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

  const addToCartHandler = async (id) => {
    try {
      // showInfo("Adding to cart...");

      await addToCart(id);

      showSuccess("✅ Added to cart!");
    } catch (err) {
      showError("❌ Failed to add to cart");
    }
  };

  
  // const deals = [
  //   {
  //     title: "Flash Sale",
  //     subtitle: "Ends in 12:34:56",
  //     icon: <Fire size={24} className="text-danger" />,
  //   },
  //   {
  //     title: "Free Shipping",
  //     subtitle: "On orders over $50",
  //     icon: <Truck size={24} className="text-primary" />,
  //   },
  //   {
  //     title: "2-Year Warranty",
  //     subtitle: "On all electronics",
  //     icon: <ShieldCheck size={24} className="text-success" />,
  //   },
  // ];

  // const renderStars = (rating) => {
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 >= 0.5;

  //   for (let i = 0; i < fullStars; i++) {
  //     stars.push(<StarFill key={`full-${i}`} className="text-warning" />);
  //   }

  //   if (hasHalfStar) {
  //     stars.push(<StarHalf key="half" className="text-warning" />);
  //   }

  //   const remainingStars = 5 - stars.length;
  //   for (let i = 0; i < remainingStars; i++) {
  //     stars.push(<StarFill key={`empty-${i}`} className="text-secondary" />);
  //   }

  //   return stars;
  // };

  console.log(lastProductRef?.name?.las);

  return (
    <div className="electronics-store">
      {/* Hero Carousel */}
      {/* <Carousel fade className="hero-carousel mb-4">
        <Carousel.Item>
          <div
            className="hero-slide d-flex align-items-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1350&q=80)",
              height: "400px",
            }}
          >
            <Container>
              <div className="text-white" style={{ maxWidth: "600px" }}>
                <h1 className="display-5 fw-bold mb-3">New MacBook Pro</h1>
                <p className="lead mb-4">
                  Supercharged for pros. Now with M2 Pro and M2 Max chips.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4"
                >
                  Shop Now <ArrowRight className="ms-2" />
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item>
          <div
            className="hero-slide d-flex align-items-center"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1350&q=80)",
              height: "400px",
            }}
          >
            <Container>
              <div className="text-white" style={{ maxWidth: "600px" }}>
                <h1 className="display-5 fw-bold mb-3">Summer Sale</h1>
                <p className="lead mb-4">
                  Up to 50% off on select electronics. Limited time offer!
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-pill px-4"
                >
                  View Deals <ArrowRight className="ms-2" />
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel> */}
        <HeroCarousel />
      {/* Deals Bar */}
      {/* <Container className="mb-5">
        <Row xs={2} md={3} lg={4} className="g-3">
          {deals.map((deal, index) => (
            <Col md={4} key={index}>
              <div className="deal-card p-3 rounded-3 bg-light d-flex align-items-center">
                <div className="me-3">{deal.icon}</div>
                <div>
                  <h6 className="mb-0 fw-bold">{deal.title}</h6>
                  <small className="text-muted">{deal.subtitle}</small>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container> */}

      <Container>
        <section className="mb-5">
          <h2 className="mb-4 fw-bold text-center">Shop by Category</h2>
          {/* This div enables horizontal scrolling on small screens */}
          {loadingCategories && <Loader />}
          {categories && <div className=" horizontal-scroll-container">
            {categories.map((category, index) => (
              <div key={index} className="scroll-item">
                <a
                  href={`/category/${category.slug}`}
                  className="text-decoration-none text-dark text-center"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="rounded-circle mb-2"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <h6 className="fw-medium">{category.name}</h6>
                </a>
              </div>
            ))}
          </div>
}
        </section>
      </Container>

      {/* Trending Products */}
      <section className="trending-products py-5 bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Trending Now</h2>
            <Button variant="link" className="text-decoration-none">
              View All <ArrowRight />
            </Button>
          </div>

          <Row className="g-4">
            {loading && <p>Loading products...</p>}
            {error && <p className="text-danger">Error: {error}</p>}
            {products.map((product) => (
              <>
                <Col key={product.id} xs={6} md={3} lg={3} ref={lastProductRef}>
                  <Card className="h-100 border-0 shadow-sm product-card">
                    {/* Image container for positioning the tag */}
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

                        {/* --- 1. Conditional Tag Display --- */}
                        {product?.tag && (
                          <Badge bg="danger" className="product-tag">
                            {product?.tag[0]}
                          </Badge>
                        )}
                      </div>
                    )}
                    <Card.Body className="d-flex flex-column p-3">
                      <Link
                        to={`/product/${product.slug}`}
                        className="stretched-link text-decoration-none text-dark"
                      ></Link>
                      <Card.Title className="fs-6 mb-1">
                        {product?.name?.length > 50
                          ? product?.name?.substring(0, 50) + "..."
                          : product?.name }
                      </Card.Title>
                      <StarRating rating={product?.average_rating} />

                      {/* --- 2. Conditional Price Display --- */}
                      <div className="mt-auto">
                        {product?.promo_price &&
                        Number(product?.promo_price) > 0 &&
                        Number(product?.promo_price) <
                          Number(product?.price) ? (
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold fs-5 text-primary">
                              N{product.promo_price}
                            </span>
                            <span className="text-muted text-decoration-line-through">
                              N{product?.price}
                            </span>
                          </div>
                        ) : (
                          <span className="fw-bold fs-5">
                            N{product?.price}
                          </span>
                        )}
                      </div>

                    </Card.Body>
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
              </>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
