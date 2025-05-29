import React, { useState } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  // States for user management
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Assia Tamai",
      email: "assia.tamai@gmail.com",
      type: "participant",
      status: "active",
      registrationDate: "2025-01-15",
      lastConnection: "2025-05-30",
      avatar: "https://i.pravatar.cc/150?img=5",
      history: [
        {
          date: "2025-03-15T14:30:00",
          description: "Booked the event 'Jazz Concert'",
          icon: "calendar-check"
        },
        {
          date: "2025-02-28T10:15:00",
          description: "Left a review for 'Purple Party'",
          icon: "star"
        }
      ],
      transactions: [
        {
          id: "TX001",
          date: "2025-03-15",
          amount: 100.00,
          type: "Booking",
          event: "Jazz Concert",
          status: "Refunded"
        },
        {
          id: "TX002",
          date: "2025-02-10",
          amount: 250.00,
          type: "Booking",
          event: "Purple Party",
          status: "Completed"
        }
      ]
    },
    {
      id: 2,
      name: "Imane Chaabani",
      email: "imanechaabani@gmail.com",
      type: "organizer",
      status: "active",
      registrationDate: "2025-01-10",
      lastConnection: "2025-03-21",
      avatar: "/images/organizer.webp"
    },
    {
          id: 3,
          name: "Ali Moustapha",
          email: "alimoustapha@gmail.com",
          type: "organizer",
          status: "active",
          registrationDate: "2025-01-10",
          lastConnection: "2025-05-23",
          avatar: "/images/participant3.webp"
        },
    {
          id: 4,
          name: "Amina Ait",
          email: "amina.ait@gmail.com",
          type: "participant",
          status: "active",
          registrationDate: "2025-02-10",
          lastConnection: "2025-05-30",
          avatar: "/images/partcipant1.webp",
          history: [
            {
              date: "2025-03-15T14:30:00",
              description: "Booked the event 'Festival R&B'",
              icon: "calendar-check"
            },
            {
              date: "2025-02-28T10:15:00",
              description: "Left a review for 'Mawazine 2025'",
              icon: "star"
            }
          ],
          transactions: [
            {
              id: "TX001",
              date: "2025-03-15",
              amount: 100.00,
              type: "Booking",
              event: "Festival R&B",
              status: "refunded"
            },
            {
              id: "TX002",
              date: "2025-02-10",
              amount: 250.00,
              type: "Booking",
              event: "Mawazine 2025",
              status: "Completed"
            }
          ]
        },
       {
              id: 5,
              name: "Oualid Madih",
              email: "oualid.madih@gmail.com",
              type: "participant",
              status: "active",
              registrationDate: "2025-03-10",
              lastConnection: "2025-05-30",
              avatar: "/images/participant4.webp",
              history: [
                {
                  date: "2025-03-15T14:30:00",
                  description: "Booked the event 'Summer Festival'",
                  icon: "calendar-check"
                },
                {
                  date: "2025-02-28T10:15:00",
                  description: "Left a review for 'Festival Gnaoua Essaouira 2025'",
                  icon: "star"
                }
              ],
              transactions: [
                {
                  id: "TX001",
                  date: "2025-03-15",
                  amount: 100.00,
                  type: "Booking",
                  event: "Summer Festival",
                  status: "completed"
                },
                {
                  id: "TX002",
                  date: "2025-02-10",
                  amount: 250.00,
                  type: "Booking",
                  event: "Purple Party",
                  status: "Completed"
                }
              ]
            },
    // ... other users
  ]);

  // States for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    sortBy: 'name'
  });

  // State for details modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  const [userHistory, setUserHistory] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type === 'all' || user.type === filters.type;
    const matchesStatus = filters.status === 'all' || user.status === filters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return new Date(b.registrationDate) - new Date(a.registrationDate);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Handle account suspension/activation
  const handleStatusChange = () => {
    if (adminPassword === '12345678' && confirmDelete) { // Same validation as for deletion
      setUsers(users.map(user =>
        user.id === selectedUser.id ? { 
          ...user, 
          status: user.status === 'active' ? 'suspended' : 'active' 
        } : user
      ));
      setShowSuspendModal(false);
      setSelectedUser(null);
      setAdminPassword('');
      setConfirmDelete(false);
    } else {
      alert('Please verify the password and confirmation');
    }
  };

  // Handle account deletion
  const handleDeleteUser = () => {
    if (adminPassword === '12345678' && confirmDelete) { // Replace with real validation
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
      setAdminPassword('');
      setConfirmDelete(false);
    } else {
      alert('Please verify the password and confirmation');
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <div className="search-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search for a user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filters">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="all">All types</option>
                <option value="participant">Participants</option>
                <option value="organizer">Organizers</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deleted">Deleted</option>
              </select>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="name">Sort by name</option>
                <option value="date">Sort by date</option>
                <option value="status">Sort by status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>Last Connection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="user-info">
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                  <span 
                    className="user-name clickable"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                  >
                    {user.name}
                  </span>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`type-badge ${user.type}`}>
                    {user.type === 'participant' ? 'Participant' : 'Organizer'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.registrationDate).toLocaleDateString()}</td>
                <td>{new Date(user.lastConnection).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="action-button"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserModal(true);
                    }}
                    title="View details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="action-button"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowSuspendModal(true);
                    }}
                    title={user.status === 'active' ? 'Suspend' : 'Activate'}
                  >
                    <i className={`fas fa-${user.status === 'active' ? 'ban' : 'check'}`}></i>
                  </button>
                  <button
                    className="action-button delete"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User details modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content user-details-modal">
            <div className="modal-header">
              <h3>User Details</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-profile-header">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="user-avatar-large" />
                <div className="user-info-main">
                  <h4>{selectedUser.name}</h4>
                  <p>{selectedUser.email}</p>
                  <div className="user-badges">
                    <span className={`type-badge ${selectedUser.type}`}>
                      {selectedUser.type === 'participant' ? 'Participant' : 'Organizer'}
                    </span>
                    <span className={`status-badge ${selectedUser.status}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="user-details-tabs">
                <button className={`tab-button ${activeTab === 'informations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('informations')}>Information</button>
                <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}>History</button>
                <button className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('transactions')}>Transactions</button>
              </div>

              <div className="user-details-content">
                {activeTab === 'informations' && (
                  <div className="details-section">
                    <h4>Personal Information</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Registration Date</label>
                        <p>{new Date(selectedUser.registrationDate).toLocaleDateString()}</p>
                      </div>
                      <div className="info-item">
                        <label>Last Connection</label>
                        <p>{new Date(selectedUser.lastConnection).toLocaleDateString()}</p>
                      </div>
                      {/* Other information */}
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="details-section">
                    <h4>Activity History</h4>
                    <div className="activities-list">
                      {selectedUser.history?.length > 0 ? (
                        selectedUser.history.map((activity, index) => (
                          <div key={index} className="activity-item">
                            <div className="activity-icon">
                              <i className={`fas fa-${activity.icon || 'check'}`}></i>
                            </div>
                            <div className="activity-details">
                              <p>{activity.description}</p>
                              <small>{new Date(activity.date).toLocaleString()}</small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No recent activity</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div className="details-section">
                    <h4>Transactions</h4>
                    <div className="transactions-table-container">
                      <table className="transactions-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Event</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedUser.transactions?.length > 0 ? (
                            selectedUser.transactions.map(transaction => (
                              <tr key={transaction.id}>
                                <td>{transaction.id}</td>
                                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                <td>{transaction.amount} MAD</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.event || 'N/A'}</td>
                                <td>
                                  <span className={`status-badge ${transaction.status}`}>
                                    {transaction.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6">No transactions found</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => {
                  setShowUserModal(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </button>
              <div className="action-buttons">
                <button
                  className={`status-button ${selectedUser.status === 'active' ? 'suspend' : 'activate'}`}
                  onClick={() => setShowSuspendModal(true)}
                >
                  {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  className="delete-button"
                  onClick={() => {
                    setShowUserModal(false);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete modal */}
      {showDeleteModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                  setAdminPassword('');
                  setConfirmDelete(false);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Are you sure you want to delete the account of <strong>{selectedUser.name}</strong>?</p>
                <p>This action is irreversible.</p>
              </div>
              <div className="form-group">
                <label>Admin password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                  />
                  I confirm that I want to delete this account
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                  setAdminPassword('');
                  setConfirmDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className="delete-button"
                onClick={handleDeleteUser}
                disabled={!adminPassword || !confirmDelete}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend modal */}
      {showSuspendModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content suspend-modal">
            <div className="modal-header">
              <h3>Confirm {selectedUser.status === 'active' ? 'suspension' : 'activation'}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSelectedUser(null);
                  setAdminPassword('');
                  setConfirmDelete(false);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Are you sure you want to {selectedUser.status === 'active' ? 'suspend' : 'activate'} the account of <strong>{selectedUser.name}</strong>?</p>
                {selectedUser.status === 'active' && (
                  <p>The user will not be able to log in until reactivation.</p>
                )}
              </div>
              <div className="form-group">
                <label>Admin password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.checked)}
                  />
                  I confirm that I want to {selectedUser.status === 'active' ? 'suspend' : 'activate'} this account
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => {
                  setShowSuspendModal(false);
                  setSelectedUser(null);
                  setAdminPassword('');
                  setConfirmDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`status-button ${selectedUser.status === 'active' ? 'suspend' : 'activate'}`}
                onClick={handleStatusChange}
                disabled={!adminPassword || !confirmDelete}
              >
                Confirm {selectedUser.status === 'active' ? 'suspension' : 'activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;