import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './participantsignup.css'; // Fichier CSS que nous créerons ensuite
import axios from 'axios';

const ParticipantSignup = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    Phone_num: '',
    birthDate: '',
    acceptsTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    const birthDate = new Date(formData.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (!formData.fullName.trim()) newErrors.fullName = "Full name required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone.match(/^[0-9]{10}$/)) newErrors.phone = "Invalid number (10 digits)";
    if (age < 18) newErrors.birthDate = "You must be 18 or older";
    if (!formData.acceptsTerms) newErrors.acceptsTerms = "You must accept the Terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);

      const [firstName, ...lastNameParts] = formData.fullName.trim().split(" ");
      const lastName = lastNameParts.join(" ") || "";

      try {
        const response = await axios.post('http://localhost:8080/api/auth/register', {
          email: formData.email,
          password: formData.password,
          f_name: firstName,
          l_name: lastName,
          phone_num: formData.phone,
          birthDate: formData.birthDate,
          role: "PARTICIPANT"
        });
        setSuccessMessage(`Registration successful! Please check your email: ${formData.email}`);
        navigate('/Auth/login');
      } catch (error) {
        console.error("Registration error:", error.response?.data || error.message);
        alert("Error during registration. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="participant-signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Become a Participant</h2>
          <p>Join our community and discover exciting events!</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName}
              onChange={handleChange} className={errors.fullName ? 'error' : ''}
              placeholder="John Smith"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={formData.email}
              onChange={handleChange} className={errors.email ? 'error' : ''}
              placeholder="john@example.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password" id="password" name="password" value={formData.password}
              onChange={handleChange} className={errors.password ? 'error' : ''}
              placeholder="Minimum 8 characters"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input type="tel" id="phone" name="phone" value={formData.phone}
              onChange={handleChange} className={errors.phone ? 'error' : ''}
              placeholder="0612345678"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Birth Date */}
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date*</label>
            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate}
              onChange={handleChange} className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && (
              <span className="error-message">{errors.birthDate}</span>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="form-group checkbox-group">
            <input type="checkbox" id="acceptsTerms" name="acceptsTerms"
              checked={formData.acceptsTerms} onChange={handleChange}
              className={errors.acceptsTerms ? 'error' : ''}
            />
            <label htmlFor="acceptsTerms">
              I accept the <a href="/terms" target="_blank">Terms and Conditions</a>*
            </label>
            {errors.acceptsTerms && (
              <span className="error-message">{errors.acceptsTerms}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner">⏳</span>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="login-redirect">
          Already a member? <span onClick={() => navigate('/Auth/login')}>Log In</span>
        </div>
      </div>
      {/* Success message */}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ParticipantSignup;