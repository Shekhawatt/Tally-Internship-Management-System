// src/services/apiService.js

import axios from "axios";

const API_URL = "http://localhost:4000"; // Replace with your API URL

const apiService = {
  // Signup request
  signup: async (userData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/users/signup`,
        userData
      );
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // Login request
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      // Destructure the token from the response data
      const { token } = response.data;

      if (token) {
        // Save the token to localStorage
        localStorage.setItem("authToken", token);
        console.log("Token saved to localStorage:", token); // Debugging log
      } else {
        console.error("Login response does not include token.");
        throw new Error("Login failed. Token not provided.");
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw new Error("Failed to fetch profile");
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(
        `${API_URL}/api/users/update`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  },
  // Fetch admin dashboard data
  getAdminDashboardData: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/dashboard-data`);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      throw error;
    }
  },

  // Fetch only interns
  getInternList: async () => {
    try {
      const token = localStorage.getItem("authToken"); // Ensure token is stored in localStorage after login
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
      });

      console.log("Backend Response:", response.data); // Debugging
      const interns = response.data.users.filter(
        (user) => user.role === "intern"
      );
      console.log("Filtered Interns:", interns); // Debugging
      return interns;
    } catch (error) {
      console.error("Error in getInternList:", error.message);
      throw new Error("Failed to fetch intern list");
    }
  },

  // Fetch only guides
  getGuideList: async () => {
    try {
      const token = localStorage.getItem("authToken"); // Ensure token is stored in localStorage after login
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in the Authorization header
        },
      });

      console.log("Backend Response:", response.data); // Debugging
      const interns = response.data.users.filter(
        (user) => user.role === "guide"
      );
      console.log("Filtered Interns:", interns); // Debugging
      return interns;
    } catch (error) {
      console.error("Error in getInternList:", error.message);
      throw new Error("Failed to fetch intern list");
    }
  },

  // Fetch pending internship requests
  getPendingInternshipRequests: async () => {
    try {
      const token = localStorage.getItem("authToken"); // Ensure token is stored in localStorage after login
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(
        "http://localhost:4000/api/internshipRequests/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the Authorization header
          },
        }
      );

      return response.data; // Return API response
    } catch (error) {
      console.error("Error in getPendingInternshipRequests:", error.message);
      throw new Error("Failed to fetch pending internship requests");
    }
  },

  // Review internship request (approve/reject)
  reviewInternshipRequest: async (id, status, remarks = "") => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/internshipRequests/review/${id}`,
        { status, remarks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in reviewInternshipRequest:", error.message);
      throw new Error("Failed to review internship request");
    }
  },

  // Update intern details
  updateInternDetails: async (id, updatedData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/interns/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in updateInternDetails:", error.message);
      throw new Error("Failed to update intern details");
    }
  },

  addGuide: async (guideData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(`${API_URL}/api/guides`, guideData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in addGuide:", error.message);
      throw new Error("Failed to add guide");
    }
  },

  // Update guide details
  updateGuide: async (id, guideData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/guides/${id}`,
        guideData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        console.error("API Error:", error.response.data);
        throw new Error(
          error.response.data.message || "Failed to update guide details"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network Error:", error.request);
        throw new Error("Network error, please try again later.");
      } else {
        console.error("Error:", error.message);
        throw new Error("Failed to update guide details");
      }
    }
  },

  // Delete a guide
  deleteGuide: async (guideId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.delete(`${API_URL}/api/guides/${guideId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in deleteGuide:", error.message);
      throw new Error("Failed to remove guide");
    }
  },

  // Method to create a project
  createProject: async (projectData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(
        `${API_URL}/api/projects/create`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating project:", error.message);
      throw new Error("Failed to create project");
    }
  },

  getAllProjects: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authorization token not found");

    const response = await axios.get(`${API_URL}/api/projects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  getProjectById: async (id) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authorization token not found");

    const response = await axios.get(`${API_URL}/api/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  updateProject: async (id, projectData) => {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Authorization token not found");

    const response = await axios.patch(
      `${API_URL}/api/projects/${id}`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  // Delete a project
  deleteProject: async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.delete(
        `${API_URL}/api/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in deleteProject:", error.message);
      throw new Error("Failed to delete project");
    }
  },

  submitInternshipRequest: async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }
      console.log(formData);
      const response = await axios.post(
        `${API_URL}/api/internshipRequests/apply`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add team creation function
  addTeam: async (teamData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(`${API_URL}/api/teams`, teamData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating team:", error.message);
      throw new Error("Failed to create team");
    }
  },

  // Update team details
  updateTeam: async (id, teamData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/teams/${id}`,
        teamData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating team:", error.message);
      throw new Error("Failed to update team");
    }
  },

  // Get all teams
  getAllTeams: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/teams`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all teams:", error.message);
      throw new Error("Failed to fetch teams");
    }
  },

  // Get team by ID
  getTeamById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching team by ID:", error.message);
      throw new Error("Failed to fetch team");
    }
  },

  // Delete a team
  deleteTeam: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.delete(`${API_URL}/api/teams/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting team:", error.message);
      throw new Error("Failed to delete team");
    }
  },

  getMilestonesByTeam: async (teamId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(
        `${API_URL}/api/milestones/team/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching team milestones:", error.message);
      throw new Error("Failed to fetch team milestones");
    }
  },
  updateMilestoneSubtask: async (milestoneId, subtaskId, isCompleted) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/milestones/${milestoneId}/${subtaskId}`,
        { isCompleted },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating milestone subtask:", error.message);
      throw new Error("Failed to update milestone subtask");
    }
  },
  getDemosById: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/demos/upcoming`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching Demos:", error.message);
      throw new Error("Failed to fetch demo details");
    }
  },

  // Fetch all demos
  getAllDemos: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/demos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching all demos:", error.message);
      throw new Error("Failed to fetch demos");
    }
  },

  // Update demo details
  updateDemo: async (id, demoData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/demos/${id}`,
        demoData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error in updateDemo:", error.message);
      throw new Error("Failed to update demo");
    }
  },

  // Get demo by ID
  getDemoById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/demos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error in getDemoById:", error.message);
      throw new Error("Failed to fetch demo");
    }
  },

  // Create a new demo
  createDemo: async (demoData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(`${API_URL}/api/demos`, demoData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating demo:", error.message);
      throw new Error("Failed to create demo");
    }
  },

  // Delete a demo
  deleteDemo: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.delete(`${API_URL}/api/demos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting demo:", error.message);
      throw new Error("Failed to delete demo");
    }
  },

  createBatch: async (batchData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.post(`${API_URL}/api/batch`, batchData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error creating batch:", error.message);
      throw new Error("Failed to create batch");
    }
  },

  // Fetch all batches
  getAllBatches: async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/batch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching batches:", error.message);
      throw new Error("Failed to fetch batches");
    }
  },

  // Get batch by ID
  getBatchById: async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(`${API_URL}/api/batch/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching batch by ID:", error.message);
      throw new Error("Failed to fetch batch");
    }
  },

  // Delete a batch
  deleteBatch: async (batchId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.delete(`${API_URL}/api/batch/${batchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting batch:", error.message);
      throw new Error("Failed to delete batch");
    }
  },

  //Update Batch

  updateBatch: async (id, batchData) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.patch(
        `${API_URL}/api/batch/${id}`,
        batchData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating batch:", error.message);
      throw new Error("Failed to update batch");
    }
  },

  getInternsByBatch: async (batchId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authorization token not found");
      }

      const response = await axios.get(
        `${API_URL}/api/batch/${batchId}/interns`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching interns by batch:", error.message);
      throw new Error("Failed to fetch interns by batch");
    }
  },

  // Other API methods like logout, fetch user data, etc.
};

export default apiService;
