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

  // Other API methods like logout, fetch user data, etc.
};

export default apiService;
