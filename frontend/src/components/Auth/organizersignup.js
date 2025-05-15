import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './organizersignup.css'; // Will use a similar style to ParticipantSignup with adjustments

const OrganizerSignup = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      idNumber: '',
      portfolioLink: '',
      idDocument: null,
      acceptsContract: false,
      contractId: null, // Add contractId to keep track of the contract
    });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Invalid email";
    if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.phone.match(/^[0-9]{10}$/)) newErrors.phone = "Invalid number (10 digits)";
    if (!formData.idNumber.match(/^[0-9A-Za-z]{8,20}$/)) newErrors.idNumber = "Invalid ID number";
    if (!formData.idDocument) newErrors.idDocument = "Document required";
    if (!formData.acceptsContract) newErrors.acceptsContract = "You must sign the contract";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    setIsSubmitting(true);

    // Extract firstName and lastName from fullName
    const nameParts = formData.fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';


    try {
      // Send organizer registration request
      const response = await axios.post('http://localhost:8080/api/auth/organizer-register', {
        f_name: firstName,
        l_name: lastName,
        email: formData.email,
        password: formData.password,
        phone_num: formData.phone,
        idNumber: formData.idNumber,
        portfolioLink: formData.portfolioLink,
        acceptsContract: formData.acceptsContract,
        role: "ORGANIZER"
      });

      const organizerId = response.data.id; // Adjust based on your backend's actual response shape

      // Handle contract signing
      if (formData.acceptsContract && formData.contractId) {
        await axios.patch(`http://localhost:8080/api/organizer/${organizerId}/sign-contract/${formData.contractId}`, {
          signed: true,
          signedAt: new Date(),
        });
      }

      setSuccessMessage("Registration successful! Please check your email.");
      navigate('/Auth/login');
    } catch (error) {
      console.error('Error during registration', error);
      alert("Error during registration, please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  }
};


  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const ContractModal = () => (
    <div className="contract-modal-overlay">
      <div className="contract-modal">
        <h3>Organizer Contract</h3>
        <div className="contract-content">
          <p><strong>As an organizer on GetUrTicket, you agree to:</strong></p>
          <ol>
            <li>Provide accurate information about your events.</li>
            <li>Comply with local laws and participant rights.</li>
            <li>Honor paid reservations (full refund in case of cancellation).</li>
            <li>Not use the platform for fraudulent purposes.</li>
          </ol>
          <p>Failure to comply may result in suspension of your account without notice.</p>
        </div>
        <button
          onClick={() => {
            setFormData({...formData, acceptsContract: true});
            setShowContractModal(false);
          }}
          className="sign-contract-btn"
        >
          I sign electronically
        </button>
        <button
          onClick={() => setShowContractModal(false)}
          className="close-modal-btn"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="organizer-signup-container">
      {showContractModal && <ContractModal />}

      <div className="signup-card">
        <div className="signup-header">
          <h2>Become an Organizer</h2>
          <p>Publish your events and manage your participants with ease</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Information Section */}
          <div className="form-section">
            <h4>Personal Information</h4>

            <div className="form-group">
              <label htmlFor="fullName">Full Name*</label>
              <input
                type="text" id="fullName" name="fullName" value={formData.fullName}
                onChange={handleChange} className={errors.fullName ? 'error' : ''}
                placeholder="John Smith"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input type="email" id="email" name="email" value={formData.email}
                onChange={handleChange} className={errors.email ? 'error' : ''}
                placeholder="contact@yourevent.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input type="tel" id="phone" name="phone" value={formData.phone}
                onChange={handleChange} className={errors.phone ? 'error' : ''}
                placeholder="0612345678"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h4>Account Security</h4>

            <div className="form-group">
              <label htmlFor="password">Password*</label>
              <input type="password" id="password" name="password" value={formData.password}
                onChange={handleChange} className={errors.password ? 'error' : ''}
                placeholder="At least 8 characters"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password*</label>
              <input
                type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} className={errors.confirmPassword ? 'error' : ''}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          {/* Identity Verification Section */}
          <div className="form-section">
            <h4>Identity Verification</h4>

            <div className="form-group">
              <label htmlFor="idNumber">ID Number*</label>
              <input type="text" id="idNumber" name="idNumber" value={formData.idNumber}
                onChange={handleChange} className={errors.idNumber ? 'error' : ''}
                placeholder="AB12345678"
              />
              {errors.idNumber && (
                <span className="error-message">{errors.idNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label>Identity Document*</label>
              <div
                className={`file-upload-area ${errors.idDocument ? 'error' : ''}`}
                onClick={triggerFileInput}
              >
                {formData.idDocument ? (
                  <span>📄 {formData.idDocument.name}</span>
                ) : (
                  <span>📁 Drag and Drop or Click to Upload</span>
                )}
                <input type="file" ref={fileInputRef} onChange={handleChange}
                  name="idDocument" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                />
              </div>
              {errors.idDocument && (
                <span className="error-message">{errors.idDocument}</span>
              )}
              <p className="file-hint">Accepted formats: PDF, JPG, PNG (max 5MB)</p>
            </div>

            <div className="form-group">
              <label htmlFor="portfolioLink">Portfolio/Link*</label>
              <input type="url" id="portfolioLink" name="portfolioLink"
                value={formData.portfolioLink}
                onChange={handleChange}
                placeholder="https://yoursite.com or link to social media"
              />
              <p className="field-hint">Help us verify your organizer activities</p>
            </div>
          </div>

          {/* Contract Agreement */}
          <div className="form-section">
            <div className="form-group checkbox-group">
              <input type="checkbox" id="acceptsContract" name="acceptsContract"
                checked={formData.acceptsContract}
                onChange={(e) => {
                  if (e.target.checked) setShowContractModal(true);
                  else handleChange(e);
                }}
                className={errors.acceptsContract ? 'error' : ''}
              />
              <label htmlFor="acceptsContract">
                I read and sign the <span className="contract-link">Organizer Contract</span>*
              </label>
              {errors.acceptsContract && (
                <span className="error-message">{errors.acceptsContract}</span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner">⏳</span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <div className="login-redirect">
          Already an organizer? <span onClick={() => navigate('/Auth/login')}>Log In</span>
        </div>
      </div>
      {/* Success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default OrganizerSignup;
