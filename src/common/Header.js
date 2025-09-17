import { useState, useEffect, useRef } from "react";
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Badge,
//  ListGroup,
} from "react-bootstrap";
import { Cart3, Person, 
  //Search, 
  List, XLg, 
  Bell} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/actions/userActions";
import { listCart } from "../redux/actions/cartActions";
import SearchBox from "../components/products/SearchBox";
import logo from '../asset/images/dalstores_logo.png';
import { getNotificationCount } from "../redux/actions/notificationActions";

// import { searchProducts } from "../redux/actions/productActions"; // Optional: If using API

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const inputRef = useRef(null);

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const cartDetails = useSelector((state) => state.cartList);
  const { cart } = cartDetails;
  const { count } = useSelector((state) => state.notificationCount);
  const cartItemsCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const logoutHandler = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (userInfo) {
    dispatch(listCart());
     dispatch(getNotificationCount());
    }
  }, [dispatch,userInfo]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      bg="dark"
      expand="lg"
      className={`main-header ${scrolled ? "scrolled" : ""} ${
        mobileMenuOpen ? "mobile-open" : ""
      }`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          <img src={logo} alt="DalStore Logo" height="60" className="me-2"/>
          {/* <span className="text-primary">Dal</span>Store */}
        </Navbar.Brand>

        <div
          className="d-flex align-items-center order-lg-3 ms-auto"
          ref={inputRef}
        >
          <SearchBox />
          {/* <Form className="d-none d-lg-flex me-3 position-relative">
            <FormControl
              type="search"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
            />
            <Button variant="outline-primary" className="search-btn">
             <SearchBox />
              <Search />
            </Button>
            {showDropdown && suggestions.length > 0 && (
              <ListGroup className="position-absolute mt-1 shadow w-100 z-3">
                {suggestions.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form> */}

          <div className="header-icons d-flex align-items-center">
            {userInfo ? (
              <>
                <Link to="/account" className="icon-link mx-2 text-white">
                  <Person size={20} />
                </Link>
                <Link to="/notifications" className="icon-link text-white mx-2 position-relative">
                  <Bell size={20} />
                  {count > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {count}
                    </Badge>
                  )}
                </Link>
                <Link to="/cart" className="icon-link text-white mx-2 position-relative">
                  <Cart3 size={20} />
                  {cartItemsCount > 0 && (
                    <Badge
                      pill
                      bg="danger"
                      className="position-absolute top-0 start-100 translate-middle"
                    >
                      {cartItemsCount}
                    </Badge>
                  )}
                </Link>
                <Link
                  to="/"
                  onClick={logoutHandler}
                  className="icon-link text-white mx-2 text-danger small"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-decoration-none text-white mx-2 small ">
                  Login
                </Link>
                <Link to="/register" className="text-decoration-none text-white icon-link mx-2 small text-primary-custom">
                  Register
                </Link>
              </>
            )}
          </div>

          <Button
            variant="dark"
            className="d-lg-none mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <XLg size={24} /> : <List size={24} />}
          </Button>
        </div>

        <Navbar.Collapse in={mobileMenuOpen} className="mobile-menu">
          <Nav className="me-auto">
            <Nav.Link as={Link} className="text-white" to="/">
              Home
            </Nav.Link>
            {/* <Nav.Link as={Link} className="text-white" to="/shop">
              Shop
            </Nav.Link>
            <Nav.Link as={Link} className="text-white" to="/categories">
              Categories
            </Nav.Link> */}
            <Nav.Link as={Link} className="text-white" to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} className="text-white" to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          <Form className="d-lg-none mt-3">
            <FormControl
              type="search"
              placeholder="Search products..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
