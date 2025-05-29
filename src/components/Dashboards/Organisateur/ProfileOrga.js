import React, { useState } from 'react';
import './ProfileOrga.css';

const ProfileOrga = () => {
  // Simulated data
  const [profile, setProfile] = useState({
    profilePhoto: null,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+33 123 456 789",
    address: "123 Example Street",
    address2: "",
    city: "Paris",
    country: "France",
    zipCode: "75001",
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "1234", expiry: "12/26" },
    { id: 2, type: "Mastercard", last4: "5678", expiry: "06/25" },
  ]);

  // States for forms and modals
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(null);
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false);
  const [closeAccountConfirmation, setCloseAccountConfirmation] = useState("");
  const [closeAccountError, setCloseAccountError] = useState("");

  // List of countries
  const countries = ["France", "United States", "Canada", "United Kingdom", "Germany"];

  // Profile update handling
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!profile.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      alert("Please enter a valid email.");
      return;
    }
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
    // TODO: Call API /api/user/update-profile
  };

  // Password change handling
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    alert("Password changed successfully!");
    // TODO: Call API /api/user/change-password
  };

  // Card handling
  const handleCardChange = (e) => {
    setCardForm({ ...cardForm, [e.target.name]: e.target.value });
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const newCard = {
      id: paymentMethods.length + 1,
      type: cardForm.number.startsWith("4") ? "Visa" : "Mastercard",
      last4: cardForm.number.slice(-4),
      expiry: cardForm.expiry,
    };
    setPaymentMethods([...paymentMethods, newCard]);
    setCardForm({ number: "", name: "", expiry: "", cvv: "" });
    setShowAddCardModal(false);
    alert("Card added successfully!");
    // TODO: Call API /api/user/add-payment-method
  };

  const handleDeleteCard = (cardId) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== cardId));
    setShowDeleteCardModal(null);
    alert("Card deleted successfully!");
    // TODO: Call API /api/user/delete-payment-method
  };

  // Account closure handling
  const handleCloseAccount = () => {
    if (closeAccountConfirmation !== "CONFIRM") {
      setCloseAccountError("Please type 'CONFIRM' to continue.");
      return;
    }
    setCloseAccountConfirmation("");
    setCloseAccountError("");
    setShowCloseAccountModal(false);
    alert("Account closed successfully!");
    // TODO: Call API /api/user/close-account
  };

  return (
    <div className="profile-orga-page">
      <h1>Profile Settings</h1>

      {/* Personal Information */}
      <div className="profile-section summary-card">
        <h2>Personal Information</h2>
        <div className="profile-photo-section">
          <div className="profile-photo">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Profile" />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </div>
          <button className="secondary-button">
            <i className="fas fa-camera"></i> Change photo
          </button>
        </div>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Address 2</label>
              <input
                type="text"
                name="address2"
                value={profile.address2}
                onChange={handleProfileChange}
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={profile.city}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <select
                name="country"
                value={profile.country}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={profile.zipCode}
                onChange={handleProfileChange}
                required
                disabled={!isEditingProfile}
              />
            </div>
          </div>
          <div className="form-actions">
            {isEditingProfile ? (
              <>
                <button type="submit" className="primary-button">
                  Save
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="primary-button"
                onClick={() => setIsEditingProfile(true)}
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="profile-section summary-card">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          {passwordError && <p className="error-text">{passwordError}</p>}
          <button type="submit" className="primary-button">
            Change Password
          </button>
        </form>
      </div>

      {/* Payment Methods */}
      <div className="profile-section summary-card">
        <h2>Payment Methods</h2>
        {paymentMethods.length === 0 ? (
          <p>No cards registered.</p>
        ) : (
          <div className="payment-methods-list">
            {paymentMethods.map(card => (
              <div key={card.id} className="payment-method">
                <span>{card.type} **** {card.last4}</span>
                <span>Expires {card.expiry}</span>
                <button
                  className="delete-button"
                  onClick={() => setShowDeleteCardModal(card.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          className="primary-button"
          onClick={() => setShowAddCardModal(true)}
        >
          Add a card
        </button>
      </div>

      {/* Close Account */}
      <div className="profile-section summary-card danger">
        <h2>Close Account</h2>
        <p>
          Closing your account is irreversible. You will lose access to
          all your events and data.
        </p>
        <button
          className="reject-button"
          onClick={() => setShowCloseAccountModal(true)}
        >
          Close my account
        </button>
      </div>

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add a card</h3>
              <button
                className="close-button"
                onClick={() => setShowAddCardModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCard}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardForm.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    name="name"
                    value={cardForm.name}
                    onChange={handleCardChange}
                    placeholder="JOHN DOE"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddCardModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Card Modal */}
      {showDeleteCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Delete Card</h3>
              <button
                className="close-button"
                onClick={() => setShowDeleteCardModal(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this card?</p>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowDeleteCardModal(null)}
              >
                Cancel
              </button>
              <button
                className="reject-button"
                onClick={() => handleDeleteCard(showDeleteCardModal)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Account Modal */}
      {showCloseAccountModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Close Account</h3>
              <button
                className="close-button"
                onClick={() => setShowCloseAccountModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>
                Closing your account is irreversible. Type "CONFIRM" to continue.
              </p>
              <div className="form-group">
                <input
                  type="text"
                  value={closeAccountConfirmation}
                  onChange={(e) => setCloseAccountConfirmation(e.target.value)}
                  placeholder="CONFIRM"
                />
              </div>
              {closeAccountError && (
                <p className="error-text">{closeAccountError}</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowCloseAccountModal(false)}
              >
                Cancel
              </button>
              <button
                className="reject-button"
                onClick={handleCloseAccount}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileOrga;