
import { useState } from "react";
import "../styles/auth.css";
import loginIllustration from "../assets/login.svg";

const DB_KEY = "portsure_users";

export default function Login({ goToRegister, goToReset, goToDashboard }) {
  const [role, setRole] = useState("INVESTOR");
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!emailOrId || !password) {
      alert("Please enter credentials");
      return;
    }

    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];

    const user = users.find(
      (u) =>
        (u.email === emailOrId || u.id === emailOrId) &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      alert("Invalid credentials or wrong role selected");
      return;
    }

    // ✅ SET SESSION
    localStorage.setItem("loggedUser", JSON.stringify(user));

    alert("Login successful");

    // ✅ REDIRECT
    goToDashboard();
  };

  return (
    <div className="login-page">
      <div className="login-illustration">
        <img src={loginIllustration} alt="Login" />
      </div>

      <div className="login-form-section">
        <h1 className="brand">PortSure</h1>
        <p className="subtitle">
          Portfolio Risk Analysis & Investment Compliance
        </p>

        <h2>Login</h2>

        <div className="role-switch">
          <label>
            <input
              type="radio"
              checked={role === "INVESTOR"}
              onChange={() => setRole("INVESTOR")}
            />
            Investor
          </label>
          <label>
            <input
              type="radio"
              checked={role === "ADMIN"}
              onChange={() => setRole("ADMIN")}
            />
            Admin
          </label>
        </div>

        <input
          placeholder="Email or ID"
          value={emailOrId}
          onChange={(e) => setEmailOrId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="register-text">
          Don’t have an account?{" "}
          <span onClick={goToRegister}>Register</span>
        </p>

        <p className="register-text">
          <span onClick={goToReset}>Manage Password?</span>
        </p>
      </div>
    </div>
  );
}
