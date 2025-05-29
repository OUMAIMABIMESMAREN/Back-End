import React from "react";
import { useNavigate } from 'react-router-dom';
import "./signuptype.css";

const SignUpType = () => {
  const navigate = useNavigate();

  // Données dynamiques pour les cartes
  const accountTypes = [
    {
      title: "Participant",
      description: "I want to book events",
      features: [
        "Access to all events",
        "Manage my bookings",
        "Secure payment",
        "Participation history"
      ],
      color: "#FFC107", // Yellow
      route: '/Auth/participantsignup'
    },
    {
      title: "Organizer",
      description: "I want to create events",
      features: [
        "Publish events",
        "Manage participants",
        "Secure payments",
        "Detailed statistics"
      ],
      color: "#E91E63", // Pink
      route: '/Auth/organizersignup'
    }
  ];

  return (
    <div className="signup-type-container">
      <div className="signup-type-content">
        <h2 className="signup-title">Join our community</h2>
        <p className="signup-subtitle">Choose your profile to start the adventure</p>
        
        <div className="account-cards-grid">
          {accountTypes.map((account, index) => (
            <div 
              key={index}
              className="account-card"
              onClick={() => navigate(account.route)}
              style={{ '--card-color': account.color }}
            >
              <div className="card-header">
                <h3>{account.title}</h3>
                <p>{account.description}</p>
              </div>
              <ul className="card-features">
                {account.features.map((feature, i) => (
                  <li key={i}>
                    <span className="feature-icon">✓</span> 
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                className="card-button"
                style={{ backgroundColor: account.color }}
              >
                Choose this profile
              </button>
            </div>
          ))}
        </div>

        <div className="already-member">
          Already a member? <span onClick={() => navigate('/Auth/login')}>Log in</span>
        </div>
      </div>
    </div>
  );
};

export default SignUpType;