import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EmailVerificationResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

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
        <h2 style={{ 
          color: isSuccess ? "green" : "red",
          marginBottom: "20px"
        }}>
          {isSuccess ? "Email Verification Successful!" : "Email Verification Failed"}
        </h2>
        <p style={{ color: "#555", fontSize: "16px", marginBottom: "20px" }}>
          {isSuccess
            ? "Your account has been successfully verified. You can now log in."
            : "Verification failed. Your verification link may have expired or is invalid. Please try again or contact support."}
        </p>
        <button 
          onClick={() => navigate("/login")} 
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isSuccess ? "#28a745" : "#DC3545",
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

export default EmailVerificationResultPage;
