// ManageInternDetails.js
import React, { useState } from "react";

const ManageInternDetails = () => {
  const [internDetails, setInternDetails] = useState({
    name: "",
    email: "",
    status: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInternDetails({
      ...internDetails,
      [name]: value,
    });
  };

  const handleSave = () => {
    // Save intern details (mocked)
    console.log("Intern details saved:", internDetails);
  };

  return (
    <div>
      <h3>Manage Intern Details</h3>
      <input
        type="text"
        name="name"
        value={internDetails.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="email"
        name="email"
        value={internDetails.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <select
        name="status"
        value={internDetails.status}
        onChange={handleChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ManageInternDetails;
