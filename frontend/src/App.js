import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Home from "./Pages/Home/Home";
import LoginPage from "./Pages/Login/Login";
import RegisterPage from "./Pages/Register/Register";
import ForgotPasswordPage from "./Pages/ForgotPassword/ForgotPassword";
import ResetPasswordPage from "./Pages/ResetPassword/ResetPassword";
import VerifyEmailPage from "./Pages/VerifyEmail/VerifyEmail";
import EmailVerificationResultPage from "./Pages/VerifyResponse/VerifyReponse";
import {jwtDecode} from "jwt-decode";
import { SERVER_URL } from "./config";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!accessToken || !refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/auth/token", {
          refreshToken,
        });

        if (response.data.isSuccess) {
          localStorage.setItem("accessToken", response.data.data.token);

          const decodedToken = jwtDecode(response.data.data.token);

          if (decodedToken.verified === false) {
            navigate("/verify-email?registered=false");
          }
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token refresh failed", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return children;

};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-email-result" element={<EmailVerificationResultPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
