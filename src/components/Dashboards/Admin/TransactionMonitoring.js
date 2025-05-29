import React, { useState } from 'react';
import './TransactionMonitoring.css';

const TransactionMonitoring = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [filters, setFilters] = useState({
    dateRange: 'all',
    organizer: 'all',
    event: 'all',
    status: 'all',
    customStartDate: '',
    customEndDate: '',
  });
  const [isExporting, setIsExporting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Simulated data
  const transactions = [
    {
      id: 1,
      participant: { id: 101, name: 'Assia Tamai', email: 'assia.tamai@gmail.com' },
      organizer: { id: 201, name: 'Jazz Productions', email: 'jazz@example.com' },
      event: { id: 301, title: 'Jazz Festival 2025' },
      amount: 150,
      status: 'completed',
      date: '2025-05-01',
      details: { completedAt: '2025-05-01T10:00:00Z' },
    },
    {
      id: 2,
      participant: { id: 102, name: 'Asmae Assoulaimani', email: 'asmae.assou@gmail.com' },
      organizer: { id: 202, name: 'Ali Moustapha', email: 'alimoustapha@gmail.com' },
      event: { id: 302, title: 'Modern Chinese Art Exhibition' },
      amount: 50,
      status: 'pending',
      date: '2025-05-10',
      details: { pendingSince: '2025-05-10T12:00:00Z' },
    },
    {
      id: 3,
      participant: { id: 103, name: 'Amina Ait', email: 'amina.ait@gmail.com' },
      organizer: { id: 201, name: 'Imane Chaabani', email: 'imanechaabani@gmail.com' },
      event: { id: 301, title: 'Festival R&B' },
      amount: 100,
      status: 'failed',
      date: '2025-05-05',
      details: { reason: 'Payment declined by bank' },
    },
    {
          id: 4,
          participant: { id: 103, name: 'Oualid madih ', email: 'oualid.madih@gmail.com' },
          organizer: { id: 201, name: 'Imane Chaabani', email: 'imanechaabani@gmail.com' },
          event: { id: 301, title: 'Summer Festival' },
          amount: 100,
          status: 'completed',
          date: '2025-05-05',
          details: { completedAt: '2025-05-11T14:00:00Z' },
        },
  ];

  const refunds = [
    {
      id: 1,
      event: { id: 301, title: 'Purple Party' },
      participant: { id: 101, name: 'Amina Ait', email: 'amina.ait@gmail.com' },
      amount: 150,
      status: 'approved',
      submissionDate: '2025-05-02',
      details: { approvedAt: '2025-05-03T14:00:00Z' },
    },
    {
      id: 2,
      event: { id: 302, title: 'Modern Chinese Art Exhibition' },
      participant: { id: 102, name: 'Asmae Assoulaimani', email: 'asmae.assou@gmail.com' },
      amount: 50,
      status: 'pending',
      submissionDate: '2025-05-11',
      details: { pendingSince: '2025-05-11T09:00:00Z' },
    },
    {
      id: 3,
      event: { id: 301, title: 'Jazz Festival 2025' },
      participant: { id: 103, name: 'Assia tamai', email: 'assia.tamai@gmail.com' },
      amount: 100,
      status: 'refused',
      submissionDate: '2025-05-06',
      details: { reason: 'Unjustified request' },
    },
  ];

  const platformPayments = [
    {
      id: 1,
      organizer: { id: 201, name: 'Imane Chaabani', email: 'imanechaabani@gmail.com' },
      amount: 750,
      status: 'paid',
      date: '2025-05-05',
      details: { paidAt: '2025-05-05T16:00:00Z' },
    },
    {
      id: 2,
      organizer: { id: 202, name: 'Ali Moustapha', email: 'alimoustapha@gmail.com' },
      amount: 300,
      status: 'pending',
      date: '2025-05-12',
      details: { pendingSince: '2025-05-12T10:00:00Z' },
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

  // Component for Transactions tab
  const TransactionsTab = () => {
    const filteredTransactions = transactions.filter(t => {
      const statusMatch = filters.status === 'all' || t.status === filters.status;
      const organizerMatch = filters.organizer === 'all' || t.organizer.id.toString() === filters.organizer;
      const eventMatch = filters.event === 'all' || t.event.id.toString() === filters.event;
      const dateMatch = filterByDateRange(t.date, filters.dateRange, filters.customStartDate, filters.customEndDate);
      return statusMatch && organizerMatch && eventMatch && dateMatch;
    });

    const metrics = {
      totalAmount: filteredTransactions.reduce((sum, t) => sum + t.amount, 0),
      pendingCount: filteredTransactions.filter(t => t.status === 'pending').length,
      completedAmount: filteredTransactions
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    const handleExport = () => {
      const columns = [
        { header: 'ID', accessor: item => item.id },
        { header: 'Date', accessor: item => new Date(item.date).toLocaleDateString('en-US') },
        { header: 'Participant', accessor: item => item.participant.name },
        { header: 'Organizer', accessor: item => item.organizer.name },
        { header: 'Event', accessor: item => item.event.title },
        { header: 'Amount', accessor: item => `${item.amount}MAD` },
        { header: 'Status', accessor: item => item.status },
      ];
      exportToCSV(filteredTransactions, columns, 'transactions.csv');
    };

    return (
      <div className="transactions-section">
        <div className="section-header">
          <h2>Participant-Organizer Transactions</h2>
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
              {[...new Set(transactions.map(t => t.organizer.id))].map(id => (
                <option key={id} value={id}>
                  {transactions.find(t => t.organizer.id === id).organizer.name}
                </option>
              ))}
            </select>
            <select
              value={filters.event}
              onChange={e => setFilters({ ...filters, event: e.target.value })}
            >
              <option value="all">All events</option>
              {[...new Set(transactions.map(t => t.event.id))].map(id => (
                <option key={id} value={id}>
                  {transactions.find(t => t.event.id === id).event.title}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
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
              onClick={handleExport}
              disabled={isExporting}
            >
              <i className="fas fa-download"></i> {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="summary">
          <div className="summary-card">
            <h3>Total Transactions</h3>
            <p className="amount">1000MAD</p>
          </div>
          <div className="summary-card">
            <h3>Pending Transactions</h3>
            <p className="amount">{metrics.pendingCount}</p>
          </div>
          <div className="summary-card">
            <h3>Completed Amount</h3>
            <p className="amount">2500MAD</p>
          </div>
        </div>

        <div className="table-container table-scrollable">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Participant</th>
                <th>Organizer</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td
                    className="clickable"
                    onClick={() => {
                      setSelectedItem(t);
                      setShowDetailsModal(true);
                    }}
                  >
                    {t.id}
                  </td>
                  <td>{new Date(t.date).toLocaleDateString('en-US')}</td>
                  <td>
                    <div className="participant-info">
                      <span>{t.participant.name}</span>
                      <span className="email">{t.participant.email}</span>
                    </div>
                  </td>
                  <td>{t.organizer.name}</td>
                  <td>{t.event.title}</td>
                  <td>{t.amount.toLocaleString('en-US')}MAD</td>
                  <td>
                    <span className={`status-badge ${t.status}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Component for Refunds tab
  const RefundsTab = () => {
    const filteredRefunds = refunds.filter(r => {
      const statusMatch = filters.status === 'all' || r.status === filters.status;
      const eventMatch = filters.event === 'all' || r.event.id.toString() === filters.event;
      const dateMatch = filterByDateRange(r.submissionDate, filters.dateRange, filters.customStartDate, filters.customEndDate);
      return statusMatch && eventMatch && dateMatch;
    });

    const metrics = {
      pendingCount: filteredRefunds.filter(r => r.status === 'pending').length,
      totalPendingAmount: filteredRefunds
        .filter(r => r.status === 'pending')
        .reduce((sum, r) => sum + r.amount, 0),
      approvedAmount: filteredRefunds
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + r.amount, 0),
    };

    const handleExport = () => {
      const columns = [
        { header: 'ID', accessor: item => item.id },
        { header: 'Submission Date', accessor: item => new Date(item.submissionDate).toLocaleDateString('en-US') },
        { header: 'Participant', accessor: item => item.participant.name },
        { header: 'Event', accessor: item => item.event.title },
        { header: 'Amount', accessor: item => `${item.amount}MAD` },
        { header: 'Status', accessor: item => item.status },
      ];
      exportToCSV(filteredRefunds, columns, 'refunds.csv');
    };

    return (
      <div className="refunds-section">
        <div className="section-header">
          <h2>Refund Management</h2>
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
              value={filters.event}
              onChange={e => setFilters({ ...filters, event: e.target.value })}
            >
              <option value="all">All events</option>
              {[...new Set(refunds.map(r => r.event.id))].map(id => (
                <option key={id} value={id}>
                  {refunds.find(r => r.event.id === id).event.title}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="refused">Refused</option>
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
              onClick={handleExport}
              disabled={isExporting}
            >
              <i className="fas fa-download"></i> {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="summary">
          <div className="summary-card">
            <h3>Pending Refunds</h3>
            <p className="amount">{metrics.pendingCount}</p>
          </div>
          <div className="summary-card">
            <h3>Pending Amount</h3>
            <p className="amount">{metrics.totalPendingAmount.toLocaleString('en-US')}MAD</p>
          </div>
          <div className="summary-card">
            <h3>Approved Amount</h3>
            <p className="amount">{metrics.approvedAmount.toLocaleString('en-US')}MAD</p>
          </div>
        </div>

        <div className="table-container table-scrollable">
          <table className="refunds-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Submission Date</th>
                <th>Participant</th>
                <th>Event</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRefunds.map(r => (
                <tr key={r.id}>
                  <td
                    className="clickable"
                    onClick={() => {
                      setSelectedItem(r);
                      setShowDetailsModal(true);
                    }}
                  >
                    {r.id}
                  </td>
                  <td>{new Date(r.submissionDate).toLocaleDateString('en-US')}</td>
                  <td>
                    <div className="participant-info">
                      <span>{r.participant.name}</span>
                      <span className="email">{r.participant.email}</span>
                    </div>
                  </td>
                  <td>{r.event.title}</td>
                  <td>{r.amount.toLocaleString('en-US')}MAD</td>
                  <td>
                    <span className={`status-badge ${r.status}`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Component for Platform Payments tab
  const PlatformPaymentsTab = () => {
    const filteredPayments = platformPayments.filter(p => {
      const statusMatch = filters.status === 'all' || p.status === filters.status;
      const organizerMatch = filters.organizer === 'all' || p.organizer.id.toString() === filters.organizer;
      const dateMatch = filterByDateRange(p.date, filters.dateRange, filters.customStartDate, filters.customEndDate);
      return statusMatch && organizerMatch && dateMatch;
    });

    const metrics = {
      totalAmount: filteredPayments.reduce((sum, p) => sum + p.amount, 0),
      pendingCount: filteredPayments.filter(p => p.status === 'pending').length,
      paidAmount: filteredPayments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),
    };

    const handleExport = () => {
      const columns = [
        { header: 'ID', accessor: item => item.id },
        { header: 'Date', accessor: item => new Date(item.date).toLocaleDateString('en-US') },
        { header: 'Organizer', accessor: item => item.organizer.name },
        { header: 'Amount', accessor: item => `${item.amount}MAD` },
        { header: 'Status', accessor: item => item.status },
      ];
      exportToCSV(filteredPayments, columns, 'platform-payments.csv');
    };

    return (
      <div className="platform-payments-section">
        <div className="section-header">
          <h2>Organizer-Platform Payments</h2>
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
              {[...new Set(platformPayments.map(p => p.organizer.id))].map(id => (
                <option key={id} value={id}>
                  {platformPayments.find(p => p.organizer.id === id).organizer.name}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
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
              onClick={handleExport}
              disabled={isExporting}
            >
              <i className="fas fa-download"></i> {isExporting ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>

        <div className="summary">
          <div className="summary-card">
            <h3>Total Payments</h3>
            <p className="amount">{metrics.totalAmount.toLocaleString('en-US')}MAD</p>
          </div>
          <div className="summary-card">
            <h3>Pending Payments</h3>
            <p className="amount">{metrics.pendingCount}</p>
          </div>
          <div className="summary-card">
            <h3>Paid Amount</h3>
            <p className="amount">{metrics.paidAmount.toLocaleString('en-US')}MAD</p>
          </div>
        </div>

        <div className="table-container table-scrollable">
          <table className="platform-payments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Organizer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id}>
                  <td
                    className="clickable"
                    onClick={() => {
                      setSelectedItem(p);
                      setShowDetailsModal(true);
                    }}
                  >
                    {p.id}
                  </td>
                  <td>{new Date(p.date).toLocaleDateString('en-US')}</td>
                  <td>
                    <div className="participant-info">
                      <span>{p.organizer.name}</span>
                      <span className="email">{p.organizer.email}</span>
                    </div>
                  </td>
                  <td>{p.amount.toLocaleString('en-US')}MAD</td>
                  <td>
                    <span className={`status-badge ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Modal for details
  const DetailsModal = () => {
    if (!selectedItem) return null;

    const isTransaction = 'participant' in selectedItem;
    const isRefund = 'submissionDate' in selectedItem;
    const isPlatformPayment = !isTransaction && !isRefund;

    return (
      <div className="modal-overlay">
        <div className="modal-content details-modal">
          <div className="modal-header">
            <h3>
              <i className="fas fa-info-circle"></i> {isTransaction ? 'Transaction' : isRefund ? 'Refund' : 'Payment'} Details #{selectedItem.id}
            </h3>
            <button
              className="close-button"
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedItem(null);
              }}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {isTransaction && (
              <div className="details">
                <p><strong>Participant:</strong> {selectedItem.participant.name} ({selectedItem.participant.email})</p>
                <p><strong>Organizer:</strong> {selectedItem.organizer.name}</p>
                <p><strong>Event:</strong> {selectedItem.event.title}</p>
                <p><strong>Amount:</strong> {selectedItem.amount.toLocaleString('en-US')}MAD</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
                <p><strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString('en-US')}</p>
                {selectedItem.status === 'completed' && (
                  <p><strong>Completed on:</strong> {new Date(selectedItem.details.completedAt).toLocaleString('en-US')}</p>
                )}
                {selectedItem.status === 'pending' && (
                  <p><strong>Pending since:</strong> {new Date(selectedItem.details.pendingSince).toLocaleString('en-US')}</p>
                )}
                {selectedItem.status === 'failed' && (
                  <p><strong>Failure reason:</strong> {selectedItem.details.reason}</p>
                )}
              </div>
            )}
            {isRefund && (
              <div className="details">
                <p><strong>Participant:</strong> {selectedItem.participant.name} ({selectedItem.participant.email})</p>
                <p><strong>Event:</strong> {selectedItem.event.title}</p>
                <p><strong>Amount:</strong> {selectedItem.amount.toLocaleString('en-US')}MAD</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
                <p><strong>Submission date:</strong> {new Date(selectedItem.submissionDate).toLocaleDateString('en-US')}</p>
                {selectedItem.status === 'approved' && (
                  <p><strong>Approved on:</strong> {new Date(selectedItem.details.approvedAt).toLocaleString('en-US')}</p>
                )}
                {selectedItem.status === 'pending' && (
                  <p><strong>Pending since:</strong> {new Date(selectedItem.details.pendingSince).toLocaleString('en-US')}</p>
                )}
                {selectedItem.status === 'refused' && (
                  <p><strong>Refusal reason:</strong> {selectedItem.details.reason}</p>
                )}
              </div>
            )}
            {isPlatformPayment && (
              <div className="details">
                <p><strong>Organizer:</strong> {selectedItem.organizer.name} ({selectedItem.organizer.email})</p>
                <p><strong>Amount:</strong> {selectedItem.amount.toLocaleString('en-US')}MAD</p>
                <p><strong>Status:</strong> {selectedItem.status}</p>
                <p><strong>Date:</strong> {new Date(selectedItem.date).toLocaleDateString('en-US')}</p>
                {selectedItem.status === 'paid' && (
                  <p><strong>Paid on:</strong> {new Date(selectedItem.details.paidAt).toLocaleString('en-US')}</p>
                )}
                {selectedItem.status === 'pending' && (
                  <p><strong>Pending since:</strong> {new Date(selectedItem.details.pendingSince).toLocaleString('en-US')}</p>
                )}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              className="secondary-button"
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedItem(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="transaction-monitoring">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab-button ${activeTab === 'refunds' ? 'active' : ''}`}
          onClick={() => setActiveTab('refunds')}
        >
          Refunds
        </button>
        <button
          className={`tab-button ${activeTab === 'platform-payments' ? 'active' : ''}`}
          onClick={() => setActiveTab('platform-payments')}
        >
          Platform Payments
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'refunds' && <RefundsTab />}
        {activeTab === 'platform-payments' && <PlatformPaymentsTab />}
      </div>

      {showDetailsModal && <DetailsModal />}
    </div>
  );
};

export default TransactionMonitoring;