import React, { useState, useEffect } from 'react';
import { Carousel, Container, Button, Row, Col } from 'react-bootstrap';
import { 
  FaArrowRight, 
  FaRocket, 
  //FaStar, 
  FaShoppingBag, 
  FaGift,
  FaMobile,
  FaLaptop,
  FaHeadphones
} from 'react-icons/fa';

// Floating Icons Component
const FloatingIcons = () => {
  const icons = [FaMobile, FaLaptop, FaHeadphones, FaShoppingBag, FaGift];
  
  return (
    <div className="floating-icons">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className="floating-icon"
          style={{
            left: `${20 + index * 15}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${3 + index * 0.5}s`
          }}
        >
          <Icon className="text-white opacity-25" size={24} />
        </div>
      ))}
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
      <div className="shape shape-4"></div>
    </div>
  );
};

// Particle Effect
const Particles = () => {
  return (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
{
  title: "New MacBook Pro",
  subtitle: "Supercharged for pros. Now with M2 Pro and M2 Max chips.",
  gradient: "linear-gradient(135deg, #000000 0%, #434343 100%)", // 🖤 sleek black gradient
  icon: FaLaptop,
  buttonText: "Shop Now",
  features: ["M2 Chip", "8-Core CPU", "10-Core GPU", "16GB RAM"]
},
{
  title: "Summer Sale",
  subtitle: "Up to 50% off on select electronics. Limited time offer!",
  gradient: "linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)", // 🟠 warm orange gradient
  icon: FaGift,
  buttonText: "View Deals",
  features: ["50% Off", "Free Shipping", "Limited Time", "Hot Deals"]
},
{
  title: "Wireless Freedom",
  subtitle: "Latest wireless headphones with noise cancellation technology",
  gradient: "linear-gradient(135deg,rgb(255, 218, 7) 0%,rgb(250, 184, 2) 100%)", // ⚪ clean white gradient
  icon: FaHeadphones,
  buttonText: "Explore",
  features: ["Noise Cancel", "30h Battery", "Wireless", "Hi-Fi Sound"]
}

  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

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
          <Carousel.Item key={index} interval={5000}>
            <div
              className="hero-slide d-flex align-items-center position-relative"
              style={{
                background: slide.gradient,
                height: "500px",
                position: 'relative'
              }}
            >
              <AnimatedShapes />
              <Particles />
              <FloatingIcons />
              
              <Container>
                <Row className="align-items-center">
                  <Col lg={6}>
                    <div className="hero-content text-white">
                      {/* Animated Badge */}
                      <div className="d-flex align-items-center mb-3">
                        <div className="pulse-dot me-2"></div>
                        <span className="badge bg-white text-dark px-3 py-2 rounded-pill">
                          <FaRocket className="me-2" />
                          New Arrival
                        </span>
                      </div>
                      
                      <h1 className="display-4 fw-bold mb-3 animate-text">
                        {slide.title}
                      </h1>
                      
                      <p className="lead mb-4 fs-5">
                        {slide.subtitle}
                      </p>

                      {/* Features Tags */}
                      <div className="d-flex flex-wrap gap-2 mb-4">
                        {slide.features.map((feature, i) => (
                          <span key={i} className="badge bg-light bg-opacity-25 text-white px-3 py-2">
                            {feature}
                          </span>
                        ))}
                      </div>

                      <Button
                        variant="light"
                        size="lg"
                        className="rounded-pill px-4 py-3 fw-semibold hero-button"
                      >
                        {slide.buttonText} 
                        <FaArrowRight className="ms-2 animate-arrow" />
                      </Button>

                      {/* Stats */}
                      <div className="d-flex gap-4 mt-4 text-white-50">
                        <div className="text-center">
                          <div className="fw-bold fs-3">500+</div>
                          <small>Happy Customers</small>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold fs-3">24/7</div>
                          <small>Support</small>
                        </div>
                        <div className="text-center">
                          <div className="fw-bold fs-3">1Y</div>
                          <small>Warranty</small>
                        </div>
                      </div>
                    </div>
                  </Col>
                  
                  <Col lg={6} className="text-center">
                    <div className="hero-icon-container">
                      <slide.icon className="hero-main-icon" />
                      <div className="icon-glow"></div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Custom Indicators */}
      <div className="custom-indicators position-absolute bottom-0 start-50 translate-middle-x mb-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${activeIndex === index ? 'active' : ''}`}
            onClick={() => setActiveIndex(index)}
          >
            <span></span>
          </button>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="carousel-control custom-prev"
        onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)}
      >
        ‹
      </button>
      <button 
        className="carousel-control custom-next"
        onClick={() => setActiveIndex((activeIndex + 1) % slides.length)}
      >
        ›
      </button>

      <style jsx>{`
        .hero-carousel-wrapper {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
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
          background: rgba(255,255,255,0.1);
          animation: float 8s ease-in-out infinite;
        }

        .shape-1 { width: 100px; height: 100px; top: 10%; left: 10%; }
        .shape-2 { width: 150px; height: 150px; bottom: 20%; right: 10%; }
        .shape-3 { width: 80px; height: 80px; top: 50%; left: 80%; }
        .shape-4 { width: 120px; height: 120px; bottom: 10%; left: 20%; }

        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255,255,255,0.6);
          border-radius: 50%;
          animation: float 5s ease-in-out infinite;
        }

        .hero-main-icon {
          font-size: 8rem;
          color: rgba(255,255,255,0.8);
          animation: bounce 3s ease-in-out infinite;
        }

        .icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #ff6b6b;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .hero-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .hero-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .animate-arrow {
          animation: slide 1s ease-in-out infinite alternate;
        }

        .animate-text {
          animation: slideIn 1s ease-out;
        }

        .custom-indicators {
          display: flex;
          gap: 10px;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border: 2px solid white;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }

        .carousel-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          font-size: 2rem;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .custom-prev { left: 20px; }
        .custom-next { right: 20px; }

        .carousel-control:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-50%) scale(1.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes slide {
          0% { transform: translateX(0px); }
          100% { transform: translateX(5px); }
        }

        @keyframes slideIn {
          0% { transform: translateX(-50px); opacity: 0; }
          100% { transform: translateX(0px); opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero-slide { height: 400px; }
          .hero-main-icon { font-size: 4rem; }
          .display-4 { font-size: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default HeroCarousel;