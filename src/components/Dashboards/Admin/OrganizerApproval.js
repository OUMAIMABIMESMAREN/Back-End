// src/components/Dashboards/Admin/OrganizerApproval/OrganizerApproval.js

import React, { useState } from 'react';
import './OrganizerApproval.css';

const OrganizerApproval = () => {
  // State for organizer applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "Jazz Productions",
      email: "contact@jazzproductions.com",
      phone: "+212 1 23 45 67 89",
      company: "Jazz Productions SARL",
      address: "15 Rue de la Musique, Rabat",
      submissionDate: "2024-03-15",
      status: "pending",
      documents: {
        identity: "/path/to/identity.pdf",
        portfolio: "/path/to/portfolio.pdf",
        contract: "/path/to/contract.pdf"
      },
      pastEvents: [
        {
          title: "Jazz Festival 2023",
          date: "2023-07-15",
          location: "Rabat",
          attendees: 5000
        }
      ]
    },
     {
      id: 2,
      name: "Oumi Productions",
      email: "contact@oumiproductions.com",
      phone: "+212 6 61 45 67 89",
      company: "Oumi Productions SARL",
      address: "15 Rue Iligh, Agadir",
      submissionDate: "2025-04-25",
      status: "pending",
      documents: {
        identity: "/path/to/identity.pdf",
        portfolio: "/path/to/portfolio.pdf",
        contract: "/path/to/contract.pdf"
      },
      pastEvents: [
        {
          title: "Summer Festival 2024",
          date: "2024-07-15",
          location: "Taghazout",
          attendees: 5000
        }
      ]
    },
     {
      id: 2,
      name: "Ally Productions",
      email: "contact@allyproductions.com",
      phone: "+212 6 62 85 07 23",
      company: "Ally Productions SARL",
      address: "15 Rue Iligh, Casablanca",
      submissionDate: "2025-03-20",
      status: "pending",
      documents: {
        identity: "/path/to/identity.pdf",
        portfolio: "/path/to/portfolio.pdf",
        contract: "/path/to/contract.pdf"
      },
      pastEvents: [
        {
          title: "Music Festival 2023",
          date: "2023-10-25",
          location: "Casablanca",
          attendees: 5000
        }
      ]
    },
    // ... other applications
  ]);

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'pending',
    sortBy: 'date'
  });

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => filters.status === 'all' || app.status === filters.status)
    .sort((a, b) => {
      if (filters.sortBy === 'date') {
        return new Date(b.submissionDate) - new Date(a.submissionDate);
      }
      return a.name.localeCompare(b.name);
    });

  // Handle approval
  const handleApprove = (applicationId) => {
    setApplications(applications.map(app =>
      app.id === applicationId
        ? { ...app, status: 'approved' }
        : app
    ));
    // Simulate sending an email
    console.log(`Email sent to organizer ${applicationId} for approval confirmation`);
  };

  // Handle rejection
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setApplications(applications.map(app =>
      app.id === selectedApplication?.id
        ? { ...app, status: 'rejected', rejectionReason }
        : app
    ));

    // Simulate sending an email
    console.log(`Email sent to organizer ${selectedApplication?.id} for rejection notification`);
    
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedApplication(null);
  };

  return (
    <div className="organizer-approval">
      <div className="section-header">
        <h2>Organizer Approval</h2>
        <div className="header-actions">
          <div className="filters">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="date">Sort by date</option>
              <option value="name">Sort by name</option>
            </select>
          </div>
        </div>
      </div>

      <div className="applications-grid">
        {filteredApplications.map(application => (
          <div key={application.id} className="application-card">
            <div className="application-header">
              <div className="applicant-info">
                <h3>{application.name}</h3>
                <span className={`status-badge ${application.status}`}>
                  {application.status}
                </span>
              </div>
              <p className="submission-date">
                Submitted on {new Date(application.submissionDate).toLocaleDateString()}
              </p>
            </div>

            <div className="application-content">
              <div className="info-row">
                <i className="fas fa-envelope"></i>
                <span>{application.email}</span>
              </div>
              <div className="info-row">
                <i className="fas fa-phone"></i>
                <span>{application.phone}</span>
              </div>
              <div className="info-row">
                <i className="fas fa-building"></i>
                <span>{application.company}</span>
              </div>
            </div>

            <div className="documents-section">
              <h4>Provided Documents</h4>
              <div className="document-list">
                {Object.entries(application.documents).map(([docType, docUrl]) => (
                        <div key={docType} className="document-item">
                          <i className={`fas fa-${
                            docType === 'identity' ? 'id-card' : 
                            docType === 'portfolio' ? 'folder' : 'file-contract'
                          }`}></i>
                          <span>
                            {docType === 'identity' ? 'ID Document' : 
                             docType === 'portfolio' ? 'Portfolio' : 'Signed Contract'}
                          </span>
                          <button 
                            className="view-button"
                            onClick={() => {
                              setSelectedDocument({
                                name: docType === 'identity' ? 'National ID' : 
                                      docType === 'portfolio' ? 'Portfolio' : 'Contract',
                                url: docUrl,
                                type: 'pdf'
                              });
                              setShowDocumentModal(true);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                     </div>
                  ))}
              </div>
            </div>

            <div className="application-actions">
              <button
                className="details-button"
                onClick={() => {
                  setSelectedApplication(application);
                  setShowDetailsModal(true);
                }}
              >
                View Details
              </button>
              {application.status === 'pending' && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(application.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowRejectionModal(true);
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content details-modal">
            <div className="modal-header">
              <h3>Application Details</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedApplication(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="details-section">
                <h4>Company Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Company Name</label>
                    <p>{selectedApplication.company}</p>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <p>{selectedApplication.address}</p>
                  </div>
                  {/* Other information */}
                </div>
              </div>

              <div className="details-section">
                <h4>Past Events</h4>
                <div className="past-events-list">
                  {selectedApplication.pastEvents.map((event, index) => (
                    <div key={index} className="past-event-item">
                      <h5>{event.title}</h5>
                      <p>{event.date} - {event.location}</p>
                      <p>{event.attendees} attendees</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedApplication(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedApplication && (
        <div className="modal-overlay">
          <div className="modal-content rejection-modal">
            <div className="modal-header">
              <h3>Reject Application</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedApplication(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide a reason for rejecting {selectedApplication.name}'s application</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button 
                className="secondary-button"
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedApplication(null);
                }}
              >
                Cancel
              </button>
              <button
                className="reject-button"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Display Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="modal-overlay document-modal-overlay">
          <div className="modal-content document-modal">
            <div className="modal-header">
              <h3>{selectedDocument.name}</h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowDocumentModal(false);
                  setSelectedDocument(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {selectedDocument.type === 'pdf' ? (
                <iframe 
                  src={selectedDocument.url} 
                  title={selectedDocument.name}
                  className="document-iframe"
                ></iframe>
              ) : (
                <img 
                  src={selectedDocument.url} 
                  alt={selectedDocument.name}
                  className="document-image"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerApproval;
