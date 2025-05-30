import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './explorepage.css'; // Fichier CSS associé

// Données simulées (à remplacer par votre API)
const mockEvents = [
  {
    id: 1,
    title: "Concert Jazz",
    date: "15 Juin 2023",
    location: "Paris",
    price: "25€",
    category: "musique",
    image: "https://source.unsplash.com/random/300x200/?jazz",
    capacity: 100,
    sold: 45
  },
  {
    id: 2,
    title: "Exposition Art Moderne",
    date: "22 Juin 2023",
    location: "Lyon",
    price: "Gratuit",
    category: "art",
    image: "https://source.unsplash.com/random/300x200/?art",
    capacity: 50,
    sold: 12
  }
];

const ExplorePage = () => {
  const navigate = useNavigate();
  const [events] = useState(mockEvents);
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    price: 'all',
    searchQuery: ''
  });

  // Fonction de filtrage
  const filteredEvents = events.filter(event => {
    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    const matchesLocation = filters.location === 'all' || event.location === filters.location;
    const matchesPrice = filters.price === 'all' || 
                         (filters.price === 'free' ? event.price === 'Free' : event.price !== 'Free');
    const matchesSearch = event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                         event.location.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesCategory && matchesLocation && matchesPrice && matchesSearch;
  });

  // Gestion des clics
  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="explore-page">
      {/* Header - Reutilisez le même que dans DashboardParticipant */}
      
      <div className="explore-content">
        <h1>Explore Events</h1>
        
        {/* Barre de recherche et filtres */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
            className="search-input"
          />
          
          <div className="filter-dropdowns">
            <select 
              value={filters.category} 
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">All categories</option>
              <option value="musique">Music</option>
              <option value="art">Art</option>
              <option value="sport">Sport</option>
              <option value="travel">Travel</option>
            </select>

            <select 
              value={filters.location} 
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              <option value="all">All locations</option>
              <option value="Dakhla">Dakhla</option>
              <option value="Casa">Casablanca</option>
              <option value="Agadir">Agadir</option>
            </select>

            <select 
              value={filters.price} 
              onChange={(e) => setFilters({...filters, price: e.target.value})}
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Liste des événements filtrés */}
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="event-card"
                onClick={() => handleEventClick(event.id)}
              >
                <div className="event-image">
                  <img src={event.image} alt={event.title} />
                  <span className="event-price">{event.price}</span>
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p className="event-location">
                    <i className="fas fa-map-marker-alt"></i> {event.location}
                  </p>
                  <p className="event-date">
                    <i className="fas fa-calendar-alt"></i> {event.date}
                  </p>
                  <p className="event-capacity">
                    Available Places: {event.capacity - event.sold}/{event.capacity}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <p>No events found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;