import React, { useEffect, useState } from "react";
import apiService from "../../services/apiService"; // Import the API service
import "./AdminProfile.css"; // Import the CSS file

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    role: "Administrator", // Default role
  });
  const [updatedData, setUpdatedData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  // Fetch admin details on component load
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        var data = await apiService.getProfile();
        data = data.user;
        // console.log(data.name);
        setAdminData({
          name: data.name,
          email: data.email,
          role: "Admin",
        });
        setUpdatedData({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  // Handle form submission for updating admin details
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile(updatedData);
      setAdminData((prevData) => ({ ...prevData, ...updatedData }));
    } catch (error) {
      console.error("Error updating admin profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>

      <div className="profile-card">
        <h3>Profile Information</h3>
        <div className="profile-details">
          <div className="profile-item">
            <strong>Name :</strong> {adminData.name}
          </div>
          <div className="profile-item">
            <strong>Email :</strong> {adminData.email}
          </div>
          <div className="profile-item">
            <strong>Role :</strong> {adminData.role}
          </div>
        </div>
      </div>

      <div className="profile-update-form">
        <h3>Update Profile</h3>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={updatedData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={updatedData.email}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
