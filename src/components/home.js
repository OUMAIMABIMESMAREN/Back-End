import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Header from "./header";
import Footer from "./footer";
import LoginPage from "./loginpage";
import "../App.css";
import "./home.css";
import { eventService } from '../services/eventService';

const EventWebsite = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: 1000,
    dateFilter: 'all',
    location: '',
    freeOnly: false
  });
  const upcomingRef = useRef(null);
  const navigate = useNavigate();

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await eventService.getUpcomingEventsForHomePage();
        setEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        setError('Failed to fetch events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFilterButton(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (upcomingRef.current) {
      observer.observe(upcomingRef.current);
    }

    return () => {
      if (upcomingRef.current) {
        observer.unobserve(upcomingRef.current);
      }
    };
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleCategory = (category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const applyFilters = () => {
    const results = events.filter(event => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false;
      }
      
      // Price filter
      if (event.price > filters.priceRange) return false;
      
      // Free only filter
      if (filters.freeOnly && event.price !== 0) return false;
      
      // Location filter
      if (filters.location && !event.lieu.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      return true;
    });
    
    setFilteredEvents(results);
    setIsFilterOpen(false);
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      priceRange: 1000,
      dateFilter: 'all',
      location: '',
      freeOnly: false
    });
    setFilteredEvents(events);
  };

  const carouselImages = [
    { src: "/images/promo1.webp", alt: "Promo 1" },
    { src: "/images/promo2.webp", alt: "Promo 2" },
    { src: "/images/promo3.webp", alt: "Promo 3" },
    { src: "/images/promo4.webp", alt: "Promo 4" },
    { src: "/images/promo5.webp", alt: "Promo 5" },
  ];

  // Get unique categories from fetched events
  const uniqueCategories = [...new Set(events.map(event => event.category))];

  // Loading component
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading events...</p>
    </div>
  );

  // Error component
  const ErrorMessage = () => (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );

  const EventCard = ({ event }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [isFavorite, setIsFavorite] = useState(event.liked || false);

    // Helper for price
    const displayPrice = event.price === 0 ? 'Free' : `${event.price} MAD`;
    // Helper for capacity
    const available = event.capacity - (event.sold || 0);
    const capacityText = `${available}/${event.capacity}`;

    // Click handler for card (not buttons/heart)
    const handleCardClick = (e) => {
      if (
        e.target.closest('.event-btn') ||
        e.target.closest('.favorite-heart')
      ) return;
      setShowPopup(true);
    };

    return (
      <div className="event-card" style={{maxWidth:'500px',height:'520px',cursor:'pointer',display:'flex',flexDirection:'column',justifyContent:'space-between'}} onClick={handleCardClick}>
        <div className="event-image-wrapper" style={{position:'relative',height:'300px'}}>
          <img 
            src={event.videoImageUrl}
            alt={event.title} 
            className="event-image"
            style={{height:'100%',width:'100%',objectFit:'cover'}}
          />
          <button
            className={`favorite-heart${isFavorite ? ' liked' : ''}`}
            style={{position:'absolute',top:'12px',right:'12px',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',padding:'8px',zIndex:2,cursor:'pointer'}}
            onClick={e => {e.stopPropagation();setIsFavorite(f=>!f);}}
            aria-label="Favorite"
          >
            <i className={`fas fa-heart${isFavorite ? '' : '-o'}`} style={{color:isFavorite?'#E91E63':'#bbb',fontSize:'1.2rem'}}></i>
          </button>
        </div>
        <div className="event-info" style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'20px'}}>
          <h3 className="event-title" style={{fontSize:'1.25rem',fontWeight:600,marginBottom:'12px',color:'#C2185B'}}>{event.title}</h3>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
            <i className="fas fa-calendar" style={{color:'#E91E63'}}></i>
            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
            <i className="fas fa-map-marker-alt" style={{color:'#E91E63'}}></i>
            <span>{event.lieu}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
            <i className="fas fa-ticket-alt" style={{color:'#C2185B'}}></i>
            <span style={{color:event.price===0?'#2ecc71':'#C2185B',fontWeight:600}}>{displayPrice}</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
            <i className="fas fa-users" style={{color:'#E91E63'}}></i>
            <span>{capacityText}</span>
          </div>
          <div style={{marginTop:'auto',display:'flex',gap:'12px'}}>
            <button
              className="event-btn book-btn"
              style={{flex:1,background:'#C2185B',color:'#fff',border:'none',borderRadius:'6px',padding:'12px',fontWeight:600,cursor:'pointer'}}
              onClick={e => {
                        e.stopPropagation();
                        navigate('/Auth/login');
                      }}
            >
              <i className="fas fa-ticket-alt"></i> Book Now
            </button>
            <button
              className="event-btn details-btn"
              style={{flex:1,background:'#F8BBD0',color:'#C2185B',border:'none',borderRadius:'6px',padding:'12px',fontWeight:600,cursor:'pointer'}}
              onClick={e => {e.stopPropagation();setShowPopup(true);}}
            >
              <i className="fas fa-info-circle"></i> Details
            </button>
          </div>
        </div>
        {showPopup && (
          <div className="event-popup">
            <div className="popup-content">
              <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
              <div className="popup-body">
                <div className="popup-carousel">
                  <img 
                    src={event.videoImageUrl}
                    alt={event.title} 
                    className="popup-main-image"
                  />
                </div>
                <div className="popup-details">
                  <h2>{event.title}</h2>
                  <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p><strong>Location:</strong> {event.lieu}</p>
                  <p><strong>Price:</strong> {displayPrice}</p>
                  <p><strong>Capacity:</strong> {capacityText}</p>
                  <p><strong>Description:</strong> {event.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="event-website">
      <Header onLoginClick={() => setShowLogin(true)} />

      {/* Carousel Section */}
      <div className="carousel-section">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
        >
          {carouselImages.map((img, index) => (
            <SwiperSlide key={index}>
              <img src={img.src} alt={img.alt} className="carousel-image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="section-title">Browse by Categories</h2>
        <div className="categories-grid">
          {[
            { name: "Music", icon: "🎵", img: "music_event.webp" },
            { name: "Cultural Arts", icon: "🎭", img: "cultural_art.webp" },
            { name: "Sports", icon: "⚽", img: "sport&fitness.webp" },
            { name: "Food", icon: "🍔", img: "food&drinks.webp" },
            { name: "Technology", icon: "💻", img: "technology.jpeg" },
          ].map((cat, index) => (
            <div key={index} className="category-card">
              <img src={`/images/${cat.img}`} alt={cat.name} className="category-image" />
              <h3 className="category-name">{cat.icon} {cat.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div ref={upcomingRef} className="upcoming-events-section">
        <h2 className="section-title">Upcoming Events</h2>

        {/* Filter Button */}
        {showFilterButton && (
          <button
            className="filter-button"
            onClick={() => setIsFilterOpen(true)}
            style={{
              position: "fixed",
              top: "80px",
              left: "20px",
              zIndex: 1000,
            }}
          >
            🛠️ Filters
          </button>
        )}

        {/* Filter Sidebar */}
        {isFilterOpen && (
          <div className="filter-overlay">
            <div className="filter-container">
              <div className="filter-header">
                <h2>Filter Events</h2>
                <button onClick={() => setIsFilterOpen(false)} className="close-btn">×</button>
              </div>

              <div className="filter-groups">
                {/* Category Filter */}
                <div className="filter-group">
                  <h3>Categories</h3>
                  <div className="category-tags">
                    {uniqueCategories.map(category => (
                      <button 
                        key={category}
                        className={`tag ${filters.categories.includes(category) ? 'active' : ''}`}
                        onClick={() => toggleCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="filter-group">
                  <h3>Maximum Price (MAD)</h3>
                  <div className="price-range">
                    <input 
                      type="range" 
                      min="0" 
                      max="1000" 
                      value={filters.priceRange}
                      onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    />
                    <div className="price-values">
                      <span>0</span>
                      <span>{filters.priceRange}</span>
                      <span>1000+</span>
                    </div>
                  </div>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={filters.freeOnly}
                      onChange={(e) => setFilters({...filters, freeOnly: e.target.checked})}
                    />
                    Free events only
                  </label>
                </div>

                {/* Location Filter */}
                <div className="filter-group">
                  <h3>Location</h3>
                  <input
                    type="text"
                    placeholder="City, venue..."
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="filter-actions">
                <button onClick={resetFilters} className="reset-btn">
                  Reset
                </button>
                <button onClick={applyFilters} className="apply-btn">
                  Apply ({filteredEvents.length} results)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage />
        ) : (
          <>
            <div className="events-grid">
              {filteredEvents.slice((page - 1) * 10, page * 10).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>‹</button>
              <span>{page}</span>
              <button onClick={() => setPage(page + 1)} disabled={page * 10 >= filteredEvents.length}>›</button>
            </div>
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
      <Footer/>
    </div>
  );
};

export default EventWebsite;
