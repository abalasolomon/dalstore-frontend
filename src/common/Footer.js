import { Container, Row, Col } from 'react-bootstrap';
import { 
  Facebook, Twitter, Instagram, Linkedin, 
  GeoAlt, Telephone, Envelope, Clock 
} from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
//import './Footer.scss'; // Uncomment this if you have the file

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    // { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    // { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const customerService = [
    { name: 'My Account', path: '/account' },
    // { name: 'Order Tracking', path: '/track-order' },
    // { name: 'Wishlist', path: '/wishlist' },
    // { name: 'Shipping Info', path: '/shipping' },
    // { name: 'Returns & Exchanges', path: '/returns' },
  ];

  const socialLinks = [
    { icon: <Facebook />, url: "https://facebook.com", label: "Facebook" },
    { icon: <Twitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin />, url: "https://linkedin.com", label: "LinkedIn" }
  ];

  return (
    <footer className="footer bg-dark text-white py-5">
      <Container>
        <Row>
          <Col lg={4} className="mb-4">
            <h3 className="footer-title mb-4">
              <span className="text-primary">Dal</span>Stores
            </h3>
            <p>Your one-stop shop for fresh groceries and household essentials.</p>
            <div className="social-links mt-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="me-3 text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </Col>
          
          <Col md={6} lg={4} className="mb-4">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="footer-links list-unstyled">
              {quickLinks.map((link, index) => (
                <li key={index} className="mb-2">
                  <Link to={link.path} className="text-white text-decoration-none">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
          
          <Col md={6} lg={4}>
            <h5 className="mb-4">Customer Service</h5>
            <ul className="footer-links list-unstyled">
              {customerService.map((service, index) => (
                <li key={index} className="mb-2">
                  <Link to={service.path} className="text-white text-decoration-none">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col>
            <div className="footer-contact">
              <p className="mb-3">
                <GeoAlt className="me-2" />
                Lekki, Lagos
              </p>
              <p className="mb-3">
                <Telephone className="me-2" />
                <a href="tel:+234806915206" className="text-white text-decoration-none">
                  (+234) 8069-152-060

                </a>
              </p>
              <p className="mb-3">
                <Envelope className="me-2" />
                <a href="mailto:info@dalstores.com" className="text-white text-decoration-none">
                  info@dalstores.com
                </a>
              </p>
              <p>
                <Clock className="me-2" />
                Mon-Sat: 8:00 AM - 8:00 PM
              </p>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-4">
          <Col className="text-center">
            <p className="mb-0">
              &copy; {currentYear} DalStores. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;