import React, { useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  Person,
  BoxSeam,
  //Heart,
  Gear,
  Lock,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { getUserProfile } from "../../redux/actions/accountActions";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";

const GetAccount = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useSelector((state) => state.userProfile);
  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const accountLinks = [
    {
      icon: <Person />,
      label: "Profile Information",
      path: "/account/profile",
    },
    { icon: <BoxSeam />, label: "My Orders", path: "/orders" },
    // { icon: <Heart />, label: "Wishlist", path: "/account/wishlist" },
    { icon: <Gear />, label: "Settings", path: "/account/settings" },
    { icon: <Lock />, label: "Change Password", path: "/account/password" },
  ];

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div
                  className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center"
                  style={{ width: "100px", height: "100px", fontSize: "2rem" }}
                >
                  <Person />
                </div>
              </div>
              {loading && <Loader />}
              <h5 className="mb-1">{profile?.name}</h5>
              <p className="text-muted">{profile?.email}</p>
              {/* <Button
                as={Link}
                to="/logout"
                variant="outline-primary"
                size="sm"
              >
                Logout
              </Button> */}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h4 className="mb-4">My Account</h4>
              <ul className="list-group list-group-flush">
                {accountLinks.map((link, idx) => (
                  <li
                    key={idx}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <Link
                      to={link.path}
                      className="text-decoration-none text-dark d-flex align-items-center"
                    >
                      <span className="me-3">{link.icon}</span>
                      {link.label}
                    </Link>
                    <span className="text-muted">&rsaquo;</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GetAccount;
