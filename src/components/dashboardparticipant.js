  return (
    <div className="dashboard-container">
      <Header onLoginClick={() => {}} />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || 'User'}</h1>
          <div className="header-actions">
            <button className="btn-primary" onClick={() => navigate('/profile')}>
              <i className="fas fa-user"></i> My Profile
            </button>
            <button className="btn-secondary" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* My Events Section */}
          <div className="dashboard-section">
            <h2>My Events</h2>
            <div className="events-grid">
              {myEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                      <i className="far fa-calendar"></i> {event.date}
                    </p>
                    <p className="event-location">
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </p>
                    <div className="event-status">
                      <span className={`status-badge ${event.status.toLowerCase()}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="dashboard-section">
            <h2>Upcoming Events</h2>
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <img src={event.image} alt={event.title} />
                  <div className="event-info">
                    <h3>{event.title}</h3>
                    <p className="event-date">
                      <i className="far fa-calendar"></i> {event.date}
                    </p>
                    <p className="event-location">
                      <i className="fas fa-map-marker-alt"></i> {event.location}
                    </p>
                    <div className="event-actions">
                      <button 
                        className="btn-primary"
                        onClick={() => handleAddToCart(event)}
                      >
                        <i className="fas fa-shopping-cart"></i> Add to Cart
                      </button>
                      <button 
                        className="btn-secondary"
                        onClick={() => navigate(`/event/${event.id}`)}
                      >
                        <i className="fas fa-info-circle"></i> Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions-grid">
              <button className="action-card" onClick={() => navigate('/events')}>
                <i className="fas fa-search"></i>
                <span>Browse Events</span>
              </button>
              <button className="action-card" onClick={() => navigate('/cart')}>
                <i className="fas fa-shopping-cart"></i>
                <span>View Cart</span>
              </button>
              <button className="action-card" onClick={() => navigate('/tickets')}>
                <i className="fas fa-ticket-alt"></i>
                <span>My Tickets</span>
              </button>
              <button className="action-card" onClick={() => navigate('/favorites')}>
                <i className="fas fa-heart"></i>
                <span>Favorites</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ); 