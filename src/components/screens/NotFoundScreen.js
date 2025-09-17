import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { EmojiFrown, HouseDoor } from 'react-bootstrap-icons';

const NotFoundScreen = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="text-center mb-4">
        <Col>
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3">
            <EmojiFrown className="me-2" />
            <span className="text-danger">Oops! Page not found.</span>
          </p>
          <p className="lead">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button as={Link} to="/" variant="primary" size="lg">
            <HouseDoor className="me-2" />
            Go Back Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundScreen;