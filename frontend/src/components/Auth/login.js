import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state before each submission

    // Frontend validations
    if (!credentials.email.includes('@')) {
      setError('Invalid email');
      return;
    }

    if (credentials.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      // Call to the auth service
      const data = await authService.login(credentials.email, credentials.password);
      
      // Navigate based on the user role
      switch (data.role) {
        case 'PARTICIPANT':
          navigate('/Dashboards/dashboardparticipant');
          break;
        case 'ORGANIZER':
          navigate('/Dashboards/dashboardorganizer');
          break;
        case 'ADMIN':
          navigate('/Dashboards/dashboardadmin');
          break;
        default:
          navigate('/'); // Default to home page if the role is unrecognized
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-desktop-container">
      <div className="login-card">
        <h2>Login to GetUrTicket</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button">Login</button>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="login-links">
          <a href="/reset-password">Forgot your password?</a>
          <a href="/signup">Create an account</a>
        </div>

      </div>
    </div>
  );
};

export default Login;
