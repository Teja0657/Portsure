
import { useState } from "react";
import "../styles/auth.css";
import loginIllustration from "../assets/forget-password.svg";

const DB_KEY = "portsure_users";

export default function ForgetPassword({ goToLogin }) {
  const [mode, setMode] = useState("forgot"); // forgot | change

  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!form.email) {
      alert("Please enter registered email");
      return;
    }

    if (!isValidEmail(form.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (mode === "change" && !form.oldPassword) {
      alert("Please enter old password");
      return;
    }

    if (!form.newPassword) {
      alert("Please enter new password");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const users =
      JSON.parse(localStorage.getItem(DB_KEY)) || [];

    // find user only by email
    const index = users.findIndex(
      (u) => u.email === form.email
    );

    if (index === -1) {
      alert("User not found with this email");
      return;
    }

    // validate old password only in change mode
    if (
      mode === "change" &&
      users[index].password !== form.oldPassword
    ) {
      alert("Old password is incorrect");
      return;
    }

    users[index].password = form.newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    alert(
      mode === "forgot"
        ? "Password reset successful"
        : "Password changed successfully"
    );

    goToLogin();
  };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-illustration">
        <img src={loginIllustration} alt="Reset Password" />
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-section">
        <h1 className="brand">PortSure</h1>
        <p className="subtitle">
          Portfolio Risk Analysis & Investment Compliance
        </p>

        <h2>
          {mode === "forgot"
            ? "Forgot Password"
            : "Change Password"}
        </h2>

        <p className="welcome">
          {mode === "forgot"
            ? "Reset your account password"
            : "Update your existing password"}
        </p>
       
        {/* MODE SWITCH */}
        <div className="role-switch">
          <label>
            <input
              type="radio"
              checked={mode === "forgot"}
              onChange={() => setMode("forgot")}
            />
            Forgot Password
          </label>

          <label>
            <input
              type="radio"
              checked={mode === "change"}
              onChange={() => setMode("change")}
            />
            Change Password
          </label>
        </div>

        <input
          placeholder="Registered Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {mode === "change" && (
          <input
            type="password"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={(e) =>
              setForm({
                ...form,
                oldPassword: e.target.value,
              })
            }
          />
        )}

        <input
          type="password"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) =>
            setForm({
              ...form,
              newPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        <button className="login-btn" onClick={handleSubmit}>
          {mode === "forgot"
            ? "Reset Password"
            : "Change Password"}
        </button>

        <p className="register-text">
          Back to <span onClick={goToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}
