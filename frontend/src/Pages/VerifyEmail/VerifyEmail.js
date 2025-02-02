import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f4f4f9"
    }}>
      <div style={{
        width: "400px",
        padding: "30px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#333" }}>
          {registered ? "Registration Successful!" : "Email Verification Required"}
        </h2>
        <p style={{ marginBottom: "20px", color: "#555", fontSize: "16px" }}>
          {registered
            ? "Thank you for registering! Please check your email to verify your account."
            : "Your account is not verified. Please check your email for a verification link."}
        </p>
        <button 
          onClick={() => navigate("/login")} 
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
