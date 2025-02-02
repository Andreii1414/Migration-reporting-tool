import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const EmailVerificationResultPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  return (
    <div>
      <h2>{isSuccess ? "Email Verification Successful!" : "Email Verification Failed"}</h2>
      <p>
        {isSuccess
          ? "Your account has been successfully verified. You can now log in."
          : "Verification failed. Your verification link may have expired or is invalid. Please try again or contact support."}
      </p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default EmailVerificationResultPage;
