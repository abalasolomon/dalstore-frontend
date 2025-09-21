import React from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import { FaLock, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Card className="border-0 shadow-sm p-4" style={{ maxWidth: '600px', width: '100%' }}>
        <Card.Body className="text-center">
          <div className="mb-4">
            <FaLock size={64} className="text-danger" />
          </div>
          
          <h2 className="mb-3">Access Denied</h2>
          
          <p className="text-muted mb-4">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <Row className="g-3 justify-content-center">
            <Col xs={12} md={6}>
              <Button 
                as={Link} 
                to="/" 
                variant="dark" 
                className="w-100 d-flex align-items-center justify-content-center"
              >
                <FaHome className="me-2" />
                Return Home
              </Button>
            </Col>
            <Col xs={12} md={6}>
              <Button 
                as={Link} 
                to="/contact" 
                variant="outline-secondary" 
                className="w-100"
              >
                Contact Support
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Unauthorized;