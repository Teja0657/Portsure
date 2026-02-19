import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../CSSDesgin1/LoginPage.css';
import '../../CSSDesgin1/ForgetPassword.css';
import logo1 from "../../logo/logo.png";

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const navigate = useNavigate();

    // Verify email exists
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        
        if (!email.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8081/api/investors/check-email?email=${encodeURIComponent(email)}`);
            
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
        
        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all password fields.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('New password and confirm password do not match.');
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
                    navigate('/');
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
                                    disabled={isLoading}
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
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