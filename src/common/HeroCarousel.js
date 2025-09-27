import React, { useState, useEffect } from "react";
import {
  Carousel,
  Container,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FaArrowRight,
  FaRocket,
  FaLaptop,
  FaHeadphones,
  FaHome,
  FaGamepad,
  FaMobile,
  FaCamera,
  FaTshirt,
} from "react-icons/fa";
import { listCategories } from "../redux/actions/categoryActions";

// Icon mapping for categories
const categoryIcons = {
  electronics: FaLaptop,
  audio: FaHeadphones,
  gaming: FaGamepad,
  smartphones: FaMobile,
  photography: FaCamera,
  home: FaHome,
  fashion: FaTshirt,
  default: FaRocket,
};

// Floating Icons Component
const FloatingIcons = ({ categories }) => {
  return (
    <div className="floating-icons">
      {categories.slice(0, 5).map((category, index) => {
        const IconComponent =
          categoryIcons[category.name?.toLowerCase()] || categoryIcons.default;
        return (
          <div
            key={category.id}
            className="floating-icon"
            style={{
              left: `${15 + index * 20}%`,
              animationDelay: `${index * 0.3}s`,
              animationDuration: `${4 + index * 0.5}s`,
            }}
          >
            <IconComponent className="text-white opacity-25" size={20} />
          </div>
        );
      })}
    </div>
  );
};

// Animated Background Shapes
const AnimatedShapes = () => {
  return (
    <div className="animated-shapes">
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
    </div>
  );
};

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get categories from Redux store
  const categoryList = useSelector((state) => state.categoryList);
  const { loading, categories = [] } = categoryList;

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(listCategories());
    }
  }, [dispatch, categories.length]);

  // Consistent color scheme - using brand colors
  const brandColors = {
    primary: "linear-gradient(135deg, #FF8008 0%, #FFC837 100%)", // Orange
    secondary: "linear-gradient(135deg, #000000 0%, #434343 100%)", // Black
    accent: "linear-gradient(135deg, #FF8008 0%, #000000 100%)", // Orange + Black mix
    dark: "linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)", // Dark (unchanged)
  };

  // Generate slides from categories
  const generateSlidesFromCategories = () => {
    if (categories.length === 0) {
      return [
        {
          id: 1,
          title: "Welcome to Our Store",
          subtitle: "Discover amazing products at great prices",
          gradient: brandColors.primary,
          icon: FaRocket,
          buttonText: "Start Shopping",
          features: ["Quality Products", "Fast Shipping", "Best Prices"],
          buttonVariant: "light",
          textColor: "text-white",
          navigateTo: "/products",
        },
      ];
    }

    const colorKeys = Object.keys(brandColors);

    return categories.slice(0, 4).map((category, index) => {
      const IconComponent =
        categoryIcons[category.name?.toLowerCase()] || categoryIcons.default;
      const features = getCategoryFeatures(category.name);
      const colorKey = colorKeys[index % colorKeys.length];

      return {
        id: category.id,
        title: category.name,
        subtitle: `Explore our premium ${category.name.toLowerCase()} collection`,
        gradient: brandColors[colorKey],
        icon: IconComponent,
        buttonText: `Shop ${category.name}`,
        features: features,
        buttonVariant: "light",
        textColor: "text-white",
        navigateTo: `/category/${category.slug || category.id}`,
      };
    });
  };

  const getCategoryFeatures = (categoryName) => {
    const featureMap = {
      electronics: ["Latest Tech", "Premium Quality", "Warranty"],
      audio: ["Hi-Fi Sound", "Noise Cancel", "Wireless"],
      gaming: ["High Performance", "Pro Gaming", "Fast Delivery"],
      smartphones: ["5G Ready", "Pro Camera", "Long Battery"],
      photography: ["4K Video", "Pro Lenses", "Stabilization"],
      home: ["Smart Features", "Energy Saving", "Easy Use"],
      fashion: ["Premium Materials", "Trending", "Comfort Fit"],
    };

    const lowerName = categoryName?.toLowerCase();
    for (const [key, features] of Object.entries(featureMap)) {
      if (lowerName?.includes(key)) {
        return features;
      }
    }

    return ["Quality Products", "Best Prices", "Fast Shipping"];
  };

  const slides = generateSlidesFromCategories();

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const handleButtonClick = (navigateTo) => {
    navigate(navigateTo);
  };

  if (loading) {
    return (
      <Container className="my-5">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "400px" }}
        >
          <Spinner animation="border" variant="primary" />
        </div>
      </Container>
    );
  }

  return (
    <div className="hero-carousel-wrapper position-relative overflow-hidden">
      <Carousel
        fade
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        indicators={false}
        controls={false}
        className="hero-carousel mb-4"
      >
        {slides.map((slide, index) => (
          <Carousel.Item key={slide.id} interval={5000}>
            <div
              className="hero-slide d-flex align-items-center position-relative"
              style={{
                background: slide.gradient,
                height: "450px",
              }}
            >
              <AnimatedShapes />
              <FloatingIcons categories={categories} />

              <Container>
                <Row className="align-items-center">
                  <Col lg={8}>
                    <div className={`hero-content ${slide.textColor}`}>
                      {/* Category Badge */}
                      <div className="d-flex align-items-center mb-3">
                        <div className="pulse-dot me-2"></div>
                        <span className="badge bg-white bg-opacity-25 text-white px-3 py-2 rounded-pill">
                          <slide.icon className="me-2" />
                          Featured
                        </span>
                      </div>

                      <h1 className="display-5 fw-bold mb-3">
                        {slide.title} Collection
                      </h1>

                      <p className="lead mb-4">{slide.subtitle}</p>

                      {/* Features Tags */}
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {slide.features.map((feature, i) => (
                          <span
                            key={i}
                            className="badge bg-light bg-opacity-25 text-white px-3 py-2"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <Button
                        variant={slide.buttonVariant}
                        size="lg"
                        className="rounded-pill px-4 py-3 fw-semibold"
                        onClick={() => handleButtonClick(slide.navigateTo)}
                      >
                        {slide.buttonText}
                        <FaArrowRight className="ms-2" />
                      </Button>
                    </div>
                  </Col>

                  <Col lg={4} className="text-center d-none d-lg-block">
                    <div className="hero-icon-container">
                      <slide.icon className="hero-main-icon" />
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Indicators */}
      {slides.length > 1 && (
        <div className="custom-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${activeIndex === index ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
            >
              <span></span>
            </button>
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            className="carousel-control custom-prev"
            onClick={() =>
              setActiveIndex((activeIndex - 1 + slides.length) % slides.length)
            }
          >
            ‹
          </button>
          <button
            className="carousel-control custom-next"
            onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
          >
            ›
          </button>
        </>
      )}

      <style jsx>{`
        .hero-carousel-wrapper {
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .hero-slide {
          position: relative;
          overflow: hidden;
        }

        .floating-icons {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .floating-icon {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .animated-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          animation: float 8s ease-in-out infinite;
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 20%;
          left: 10%;
        }
        .shape-2 {
          width: 120px;
          height: 120px;
          bottom: 30%;
          right: 15%;
        }
        .shape-3 {
          width: 60px;
          height: 60px;
          top: 60%;
          left: 85%;
        }

        .hero-main-icon {
          font-size: 6rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .pulse-dot {
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .custom-indicators {
          display: flex;
          gap: 8px;
        }

        .indicator {
          width: 10px;
          height: 10px;
          border: 2px solid white;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .custom-prev {
          left: 15px;
        }
        .custom-next {
          right: 15px;
        }

        .carousel-control:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @media (max-width: 768px) {
          .hero-slide {
            height: 400px;
          }
          .hero-main-icon {
            font-size: 4rem;
          }
          .display-5 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;
