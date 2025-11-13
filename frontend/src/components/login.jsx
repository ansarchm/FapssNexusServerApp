import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api"; // Using unified API
import "./login.css";
import bg from "./assets/bg.png";
import logo from "./assets/logo.png";
import userIcon from "./assets/Group 1.png";
import passIcon from "./assets/Group 2.png";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Attempting login with:", { username });
      const response = await authAPI.login(username, password);
      console.log("✅ Login response:", response.data);

      // Store the JWT token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("🔑 Token stored in localStorage");

        // Store user info
        const userInfo = {
          id: response.data.id,
          username: response.data.username,
          userroleid: response.data.userroleid,
          userrole: response.data.userrole,
        };
        localStorage.setItem("user", JSON.stringify(userInfo));
        console.log("👤 User info stored:", userInfo);

        // Verify token was saved
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          console.log("✅ Token verified in storage");
          console.log("🚀 Navigating to location-table...");
          navigate("/location-table");
        } else {
          console.error("❌ Token not saved properly!");
          setError("Token storage failed. Please try again.");
        }
      } else {
        setError("Login successful but no token received");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      console.error("Error details:", err.response);

      if (err.response) {
        // Server responded with error
        setError(
          err.response.data?.message ||
            err.response.data?.title ||
            `Login failed: ${err.response.status} - Please check your credentials`
        );
      } else if (err.request) {
        // No response from server
        setError(
          "Cannot connect to server. Please ensure the API is running on https://localhost:7221"
        );
      } else {
        // Other errors
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-lg" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-box-lg">
        <img src={logo} alt="Logo" className="logo-img-lg" />
        <h2>Welcome Back</h2>
        <p>Enter your User name and password to login</p>

        {error && (
          <div
            style={{
              color: "#ff4444",
              backgroundColor: "#ffe6e6",
              padding: "10px",
              borderRadius: "5px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-box-lg">
            <img src={userIcon} alt="User Icon" className="icon-img-lg" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              disabled={loading}
            />
          </div>

          <div className="input-box-lg">
            <img src={passIcon} alt="Password Icon" className="icon-img-lg" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-btn-lg" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;