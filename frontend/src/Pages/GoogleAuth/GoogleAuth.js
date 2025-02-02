import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const success = searchParams.get("success");
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const message = searchParams.get("message");

    if (success === "true" && token && refreshToken) {
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/");
    } else {
      alert(message || "Google Authentication Failed");
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return <h2>Processing Google Authentication...</h2>;
};

export default GoogleAuthCallback;
