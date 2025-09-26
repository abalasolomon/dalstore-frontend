import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Form, Button, Card, Image } from "react-bootstrap";
import { getCategoryDetails, updateCategory } from "../../redux/actions/categoryActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { CATEGORY_UPDATE_RESET } from "../../redux/constants/categoryConstants";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../common/Sidebar";

function EditCategory() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const categoryDetails = useSelector((state) => state.categoryDetails);
  const { loading, error, category } = categoryDetails;

  const categoryUpdate = useSelector((state) => state.categoryUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = categoryUpdate;

  // Local state
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

    const formData = new FormData();
    formData.append("name", name);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    dispatch(updateCategory(slug, formData));
  };

  // Load details
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: CATEGORY_UPDATE_RESET });
      navigate("/admin/categories");
    } else {
      if (!category?.slug || category.slug !== slug) {
        dispatch(getCategoryDetails(slug));
      } else {
        setName(category.name);
        setPreview(category.image || null);
      }
    }
  }, [dispatch, slug, category, successUpdate, navigate]);

  return (
    <div className="d-flex">
      <Sidebar />
      <Container fluid className="flex-grow-1">
        <Row>
          <Col md={12} className="p-4">
            <Card className="shadow-sm p-4">
              <h2 className="fw-bold mb-4">Edit Category</h2>

              {error && <Message variant="danger">{error}</Message>}
              {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
              {validationError && <Message variant="warning">{validationError}</Message>}
              {(loading || loadingUpdate) && <Loader />}

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
                    Update
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

export default EditCategory;
