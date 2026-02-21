import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSSDesgin1/LoginPage.css';
import '../../CSSDesgin1/ForgetPassword.css';
import logo1 from "../../logo/logo.png";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPasswordHints, setShowPasswordHints] = useState(false);
    const navigate = useNavigate();

    // Verify email exists
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setErrors({});
        
        // Email validation - must have @ and .
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setErrors({ email: 'Email is required.' });
            return;
        } else if (!emailPattern.test(email)) {
            setErrors({ email: 'Email must contain @ and . (e.g., user@example.com)' });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8081/api/investors/check-email?email=${email}`);
            
            if (response.ok) {
                setSuccessMessage('Email verified! Please enter your new password.');
                setEmailVerified(true);
            } else {
                setErrorMessage('Email not found in our system.');
            }
        } catch  {
            setErrorMessage('Failed to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    // Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setErrors({});
        
        const newErrors = {};

        // Password validation - 6 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        if (!newPassword.trim()) {
            newErrors.newPassword = 'Password is required.';
        } else {
            if (newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters.';
            } else if (!/[A-Z]/.test(newPassword)) {
                newErrors.newPassword = 'Password must contain at least 1 uppercase letter.';
            } else if (!/[a-z]/.test(newPassword)) {
                newErrors.newPassword = 'Password must contain at least 1 lowercase letter.';
            } else if (!/[0-9]/.test(newPassword)) {
                newErrors.newPassword = 'Password must contain at least 1 digit.';
            } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
                newErrors.newPassword = 'Password must contain at least 1 special character.';
            }
        }

        // Confirm password validation
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8081/api/investors/reset-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                }),
            });

            if (response.ok) {
                setSuccessMessage('Password reset successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorMsg = await response.text();
                setErrorMessage(errorMsg || 'Failed to reset password. Please try again.');
            }
        } catch  {
            setErrorMessage('Failed to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="auth-card">
                <div className="brand">
                    <img src={logo1} alt="PortSure Logo" className="hero-logo-large" />
                    <h2 className="brand-title">Forgot Password</h2>
                    <p className="brand-subtitle">
                        {!emailVerified ? "Enter your email to reset password" : "Create a new password for your account"}
                    </p>
                </div>

                {/* Error and Success Messages */}
                {errorMessage && (
                    <div className="message-box error-message">
                        <span className="message-icon">⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="message-box success-message">
                        <span className="message-icon">✓</span>
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Email Verification or Password Reset Form */}
                {!emailVerified ? (
                    <form onSubmit={handleVerifyEmail} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            {errors.email && <span className="error-msg" style={{ color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>{errors.email}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary btn-forgot-password" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>

                        <div className="auth-footer">
                            <Link to="/login" className="link-secondary">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter new password (min. 6 characters)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onFocus={() => setShowPasswordHints(true)}
                                    onBlur={() => setShowPasswordHints(false)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            {errors.newPassword && <span className="error-msg" style={{ color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>{errors.newPassword}</span>}
                            {showPasswordHints && !errors.newPassword && (
                                <div className="password-hints" style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                    <small style={{ color: newPassword.length >= 6 ? 'green' : '#666', display: 'block', marginBottom: '0.25rem' }}>
                                        ✓ At least 6 characters
                                    </small>
                                    <small style={{ color: /[A-Z]/.test(newPassword) ? 'green' : '#666', display: 'block', marginBottom: '0.25rem' }}>
                                        ✓ 1 Uppercase letter
                                    </small>
                                    <small style={{ color: /[a-z]/.test(newPassword) ? 'green' : '#666', display: 'block', marginBottom: '0.25rem' }}>
                                        ✓ 1 Lowercase letter
                                    </small>
                                    <small style={{ color: /[0-9]/.test(newPassword) ? 'green' : '#666', display: 'block', marginBottom: '0.25rem' }}>
                                        ✓ 1 Digit
                                    </small>
                                    <small style={{ color: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? 'green' : '#666', display: 'block' }}>
                                        ✓ 1 Special character (!@#$%^&*)
                                    </small>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Re-enter new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isLoading}
                                required
                            />
                            {errors.confirmPassword && <span className="error-msg" style={{ color: 'red', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>{errors.confirmPassword}</span>}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary btn-forgot-password" 
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Reset Password'}
                        </button>

                        <div className="auth-footer">
                            <Link to="/login" className="link-secondary">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;