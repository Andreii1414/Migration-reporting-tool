import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registered = searchParams.get("registered") === "true";

  return (
    <div>
      <h2>{registered ? "Registration Successful!" : "Email Verification Required"}</h2>
      <p>
        {registered
          ? "Thank you for registering! Please check your email to verify your account."
          : "Your account is not verified. Please check your email for a verification link."}
      </p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
};

export default VerifyEmailPage;
