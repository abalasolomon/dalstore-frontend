import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Badge,
  //Alert,
  Dropdown,
  Modal,
  Container
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
//   getAllUsers,
//   deleteUser,
//   updateUserStatus,
  getAllUsers
} from "../../redux/actions/userActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaBan,
  FaCheck,
  FaEllipsisV,
  FaUserPlus,
  FaUserCheck,
} from "react-icons/fa";
import Sidebar from "../../common/Sidebar";

function GetAllUsers() {
  const dispatch = useDispatch();

  // Redux State
  const userList = useSelector((state) => state.userList);
  const { loading, error, users = [] } = userList;

//   const userDelete = useSelector((state) => state.userDelete);
//   const { loading: loadingDelete, success: successDelete, error: errorDelete } = userDelete;

//   const userUpdate = useSelector((state) => state.userUpdate);
//   const { loading: loadingUpdate, success: successUpdate, error: errorUpdate } = userUpdate;

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone_number?.includes(searchTerm);
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active) ||
        (statusFilter === "verified" && user.is_email_verified) ||
        (statusFilter === "unverified" && !user.is_email_verified);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.first_name?.localeCompare(b.first_name);
        case "name_desc":
          return b.first_name?.localeCompare(a.first_name);
        case "email_asc":
          return a.email.localeCompare(b.email);
        case "email_desc":
          return b.email.localeCompare(a.email);
        case "oldest":
          return new Date(a.date_joined) - new Date(b.date_joined);
        case "newest":
        default:
          return new Date(b.date_joined) - new Date(a.date_joined);
      }
    });

  // Delete handler
  const confirmDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const deleteHandler = () => {
    if (selectedUser) {
      //dispatch(deleteUser(selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // Status handler
  const toggleUserStatus = (user) => {
    //dispatch(updateUserStatus(user.id, { is_active: !user.is_active }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

  const getUserStatusVariant = (user) => {
    if (!user.is_active) return "danger";
    if (!user.is_email_verified) return "warning";
    return "success";
  };

  const getUserStatusText = (user) => {
    if (!user.is_active) return "Inactive";
    if (!user.is_email_verified) return "Unverified";
    return "Active";
  };

  const getRoleBadge = (user) => {
    if (user.is_superuser) return <Badge bg="primary">Super Admin</Badge>;
    if (user.is_staff) return <Badge bg="info">Staff</Badge>;
    return <Badge bg="secondary">Customer</Badge>;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("newest");
  };

  const getStats = () => {
    const total = users.length;
    const active = users.filter(u => u.is_active).length;
    const verified = users.filter(u => u.is_email_verified).length;
    const staff = users.filter(u => u.is_staff || u.is_superuser).length;

    return { total, active, verified, staff };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Loader />
      </div>
    );
  }

  return (
        <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1 p-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h3 mb-1">Users Management</h2>
          <p className="text-muted mb-0">
            Manage system users and permissions ({stats.total} total users)
          </p>
        </div>
        {/* <Link to="/admin/user/create">
          <Button variant="primary" className="fw-semibold">
            <FaUserPlus className="me-2" />
            Add User
          </Button>
        </Link> */}
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-primary bg-opacity-10">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-primary">{stats.total}</h4>
                  <span className="text-muted">Total Users</span>
                </div>
                <FaUser className="text-primary fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-success bg-opacity-10">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-success">{stats.active}</h4>
                  <span className="text-muted">Active Users</span>
                </div>
                <FaUserCheck className="text-success fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-warning bg-opacity-10">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-warning">{stats.verified}</h4>
                  <span className="text-muted">Verified Email</span>
                </div>
                <FaEnvelope className="text-warning fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} className="mb-3">
          <Card className="border-0 bg-info bg-opacity-10">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-info">{stats.staff}</h4>
                  <span className="text-muted">Staff Members</span>
                </div>
                <FaUserCheck className="text-info fs-3" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3}>
              <InputGroup>
                <InputGroup.Text>
                  <FaFilter />
                </InputGroup.Text>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                  <option value="email_asc">Email A-Z</option>
                  <option value="email_desc">Email Z-A</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={2}>
              <Button
                variant="outline-secondary"
                onClick={clearFilters}
                className="w-100"
              >
                <FaTimes className="me-2" />
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Alerts */}
      {error && <Message variant="danger">{error}</Message>}
      {/* {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {errorUpdate && <Message variant="danger">{errorUpdate}</Message>} */}
      
      {/* {(loadingDelete || loadingUpdate) && (
        <Alert variant="info" className="d-flex align-items-center">
          <Loader size="sm" className="me-2" />
          {loadingDelete ? "Deleting user..." : "Updating user..."}
        </Alert>
      )} */}

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card className="text-center py-5 shadow-sm">
          <Card.Body>
            <FaUser className="display-1 text-muted opacity-25 mb-3" />
            <h4 className="text-muted">
              {users.length === 0 ? 'No users found' : 'No matching users'}
            </h4>
            <p className="text-muted mb-4">
              {users.length === 0 
                ? 'No users have registered yet.' 
                : 'Try adjusting your search or filters.'
              }
            </p>
            {users.length === 0 && (
              <Link to="/admin/user/create">
                <Button variant="primary">
                  <FaUserPlus className="me-2" />
                  Add First User
                </Button>
              </Link>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {filteredUsers.map((user) => (
            <Col key={user.id} xl={4} lg={6} md={6}>
              <Card className="h-100 shadow-sm border-0 user-card">
                <Card.Body className="d-flex flex-column">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                        <FaUser className="text-primary" size={20} />
                      </div>
                      <div>
                        <h6 className="mb-1">
                          {user.first_name} {user.last_name}
                        </h6>
                        {getRoleBadge(user)}
                      </div>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm" className="border-0">
                        <FaEllipsisV />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Link to={`/admin/users/${user.id}`} className="dropdown-item">
                          <FaEye className="me-2" />
                          View Details
                        </Link>
                        <Link to={`/admin/users/${user.id}/edit`} className="dropdown-item">
                          <FaEdit className="me-2" />
                          Edit User
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => toggleUserStatus(user)}
                          className={user.is_active ? "text-warning" : "text-success"}
                        >
                          {user.is_active ? (
                            <>
                              <FaBan className="me-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <FaCheck className="me-2" />
                              Activate
                            </>
                          )}
                        </Dropdown.Item>
                        <Dropdown.Item 
                          onClick={() => confirmDelete(user)}
                          className="text-danger"
                        >
                          <FaTrash className="me-2" />
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  {/* User Info */}
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="text-muted me-2" size={14} />
                      <small className="text-truncate">{user.email}</small>
                    </div>
                    {user.phone_number && (
                      <div className="d-flex align-items-center mb-2">
                        <FaPhone className="text-muted me-2" size={14} />
                        <small>{user.phone_number}</small>
                      </div>
                    )}
                    <div className="d-flex align-items-center">
                      <FaCalendar className="text-muted me-2" size={14} />
                      <small>Joined {formatDate(user.date_joined)}</small>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge bg={getUserStatusVariant(user)}>
                        {getUserStatusText(user)}
                      </Badge>
                      {!user.is_email_verified && (
                        <Badge bg="warning" text="dark">
                          Email Unverified
                        </Badge>
                      )}
                    </div>
                    
                    {/* <div className="d-flex gap-2">
                      <Link 
                        to={`/admin/users/${user.id}`} 
                        className="flex-fill"
                      >
                        <Button variant="outline-primary" size="sm" className="w-100">
                          <FaEye className="me-1" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant={user.is_active ? "outline-warning" : "outline-success"}
                        size="sm"
                        onClick={() => toggleUserStatus(user)}
                        className="flex-fill"
                        // disabled={loadingUpdate}
                      >
                        {user.is_active ? (
                          <>
                            <FaBan className="me-1" />
                            Disable
                          </>
                        ) : (
                          <>
                            <FaCheck className="me-1" />
                            Enable
                          </>
                        )}
                      </Button>
                    </div> */}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Results Count */}
      {filteredUsers.length > 0 && (
        <div className="mt-4 text-center text-muted">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>Are you sure you want to delete the following user?</p>
              <div className="alert alert-warning">
                <strong>{selectedUser.first_name} {selectedUser.last_name}</strong><br />
                <small>{selectedUser.email}</small>
              </div>
              <p className="text-danger">
                <strong>Warning:</strong> This action cannot be undone. All user data will be permanently deleted.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" 
          onClick={deleteHandler} 
          //disabled={loadingDelete}
          >
            {/* {loadingDelete ? "Deleting..." : "Delete User"} */}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .user-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .user-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .dropdown-toggle::after {
          display: none;
        }
      `}</style>
      </Col>
      </Row>
      </Container>
    </div>
  );
}

export default GetAllUsers;