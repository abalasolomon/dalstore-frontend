import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  return (
    <Container className="my-5">
      {/* Header */}
      <Row className="mb-5 text-center">
        <Col>
          <h1 className="fw-bold mb-3">Contact Us</h1>
          <p className="text-muted fs-5">
            We’d love to hear from you! Reach out for inquiries, support, or feedback.
          </p>
        </Col>
      </Row>

      {/* Contact Info */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3 text-center">
            <Card.Body>
              <FaMapMarkerAlt className="fs-2 mb-2 text-primary" />
              <h6 className="fw-bold">Address</h6>
              <p className="text-muted">Lekki, Lagos, Nigeria, 100001</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3 text-center">
            <Card.Body>
              <FaEnvelope className="fs-2 mb-2 text-success" />
              <h6 className="fw-bold">Email</h6>
              <p className="text-muted">support@dalstores.com.ng</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 rounded-3 text-center">
            <Card.Body>
              <FaPhone className="fs-2 mb-2 text-danger" />
              <h6 className="fw-bold">Phone</h6>
              <p className="text-muted">+234 (0) 800-123-4567</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Form */}
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-bold mb-3 text-center">Send Us a Message</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Your message" />
                </Form.Group>
                <div className="text-center">
                  <Button variant="primary" className="px-4 rounded-pill">
                    Submit
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
