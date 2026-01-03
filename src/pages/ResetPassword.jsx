// import { useState } from "react";
// import "../styles/auth.css";

// const DB_KEY = "portsure_users";

// export default function ResetPassword({ goToLogin }) {
//   const [mode, setMode] = useState("forgot"); // forgot | change

//   const [form, setForm] = useState({
//     email: "",
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = () => {
//     if (!form.email) {
//       alert("Please enter registered email");
//       return;
//     }

//     if (!isValidEmail(form.email)) {
//       alert("Please enter a valid email address");
//       return;
//     }

//     if (mode === "change" && !form.oldPassword) {
//       alert("Please enter old password");
//       return;
//     }

//     if (!form.newPassword) {
//       alert("Please enter new password");
//       return;
//     }

//     if (form.newPassword !== form.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
//     // find user only by email
//     const index = users.findIndex((u) => u.email === form.email);

//     if (index === -1) {
//       alert("User not found with this email");
//       return;
//     }

//     // validate old password only in change mode
//     if (mode === "change" && users[index].password !== form.oldPassword) {
//       alert("Old password is incorrect");
//       return;
//     }

//     users[index].password = form.newPassword;
//     localStorage.setItem(DB_KEY, JSON.stringify(users));

//     alert(mode === "forgot" ? "Password reset successful" : "Password changed successfully");
//     goToLogin();
//   };

//   return (
//     <div className="login-page">
//       <div className="auth-card">
//         <div className="auth-form-section">
//           <h1 className="brand">PortSure</h1>
//           <p className="subtitle">Portfolio Risk Analysis & Investment Compliance</p>

//           <h2>{mode === "forgot" ? "Forgot Password" : "Change Password"}</h2>

//           <p className="subtitle">
//             {mode === "forgot" ? "Reset your account password" : "Update your existing password"}
//           </p>

//           <div className="role-switch">
//             <label>
//               <input
//                 type="radio"
//                 checked={mode === "forgot"}
//                 onChange={() => setMode("forgot")}
//               />
//               Forgot Password
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 checked={mode === "change"}
//                 onChange={() => setMode("change")}
//               />
//               Change Password
//             </label>
//           </div>

//           <input
//             placeholder="Registered Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//           />

//           {mode === "change" && (
//             <input
//               type="password"
//               placeholder="Old Password"
//               value={form.oldPassword}
//               onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
//             />
//           )}

//           <input
//             type="password"
//             placeholder="New Password"
//             value={form.newPassword}
//             onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={form.confirmPassword}
//             onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
//           />

//           <button className="auth-btn" onClick={handleSubmit}>
//             {mode === "forgot" ? "Reset Password" : "Change Password"}
//           </button>

//           <p className="link-text">
//             Back to <span onClick={goToLogin}>Login</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useState } from "react";
// import "../styles/auth.css";
// import resetIllustration from "../assets/portsure1.jpg";

// const DB_KEY = "portsure_users";

// export default function ResetPassword({ goToLogin }) {
//   const [mode, setMode] = useState("forgot");
//   const [form, setForm] = useState({ email: "", oldPassword: "", newPassword: "", confirmPassword: "" });

//   const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const handleSubmit = () => {
//     if (!form.email) return alert("Please enter registered email");
//     if (!isValidEmail(form.email)) return alert("Please enter a valid email address");
//     if (mode === "change" && !form.oldPassword) return alert("Please enter old password");
//     if (!form.newPassword) return alert("Please enter new password");
//     if (form.newPassword !== form.confirmPassword) return alert("Passwords do not match");

//     const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
//     const index = users.findIndex((u) => u.email === form.email);
    
//     if (index === -1) return alert("User not found with this email");
//     if (mode === "change" && users[index].password !== form.oldPassword) return alert("Old password is incorrect");

//     users[index].password = form.newPassword;
//     localStorage.setItem(DB_KEY, JSON.stringify(users));
//     alert(mode === "forgot" ? "Password reset successful" : "Password changed successfully");
//     goToLogin();
//   };

//   return (
//     <div className="login-page">
//       <div className="auth-card">
//         <div className="auth-left">
//           <img src={resetIllustration} alt="Reset Visual" />
//         </div>

//         <div className="auth-right">
          
//           <div className="brand-section">
//             <h2 className="brand-name">PortSure</h2>
//             <span className="brand-system-text">Portfolio Risk Analysis and Investment Compliance System</span>
//           </div>

//           <div className="auth-header">
//             <h2>{mode === "forgot" ? "Reset Password" : "Change Password"}</h2>
//           </div>

//           <div className="role-switch">
//             <label><input type="radio" checked={mode === "forgot"} onChange={() => setMode("forgot")} /> Reset</label>
//             <label><input type="radio" checked={mode === "change"} onChange={() => setMode("change")} /> Change</label>
//           </div>

//           <div className="input-group">
//             <span className="input-label">REGISTERED EMAIL</span>
//             <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com"/>
//           </div>

//           {mode === "change" && (
//             <div className="input-group">
//               <span className="input-label">OLD PASSWORD</span>
//               <input type="password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} placeholder="Enter old password"/>
//             </div>
//           )}

//           <div className="input-group">
//             <span className="input-label">NEW PASSWORD</span>
//             <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Enter new password"/>
//           </div>

//           <div className="input-group">
//             <span className="input-label">CONFIRM PASSWORD</span>
//             <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm new password"/>
//           </div>

//           <button className="auth-btn" onClick={handleSubmit}>SUBMIT REQUEST</button>

//           <p className="bottom-text">
//             Back to <span onClick={goToLogin}>Login</span>
//           </p>

//           {/* --- NEW TRADEMARK FOOTER --- */}
//           <p className="copyright-footer">
//             &copy; 2026 Portfolio Risk Analysis and Investment Compliance System
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }

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
  const [mode, setMode] = useState("forgot");
  const [form, setForm] = useState({ email: "", oldPassword: "", newPassword: "", confirmPassword: "" });
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!form.email) return alert("Please enter registered email");
    if (!isValidEmail(form.email)) return alert("Please enter a valid email address");
    if (mode === "change" && !form.oldPassword) return alert("Please enter old password");
    if (!form.newPassword) return alert("Please enter new password");
    if (form.newPassword !== form.confirmPassword) return alert("Passwords do not match");
    const users = JSON.parse(localStorage.getItem(DB_KEY)) || [];
    const index = users.findIndex((u) => u.email === form.email);
    if (index === -1) return alert("User not found with this email");
    if (mode === "change" && users[index].password !== form.oldPassword) return alert("Old password is incorrect");
    users[index].password = form.newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    alert(mode === "forgot" ? "Password reset successful" : "Password changed successfully");
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
            <h2>{mode === "forgot" ? "Reset Password" : "Change Password"}</h2>
            <p>Update your credentials securely</p>
          </div>

          <div className="role-switch">
            <label><input type="radio" checked={mode === "forgot"} onChange={() => setMode("forgot")} /> Reset</label>
            <label><input type="radio" checked={mode === "change"} onChange={() => setMode("change")} /> Change</label>
          </div>

          <div className="input-group">
            <span className="input-label">REGISTERED EMAIL</span>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@company.com"/>
          </div>

          {mode === "change" && (
            <div className="input-group">
              <span className="input-label">OLD PASSWORD</span>
              <input type="password" value={form.oldPassword} onChange={(e) => setForm({ ...form, oldPassword: e.target.value })} placeholder="Enter old password"/>
            </div>
          )}

          <div className="input-group">
            <span className="input-label">NEW PASSWORD</span>
            <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} placeholder="Enter new password"/>
          </div>

          <div className="input-group">
            <span className="input-label">CONFIRM PASSWORD</span>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm new password"/>
          </div>

          <button className="auth-btn" onClick={handleSubmit}>SUBMIT REQUEST</button>
          <p className="bottom-text">Back to <span onClick={goToLogin}>Login</span></p>
          <p className="copyright-footer">&copy; 2026 Portfolio Risk Analysis and Investment Compliance System</p>
        </div>
      </div>
    </div>
  );
}