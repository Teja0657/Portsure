import { useState } from "react";
import "../styles/auth.css";

const DB_KEY = "portsure_users";
const STAFF_SECRET_KEY = "PORTSURE";

const PortSureLogo = () => (
  <svg className="brand-logo-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2Z" fillOpacity="0.15"/>
    <path d="M12 22C6.96998 20.8222 3.5066 16.4839 3.0401 11.5201L12 22Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2L3 7V12C3 17.5228 6.77614 22.2587 12 23.5C17.2239 22.2587 21 17.5228 21 12V7L12 2ZM11 16.5V7.5L16.5 12L11 16.5Z" fill="currentColor"/>
  </svg>
);

export default function Register({ goToDashboard, goToLogin }) {
  const [role, setRole] = useState("INVESTOR");
  const [form, setForm] = useState({ name: "", email: "", password: "", mobile: "" });
  const [staffKey, setStaffKey] = useState("");
  const [errors, setErrors] = useState({});

  const nameRegex = /^[A-Za-z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRules = {
    length: form.password.length >= 8,
    lowercase: /[a-z]/.test(form.password),
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const handleName = (v) => {
    if (!nameRegex.test(v)) setErrors((e) => ({ ...e, name: "Name must contain only alphabets" }));
    else setErrors((e) => ({ ...e, name: "" }));
    setForm({ ...form, name: v });
  };

  const handleEmail = (v) => {
    if (v && !emailRegex.test(v)) setErrors((e) => ({ ...e, email: "Please enter a valid email address" }));
    else setErrors((e) => ({ ...e, email: "" }));
    setForm({ ...form, email: v });
  };

  const handleMobile = (v) => {
    if (!/^\d*$/.test(v)) { setErrors((e) => ({ ...e, mobile: "Enter only numbers" })); return; }
    if (v.length > 10) { setErrors((e) => ({ ...e, mobile: "Maximum 10 digits only" })); return; }
    if (v.length < 10) setErrors((e) => ({ ...e, mobile: "10 digits required" }));
    else setErrors((e) => ({ ...e, mobile: "" }));
    setForm({ ...form, mobile: v });
  };

  const handleRegister = () => {
    const hasErrors = Object.values(errors).some(Boolean);
    const passwordValid = Object.values(passwordRules).every(Boolean);

    if (!form.name || !form.email || !form.password || !form.mobile) return alert("Please fill all fields");

    if (role !== "INVESTOR") {
      if (!staffKey) return alert("Please enter the Staff Registration Key");
      if (staffKey !== STAFF_SECRET_KEY) return alert("Invalid Registration Key. Access Denied.");
    }

    if (hasErrors || !passwordValid) return alert("Please resolve the validation errors");

    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    if (users.some((u) => u.email === form.email)) return alert("User already exists with this email");
    
    let prefix = "INV";
    if (role === "COMPLIANCE") prefix = "CMP";
    if (role === "MANAGER") prefix = "MGR";

    const newUser = { 
        id: `${prefix}-${Date.now()}`, 
        role, 
        ...form,
        // CHANGE: Only add totalBalance if the role is INVESTOR
        ...(role === "INVESTOR" && { totalBalance: 100000 }),
        portfolios: [] 
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    
    alert(`Registration successful!\n\nYour ID is: ${newUser.id}\nPlease Login to continue.`);
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

          <div className="auth-header"><h2>Create Account</h2></div>

          <div className="role-switch">
            <label><input type="radio" checked={role === "INVESTOR"} onChange={() => setRole("INVESTOR")} /> Investor</label>
            <label><input type="radio" checked={role === "COMPLIANCE"} onChange={() => setRole("COMPLIANCE")} /> Compliance</label>
            <label><input type="radio" checked={role === "MANAGER"} onChange={() => setRole("MANAGER")} /> Asset Mgr</label>
          </div>

          <div className="input-group">
            <span className="input-label">FULL NAME</span>
            <input value={form.name} onChange={(e) => handleName(e.target.value)} placeholder="Eg. Alice Border"/>
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="input-group">
            <span className="input-label">EMAIL ADDRESS</span>
            <input value={form.email} onChange={(e) => handleEmail(e.target.value)} placeholder="Eg. name@company.com"/>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="input-group">
            <span className="input-label">PASSWORD</span>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="........"/>
            <ul className="password-rules">
              <li className={passwordRules.length ? "valid" : ""}>Min 8 chars</li>
              <li className={passwordRules.lowercase ? "valid" : ""}>Lowercase</li>
              <li className={passwordRules.uppercase ? "valid" : ""}>Uppercase</li>
              <li className={passwordRules.number ? "valid" : ""}>Number</li>
              <li className={passwordRules.special ? "valid" : ""}>Special</li>
            </ul>
          </div>

          {role !== "INVESTOR" && (
             <div className="input-group" style={{border: '1px dashed #4f46e5', padding: '10px', borderRadius: '12px', background: '#eef2ff'}}>
               <span className="input-label" style={{color: '#4f46e5'}}>STAFF REGISTRATION KEY</span>
               <input type="password" value={staffKey} onChange={(e) => setStaffKey(e.target.value)} placeholder="Enter secure key" style={{background: 'white'}}/>
             </div>
          )}

          <div className="input-group">
            <span className="input-label">MOBILE NUMBER</span>
            <input value={form.mobile} onChange={(e) => handleMobile(e.target.value)} placeholder="Eg. 1234-567-890" />
            {errors.mobile && <p className="error">{errors.mobile}</p>}
          </div>

          <button className="auth-btn" onClick={handleRegister}>SIGN-UP</button>
          <p className="bottom-text">Already have an account? <span onClick={goToLogin}>Sign in</span></p>
          <p className="copyright-footer">&copy; 2026 Portfolio Risk Analysis and Investment Compliance System</p>
        </div>
      </div>
    </div>
  );
}