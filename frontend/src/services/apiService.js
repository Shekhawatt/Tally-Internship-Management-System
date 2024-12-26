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
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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

  // Other API methods like logout, fetch user data, etc.
};

export default apiService;
