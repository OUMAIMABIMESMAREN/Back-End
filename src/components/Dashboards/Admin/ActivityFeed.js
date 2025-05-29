import React, { useState } from 'react';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    actor: 'all',
    actionType: 'all',
    customStartDate: '',
    customEndDate: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Simulated data
  const activities = [
    {
      id: 1,
      actionType: 'event_created',
      actor: { type: 'organizer', id: 201, name: 'Jazz Productions', email: 'jazz.prod@gmail.com' },
      details: { eventTitle: 'Timitar 2025', eventId: 301 },
      timestamp: '2025-05-01T09:00:00Z',
    },
    {
      id: 2,
      actionType: 'payment',
      actor: { type: 'participant', id: 101, name: 'Oualid Madih', email: 'oualid.madih@gmail.com' },
      details: { eventTitle: 'Modern Chinese Art Exibition', amount: 150, status: 'completed' },
      timestamp: '2025-05-01T10:30:00Z',
    },
    {
      id: 3,
      actionType: 'dispute_submitted',
      actor: { type: 'participant', id: 102, name: 'Amina Ait', email: 'amina.ait@gmail.com' },
      details: { disputeId: 2, reason: 'Event cancelled without refund' },
      timestamp: '2025-05-10T14:00:00Z',
    },
    {
      id: 4,
      actionType: 'dispute_resolved',
      actor: { type: 'admin', id: 1, name: 'Oumaima Bimesmaren', email: 'oumaimabimesmaren@gmail.com' },
      details: { disputeId: 3, resolution: 'Partial refund granted (500MAD)' },
      timestamp: '2025-05-07T16:00:00Z',
    },
    {
      id: 5,
      actionType: 'platform_payment',
      actor: { type: 'organizer', id: 202, name: 'Art Gallery', email: 'art.prod@gmail.com' },
      details: { amount: 300, status: 'pending' },
      timestamp: '2025-05-12T11:00:00Z',
    },
  ];

  // Utility function to filter by period
  const filterByDateRange = (itemDate, dateRange, customStartDate, customEndDate) => {
    const date = new Date(itemDate);
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return date.toDateString() === now.toDateString();
      case 'week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        return date >= startOfWeek;
      case 'month':
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      case 'custom':
        if (!customStartDate || !customEndDate) return true;
        const start = new Date(customStartDate);
        const end = new Date(customEndDate);
        return date >= start && date <= end;
      case 'all':
      default:
        return true;
    }
  };

  // Function to export to CSV
  const exportToCSV = (data, columns, filename) => {
    setIsExporting(true);
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(item =>
      columns.map(col => `"${String(col.accessor(item)).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    setTimeout(() => setIsExporting(false), 500);
  };

  // Filter activities
  const filteredActivities = activities.filter(a => {
    const actionTypeMatch = filters.actionType === 'all' || a.actionType === filters.actionType;
    const actorMatch = filters.actor === 'all' || a.actor.type === filters.actor;
    const dateMatch = filterByDateRange(a.timestamp, filters.dateRange, filters.customStartDate, filters.customEndDate);
    return actionTypeMatch && actorMatch && dateMatch;
  });

  // Calculate metrics
  const metrics = {
    todayCount: filteredActivities.filter(a => {
      const date = new Date(a.timestamp);
      const now = new Date();
      return date.toDateString() === now.toDateString();
    }).length,
    monthCount: filteredActivities.filter(a => {
      const date = new Date(a.timestamp);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    disputeCount: filteredActivities.filter(a => a.actionType.includes('dispute')).length,
    paymentCount: filteredActivities.filter(a => a.actionType.includes('payment')).length,
  };

  // Format details
  const formatDetails = (action) => {
    switch (action.actionType) {
      case 'event_created':
        return `Event "${action.details.eventTitle}" (ID: ${action.details.eventId}) created.`;
      case 'payment':
        return `Payment of ${action.details.amount}€ for "${action.details.eventTitle}" (${action.details.status}).`;
      case 'dispute_submitted':
        return `Dispute #${action.details.disputeId} submitted: "${action.details.reason}".`;
      case 'dispute_resolved':
        return `Dispute #${action.details.disputeId} resolved: "${action.details.resolution}".`;
      case 'platform_payment':
        return `Platform payment of ${action.details.amount}MAD (${action.details.status}).`;
      default:
        return 'Unknown action.';
    }
  };

  return (
    <div className="activity-feed">
        <main className="content">
          <div className="section-header">
            <h2>Activity Feed</h2>
            <div className="filters">
              <select
                value={filters.dateRange}
                onChange={e => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
                <option value="custom">Custom period</option>
              </select>
              <select
                value={filters.actor}
                onChange={e => setFilters({ ...filters, actor: e.target.value })}
              >
                <option value="all">All actors</option>
                <option value="admin">Admin</option>
                <option value="organizer">Organizer</option>
                <option value="participant">Participant</option>
              </select>
              <select
                value={filters.actionType}
                onChange={e => setFilters({ ...filters, actionType: e.target.value })}
              >
                <option value="all">All types</option>
                <option value="event_created">Event created</option>
                <option value="payment">Payment</option>
                <option value="dispute_submitted">Dispute submitted</option>
                <option value="dispute_resolved">Dispute resolved</option>
                <option value="platform_payment">Platform payment</option>
              </select>
              {filters.dateRange === 'custom' && (
                <div className="custom-date-range">
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={e => setFilters({ ...filters, customStartDate: e.target.value })}
                  />
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={e => setFilters({ ...filters, customEndDate: e.target.value })}
                  />
                </div>
              )}
              <button
                className="export-button"
                onClick={() => {
                  const columns = [
                    { header: 'ID', accessor: item => item.id },
                    { header: 'Date', accessor: item => new Date(item.timestamp).toLocaleString('en-US') },
                    { header: 'Actor', accessor: item => `${item.actor.name} (${item.actor.type})` },
                    { header: 'Action Type', accessor: item => item.actionType },
                    { header: 'Details', accessor: item => formatDetails(item) },
                  ];
                  exportToCSV(filteredActivities, columns, 'activities.csv');
                }}
                disabled={isExporting}
              >
                <i className="fas fa-download"></i> {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>

          <div className="summary">
            <div className="summary-card">
              <h3>Today's Actions</h3>
              <p className="amount">{metrics.todayCount}</p>
            </div>
            <div className="summary-card">
              <h3>This Month's Actions</h3>
              <p className="amount">{metrics.monthCount}</p>
            </div>
            <div className="summary-card">
              <h3>Disputes</h3>
              <p className="amount">{metrics.disputeCount}</p>
            </div>
            <div className="summary-card">
              <h3>Payments</h3>
              <p className="amount">{metrics.paymentCount}</p>
            </div>
          </div>

          <div className="table-container table-scrollable">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Actor</th>
                  <th>Action Type</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map(a => (
                  <tr key={a.id}>
                    <td>{new Date(a.timestamp).toLocaleString('en-US')}</td>
                    <td>
                      <div className="actor-info">
                        <span>{a.actor.name}</span>
                        <span className="email">{a.actor.email}</span>
                      </div>
                    </td>
                    <td>{a.actionType.replace('_', ' ')}</td>
                    <td>{formatDetails(a)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
   
  );
};

export default ActivityFeed;