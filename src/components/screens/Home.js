// import React, { useEffect, useRef, useCallback } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Button,
//   //  Form,
//   //Carousel,
//   Badge,
// } from "react-bootstrap";
// import {
//   // Cart3,
//   //   Envelope,
//   // ArrowRepeat,
//   // Heart,
//   // HeartFill,
//   ArrowRight,
//   // Truck,
//   // ShieldCheck,
//   // Fire,
// } from "react-bootstrap-icons";
// import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
// import {
//   showSuccess,
//   showError,
//   // showInfo
// } from "../../common/toastConfig";

// import { useDispatch, useSelector } from "react-redux";
// import { listProducts } from "../../redux/actions/productActions";
// import { Link } from "react-router-dom";
// import { addToCart } from "../../redux/actions/cartActions";
// import { listCategories } from "../../redux/actions/categoryActions";
// import Loader from "../../common/Loader";
// import HeroCarousel from "../../common/HeroCarousel";
// //import { addToCart } from "../../redux/actions/cartActions";
// const Home = () => {
//   const dispatch = useDispatch();
//   const observer = useRef();

//   const productList = useSelector((state) => state.productList);
//   const { products, loading, error, page, pages } = productList;
//   const { categories, loading: loadingCategories } = useSelector(
//       (state) => state.categoryList || {}
//     );
//   useEffect(() => {
//     dispatch(listCategories());
//     dispatch(listProducts());
//   }, [dispatch]);

//   const lastProductRef = useCallback(
//     (node) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && page < pages) {
//           dispatch(listProducts(page + 1));
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, page, pages, dispatch]
//   );

//   const StarRating = ({ rating }) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= rating) {
//         stars.push(<BsStarFill key={i} className="text-warning" />);
//       } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
//         stars.push(<BsStarHalf key={i} className="text-warning" />);
//       } else {
//         stars.push(<BsStar key={i} className="text-warning" />);
//       }
//     }
//     return <div className="mb-2">{stars}</div>;
//   };

//   const addToCartHandler = async (id) => {
//     try {
//       // showInfo("Adding to cart...");

//       await addToCart(id);

//       showSuccess("✅ Added to cart!");
//     } catch (err) {
//       showError("❌ Failed to add to cart");
//     }
//   };

  
//   // const deals = [
//   //   {
//   //     title: "Flash Sale",
//   //     subtitle: "Ends in 12:34:56",
//   //     icon: <Fire size={24} className="text-danger" />,
//   //   },
//   //   {
//   //     title: "Free Shipping",
//   //     subtitle: "On orders over $50",
//   //     icon: <Truck size={24} className="text-primary" />,
//   //   },
//   //   {
//   //     title: "2-Year Warranty",
//   //     subtitle: "On all electronics",
//   //     icon: <ShieldCheck size={24} className="text-success" />,
//   //   },
//   // ];

//   // const renderStars = (rating) => {
//   //   const stars = [];
//   //   const fullStars = Math.floor(rating);
//   //   const hasHalfStar = rating % 1 >= 0.5;

//   //   for (let i = 0; i < fullStars; i++) {
//   //     stars.push(<StarFill key={`full-${i}`} className="text-warning" />);
//   //   }

//   //   if (hasHalfStar) {
//   //     stars.push(<StarHalf key="half" className="text-warning" />);
//   //   }

//   //   const remainingStars = 5 - stars.length;
//   //   for (let i = 0; i < remainingStars; i++) {
//   //     stars.push(<StarFill key={`empty-${i}`} className="text-secondary" />);
//   //   }

//   //   return stars;
//   // };

//   console.log(lastProductRef?.name?.las);

//   return (
//     <div className="electronics-store">
//       {/* Hero Carousel */}
//       {/* <Carousel fade className="hero-carousel mb-4">
//         <Carousel.Item>
//           <div
//             className="hero-slide d-flex align-items-center"
//             style={{
//               backgroundImage:
//                 "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1350&q=80)",
//               height: "400px",
//             }}
//           >
//             <Container>
//               <div className="text-white" style={{ maxWidth: "600px" }}>
//                 <h1 className="display-5 fw-bold mb-3">New MacBook Pro</h1>
//                 <p className="lead mb-4">
//                   Supercharged for pros. Now with M2 Pro and M2 Max chips.
//                 </p>
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   className="rounded-pill px-4"
//                 >
//                   Shop Now <ArrowRight className="ms-2" />
//                 </Button>
//               </div>
//             </Container>
//           </div>
//         </Carousel.Item>
//         <Carousel.Item>
//           <div
//             className="hero-slide d-flex align-items-center"
//             style={{
//               backgroundImage:
//                 "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1350&q=80)",
//               height: "400px",
//             }}
//           >
//             <Container>
//               <div className="text-white" style={{ maxWidth: "600px" }}>
//                 <h1 className="display-5 fw-bold mb-3">Summer Sale</h1>
//                 <p className="lead mb-4">
//                   Up to 50% off on select electronics. Limited time offer!
//                 </p>
//                 <Button
//                   variant="primary"
//                   size="lg"
//                   className="rounded-pill px-4"
//                 >
//                   View Deals <ArrowRight className="ms-2" />
//                 </Button>
//               </div>
//             </Container>
//           </div>
//         </Carousel.Item>
//       </Carousel> */}
//         <HeroCarousel />
//       {/* Deals Bar */}
//       {/* <Container className="mb-5">
//         <Row xs={2} md={3} lg={4} className="g-3">
//           {deals.map((deal, index) => (
//             <Col md={4} key={index}>
//               <div className="deal-card p-3 rounded-3 bg-light d-flex align-items-center">
//                 <div className="me-3">{deal.icon}</div>
//                 <div>
//                   <h6 className="mb-0 fw-bold">{deal.title}</h6>
//                   <small className="text-muted">{deal.subtitle}</small>
//                 </div>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       </Container> */}

//       <Container>
//         <section className="mb-5">
//           <h2 className="mb-4 fw-bold text-center">Shop by Category</h2>
//           {/* This div enables horizontal scrolling on small screens */}
//           {loadingCategories && <Loader />}
//           {categories && <div className=" horizontal-scroll-container">
//             {categories.map((category, index) => (
//               <div key={index} className="scroll-item">
//                 <a
//                   href={`/category/${category.slug}`}
//                   className="text-decoration-none text-dark text-center"
//                 >
//                   <img
//                     src={category.image}
//                     alt={category.name}
//                     className="rounded-circle mb-2"
//                     style={{
//                       width: "100px",
//                       height: "100px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <h6 className="fw-medium">{category.name}</h6>
//                 </a>
//               </div>
//             ))}
//           </div>
// }
//         </section>
//       </Container>

//       {/* Trending Products */}
//       <section className="trending-products py-5 bg-light">
//         <Container>
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 className="fw-bold mb-0">Trending Now</h2>
//             <Button variant="link" className="text-decoration-none">
//               View All <ArrowRight />
//             </Button>
//           </div>

//           <Row className="g-4">
//             {loading && <p>Loading products...</p>}
//             {error && <p className="text-danger">Error: {error}</p>}
//             {products.map((product) => (
//               <>
//                 <Col key={product.id} xs={6} md={3} lg={3} ref={lastProductRef}>
//                   <Card className="h-100 border-0 shadow-sm product-card">
//                     {/* Image container for positioning the tag */}
//                     {product.images && product.images.length > 0 && (
//                       <div className="product-image-container">
//                         <Link
//                           to={`/product/${product.slug}`}
//                           className="stretched-link text-decoration-none text-dark"
//                         ></Link>
//                         <Card.Img
//                           variant="top"
//                           src={product?.images[0].image}
//                           alt={product?.name}
//                           className="product-image"
//                         />

//                         {/* --- 1. Conditional Tag Display --- */}
//                         {product?.tag && (
//                           <Badge bg="danger" className="product-tag">
//                             {product?.tag[0]}
//                           </Badge>
//                         )}
//                       </div>
//                     )}
//                     <Card.Body className="d-flex flex-column p-3">
//                       <Link
//                         to={`/product/${product.slug}`}
//                         className="stretched-link text-decoration-none text-dark"
//                       ></Link>
//                       <Card.Title className="fs-6 mb-1">
//                         {product?.name?.length > 50
//                           ? product?.name?.substring(0, 50) + "..."
//                           : product?.name }
//                       </Card.Title>
//                       <StarRating rating={product?.average_rating} />

//                       {/* --- 2. Conditional Price Display --- */}
//                       <div className="mt-auto">
//                         {product?.promo_price &&
//                         Number(product?.promo_price) > 0 &&
//                         Number(product?.promo_price) <
//                           Number(product?.price) ? (
//                           <div className="d-flex align-items-center gap-2">
//                             <span className="fw-bold fs-5 text-primary">
//                               N{product.promo_price}
//                             </span>
//                             <span className="text-muted text-decoration-line-through">
//                               N{product?.price}
//                             </span>
//                           </div>
//                         ) : (
//                           <span className="fw-bold fs-5">
//                             N{product?.price}
//                           </span>
//                         )}
//                       </div>

//                     </Card.Body>
//                     <Card.Footer className="bg-white border-0 py-3">
//                       <Button
//                         variant="dark"
//                         onClick={() => addToCartHandler(product.id)}
//                         className="mt-3 w-100"
//                       >
//                         Add to Cart
//                       </Button>
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               </>
//             ))}
//           </Row>
//         </Container>
//       </section>
//     </div>
//   );
// };

// export default Home;

import React, { useEffect, useRef, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert
} from "react-bootstrap";
//import { ArrowRight } from "react-bootstrap-icons";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { showSuccess, showError } from "../../common/toastConfig";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../redux/actions/productActions";
import { Link } from "react-router-dom";
import { addToCart } from "../../redux/actions/cartActions";
import { listCategories } from "../../redux/actions/categoryActions";
//import Loader from "../../common/Loader";
import HeroCarousel from "../../common/HeroCarousel";

const Home = () => {
  const dispatch = useDispatch();
  const observer = useRef();

  // Redux state
  const productList = useSelector((state) => state.productList);
  const { products, loading, error, page, pages } = productList;
  
  const categoryList = useSelector((state) => state.categoryList || {});
  const { categories, loading: loadingCategories, error: categoryError } = categoryList;

  // Refs for infinite scrolling
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < pages) {
          // Fix: Pass page number directly, not an object
          dispatch(listProducts(page + 1));
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, page, pages, dispatch]
  );

  useEffect(() => {
    dispatch(listCategories());
    // Fix: Remove the object wrapper, just call the function
    dispatch(listProducts(1)); // Pass page number directly
  }, [dispatch]);

  // Star Rating Component
  const StarRating = ({ rating, reviews }) => {
    const numericRating = parseFloat(rating) || 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= numericRating) {
        stars.push(<BsStarFill key={i} className="text-warning" size={12} />);
      } else if (i === Math.ceil(numericRating) && !Number.isInteger(numericRating)) {
        stars.push(<BsStarHalf key={i} className="text-warning" size={12} />);
      } else {
        stars.push(<BsStar key={i} className="text-warning" size={12} />);
      }
    }
    
    return (
      <div className="d-flex align-items-center gap-2 mb-2">
        <div className="d-flex gap-1">{stars}</div>
        <small className="text-muted">({reviews || 0})</small>
      </div>
    );
  };

  // Add to Cart Handler
  const addToCartHandler = async (product) => {
    try {
      await dispatch(addToCart(product.id));
      showSuccess(`${product.name} added to cart!`);
    } catch (err) {
      showError("Failed to add item to cart");
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₦${parseFloat(amount || 0).toLocaleString()}`;
  };

  // Simple Product Card
  const ProductCard = ({ product, isLast }) => (
    <Col xs={6} md={4} lg={3} className="mb-4" ref={isLast ? lastProductRef : null}>
      <Card className="h-100 border-0 shadow-sm product-card">
        {/* Product Image */}
        <div className="position-relative">
          <Link to={`/product/${product.slug}`} className="text-decoration-none">
            <Card.Img
              variant="top"
              src={product.images?.[0]?.image || '/placeholder-image.jpg'}
              alt={product.name}
              style={{ 
                height: '180px', 
                objectFit: 'cover',
                width: '100%'
              }}
            />
          </Link>
          
          {/* Sale Badge */}
          {product.promo_price > 0 && product.promo_price < product.price && (
            <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
              SALE
            </Badge>
          )}
        </div>

        <Card.Body className="d-flex flex-column p-3">
          {/* Product Name */}
          <Link to={`/product/${product.slug}`} className="text-decoration-none text-dark">
            <Card.Title className="fs-6 mb-2" style={{ minHeight: '40px' }}>
              {product.name?.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
            </Card.Title>
          </Link>

          {/* Rating */}
          <StarRating rating={product.average_rating} reviews={product.total_reviews} />

          {/* Price */}
          <div className="mt-auto">
            {product.promo_price > 0 && product.promo_price < product.price ? (
              <div>
                <div className="fw-bold fs-5 text-primary">
                  {formatCurrency(product.promo_price)}
                </div>
                <div className="text-muted text-decoration-line-through small">
                  {formatCurrency(product.price)}
                </div>
              </div>
            ) : (
              <div className="fw-bold fs-5 text-primary">
                {formatCurrency(product.price)}
              </div>
            )}
          </div>
        </Card.Body>

        {/* Add to Cart Button */}
        <Card.Footer className="bg-white border-0 pt-0">
          <Button
            variant="dark"
            size="sm"
            onClick={() => addToCartHandler(product)}
            className="w-100"
          >
            <FaShoppingCart className="me-2" />
            Add to Cart
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );

  // Category Scroll Component
  const CategoryScroll = () => {
    if (loadingCategories) {
      return (
        <div className="d-flex justify-content-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    if (categoryError) {
      return (
        <Alert variant="warning" className="text-center">
          Unable to load categories
        </Alert>
      );
    }

    if (!categories || categories.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          No categories available
        </Alert>
      );
    }

    return (
      <div className="horizontal-scroll-container">
        {categories.map((category, index) => (
          <div key={category.id || index} className="scroll-item text-center">
            <Link
              to={`/category/${category.slug || category.id}`}
              className="text-decoration-none text-dark"
            >
              <div className="category-icon mb-2">
                <img
                  src={category.image || '/placeholder-category.jpg'}
                  alt={category.name}
                  className="rounded-circle border"
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />
              </div>
              <h6 className="fw-medium mb-0">{category.name}</h6>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Categories Section */}
      <Container className="my-5">
        <section className="mb-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Shop by Category</h2>
            <p className="text-muted">Discover products by category</p>
          </div>
          <CategoryScroll />
        </section>
      </Container>

      {/* Products Section */}
      <section className="products-section py-5 bg-light">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Products</h2>
              <p className="text-muted mb-0">Popular items in our store</p>
            </div>
            {/* <Button variant="outline-primary" as={Link} to="/products">
              View All <ArrowRight className="ms-1" />
            </Button> */}
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              Error loading products: {error}
            </Alert>
          )}

          <Row>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                isLast={index === products.length - 1}
              />
            ))}
          </Row>

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading more products...</p>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3">🛒</div>
              <h4>No products found</h4>
              <p className="text-muted">Check back later for new arrivals</p>
              <Button variant="primary" as={Link} to="/products">
                Browse All Products
              </Button>
            </div>
          )}
        </Container>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }
        
        .horizontal-scroll-container {
          display: flex;
          overflow-x: auto;
          gap: 2rem;
          padding: 1rem 0;
          scrollbar-width: thin;
        }
        
        .horizontal-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        
        .horizontal-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .horizontal-scroll-container::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 2px;
        }
        
        .scroll-item {
          flex: 0 0 auto;
          width: 100px;
        }
        
        .product-card {
          transition: transform 0.2s ease;
          background: white;
        }
        
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .category-icon {
          transition: transform 0.2s ease;
        }
        
        .scroll-item:hover .category-icon {
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          .horizontal-scroll-container {
            gap: 1rem;
          }
          
          .scroll-item {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;