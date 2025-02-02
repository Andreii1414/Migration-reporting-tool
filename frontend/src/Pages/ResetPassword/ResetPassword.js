import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [isResetSuccessful, setIsResetSuccessful] = useState(false); // Controls form visibility
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    setMessage(null); // Clear any previous messages

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

    const forgotPasswordToken = searchParams.get("token"); // Get token from URL

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        forgotPasswordToken, // Token from the URL
        password,
        confirmPassword,
      });

      if (response.data.isSuccess) {
        setMessage("Password successfully changed! You can now log in.");
        setMessageType("success");
        setIsResetSuccessful(true); // Hide the form
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
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Reset Your Password</h2>

      {message && (
        <div style={{ color: messageType === "success" ? "green" : "red", fontWeight: "bold", marginBottom: "10px" }}>
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
            style={{ display: "block", margin: "10px auto", padding: "10px", width: "90%" }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ display: "block", margin: "10px auto", padding: "10px", width: "90%" }}
          />
          <button
            onClick={handleResetPassword}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              borderRadius: "5px",
              marginTop: "10px",
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
            borderRadius: "5px",
            marginTop: "15px",
          }}
        >
          Go to Login
        </button>
      )}
    </div>
  );
};

export default ResetPasswordPage;
