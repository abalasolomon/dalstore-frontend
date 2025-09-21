import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Card } from "react-bootstrap";
import {
  getUserProfile,
  updateUserProfile,
} from "../../redux/actions/accountActions";
import { USER_PROFILE_UPDATE_RESET } from "../../redux/constants/accountConstants";
import { showSuccess } from "../../common/toastConfig";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading } = useSelector((state) => state.userProfile);
  const { success: updateSuccess } = useSelector(
    (state) => state.userProfileUpdate
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      showSuccess("Profile updated successfully");
    setTimeout(() => {
        dispatch({type: USER_PROFILE_UPDATE_RESET });
        navigate("/account");
      }, 1500);
    }
  }, [updateSuccess, dispatch,navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
  };

  return (
    <Card className="p-4 shadow-sm">
      <h2>My Profile</h2>
      {loading && <p>Loading...</p>}
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.first_name}
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={formData.phone_number}
            onChange={(e) =>
              setFormData({ ...formData, phone_number: e.target.value })
            }
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            disabled
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Form.Group>

        <Button type="submit" variant="dark" className="w-100">
          Update Profile
        </Button>
      </Form>
    </Card>
  );
}

export default UserProfile;
