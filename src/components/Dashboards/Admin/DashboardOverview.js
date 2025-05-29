import React, { useState } from 'react';
import './DashboardOverview.css';

const DashboardOverview = ({ notifications }) => {
  const [filters, setFilters] = useState({ 
    dateRange: 'all', 
    customStartDate: '', 
    customEndDate: '' 
  });

  // Enhanced simulated data
  const metrics = {
    totalRevenue: 15000,
    pendingDisputes: notifications.filter(n => n.type === 'dispute').length + 2,
    pendingEvents: notifications.filter(n => n.type === 'event_approval').length + 1,
    activeUsers: 120,
  };

  const priorityTasks = [
    {
      id: 2,
      type: 'dispute',
      details: { disputeId: 2, reason: 'Event cancelled without refund', event: 'Jazz Festival 2025' },
      status: 'open',
      submissionDate: '2025-05-10',
      priority: 'high'
    },
    {
      id: 1,
      type: 'organizer_approval',
      details: { organizer: 'Ali Moustapha', email: 'ali.moustapha@gmail.com' },
      status: 'pending',
      submissionDate: '2025-05-12',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'event_approval',
      details: { event: 'Summer Festival', organizer: 'Imane Chaabani' },
      status: 'pending',
      submissionDate: '2025-05-05',
      priority: 'low'
    },
    {
      id: 4,
      type: 'transaction',
      details: { participant: 'Amina Ait', event: 'Festival R&B', amount: 100 },
      status: 'failed',
      submissionDate: '2025-05-05',
      priority: 'high'
    },
  ];

  const recentActivities = [
    {
      id: 4,
      actionType: 'dispute_resolved',
      actor: { type: 'admin', name: 'Oumaima Bimesmaren' },
      details: { disputeId: 3, resolution: 'Partial refund granted (500MAD)' },
      timestamp: '2025-05-07T16:00:00Z',
    },
    {
      id: 3,
      actionType: 'dispute_submitted',
      actor: { type: 'participant', name: 'Assia Tamai' },
      details: { disputeId: 2, reason: 'Event cancelled without refund' },
      timestamp: '2025-05-10T14:00:00Z',
    },
    {
      id: 2,
      actionType: 'event_created',
      actor: { type: 'organizer', name: 'Festival R&B' },
      details: { eventTitle: 'Festival of Soul R&B' },
      timestamp: '2025-05-01T10:30:00Z',
    },
  ];

  // Fonction utilitaire améliorée pour filtrer par période
  const filterByDateRange = (itemDate, dateRange, customStartDate, customEndDate) => {
    const date = new Date(itemDate);
    const now = new Date();
    
    switch (dateRange) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return date >= startOfWeek;
      case 'month':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'custom':
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        end.setHours(23, 59, 59, 999); // Inclure toute la journée
        return date >= start && date <= end;
      default:
        return true;
    }
  };

  // Filtrer et trier les tâches
  const filteredTasks = priorityTasks
    .filter(t => filterByDateRange(t.submissionDate, filters.dateRange, filters.customStartDate, filters.customEndDate))
    .sort((a, b) => {
      // Trier par priorité puis par date
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(b.submissionDate) - new Date(a.submissionDate);
    });

  // Format details with icons
  const formatTaskDetails = (task) => {
    switch (task.type) {
      case 'dispute':
        return <><i className="icon-warning"></i> Dispute #{task.details.disputeId}: {task.details.reason} ({task.details.event})</>;
      case 'organizer_approval':
        return <><i className="icon-user-check"></i> Approval: {task.details.organizer} ({task.details.email})</>;
      case 'event_approval':
        return <><i className="icon-calendar"></i> Event: {task.details.event} by {task.details.organizer}</>;
      case 'transaction':
        return <><i className="icon-credit-card"></i> Failed transaction from {task.details.participant} for {task.details.event} ({task.details.amount}MAD)</>;
      default:
        return 'Unknown task';
    }
  };

  // Format activities with icons
  const formatActivityDetails = (action) => {
    switch (action.actionType) {
      case 'dispute_resolved':
        return <><i className="icon-check-circle"></i> Dispute #{action.details.disputeId} resolved: "{action.details.resolution}"</>;
      case 'dispute_submitted':
        return <><i className="icon-alert-circle"></i> Dispute #{action.details.disputeId} submitted: "{action.details.reason}"</>;
      case 'event_created':
        return <><i className="icon-plus-circle"></i> Event "{action.details.eventTitle}" created</>;
      default:
        return 'Unknown action';
    }
  };

  // Obtenir la classe de priorité
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  return (
    <div className="dashboard-admin">
      {/* Header with title and filters */}
      <div className="dashboard-header">
         <h2>Overview</h2>
         <div className="dashboard-filters">
          <div className="filter-group">
            <label>Period:</label>
            <select
              value={filters.dateRange}
              onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
              className="filter-select"
            >
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="custom">Custom period</option>
            </select>
          </div>
          
          {filters.dateRange === 'custom' && (
            <div className="filter-group date-range-group">
              <input
                type="date"
                value={filters.customStartDate}
                onChange={e => setFilters({ ...filters, customStartDate: e.target.value })}
                className="date-input"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.customEndDate}
                onChange={e => setFilters({ ...filters, customEndDate: e.target.value })}
                className="date-input"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">{metrics.totalRevenue.toLocaleString('en-US')}MAD</p>
            <p className="metric-trend positive">+12% this month</p>
          </div>
          <i className="icon-trending-up"></i>
        </div>
        
        <div className="metric-card disputes">
          <div className="metric-content">
            <h3>Pending Disputes</h3>
            <p className="metric-value">{metrics.pendingDisputes}</p>
            <p className="metric-trend negative">+3 this week</p>
          </div>
          <i className="icon-alert-octagon"></i>
        </div>
        
        <div className="metric-card events">
          <div className="metric-content">
            <h3>Pending Events</h3>
            <p className="metric-value">{metrics.pendingEvents}</p>
            <p className="metric-trend">Stable</p>
          </div>
          <i className="icon-calendar"></i>
        </div>
        
        <div className="metric-card users">
          <div className="metric-content">
            <h3>Active Users</h3>
            <p className="metric-value">{metrics.activeUsers}</p>
            <p className="metric-trend positive">+8% this month</p>
          </div>
          <i className="icon-users"></i>
        </div>
      </div>

      {/* Priority tasks */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Priority Tasks</h3>
          <span className="badge">{filteredTasks.length}</span>
        </div>
        
        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Details</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(task => (
                <tr key={`${task.type}-${task.id}`} className={getPriorityClass(task.priority)}>
                  <td>#{task.id}</td>
                  <td>
                    <span className="task-type">{task.type.replace('_', ' ')}</span>
                  </td>
                  <td className="task-details">{formatTaskDetails(task)}</td>
                  <td>
                    <span className={`status-badge ${task.status}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <a
                      href={
                        task.type === 'dispute'
                          ? '/admin/disputes'
                          : task.type === 'organizer_approval'
                          ? '/admin/organizers'
                          : task.type === 'event_approval'
                          ? '/admin/events'
                          : '/admin/transactions'
                      }
                      className="action-button"
                    >
                      <i className="icon-arrow-right"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Recent Activity</h3>
          <a href="/admin/activity" className="view-all">
            View all <i className="icon-chevron-right"></i>
          </a>
        </div>
        
        <div className="activity-feed">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.actionType === 'dispute_resolved' && <i className="fas fa-check-circle"></i>}
                {activity.actionType === 'dispute_submitted' && <i className="fas fa-exclamation-circle"></i>}
                {activity.actionType === 'event_created' && <i className="fas fa-plus-circle"></i>}
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-actor">{activity.actor.name} ({activity.actor.type})</span>
                  <span className="activity-time">
                    {new Date(activity.timestamp).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="activity-details">{formatActivityDetails(activity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;