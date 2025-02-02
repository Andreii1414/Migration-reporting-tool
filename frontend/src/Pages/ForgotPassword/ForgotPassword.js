import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {CLIENT_URL, SERVER_URL} from "../../config";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [message, setMessage] = useState(null); // Success/Error message
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const handleResetRequest = async () => {
    setIsDisabled(true); // Disable button after click
    setMessage(null); // Clear previous messages
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/send-forgot-password-email`, { email });

      if (response.data.isSuccess) {
        setMessage("A reset link has been sent to your email. Please check your inbox.");
        setMessageType("success");
      } else {
        setMessage("Failed to send reset link. Please try again.");
        setMessageType("error");
        setIsDisabled(false); // Re-enable button if failed
      }
    } catch (error) {
      console.error("Reset request error", error);
      setMessage("An error occurred while sending the reset link. Please try again later.");
      setMessageType("error");
      setIsDisabled(false);
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button onClick={handleResetRequest} disabled={isDisabled}>
        Send Reset Link
      </button>

      {message && (
        <p
          style={{
            color: messageType === "success" ? "green" : "red",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {message}
        </p>
      )}

      <p>
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </span>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
