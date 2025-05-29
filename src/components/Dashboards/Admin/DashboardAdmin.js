// src/components/Dashboards/Admin/DashboardAdmin.js

import React, { useState } from 'react';
import './DashboardAdmin.css';
import UserManagement from './UserManagement';
import OrganizerApproval from './OrganizerApproval';
import EventModeration from './EventModeration';
import TransactionMonitoring from './TransactionMonitoring';
import DisputeResolution from './DisputeResolution';
import ActivityFeed from './ActivityFeed';
import DashboardOverview from './DashboardOverview';


const DashboardAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_organizer',
      message: 'New organizer registration request',
      date: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'event_approval',
      message: 'New event pending approval',
      date: new Date(),
      read: false
    }
  ]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">Get<span>UrTicket</span></div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className="header-icons">
          <button className="icon-button">
            <i className="fas fa-bell"></i>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <div className="admin-profile">
            <img src="/images/Admin.webp" alt="Oumaima" />
            <span>Oumaima Bimesmaren</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <nav>
          <button 
            className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i>
            <span>User Management</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'organizers' ? 'active' : ''}`}
            onClick={() => setActiveTab('organizers')}
          >
            <i className="fas fa-user-tie"></i>
            <span>Organizer Approval</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Event Moderation</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <i className="fas fa-exchange-alt"></i>
            <span>Transactions</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'disputes' ? 'active' : ''}`}
            onClick={() => setActiveTab('disputes')}
          >
            <i className="fas fa-gavel"></i>
            <span>Disputes</span>
          </button>
          
          <button 
            className={`nav-button ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="fas fa-history"></i>
            <span>Activities</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && <DashboardOverview notifications={notifications} />}
         {activeTab === 'users' && <UserManagement />}
         {activeTab === 'organizers' && <OrganizerApproval />}
         {activeTab === 'events' && <EventModeration />}
         {activeTab === 'transactions' && <TransactionMonitoring />}
         {activeTab === 'disputes' && <DisputeResolution />}
         {activeTab === 'activity' && <ActivityFeed />}

      </main>
    </div>
  );
};

export default DashboardAdmin;
