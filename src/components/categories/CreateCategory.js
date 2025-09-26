import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row,Col,Container, Form, Button, Card, Image } from "react-bootstrap";
import { createCategory } from "../../redux/actions/categoryActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { CATEGORY_CREATE_RESET } from "../../redux/constants/categoryConstants";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../common/Sidebar";

function CreateCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux State
  const categoryCreate = useSelector((state) => state.categoryCreate);
  const { loading, error, success } = categoryCreate;

  // Local State
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [validationError, setValidationError] = useState("");

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setValidationError("Image size must be less than 10MB");
        setImageFile(null);
        setPreview(null);
        return;
      }
      setValidationError("");
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const submitHandler = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError("Category name is required");
      return;
    }
    if (!imageFile) {
      setValidationError("Please upload an image");
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);

    dispatch(createCategory(formData));
  };

  // Reset after success
  useEffect(() => {
    if (success) {
      dispatch({ type: CATEGORY_CREATE_RESET });
      navigate("/admin/categories");
    }
  }, [success, dispatch, navigate]);
  
  useEffect(() => {
    if (error) {
    //  setValidationError(error);
    }
  }, [error, dispatch]);

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1">
        <Row>
          <Col md={12} className="p-4">
            <Card className="shadow-sm p-4">
          <h2 className="fw-bold mb-4">Create Category</h2>

          {error && <Message variant="danger">{error}</Message>}
          {validationError && <Message variant="warning">{validationError}</Message>}
          {loading && <Loader />}

          <Form onSubmit={submitHandler} encType="multipart/form-data">
            {/* Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group controlId="image" className="mb-3">
              <Form.Label>Category Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div className="mt-3">
                  <Image
                    src={preview}
                    alt="Preview"
                    rounded
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => navigate("/admin/categories")}>
                Cancel
              </Button>
              <Button type="submit" variant="dark">
                Create
              </Button>
            </div>
          </Form>
        </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreateCategory;

