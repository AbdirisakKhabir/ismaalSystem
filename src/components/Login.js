import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login(email, password);
      if (!result.success) {
        if (result.code === 'NOT_ADMIN') {
          setError('Access denied. Only administrators can access this panel.');
        } else if (result.code === 'INVALID_CREDENTIALS') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <img src="/icon.jpeg" alt="Ismaal" className="login-logo" />
            <h1>Welcome Back</h1>
            <p>Sign in to your admin account</p>
          </div>
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">!</span>
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" disabled={isLoading} autoComplete="email" />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" disabled={isLoading} autoComplete="current-password" />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (<><span className="spinner"></span>Signing in...</>) : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Ismaal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
