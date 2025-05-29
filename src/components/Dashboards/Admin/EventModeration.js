import React, { useState } from 'react';
import './EventModeration.css';

const EventModeration = () => {
  // States for events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Jazz Festival 2025",
      organizer: {
        id: 101,
        name: "Imane Chaabani",
        email: "imanechaabani@gmail.com"
      },
      date: "2025-03-15",
      location: "Agadir",
      category: "Music",
      image: "/images/music_event.webp",
      description: "An exceptional jazz festival featuring the best international artists.",
      tickets: [
        {
          type: "VIP",
          price: "500MAD",
          quantity: 100
        },
        {
          type: "Standard",
          price: "200MAD",
          quantity: 500
        }
        ],
              status: "pending",
              submissionDate: "2024-03-10",
              modificationReason: null
         },
        {
              id: 1,
              title: "Gnaoua Festival Essaouira 2025",
              organizer: {
                id: 101,
                name: "Ali Moustapha",
                email: "ali.moustapha@gmail.com"
              },
              date: "2025-03-15",
              location: "Essaouira",
              category: "Music",
              image: "/images/event-crowd.webp",
              description: "The traditional Rythm of Gnaoua ",
              tickets: [
                {
                  type: "VIP",
                  price: "100MAD",
                  quantity: 100
                },
                {
                  type: "Standard",
                  price: "Free",
                  quantity: 500
                }
                ],
                              status: "pending",
                              submissionDate: "2024-03-10",
                              modificationReason: null
                         },

    // ... other events
  ]);

  // States for filters and search
  const [filters, setFilters] = useState({
    status: 'pending',
    organizer: 'all',
    category: 'all',
    sortBy: 'date'
  });
  const [searchTerm, setSearchTerm] = useState('');

  // States for modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showModificationModal, setShowModificationModal] = useState(false);
  const [modifiedEvent, setModifiedEvent] = useState(null);

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filters.status === 'all' || event.status === filters.status;
      const matchesOrganizer = filters.organizer === 'all' || event.organizer.id.toString() === filters.organizer;
      const matchesCategory = filters.category === 'all' || event.category === filters.category;
      
      return matchesSearch && matchesStatus && matchesOrganizer && matchesCategory;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          return new Date(b.submissionDate) - new Date(a.submissionDate);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Handle event approval
  const handleApprove = (eventId) => {
    setEvents(events.map(event =>
      event.id === eventId
        ? { ...event, status: 'approved' }
        : event
    ));
    // Simulate sending a notification
    console.log(`Notification sent to organizer for event ${eventId}`);
  };

  // Handle event rejection
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setEvents(events.map(event =>
      event.id === selectedEvent?.id
        ? { ...event, status: 'rejected', rejectionReason }
        : event
    ));

    // Simulate sending a notification
    console.log(`Rejection notification sent to organizer for event ${selectedEvent?.id}`);
    
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedEvent(null);
  };

  // Handle event modification
  const handleModification = () => {
    if (!modifiedEvent) return;

    setEvents(events.map(event =>
      event.id === modifiedEvent.id
        ? { ...modifiedEvent, status: 'pending' }
        : event
    ));

    setShowModificationModal(false);
    setModifiedEvent(null);
  };

  return (
    <div className="event-moderation">
      <div className="section-header">
        <h2>Event Moderation</h2>
        <div className="header-actions">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search for an event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All categories</option>
              <option value="Music">Music</option>
              <option value="Art">Art</option>
              <option value="Sport">Sport</option>
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="date">Sort by date</option>
              <option value="title">Sort by title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Submitted on</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td className="event-info">
                  <img src={event.image} alt={event.title} className="event-thumbnail" />
                  <div>
                    <span 
                      className="event-title clickable"
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowDetailsModal(true);
                      }}
                    >
                      {event.title}
                    </span>
                    <span className="event-category">{event.category}</span>
                  </div>
                </td>
                <td className="organizer-info">
                  <span className="org-name">{event.organizer.name}</span>
                  <span className="organizer-email">{event.organizer.email}</span>
                </td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.location}</td>
                <td>
                  <span className={`status-badge ${event.status}`}>
                    {event.status}
                  </span>
                </td>
                <td>{new Date(event.submissionDate).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="action-button"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowDetailsModal(true);
                    }}
                    title="View details"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="action-button"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowPreviewModal(true);
                    }}
                    title="Preview"
                  >
                    <i className="fas fa-desktop"></i>
                  </button>
                  {event.status === 'pending' && (
                    <>
                      <button
                        className="action-button approve"
                        onClick={() => handleApprove(event.id)}
                        title="Approve"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowRejectModal(true);
                        }}
                        title="Reject"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  )}
                  <button
                    className="action-button"
                    onClick={() => {
                      setModifiedEvent({...event});
                      setShowModificationModal(true);
                    }}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals will be added later */}
    </div>
  );
};
export default EventModeration;