import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaStore, FaTags, FaTruck } from "react-icons/fa";

const About = () => {
  return (
    <Container className="my-5">
      {/* Header */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="fw-bold mb-3">
            <FaStore className="me-2 text-primary" /> About Dalstore
          </h1>
          <p className="text-muted fs-5">
            Dalstore is your trusted online shopping destination where quality meets
            convenience. We bring the best products to your doorstep at unbeatable prices.
          </p>
        </Col>
      </Row>

      {/* Categories Section */}
      <Row className="mb-5">
        <Col>
          <h2 className="fw-semibold text-center mb-4">
            <FaTags className="me-2 text-success" /> Categories We Cover
          </h2>
        </Col>
        {[
          "Electronics",
          "Fashion & Apparel",
          "Health & Beauty",
          "Home & Living",
          "Groceries",
          "Sports & Fitness",
          "Kids & Baby Products",
        ].map((cat, i) => (
          <Col md={4} key={i} className="mb-4">
            <Card className="h-100 shadow-sm border-0 rounded-3">
              <Card.Body className="text-center">
                <h5 className="fw-bold">{cat}</h5>
                <p className="text-muted">
                  Shop top-quality {cat.toLowerCase()} at Dalstore.
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Shopping Service */}
      <Row>
        <Col>
          <h2 className="fw-semibold text-center mb-4">
            <FaTruck className="me-2 text-danger" /> Why Shop With Us
          </h2>
        </Col>
        {[
          { title: "Easy Navigation", desc: "Browse by category or search instantly." },
          { title: "Secure Payments", desc: "Safe and reliable payment options." },
          { title: "Fast Delivery", desc: "Quick and efficient to your doorstep." },
          { title: "24/7 Support", desc: "Always here to help with your orders." },
        ].map((item, i) => (
          <Col md={3} sm={6} key={i} className="mb-4">
            <Card className="h-100 shadow-sm border-0 rounded-3">
              <Card.Body className="text-center">
                <h6 className="fw-bold">{item.title}</h6>
                <p className="text-muted">{item.desc}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default About;
