import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import { useParams, useNavigate } from "react-router-dom";

const EditBatch = () => {
  const { id } = useParams(); // Get batch ID from URL params
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        const response = await apiService.getBatchById(id);
        const batch = response.data.batch;

        // Format dates to 'YYYY-MM-DD'
        const formattedBatch = {
          ...batch,
          startDate: batch.startDate ? batch.startDate.split("T")[0] : "",
          endDate: batch.endDate ? batch.endDate.split("T")[0] : "",
        };

        setBatchData(formattedBatch);
      } catch (err) {
        console.error("Error fetching batch details:", err);
        setError("Failed to fetch batch details");
      }
    };

    fetchBatchDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiService.updateBatch(id, batchData);
      setSuccess("Batch updated successfully!");
      setTimeout(() => {
        navigate("/admin/batch-management/view-batches"); // Navigate after success message
      }, 2000); // Wait 2 seconds before navigating
    } catch (err) {
      console.error("Error updating batch:", err);
      setError("Failed to update batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        .form-container {
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background-color: #f9f9f9;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .form-container h2 {
          text-align: center;
          margin-bottom: 20px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .form-group input:focus {
          outline: none;
          border-color: #007bff;
        }
        .error {
          color: red;
          margin-bottom: 10px;
          text-align: center;
        }
        .success {
          color: green;
          margin-bottom: 10px;
          text-align: center;
        }
        .btn {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        .btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>

      <div className="form-container">
        <h2>Edit Batch</h2>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          {/* Example fields */}
          <div className="form-group">
            <label>Batch Name</label>
            <input
              type="text"
              name="name"
              value={batchData.name || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={batchData.startDate || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={batchData.endDate || ""}
              onChange={handleInputChange}
            />
          </div>
          {/* Add more fields as needed */}
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Updating..." : "Update Batch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBatch;
