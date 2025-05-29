import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = ({ user, events, activeTab, setActiveTab, searchTerm, setSearchTerm, addToCart, setCheckoutStep }) => {
  const { id } = useParams();
  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return <div>Cannot find event</div>;
  }

  const handleReserve = () => {
    addToCart(event.id);
    setActiveTab('cart');
    setCheckoutStep('cart');
  };

  return (
    <div className="dashboard">
      {/* Header et Sidebar restent identiques */}
      <header className="dashboard-header">
        <div className="logo">Get<span>UrTicket</span></div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="search events..."
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
            <span className="notification-badge">3</span>
          </button>
          <button className="icon-button">
            <i className="fas fa-heart"></i>
          </button>
          <button className="icon-button">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-badge">2</span>
          </button>
          <div className="user-profile">
            <img src={user.photo} alt={user.nickname} />
            <span>{user.name} {user.nickname}</span>
          </div>
        </div>
      </header>
      <aside className="sidebar">
        <nav>
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <i className="fas fa-home"></i>
            <span>Home</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <i className="fas fa-compass"></i>
            <span>Explore</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>My Reservations</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="fas fa-heart"></i>
            <span>Favorites</span>
          </button>
          <button 
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fas fa-user"></i>
            <span>My Profil</span>
          </button>
        </nav>
        
        <div className="help-section">
          <button className="help-button">
            <i className="fas fa-question-circle"></i>
            <span>Help & Support</span>
          </button>
        </div>
      </aside>

      {/* Contenu des détails */}
      <main className="main-content">
        <div className="event-details">
          <h1>{event.title}</h1>
          <img src={event.image} alt={event.title} />
          <p><strong>Date :</strong> {event.date}</p>
          <p><strong>Location :</strong> {event.location}</p>
          <p><strong>Description :</strong> {event.description || 'Pas de description disponible'}</p>
          <p><strong>Organizer :</strong> {event.organizer?.name || 'Non spécifié'}</p>
          <p><strong>Capacity :</strong> {event.capacity}</p>
          <p><strong>Places Available :</strong> {event.capacity - event.sold}</p>
          <p><strong>Category :</strong> {event.category}</p>
          <p><strong>State :</strong> {event.liked ? 'Liké' : 'Non liké'}</p>
          <button 
            className="book-button" 
            onClick={handleReserve}
            disabled={event.sold >= event.capacity}
          >
            {event.sold >= event.capacity ? 'Complet' : 'Réserver maintenant'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;