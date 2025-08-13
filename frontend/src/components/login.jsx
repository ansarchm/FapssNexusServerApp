import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import bg from "./assets/bg.png";
import logo from "./assets/logo.png";
import userIcon from "./assets/Group 1.png";
import passIcon from "./assets/Group 2.png";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // No authentication, just UI
    navigate("/location-table"); // redirect to dashboard
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bg})` }}>
      <div className="login-box">
        <img src={logo} alt="Logo" className="logo-img" />
        <h2>Welcome Back</h2>
        <p>Enter your User name and password to login</p>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <img src={userIcon} alt="User Icon" className="icon-img" />
            <input type="text" required />
          </div>

          <div className="input-box">
            <img src={passIcon} alt="Password Icon" className="icon-img" />
            <input type="password" required />
          </div>

          <button type="submit" className="login-btn">LOGIN</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
