// src/App.js

import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm";
import SignUpForm from "./components/SignUp/SignUpForm";
import AdminDashboard from "./components/Admin/Dashboard";
import GuideDashboard from "./components/Guide/Dashboard";
import InternDashboard from "./components/Intern/Dashboard";
import ApplyPage from "./components/TemporaryUser/Apply";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/create-account" element={<SignUpForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/guide" element={<GuideDashboard />} />
        <Route path="/intern" element={<InternDashboard />} />
        <Route path="/apply" element={<ApplyPage />} />

        {/* Default route */}
        <Route path="/" element={<LoginForm />} />
      </Routes>
    </Router>
  );
};

export default App;
