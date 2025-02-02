import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async () => {
    setIsDisabled(true); // Disable button after click
    try {
      const response = await axios.post("http://localhost:5000/api/auth/send-forgot-password-email", { email });
      if (response.data.isSuccess) {
        alert("Reset link sent! Check your email.");
      } else {
        alert("Failed to send reset link.");
        setIsDisabled(false); // Re-enable button if failed
      }
    } catch (error) {
      console.error("Reset request error", error);
      alert("An error occurred.");
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
