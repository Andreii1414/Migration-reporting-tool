import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const token = searchParams.get("token");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password,
      });

      if (response.data.isSuccess) {
        alert("Password successfully changed!");
        navigate("/login");
      } else {
        alert("Error resetting password.");
      }
    } catch (error) {
      console.error("Reset password error", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <h2>Reset Your Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button onClick={handleResetPassword}>Submit</button>
    </div>
  );
};

export default ResetPasswordPage;
