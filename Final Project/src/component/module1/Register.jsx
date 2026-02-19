import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../CSSDesgin1/Register.css';
import logo1 from "../../logo/logo.png";

const MAX_KYC_SIZE_MB = 5;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    
    // Full Name validation - only alphabets and spaces
    const namePattern = /^[A-Za-z\s]+$/;
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (!namePattern.test(fullName.trim())) {
      newErrors.fullName = 'Full Name must contain only letters.';
    }
    
    // Email validation - must have @ and .
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email)) {
      newErrors.email = 'Email must contain @ and . (e.g., user@example.com)';
    }

    // Password validation - 6 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    } else {
      if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password = 'Password must contain at least 1 uppercase letter.';
      } else if (!/[a-z]/.test(password)) {
        newErrors.password = 'Password must contain at least 1 lowercase letter.';
      } else if (!/[0-9]/.test(password)) {
        newErrors.password = 'Password must contain at least 1 digit.';
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = 'Password must contain at least 1 special character.';
      }
    }

    // Phone validation - exactly 10 digits, no alphabets
    const phonePattern = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9]+$/.test(phone.trim())) {
      newErrors.phone = 'Phone number must contain only digits.';
    } else if (!phonePattern.test(phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const investorData = {
        fullName: fullName,
        email: email,
        password: password,
        phoneNumber: phone,
        availableBalance: 0.0
      };

      const response = await fetch('http://localhost:8081/api/investors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      });

      if (response.ok) {
        await response.json();
        setSuccessMessage('Registration Successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMessage(errorText || 'Registration failed. Email might already be in use.');
      }
    } catch  {
      setErrorMessage('Could not connect to the server. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="brand-logo" aria-hidden="true">
              <div className="hero-visual">
                        <img src={logo1} alt="PortSure Large Logo" className="hero-logo-large" />
                      </div>
          </div>
        <h2>Investor Registration</h2>
        
        {/* Success and Error Messages */}
        {successMessage && (
          <div className="message-box success-message">
            <span className="message-icon">✓</span>
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="message-box error-message">
            <span className="message-icon">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          
          <div className="input-field">
            <label>Full Name</label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => {
                // Only allow letters and spaces
                const value = e.target.value;
                if (value === '' || /^[A-Za-z\s]*$/.test(value)) {
                  setFullName(value);
                }
              }}
              placeholder="Enter your full name"
              required 
            />
            {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
          </div>

          <div className="input-field">
            <label>Contact Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required 
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="input-field">
            <label>Create Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setShowPasswordHints(true)}
              onBlur={() => setShowPasswordHints(false)}
              placeholder="Min 6 chars (A-z, 0-9, !@#$)"
              required 
            />
            {errors.password && <span className="error-msg">{errors.password}</span>}
            {showPasswordHints && !errors.password && (
              <div className="password-hints">
                <small style={{ color: password.length >= 6 ? 'green' : '#666' }}>
                  ✓ At least 6 characters
                </small>
                <small style={{ color: /[A-Z]/.test(password) ? 'green' : '#666' }}>
                  ✓ 1 Uppercase letter
                </small>
                <small style={{ color: /[a-z]/.test(password) ? 'green' : '#666' }}>
                  ✓ 1 Lowercase letter
                </small>
                <small style={{ color: /[0-9]/.test(password) ? 'green' : '#666' }}>
                  ✓ 1 Digit
                </small>
                <small style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'green' : '#666' }}>
                  ✓ 1 Special character (!@#$%^&*)
                </small>
              </div>
            )}
          </div>

          <div className="input-field">
            <label>Contact Phone</label>
            <input 
              type="tel" 
              value={phone} 
              onChange={(e) => {
                // Only allow digits and limit to 10
                const value = e.target.value;
                if (value === '' || (/^[0-9]*$/.test(value) && value.length <= 10)) {
                  setPhone(value);
                }
              }}
              placeholder="10-digit mobile number"
              maxLength="10"
              required 
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>


          <button type="submit" className="reg-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </button>
          
         <div className="login-inline">
            <span className="login-text">Already registered?</span>
            <Link to="/login" className="login-small-btn">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;