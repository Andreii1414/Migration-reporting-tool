import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CLIENT_URL, SERVER_URL } from "../../config";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setMessage(null);

    if (password.length < 5 || confirmPassword.length < 5) {
      setMessage("Password must be at least 5 characters long.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setMessageType("error");
      return;
    }

    const forgotPasswordToken = searchParams.get("token");

    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/reset-password`, {
        forgotPasswordToken,
        password,
        confirmPassword,
      });

      if (response.data.isSuccess) {
        setMessage("Password successfully changed! You can now log in.");
        setMessageType("success");
        setIsResetSuccessful(true);
      } else {
        setMessage("Error resetting password. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Reset password error", error);
      setMessage("An error occurred while resetting your password.");
      setMessageType("error");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f4f9"
    }}>
      <div style={{
        width: "350px",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#333" }}>Reset Your Password</h2>

        {message && (
          <div style={{
            color: messageType === "success" ? "green" : "red",
            fontWeight: "bold",
            marginBottom: "10px"
          }}>
            {message}
          </div>
        )}

        {!isResetSuccessful && (
          <>
            <input
              type="password"
              placeholder="New Password (min 5 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            />
            <button
              onClick={handleResetPassword}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              Submit
            </button>
          </>
        )}

        {isResetSuccessful && (
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
