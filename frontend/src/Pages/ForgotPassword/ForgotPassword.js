import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CLIENT_URL, SERVER_URL } from "../../config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleResetRequest = async () => {
    setIsDisabled(true);
    setMessage(null);
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/send-forgot-password-email`, { email });

      if (response.data.isSuccess) {
        setMessage("A reset link has been sent to your email. Please check your inbox.");
        setMessageType("success");
      } else {
        setMessage("Failed to send reset link. Please try again.");
        setMessageType("error");
        setIsDisabled(false);
      }
    } catch (error) {
      console.error("Reset request error", error);
      setMessage("An error occurred while sending the reset link. Please try again later.");
      setMessageType("error");
      setIsDisabled(false);
    }
  };

  return (
    <div style={{ 
      textAlign: "center", 
      padding: "30px", 
      maxWidth: "400px", 
      margin: "auto", 
      border: "1px solid #ccc", 
      borderRadius: "8px",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Reset Your Password</h2>
      
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        onClick={handleResetRequest} 
        disabled={isDisabled}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: isDisabled ? "#aaa" : "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: isDisabled ? "not-allowed" : "pointer",
          marginBottom: "15px",
        }}
      >
        {isDisabled ? "Sending..." : "Send Reset Link"}
      </button>

      {message && (
        <p style={{
          color: messageType === "success" ? "green" : "red",
          fontWeight: "bold",
          marginBottom: "15px"
        }}>
          {message}
        </p>
      )}

      <p>
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </span>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
