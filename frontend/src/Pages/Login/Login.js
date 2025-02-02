import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import {CLIENT_URL, SERVER_URL} from "../../config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.isSuccess) {
        const { token, refreshToken } = response.data.data;
        console.log(response.data.data);
        console.log(token);
        
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        const isVerified = decodedToken.verified; 

        if (isVerified === true) {
          navigate("/home");
        } else {
          navigate("/verify-email?registered=false");
        }
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${SERVER_URL}/api/auth/google`;
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleGoogleAuth} style={{ backgroundColor: "#DB4437", color: "white" }}>
          Login with Google
        </button>
      </form>
      <p>
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot your password?
        </span>
      </p>
      <p>
        Don't have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
