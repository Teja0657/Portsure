import { useState } from "react";
import "../styles/auth.css";
import loginIllustration from "../assets/register.svg";

const DB_KEY = "portsure_users";

export default function Register({ goToDashboard, goToLogin }) {
  const [role, setRole] = useState("INVESTOR");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    proofId: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= REGEX ================= */
  const nameRegex = /^[A-Za-z\s]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{0,10}$/;
  const proofRegex = /^[A-Za-z0-9]*$/;

  /* ================= PASSWORD RULES ================= */
  const passwordRules = {
    length: form.password.length >= 8,
    lowercase: /[a-z]/.test(form.password),
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  /* ================= HANDLERS ================= */

  const handleName = (v) => {
    if (!nameRegex.test(v)) {
      setErrors((e) => ({
        ...e,
        name: "Name must contain only alphabets",
      }));
    } else {
      setErrors((e) => ({ ...e, name: "" }));
    }
    setForm({ ...form, name: v });
  };

  const handleEmail = (v) => {
    if (v && !emailRegex.test(v)) {
      setErrors((e) => ({
        ...e,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((e) => ({ ...e, email: "" }));
    }
    setForm({ ...form, email: v });
  };

  const handleMobile = (v) => {
  // ❌ block non-numeric characters
  if (!/^\d*$/.test(v)) {
    setErrors((e) => ({
      ...e,
      mobile: "Enter only numbers",
    }));
    return;
  }

  // ❌ block more than 10 digits
  if (v.length > 10) {
    setErrors((e) => ({
      ...e,
      mobile: "Maximum 10 digits only",
    }));
    return; // IMPORTANT: do not update state
  }

  // ⚠️ less than 10 digits
  if (v.length < 10) {
    setErrors((e) => ({
      ...e,
      mobile: "10 digits required",
    }));
  } else {
    // ✅ exactly 10 digits
    setErrors((e) => ({ ...e, mobile: "" }));
  }

  // ✅ update state only when length <= 10
  setForm({ ...form, mobile: v });
};

  const handleProof = (v) => {
    if (!proofRegex.test(v)) {
      setErrors((e) => ({
        ...e,
        proofId: "Only alphabets and numbers allowed",
      }));
    } else {
      setErrors((e) => ({ ...e, proofId: "" }));
    }
    setForm({ ...form, proofId: v });
  };

  /* ================= REGISTER ================= */

  const handleRegister = () => {
    const hasErrors = Object.values(errors).some(Boolean);
    const passwordValid = Object.values(passwordRules).every(Boolean);

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.mobile ||
      !form.proofId
    ) {
      return alert("Please fill all fields");
    }

    if (hasErrors || !passwordValid) {
      return alert("Please resolve the validation errors");
    }

    const users =
      JSON.parse(localStorage.getItem(DB_KEY)) || [];

    if (users.some((u) => u.email === form.email)) {
      return alert("User already exists with this email");
    }

    const newUser = {
      id:
        role === "INVESTOR"
          ? `INV-${Date.now()}`
          : `ADM-${Date.now()}`,
      role,
      ...form,
      portfolios: [],
    };

    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));

    // ✅ SUCCESS MESSAGE WITH ID
    alert(
      `Registration successful!\n\nYour ${
        role === "INVESTOR" ? "Investor" : "Admin"
      } ID is: ${newUser.id}`
    );

    // ✅ AUTO LOGIN
    localStorage.setItem("loggedUser", JSON.stringify(newUser));

    // ✅ REDIRECT TO DASHBOARD (PORTFOLIO CREATION)
    goToDashboard();
  };

  /* ================= UI ================= */

  return (
    <div className="login-page">
      <div className="login-illustration">
        <img src={loginIllustration} alt="Register" />
      </div>

      <div className="login-form-section">
        <h1 className="brand">PortSure</h1>
        <p className="subtitle">
          Portfolio Risk Analysis & Investment Compliance
        </p>

        <h2>Register</h2>

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

        {/* NAME */}
        <input placeholder="Full Name" onChange={(e) => handleName(e.target.value)} />
        {errors.name && <p className="error">{errors.name}</p>}

        {/* EMAIL */}
        <input placeholder="Email Address" onChange={(e) => handleEmail(e.target.value)} />
        {errors.email && <p className="error">{errors.email}</p>}

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <ul className="password-rules">
          <li className={passwordRules.length ? "valid" : "invalid"}>
            Minimum 8 characters
          </li>
          <li className={passwordRules.lowercase ? "valid" : "invalid"}>
            One lowercase letter
          </li>
          <li className={passwordRules.uppercase ? "valid" : "invalid"}>
            One uppercase letter
          </li>
          <li className={passwordRules.number ? "valid" : "invalid"}>
            One number
          </li>
          <li className={passwordRules.special ? "valid" : "invalid"}>
            One special character
          </li>
        </ul>

        {/* MOBILE */}
        <input placeholder="Mobile Number" onChange={(e) => handleMobile(e.target.value)} />
        {errors.mobile && <p className="error">{errors.mobile}</p>}

        {/* PROOF */}
        <input placeholder="Government Proof ID" onChange={(e) => handleProof(e.target.value)} />
        {errors.proofId && <p className="error">{errors.proofId}</p>}

        <button className="login-btn" onClick={handleRegister}>
          Register & Continue
        </button>

        <p className="register-text">
          Already registered?{" "}
          <span onClick={goToLogin}>Login</span>
        </p>
      </div>
    </div>
  );
}
