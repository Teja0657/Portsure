
import { useState } from "react";
import "../styles/auth.css";

const DB_KEY = "portsure_users";

// SVG LOGO
const PortSureLogo = () => (
  <svg className="brand-logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2Z" fillOpacity="0.15"/>
    <path d="M12 22C6.96998 20.8222 3.5066 16.4839 3.0401 11.5201L12 22Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2ZM11 16.5V7.5L16.5 12L11 16.5Z" fill="currentColor"/>
  </svg>
);

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
      (u) => (u.email === emailOrId || u.id === emailOrId) && u.password === password && u.role === role
    );
    if (!user) {
      alert("Invalid credentials or wrong role selected");
      return;
    }
    localStorage.setItem("loggedUser", JSON.stringify(user));
    alert("Login successful");
    goToDashboard();
  };

  return (
    <div className="login-page">
      <div className="auth-card">
        <div className="auth-right">
          
          <div className="brand-section">
            <div className="brand-header">
              <PortSureLogo />
              <h2 className="brand-name">PortSure</h2>
            </div>
            <span className="brand-system-text">Portfolio Risk Analysis &<br/>Investment Compliance System</span>
          </div>

          <div className="auth-header">
            <h2>Welcome back</h2>
          </div>

          <div className="role-switch">
            <label><input type="radio" checked={role === "INVESTOR"} onChange={() => setRole("INVESTOR")} /> Investor</label>
            <label><input type="radio" checked={role === "COMPLIANCE"} onChange={() => setRole("COMPLIANCE")} /> Compliance</label>
            <label><input type="radio" checked={role === "MANAGER"} onChange={() => setRole("MANAGER")} /> Asset Mgr</label>
          </div>

          <div className="input-group">
            <span className="input-label">EMAIL OR ID</span>
            <input placeholder="name@company.com or ID" value={emailOrId} onChange={(e) => setEmailOrId(e.target.value)} />
          </div>

          <div className="input-group">
            <span className="input-label">PASSWORD</span>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="form-footer">
            <span className="forgot-link" onClick={goToReset}>Manage Password?</span>
          </div>

          <button className="auth-btn" onClick={handleLogin}>SIGN IN</button>

          <p className="bottom-text">Don’t have an account? <span onClick={goToRegister}>Sign up</span></p>

          <p className="copyright-footer">&copy; 2026 Portfolio Risk Analysis and Investment Compliance System</p>
        </div>
      </div>
    </div>
  );
}