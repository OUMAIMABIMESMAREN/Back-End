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

    if (!formData.fullName.trim()) newErrors.fullName = "Nom complet requis";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (formData.password.length < 8) newErrors.password = "8 caractères minimum";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!formData.phone.match(/^[0-9]{10}$/)) newErrors.phone = "Numéro invalide (10 chiffres)";
    if (age < 18) newErrors.birthDate = "Vous devez avoir 18 ans ou plus";
    if (!formData.acceptsTerms) newErrors.acceptsTerms = "Vous devez accepter les CGU";

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
                           //address: "Rue Exemple 123", // 🟡 Replace or make a field in form
                           //ville: "Casablanca",        // 🟡 Replace or make a field in form
                           role: "PARTICIPANT"
                         });
        setSuccessMessage(`Inscription réussie ! Vérifiez votre email: ${formData.email}`);
        navigate('/Auth/login');
      } catch (error) {
        console.error("Erreur d'inscription :", error.response?.data || error.message);
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };


  return (
    <div className="participant-signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2>Devenez Participant</h2>
          <p>Rejoignez notre communauté et découvrez des événements passionnants !</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Nom complet */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name*</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName}
              onChange={handleChange} className={errors.fullName ? 'error' : ''}
              placeholder="Jean Dupont"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input type="email" id="email" name="email" value={formData.email}
              onChange={handleChange} className={errors.email ? 'error' : ''}
              placeholder="jean@exemple.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Mot de passe */}
          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password" id="password" name="password" value={formData.password}
              onChange={handleChange} className={errors.password ? 'error' : ''}
              placeholder="8 caractères minimum"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirmation mot de passe */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password*</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} className={errors.confirmPassword ? 'error' : ''}
              placeholder="Retapez votre mot de passe"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Téléphone */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number*</label>
            <input type="tel" id="phone" name="phone" value={formData.phone}
              onChange={handleChange} className={errors.phone ? 'error' : ''}
              placeholder="0612345678"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {/* Date de naissance */}
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date*</label>
            <input type="date" id="birthDate" name="birthDate" value={formData.birthDate}
              onChange={handleChange} className={errors.birthDate ? 'error' : ''}
            />
            {errors.birthDate && (
              <span className="error-message">{errors.birthDate}</span>
            )}
          </div>

          {/* Checkbox CGU */}
          <div className="form-group checkbox-group">
            <input type="checkbox" id="acceptsTerms" name="acceptsTerms"
              checked={formData.acceptsTerms} onChange={handleChange}
              className={errors.acceptsTerms ? 'error' : ''}
            />
            <label htmlFor="acceptsTerms">
              J'accepte les <a href="/terms" target="_blank">Conditions Générales</a>*
            </label>
            {errors.acceptsTerms && (
              <span className="error-message">{errors.acceptsTerms}</span>
            )}
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="spinner">⏳</span>
            ) : (
              "Register "
            )}
          </button>
        </form>
        <div className="login-redirect">
          Already member ? <span onClick={() => navigate('/Auth/login')}>Log In</span>
        </div>
      </div>
      {/* Success message */}
            {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ParticipantSignup;