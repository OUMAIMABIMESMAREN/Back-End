import React, { useState } from 'react';
import './DisputeResolution.css';

const DisputeResolution = () => {
  const [filters, setFilters] = useState({
    dateRange: 'all',
    organizer: 'all',
    event: 'all',
    status: 'all',
    customStartDate: '',
    customEndDate: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [adminComments, setAdminComments] = useState('');

  // Simulated data
  const disputes = [
    {
      id: 1,
      participant: { id: 101, name: 'Assia Tamai', email: 'assia.tamai@gmail.com' },
      organizer: { id: 201, name: 'Imane Chaabani', email: 'imanechaabani@gmail.com' },
      event: { id: 301, title: 'Jazz Festival 2025' },
      reason: 'Ticket not delivered after payment',
      submissionDate: '2025-05-01',
      status: 'open',
      evidence: [
        { type: 'pdf', name: 'payment_proof.pdf', url: '/uploads/payment_proof.pdf' },
        { type: 'image', name: 'screenshot.jpg', url: '/uploads/screenshot.jpg' },
      ],
      resolution: null,
    },
    {
      id: 2,
      participant: { id: 102, name: 'Oualid Madih', email: 'oualid.madih@gmail.com' },
      organizer: { id: 202, name: 'Art Gallery Production', email: 'art.prod@gmail.com' },
      event: { id: 302, title: 'Modern Art Exhibition' },
      reason: 'Event cancelled without refund',
      submissionDate: '2025-05-10',
      status: 'in_progress',
      evidence: [],
      resolution: null,
    },
    {
      id: 3,
      participant: { id: 103, name: 'Asmae Assoulaimani', email: 'asmae.assou@gmail.com' },
      organizer: { id: 201, name: 'Jazz Productions', email: 'jazz.prod@gmail.com' },
      event: { id: 301, title: 'Timitar 2025' },
      reason: 'Poor event quality',
      submissionDate: '2025-05-05',
      status: 'resolved',
      evidence: [{ type: 'image', name: 'event_photo.jpg', url: '/Uploads/event_photo.jpg' }],
      resolution: {
        decision: 'Partial refund granted (50€)',
        date: '2025-05-07',
      },
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

  // Filter disputes
  const filteredDisputes = disputes.filter(d => {
    const statusMatch = filters.status === 'all' || d.status === filters.status;
    const organizerMatch = filters.organizer === 'all' || d.organizer.id.toString() === filters.organizer;
    const eventMatch = filters.event === 'all' || d.event.id.toString() === filters.event;
    const dateMatch = filterByDateRange(d.submissionDate, filters.dateRange, filters.customStartDate, filters.customEndDate);
    return statusMatch && organizerMatch && eventMatch && dateMatch;
  });

  // Calculate metrics
  const metrics = {
    openCount: filteredDisputes.filter(d => d.status === 'open').length,
    inProgressCount: filteredDisputes.filter(d => d.status === 'in_progress').length,
    resolvedCount: filteredDisputes.filter(d => d.status === 'resolved').length,
    monthlyResolved: filteredDisputes
      .filter(d => {
        const date = new Date(d.submissionDate);
        const now = new Date();
        return d.status === 'resolved' && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .length,
  };

  // Handle resolution
  const handleResolveDispute = (disputeId, resolution) => {
    const updatedDisputes = disputes.map(d =>
      d.id === disputeId ? { ...d, status: 'resolved', resolution: { decision: resolution, date: new Date().toISOString().split('T')[0] } } : d
    );
    // Simulate email sending
    alert(`Notification sent to ${selectedDispute.participant.email} and ${selectedDispute.organizer.email}: Dispute #${disputeId} resolved with decision "${resolution}".`);
    setSelectedDispute({ ...selectedDispute, status: 'resolved', resolution: { decision: resolution, date: new Date().toISOString().split('T')[0] } });
    // Note: In a real system, update state via setDisputes(updatedDisputes) and send email via API.
    setAdminComments('');
  };

  // Main component
  return (
    <div className="dispute-resolution">
      <div className="section-header">
        <h2>Dispute Resolution</h2>
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
            value={filters.organizer}
            onChange={e => setFilters({ ...filters, organizer: e.target.value })}
          >
            <option value="all">All organizers</option>
            {[...new Set(disputes.map(d => d.organizer.id))].map(id => (
              <option key={id} value={id}>
                {disputes.find(d => d.organizer.id === id).organizer.name}
              </option>
            ))}
          </select>
          <select
            value={filters.event}
            onChange={e => setFilters({ ...filters, event: e.target.value })}
          >
            <option value="all">All events</option>
            {[...new Set(disputes.map(d => d.event.id))].map(id => (
              <option key={id} value={id}>
                {disputes.find(d => d.event.id === id).event.title}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
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
                { header: 'Submission Date', accessor: item => new Date(item.submissionDate).toLocaleDateString('en-US') },
                { header: 'Participant', accessor: item => item.participant.name },
                { header: 'Organizer', accessor: item => item.organizer.name },
                { header: 'Event', accessor: item => item.event.title },
                { header: 'Reason', accessor: item => item.reason },
                { header: 'Status', accessor: item => item.status },
              ];
              exportToCSV(filteredDisputes, columns, 'disputes.csv');
            }}
            disabled={isExporting}
          >
            <i className="fas fa-download"></i> {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </div>

      <div className="summary">
        <div className="summary-card">
          <h3>Open Disputes</h3>
          <p className="amount">{metrics.openCount}</p>
        </div>
        <div className="summary-card">
          <h3>In Progress Disputes</h3>
          <p className="amount">{metrics.inProgressCount}</p>
        </div>
        <div className="summary-card">
          <h3>Resolved Disputes</h3>
          <p className="amount">{metrics.resolvedCount}</p>
        </div>
        <div className="summary-card">
          <h3>Resolved This Month</h3>
          <p className="amount">{metrics.monthlyResolved}</p>
        </div>
      </div>

      <div className="table-container table-scrollable">
        <table className="disputes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Submission Date</th>
              <th>Participant</th>
              <th>Organizer</th>
              <th>Event</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map(d => (
              <tr key={d.id}>
                <td
                  className="clickable"
                  onClick={() => {
                    setSelectedDispute(d);
                    setShowDetailsModal(true);
                    setAdminComments('');
                  }}
                >
                  {d.id}
                </td>
                <td>{new Date(d.submissionDate).toLocaleDateString('en-US')}</td>
                <td>
                  <div className="participant-info">
                    <span>{d.participant.name}</span>
                    <span className="email">{d.participant.email}</span>
                  </div>
                </td>
                <td>{d.organizer.name}</td>
                <td>{d.event.title}</td>
                <td>
                  <span className="reason-text" title={d.reason}>
                    {d.reason.length > 30 ? d.reason.substring(0, 30) + '...' : d.reason}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${d.status}`}>
                    {d.status.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for dispute details */}
      {showDetailsModal && selectedDispute && (
        <div className="modal-overlay">
          <div className="modal-content dispute-modal">
            <div className="modal-header">
              <h3><i className="fas fa-gavel"></i> Dispute #{selectedDispute.id}</h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDispute(null);
                  setAdminComments('');
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="dispute-details">
                <p><strong>Participant:</strong> {selectedDispute.participant.name} ({selectedDispute.participant.email})</p>
                <p><strong>Organizer:</strong> {selectedDispute.organizer.name} ({selectedDispute.organizer.email})</p>
                <p><strong>Event:</strong> {selectedDispute.event.title}</p>
                <p><strong>Reason:</strong> {selectedDispute.reason}</p>
                <p><strong>Submission Date:</strong> {new Date(selectedDispute.submissionDate).toLocaleDateString('en-US')}</p>
                <p><strong>Status:</strong> {selectedDispute.status.replace('_', ' ')}</p>
                {selectedDispute.evidence.length > 0 && (
                  <div className="evidence-section">
                    <strong>Evidence:</strong>
                    <ul>
                      {selectedDispute.evidence.map((e, index) => (
                        <li key={index}>
                          <a href={e.url} target="_blank" rel="noopener noreferrer">
                            {e.name} ({e.type})
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedDispute.resolution && (
                  <div className="resolution-section">
                    <strong>Resolution:</strong>
                    <p>{selectedDispute.resolution.decision}</p>
                    <p><strong>Date:</strong> {new Date(selectedDispute.resolution.date).toLocaleDateString('en-US')}</p>
                  </div>
                )}
              </div>
              {selectedDispute.status !== 'resolved' && (
                <div className="resolution-actions">
                  <label>Admin Comments / Decision</label>
                  <textarea
                    value={adminComments}
                    onChange={e => setAdminComments(e.target.value)}
                    placeholder="Enter your comments or resolution decision..."
                    rows="4"
                  />
                  <button
                    className="resolve-button"
                    onClick={() => {
                      if (!adminComments.trim()) {
                        alert('Please enter a decision.');
                        return;
                      }
                      handleResolveDispute(selectedDispute.id, adminComments);
                    }}
                    disabled={!adminComments.trim()}
                  >
                    <i className="fas fa-check"></i> Resolve and Notify
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedDispute(null);
                  setAdminComments('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeResolution;