import { useState } from "react";
import "../styles/auth.css";

const DB_KEY = "portsure_users";

const PortSureLogo = () => (
  <svg className="brand-logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2Z" fillOpacity="0.15"/>
    <path d="M12 22C6.96998 20.8222 3.5066 16.4839 3.0401 11.5201L12 22Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2ZM11 16.5V7.5L16.5 12L11 16.5Z" fill="currentColor"/>
  </svg>
);

export default function ResetPassword({ goToLogin }) {
  // CHANGE 4: Removed 'mode' state. This is now strictly Reset Password.
  const [form, setForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
  
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!form.email) return alert("Please enter registered email");
    if (!isValidEmail(form.email)) return alert("Please enter a valid email address");
    if (!form.newPassword) return alert("Please enter new password");
    if (form.newPassword !== form.confirmPassword) return alert("Passwords do not match");

    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const index = users.findIndex((u) => u.email === form.email);

    if (index === -1) return alert("User not found with this email");

    // In a real app, this would send an email link. Here we simulate a hard reset.
    users[index].password = form.newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    
    alert("Password reset successful. Please login with new credentials.");
    goToLogin();
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
            <h2>Reset Password</h2>
            <p>Recover your account access</p>
          </div>

          <div className="input-group">
            <span className="input-label">REGISTERED EMAIL</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com"/>
          </div>

          <div className="input-group">
            <span className="input-label">NEW PASSWORD</span>
            <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Enter new password"/>
          </div>

          <div className="input-group">
            <span className="input-label">CONFIRM PASSWORD</span>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm new password"/>
          </div>

          <button className="auth-btn" onClick={handleSubmit}>RESET PASSWORD</button>
          <p className="bottom-text">Back to <span onClick={goToLogin}>Login</span></p>
          <p className="copyright-footer">&copy; 2026 Portfolio Risk Analysis and Investment Compliance System</p>
        </div>
      </div>
    </div>
  );
}