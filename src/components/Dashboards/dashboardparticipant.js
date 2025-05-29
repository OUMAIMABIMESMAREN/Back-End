import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { participantService } from '../../services/participantService';
import { authService } from '../../services/authService';
import { eventService } from '../../services/eventService';
import { reservationService } from '../../services/reservationService';
import { organizerService } from '../../services/organizerService';
import { filterService } from '../../services/filterService';
import './dashboardparticipant.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { conversationService } from '../../services/conversationService';
import { messageService } from '../../services/messageService';
import { qrCodeService } from '../../services/qrCodeService';
import QRCodeModal from '../QRCodeModal';

const DashboardParticipant = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState('');         // or a default like 'event' or 'organizer'
  const [searchQuery, setSearchQuery] = useState('');
  const [organizerResults, setOrganizerResults] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [displayedBookings, setDisplayedBookings] = useState([]);
  const [activeBookingTab, setActiveBookingTab] = useState('upcoming');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationService.getMyReservations(activeBookingTab);
        setDisplayedBookings(data);
      } catch (error) {
        console.error('Failed to load reservations', error);
      }
    };

    fetchReservations();
  }, [activeBookingTab]);

  // Core states
  const [user, setUser] = useState({
    name: '',
    nickname:'',
    email: '',
    photo: 'https://i.pravatar.cc/150?img=5', // Default photo until we get user's photo
    phone: '',
    address: '',
    city: '',
    country: '',
    newsletterFrequency: 'weekly',
    upcomingEvents: 4
  });

  // Error and loading states
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth error handler
  const handleAuthError = (error) => {
    if (error.message.includes('Session expired') || error.message.includes('Authentication required')) {
      authService.logout();
      navigate('/Auth/login');
    }
    throw error;
  };
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [organizerDashboard, setOrganizerDashboard] = useState(null);

  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
      });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const [tempUser, setTempUser] = useState({ ...user }); // Temporary user data for editing
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [conversationError, setConversationError] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Jazz Productions', text: 'Hello, your reservation is confirmed!' },
    { id: 2, sender: 'Modern Gallery', text: 'Welcome to our exhibition.' }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [invoices, setInvoices] = useState([
    { id: 1, date: '2025-05-01', amount: '25€', event: 'Jazz Festival' },
    { id: 2, date: '2025-04-15', amount: 'Free', event: 'Modern Art Exhibition' }
  ]);

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'information', 'payment', 'confirmation'

    // This useEffect hook will reset isCheckoutOpen when leaving the cart
    useEffect(() => {
      if (activeTab !== 'cart') {
        setCheckoutStep('cart');
      }
    }, [activeTab]);
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    price: 'all'
  });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    bookingId: null,
    reason: "",
    refundEligible: false
  });

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New event available near you!", read: false },
    { id: 2, message: "Your reservation for the Jazz Festival has been confirmed.", read: false }
  ]);

  const isRefundEligible = (frenchDate) => {
    const eventDate = parseFrenchDate(frenchDate);
    if (isNaN(eventDate.getTime())) return false; // Si la date est invalide

    const now = new Date();
    const diffHours = (eventDate - now) / (1000 * 60 * 60);
    return diffHours > 24; // Remboursable si >24h avant
  };

  // Fonction pour liker/unliker un événement
  const toggleLike = (eventId) => {
    setEvents(events.map(event =>
      event.id === eventId ? {...event, liked: !event.liked} : event
    ));
  };
  // Fonction pour convertir "15 Mars 2025" en objet Date
  const parseFrenchDate = (frenchDate) => {
    if (typeof frenchDate !== 'string') return null;

    const parts = frenchDate.split(' ');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0]);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2]);

    const months = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };

    const month = months[monthName];
    if (month === undefined || isNaN(day) || isNaN(year)) return null;

    return new Date(year, month, day);
  };

  // Filtrer les événements selon la recherche et les filtres
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.lieu.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || event.category === filters.category;
    const matchesLocation = filters.location === 'all' || event.lieu === filters.location;
    const matchesPrice = filters.price === 'all' ||
                        (filters.price === 'free' ? event.price === 'Gratuit' : event.price !== 'Gratuit');

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  // Gestion du changement de filtre
  const handleFilterChange = async (filterType, value) => {
    try {
      setIsLoading(true);
      const newFilters = {
        ...filters,
        [filterType]: value
      };
      setFilters(newFilters);

      // Create filterDTO for backend
      const filterDTO = {
        category: newFilters.category !== 'all' ? newFilters.category : null,
        location: newFilters.location !== 'all' ? newFilters.location : null,
        price: newFilters.price !== 'all' ? newFilters.price : null,
        searchTerm: searchTerm || null,
        page: 0,
        size: 10
      };

      // Call backend filter service
      const filteredResults = await filterService.filterEvents(filterDTO);
      setEvents(filteredResults.content || filteredResults);
    } catch (err) {
      console.error('Error applying filters:', err);
      setError('Failed to apply filters');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the search handling
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    try {
        if (searchType === 'events') {
            const filterDTO = {
                category: filters.category !== 'all' ? filters.category : null,
                location: filters.location !== 'all' ? filters.location : null,
                price: filters.price !== 'all' ? filters.price : null,
                searchTerm: searchQuery || null,
                page: 0,
                size: 10
            };
            const results = await filterService.searchEvents(searchQuery, filterDTO);
            setEvents(results.content || results);
        } else {
            const results = await organizerService.searchOrganizers(
                searchQuery,
                searchQuery,
                searchQuery
            );
            setOrganizerResults(results);
        }
    } catch (error) {
        console.error('Search error:', error);
        setError('Failed to perform search. Please try again.');
    } finally {
        setIsSearching(false);
    }
};

  const increaseQuantity = (eventId) => {
    setCart(cart.map(item =>
      item.eventId === eventId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (eventId) => {
    setCart(cart.map(item =>
      item.eventId === eventId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };
  const InformationComponent = ({ cart, onConfirm, setCheckoutStep }) => {
    const [participantsData, setParticipantsData] = useState(() => {
      const initialData = [];
      cart.forEach(item => {
          for (let i = 0; i < item.quantity; i++) {
            initialData.push({ eventId: item.eventId, name: '', email: '' });
             }
            });
            return initialData;
          });

    const handleParticipantChange = (index, field, value) => {
      const newParticipantsData = [...participantsData];
      newParticipantsData[index][field] = value;
      setParticipantsData(newParticipantsData);
    };

    const calculateTotal = () => {
      return cart.reduce((total, item) => {
        const price = item.price === 'Gratuit' ? 0 : parseFloat(item.price);
        return total + price * item.quantity;
      }, 0);
    };

    const total = calculateTotal();

    return (
      <div className="checkout-page">
      <div className="checkout-header">
        <h2>Participant Information</h2>
        <div className="checkout-steps">
          <div className="step completed">Cart</div>
          <div className="step active">Information</div>
          <div className="step">Payment</div>
          <div className="step">Confirmation</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="participants-section">
          {participantsData.map((participant, index) => {
            const event = cart.find(item => item.eventId === participant.eventId);
            return (
              <div key={index} className="participant-form">
                <h3>Participant #{index + 1} - {event?.title}</h3>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={participant.email}
                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Summary</h3>
            {cart.map(item => (
              <div key={item.eventId} className="summary-item">
                <span>{item.title} x{item.quantity}</span>
                <span>{item.price === 'Gratuit' ? 'Gratuit' : `${parseFloat(item.price) * item.quantity}€`}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total</span>
              <span>{calculateTotal()}€</span>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-footer">
        <button
          className="back-button"
          onClick={() => setCheckoutStep('cart')}
        >
          Back to Cart
        </button>
        <button
          className="next-button"
          onClick={() => {
            if (participantsData.every(p => p.name && p.email)) {
              setCheckoutStep('payment');
            } else {
              alert('Please fill in all information');
            }
          }}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

  const handlePaymentConfirmation = async () => {
    try {
      // Create reservations for each item in cart
      const newReservations = await Promise.all(
        cart.map(async (item) => {
          const reservation = await reservationService.createReservation(item.eventId);
          return {
            id: reservation.id,
            eventId: item.eventId,
            event: events.find(e => e.id === item.eventId),
            bookingDate: new Date().toISOString().split('T')[0],
            status: 'CONFIRMED',
            bookingstatus: 'CONFIRMED',
            feedback: null,
            quantity: item.quantity
          };
        })
      );

      // Update bookings state
      setBookings(prevBookings => [...prevBookings, ...newReservations]);

      // Clear cart
      clearCart();

      // Show success message
      alert('Reservations created successfully!');

      // Redirect to bookings tab
      setActiveTab('bookings');
      setActiveBookingTab('upcoming');
    } catch (error) {
      console.error('Error creating reservations:', error);
      alert('Error creating reservations. Please try again.');
    }
  };

  const PaymentComponent = ({ setCheckoutStep }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardInfo, setCardInfo] = useState({
      number: '',
      name: '',
      expiry: '',
      cvv: ''
    });

    const handlePaymentSubmit = async () => {
      try {
        await handlePaymentConfirmation();
        setCheckoutStep('confirmation');
      } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      }
    };

    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <h2>Payment Information</h2>
          <div className="checkout-steps">
            <div className="step completed">Cart</div>
            <div className="step completed">Information</div>
            <div className="step active">Payment</div>
            <div className="step">Confirmation</div>
          </div>
        </div>
        <div className="checkout-content">
          <div className="payment-section">
            <div className="payment-methods">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <button
                  className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <i className="fas fa-credit-card"></i>
                  Credit Card
                </button>
                <button
                  className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <i className="fab fa-paypal"></i>
                  PayPal
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-payment-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Name on Card</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="JOHN DOE"
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                    />
                  </div>
                  <div className="form-group half">
                    <label>CVV</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="123"
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-section">
                <p>You will be redirected to PayPal to complete your payment.</p>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Payment Security</h3>
              <div className="security-info">
                <div className="security-item">
                  <i className="fas fa-lock"></i>
                  <span>Secure SSL Payment</span>
                </div>
                <div className="security-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Data Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-footer">
          <button
            className="back-button"
            onClick={() => setCheckoutStep('information')}
          >
            Back
          </button>
          <button
            className="next-button"
            onClick={handlePaymentSubmit}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    );
  };

const ConfirmationComponent = () => {
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h2>Order Confirmation</h2>
        <div className="checkout-steps">
          <div className="step completed">Cart</div>
          <div className="step completed">Information</div>
          <div className="step completed">Payment</div>
          <div className="step completed">Confirmation</div>
        </div>
      </div>

      <div className="confirmation-content">
        <div className="confirmation-message">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>Thank you for your order!</h3>
          <p>Your reservation has been confirmed and you will receive a confirmation email.</p>
        </div>

        <div className="order-details">
          <h4>Order Details</h4>
          <div className="order-info">
            <p><strong>Order Number:</strong> #123456</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="next-steps">
          <h4>Next Steps</h4>
          <ul>
            <li>Check your email for confirmation</li>
            <li>Download your e-tickets</li>
            <li>Add the event to your calendar</li>
          </ul>
        </div>
      </div>

      <div className="checkout-footer">
        <button
          className="home-button"
          onClick={() => window.location.href = '/'}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

  const handleConfirmOrder = async () => {
    // 1. Process payment via Stripe or PayPal (call your backend)
    // 2. Create order in your database (call your backend)

    // Simulate success
    alert('Paiement réussi et commande créée!');

    // 3. Update bookings and invoices states
    // (Assuming you have backend endpoints to fetch these)
    // const newBooking = await fetch('/api/bookings').then(res => res.json());
    // setBookings(newBooking);

    // const newInvoice = await fetch('/api/invoices').then(res => res.json());
    // setInvoices(newInvoice);

    // 4. Clear the cart
    clearCart();

    // 5. Advance to confirmation step
    setCheckoutStep('confirmation');
  };

  // Composant EventCard
   const EventCard = ({ event, onLike, showCapacity = false }) => {
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
      setSelectedEvent(event);
      setActiveTab('eventDetails');
    };
    return (
      <div className="event-card" style={{maxWidth:'500px',height:'520px',cursor:'pointer',display:'flex',flexDirection:'column',justifyContent:'space-between'}} onClick={handleCardClick}>
        <div className="event-image-wrapper" style={{position:'relative',height:'300px'}}>
          <img src={event.videoImageUrl} alt={event.title} className="event-image" style={{height:'100%',width:'100%',objectFit:'cover'}} />
          <button
            className={`favorite-heart${isFavorite ? ' liked' : ''}`}
            style={{position:'absolute',top:'12px',right:'12px',background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',padding:'8px',zIndex:2,cursor:'pointer'}}
            onClick={e => {e.stopPropagation();setIsFavorite(f=>!f);onLike && onLike(event.id);}}
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
              className="event-btn addcart-btn"
              style={{flex:1,background:'#C2185B',color:'#fff',border:'none',borderRadius:'6px',padding:'12px',fontWeight:600,cursor:'pointer'}}
              onClick={e => {e.stopPropagation();addToCart(event.id);}}
              disabled={event.sold >= event.capacity}
            >
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button
              className="event-btn details-btn"
              style={{flex:1,background:'#F8BBD0',color:'#C2185B',border:'none',borderRadius:'6px',padding:'12px',fontWeight:600,cursor:'pointer'}}
              onClick={e => {e.stopPropagation();setSelectedEvent(event);setActiveTab('eventDetails');}}
            >
              <i className="fas fa-info-circle"></i> Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Gestion des réservations
  const handleBookEvent = async (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event || event.participants.length >= event.capacity) {
        alert('Sorry, completed !');
        return;
      }

      const reservation = await reservationService.createReservation(eventId);

      setBookings(prev => [...prev, {
        id: reservation.id,
        eventId,
        bookingDate: new Date().toISOString().split('T')[0],
        status: 'upcoming',
        feedback: null
      }]);

      setEvents(events.map(e =>
        e.id === eventId ? { ...e, participants: [...e.participants, reservation.id] } : e
      ));

      // Schedule notification
      const eventDate = parseFrenchDate(event.eventDate);
      const notificationTime = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);

      if (notificationTime > new Date()) {
        const timeoutId = setTimeout(() => {
          setNotifications(prev => [
            ...prev,
            {
              id: Date.now(),
              message: `Your booked event "${event.title}" starts in 24h!`,
              read: false
            }
          ]);
        }, notificationTime.getTime() - new Date().getTime());

        // Store timeout ID for potential cleanup
        reservation.timeoutId = timeoutId;
      }
    } catch (err) {
      handleAuthError(err);
      setError('Failed to book event. Please try again later.');
    }
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;

      const event = events.find(e => e.id === booking.eventId);
      if (!event) return;

      await reservationService.cancelReservation(bookingId, reason);

      setBookings(bookings.map(b =>
        b.id === bookingId ? {
          ...b,
          status: "cancelled",
          cancellationReason: reason,
          cancelledAt: new Date().toLocaleString(),
          refundProcessed: event.price !== "Free" && cancelModal.refundEligible
        } : b
      ));

      // Clear scheduled notification
      if (booking.timeoutId) {
        clearTimeout(booking.timeoutId);
      }

      // Free up a spot
      setEvents(events.map(e =>
        e.id === booking.eventId ? { ...e, participants: e.participants.filter(id => id !== booking.id) } : e
      ));
    } catch (err) {
      handleAuthError(err);
      setError('Failed to cancel booking. Please try again later.');
    }
  };

     // Function to handle feedback submission
   const handleFeedbackSubmit = async (bookingId, feedbackText) => {
    try {
      await reservationService.updateReservation(bookingId, { feedback: feedbackText });
      setBookings(bookings.map(b =>
        b.id === bookingId ? { ...b, feedback: feedbackText } : b
      ));
    } catch (err) {
      handleAuthError(err);
      setError('Failed to submit feedback. Please try again later.');
    }
   };

   const handleOrganizerClick = async (organizerId) => {
    try {
      const organizer = organizers.find(o => o.id === organizerId);
      if (!organizer) return;

      setSelectedOrganizer(organizer);
      
      // Fetch organizer dashboard data
      const dashboardData = await organizerService.getOrganizerDashboard(organizerId);
      setOrganizerDashboard(dashboardData);
      
      setActiveTab('organizerProfile');
    } catch (err) {
      handleAuthError(err);
      setError('Failed to load organizer data. Please try again later.');
    }
  };

  const handleCheckout = () => {
    setCheckoutStep('information'); // Start checkout
  };

  const startNewConversation = async (organizerId) => {
    try {
      const userId = authService.getUserId();
      const existingConversation = conversations.find(c => c.organizerId === organizerId);
      
      if (existingConversation) {
        setActiveConversation(existingConversation.id);
        return;
      }

      const newConversation = await conversationService.createConversation(userId, organizerId);
      setConversations(prev => [...prev, newConversation]);
      setActiveConversation(newConversation.id);
    } catch (error) {
      console.error('Error starting new conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Traitement des réservations
  const currentDate = new Date().toISOString().split('T')[0];

  const processedBookings = bookings.map(booking => {
    const event = booking.event;
    if (!event) return booking;
    let bookingstatus = booking.bookingstatus;

    // Update status based on event date for CONFIRMED bookings
    if (bookingstatus === 'CONFIRMED') {
      const eventDate = new Date(event.eventDate);
      const now = new Date();
      if (eventDate < now) {
        bookingstatus = 'PAST';
      }
    }

    return {
      ...booking,
      bookingstatus
    };
  });
  const addToCart = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event || cart.some(item => item.eventId === eventId)) return;

    // Check if the item is already in the cart
    const existingCartItem = cart.find(item => item.eventId === eventId);

    if (existingCartItem) {
        // If the item is already in the cart, increase the quantity
        setCart(cart.map(item =>
            item.eventId === eventId ? { ...item, quantity: item.quantity + 1 } : item
        ));
    } else {
        // If the item is not in the cart, add it with a quantity of 1
        setCart([...cart, {
            eventId,
            title: event.title,
            price: event.price,
            eventDate: event.eventDate,
            lieu: event.lieu,
            image: event.videoImageUrl,
            quantity: 1 // Initial quantity
        }]);
    }
    
    // Redirect to cart page
    setActiveTab('cart');
    setCheckoutStep('cart');
};

   // Retirer un élément du panier
   const removeFromCart = (eventId) => {
    setCart(cart.filter(item => item.eventId !== eventId));
  };

  // Vider complètement le panier
  const clearCart = () => setCart([]);

  // Filtrage pour l'onglet actif
  /*const displayedBookings = processedBookings.filter(booking =>
    activeBookingTab === 'upcoming' ? booking.bookingstatus === 'CONFIRMED' :
    activeBookingTab === 'past' ? booking.bookingstatus === 'PAST' :
    booking.bookingstatus === 'CANCELLED'
  );*/

  // Composant BookingCard
  const BookingCard = ({ booking }) => {
    const [showQRCode, setShowQRCode] = useState(false);
    const [qrCodeImage, setQRCodeImage] = useState(null);
    const [isLoadingQR, setIsLoadingQR] = useState(false);

    const handleQRCodeClick = async () => {
      try {
        setIsLoadingQR(true);
        const ticketResponse = await qrCodeService.generateTicket(
          booking.id,
          'STANDARD',
          'AUTO'
        );
        setQRCodeImage(ticketResponse.qrCodeImage);
        setShowQRCode(true);
      } catch (error) {
        console.error('Error generating ticket:', error);
        alert('Failed to generate ticket. Please try again.');
      } finally {
        setIsLoadingQR(false);
      }
    };

    return (
      <div className="booking-card" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '15px',
        maxWidth: '600px',
        margin: '15px auto'
      }}>
        {/* Event Image */}
        <img 
          src={booking.event.videoImageUrl} 
          alt={booking.event.title} 
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '8px',
            objectFit: 'cover',
            marginRight: '20px'
          }}
        />

        {/* Event Details */}
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{booking.event.title}</h3>
          <div style={{ display: 'flex', gap: '15px', color: '#666', fontSize: '0.9rem' }}>
            <span><i className="fas fa-calendar"></i> {new Date(booking.event.eventDate).toLocaleDateString()}</span>
            <span><i className="fas fa-map-marker-alt"></i> {booking.event.lieu}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCancelModal({
              isOpen: true,
              bookingId: booking.id,
              reason: '',
              refundEligible: booking.event.price !== "Free" && isRefundEligible(booking.event.eventDate)
            })}
            style={{
              padding: '8px 15px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-times"></i> Cancel
          </button>
          <button
            onClick={handleQRCodeClick}
            disabled={isLoadingQR}
            style={{
              padding: '8px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLoadingQR ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-qrcode"></i>
            )} View QR
          </button>
        </div>

        {/* QR Code Modal */}
        <QRCodeModal
          isOpen={showQRCode}
          onClose={() => setShowQRCode(false)}
          qrCodeImage={qrCodeImage}
          eventTitle={booking.event.title}
        />
      </div>
    );
  };

  const CancelModal = React.memo(({ isOpen, onClose, onConfirm, refundEligible, initialReason }) => {
    const [reason, setReason] = useState(initialReason);

    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Cancel Reservation</h3>
            <button
              className="close-button"
              onClick= {onClose}
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <p className="modal-text">Tell us your reason for cancelling this event:</p>

            {refundEligible && (
              <div className="refund-notice">
                <i className="fas fa-check-circle"></i>
                <span>Refund Possible (Cancelling 24h before event)</span>
              </div>
            )}

            <textarea
              className="reason-textarea"
              placeholder="Ex: Other Plans, Transportation Issues..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="5"
            />
          </div>

          <div className="modal-footer">
            <button
              className="secondary-button"
              onClick={onClose}
               >
              Back
            </button>
            <button
              className="primary-button"
              disabled={!reason.trim()}
              onClick={() => {
                onConfirm(reason);
              }}
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </div>
    );
      });

      const memoizedCancelModal = useMemo(() => (
        <CancelModal
          isOpen={cancelModal.isOpen}
          onClose={() => setCancelModal({...cancelModal, isOpen: false})}
          onConfirm={(reason) => {
            handleCancelBooking(cancelModal.bookingId, reason);
            setCancelModal({...cancelModal, isOpen: false});
          }}
          refundEligible={cancelModal.refundEligible}
          initialReason={cancelModal.reason}
        />
       ), [cancelModal.isOpen, cancelModal.refundEligible, cancelModal.bookingId, cancelModal.reason, handleCancelBooking, cancelModal]); // Seuls ces états déclenchent un nouveau rendu


       const handleProfileEdit = () => {
        setIsEditingProfile(true);
        setTempUser({ ...user }); // Initialize tempUser with current user data
      };

      const handleProfileCancel = () => {
        setIsEditingProfile(false);
      };

      const handleProfileSave = async () => {
        try {
          const [firstName, lastName] = tempUser.name.split(' ');
          const profileData = {
            firstName,
            lastName,
            email: tempUser.email,
            phoneNumber: tempUser.phone,
            newsletterFrequency: tempUser.newsletterFrequency
          };

          await participantService.updateProfile(profileData);
          setUser({ ...tempUser });
          setIsEditingProfile(false);
        } catch (err) {
          handleAuthError(err);
          setError('Failed to update profile. Please try again later.');
        }
      };

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUser({ ...tempUser, [name]: value });
      };

      const handleNewsletterChange = async (frequency) => {
        try {
          await participantService.updateNewsletterFrequency(frequency);
          setUser(prev => ({ ...prev, newsletterFrequency: frequency }));
        } catch (err) {
          handleAuthError(err);
          setError('Failed to update newsletter preferences. Please try again later.');
        }
      };

      const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // In a real application, you would upload this file to a server
          // and get a URL to store in the user's photo field.
          // For this example, we'll just use a placeholder.
          setTempUser({ ...tempUser, photo: URL.createObjectURL(file) });
        }
      };

      /*const handleSendMessage = async () => {
        if (!newMessageText.trim() || !activeConversation || !isWebSocketConnected) return;

        try {
          const message = {
            conversationId: activeConversation,
            content: newMessageText,
            senderId: authService.getUserId(),
            timestamp: new Date().toISOString()
          };

          // Send message through WebSocket
          await messageService.sendMessage(activeConversation, newMessageText);

          // Update local state
          setConversations(prevConversations => 
            prevConversations.map(conv =>
              conv.id === activeConversation
                ? {
                    ...conv,
                    messages: [...conv.messages, message],
                    lastMessageDate: message.timestamp
                  }
                : conv
            )
          );

          setNewMessageText('');
        } catch (error) {
          console.error('Error sending message:', error);
          alert('Failed to send message. Please try again.');
        }
      };*/

      const handleDownloadInvoice = (invoiceId) => {
        alert(`Téléchargement de la facture #${invoiceId} simulé.`);
        // In a real application, you would trigger a file download from the server here.
      };

      const handlePasswordChange = () => {
        const errors = {};

        if (!passwordData.currentPassword) {
          errors.currentPassword = "Veuillez entrer votre mot de passe actuel";
        }

        if (!passwordData.newPassword) {
          errors.newPassword = "Veuillez entrer un nouveau mot de passe";
        } else if (passwordData.newPassword.length < 8) {
          errors.newPassword = "Le mot de passe doit contenir au moins 8 caractères";
        }

        if (!passwordData.confirmPassword) {
          errors.confirmPassword = "Veuillez confirmer votre nouveau mot de passe";
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
          errors.confirmPassword = "Les mots de passe ne correspondent pas";
        }

        if (Object.keys(errors).length > 0) {
          setPasswordErrors(errors);
          return;
        }

        // Ici, vous feriez normalement un appel API pour changer le mot de passe
        alert("Successfully Modifying Password!");
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
      };

      const PasswordModal = () => {
        if (!showPasswordModal) return null;

        return (
          <div className="modal-overlay">
            <div className="modal-content password-modal">
              <div className="modal-header">
                <h3>Change Password</h3>
                <button
                  className="close-button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="password-input-container">
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value
                      })}
                      className={passwordErrors.currentPassword ? 'error' : ''}
                    />
                    {passwordErrors.currentPassword && (
                      <span className="error-message">{passwordErrors.currentPassword}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-container">
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })}
                      className={passwordErrors.newPassword ? 'error' : ''}
                    />
                    {passwordErrors.newPassword && (
                      <span className="error-message">{passwordErrors.newPassword}</span>
                    )}
                  </div>
                  <div className="password-requirements">
                    <p>Password Must Have:</p>
                    <ul>
                      <li className={passwordData.newPassword.length >= 8 ? 'valid' : ''}>
                        At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(passwordData.newPassword) ? 'valid' : ''}>
                        At least 1 uppercase letter
                      </li>
                      <li className={/[0-9]/.test(passwordData.newPassword) ? 'valid' : ''}>
                        At least 1 number
                      </li>
                      <li className={/[!@#$%^&*]/.test(passwordData.newPassword) ? 'valid' : ''}>
                        At least 1 special character
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-container">
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })}
                      className={passwordErrors.confirmPassword ? 'error' : ''}
                    />
                    {passwordErrors.confirmPassword && (
                      <span className="error-message">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={handlePasswordChange}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        );
      };

      const NotificationSettingsModal = () => {
        if (!showNotificationSettings) return null;

        return (
          <div className="modal-overlay">
            <div className="modal-content notification-settings-modal">
              <div className="modal-header">
                <h3>Notification Preferences</h3>
                <button
                  className="close-button"
                  onClick={() => setShowNotificationSettings(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="notification-setting">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Email Notifications
                  </label>
                  <p>Receive emails for important updates</p>
                </div>

                <div className="notification-setting">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Push Notifications
                  </label>
                  <p>Receive notifications in browser</p>
                </div>

                <div className="notification-setting">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Event Reminders
                  </label>
                  <p>Receive reminders before events</p>
                </div>

                <div className="notification-setting">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Organizer Messages
                  </label>
                  <p>Receive messages from organizers</p>
                </div>

                <div className="notification-setting">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Promos & Offers
                  </label>
                  <p>Receive special offers and recommendations</p>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={() => setShowNotificationSettings(false)}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  onClick={() => {
                    alert('Notification preferences updated!');
                    setShowNotificationSettings(false);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        );
      };

      const DeleteAccountModal = () => {
        if (!showDeleteAccountModal) return null;

        return (
          <div className="modal-overlay">
            <div className="modal-content delete-account-modal">
              <div className="modal-header">
                <h3>Delete Account</h3>
                <button
                  className="close-button"
                  onClick={() => setShowDeleteAccountModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className="modal-body">
                <div className="warning-icon">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h4>Are you sure you want to delete this account?</h4>
                <p>This action is irreversible. All your data will be permanently deleted.</p>

                <div className="delete-confirmation">
                  <label>
                    <input type="checkbox" required />
                    I understand that this action is irreversible
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-button"
                  onClick={() => setShowDeleteAccountModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="danger-button"
                  onClick={() => {
                    alert('Account Deleted');
                    setShowDeleteAccountModal(false);
                  }}
                >
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        );
      };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/Auth/login');
      return;
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch user profile
        const profile = await participantService.getProfile();
        setUser({
          name: profile.firstName,
          nickname: profile.lastName,
          email: profile.email,
          phone: profile.phone_num || '',
          newsletterFrequency: profile.newsletterFrequency || 'weekly',
          photo: profile.profilePic || 'https://i.pravatar.cc/150?img=5',
          address: profile.address || '',
          city: profile.ville || '',
          country: profile.country || '',
          upcomingEvents: profile.upcomingEvents || ''
        });

        // Fetch events
        const upcomingEvents = await eventService.getUpcomingEvents();
        setEvents(upcomingEvents.map(event => ({
          id: event.id,
          title: event.title,
          eventDate: new Date(event.eventDate),
          lieu: event.lieu,
          price: event.price,
          category: event.category,
          videoImageUrl: event.videoImageUrl || '/images/music_event.webp',
          media: event.media || [],
          liked: false,
          capacity: event.capacity,
          participants: event.participants || [],
          description: event.description,
          organizer: event.organizer,
          validationStatus: event.validationStatus,
          status: event.status,
          isCancelled: event.isCancelled,
          cancellationReason: event.cancellationReason
        })));

        // Fetch reservations
        const reservations = await reservationService.getMyReservations();
        setBookings(reservations.map(reservation => ({
          id: reservation.id,
          eventId: reservation.eventId,
          event: reservation.event,
          bookingDate: reservation.reservationDate
            ? new Date(reservation.reservationDate).toISOString().split('T')[0]
            : null,
          status: reservation.status,
          bookingstatus: reservation.bookingStatus || reservation.status,
          feedback: reservation.feedback || null,
          cancellationReason: reservation.cancellationReason || null,
          cancelledAt: reservation.status === 'CANCELLED' && reservation.reservationDate
            ? new Date(reservation.reservationDate).toLocaleString()
            : null,
          refundProcessed: reservation.refundProcessed || false,
          quantity: reservation.quantity || 1
        })));

        // Fetch organizers
        const organizersData = await organizerService.getOrganizers();
        setOrganizers(organizersData.map(organizer => ({
          id: organizer.id,
          name: organizer.f_name,
          nickname: organizer.l_name,
          email: organizer.email,
          phone: organizer.phone_num,
          photo: organizer.profilPic || 'https://i.pravatar.cc/150?img=1',
          rating: organizer.rating || 0,
          status: organizer.status,
          portfolioLink: organizer.portfoliolink,
          acceptsContract: organizer.acceptscontract
        })));

      } catch (err) {
        handleAuthError(err);
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Add useEffect for fetching conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        setConversationError(null);
        const userId = authService.getUserId();
        const fetchedConversations = await conversationService.getParticipantConversations(userId);
        setConversations(fetchedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversationError('Failed to load conversations');
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (activeTab === 'inbox') {
      fetchConversations();
    }
  }, [activeTab]);

  const carouselImages = [
          { src: "/images/promo6.webp", alt: "Promo 6" },
          { src: "/images/promo7.webp", alt: "Promo 7" },
          { src: "/images/promo1.webp", alt: "Promo 1" },
          { src: "/images/promo2.webp", alt: "Promo 2" },
        ];

  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Add WebSocket connection setup
  useEffect(() => {
    const setupWebSocket = async () => {
      try {
        await messageService.connect();
        setIsWebSocketConnected(true);

        // Subscribe to user's message queue
        const userId = authService.getUserId();
        messageService.subscribeToUserQueue(userId, handleNewMessage);
      } catch (error) {
        console.error('WebSocket connection failed:', error);
        setIsWebSocketConnected(false);
      }
    };

    if (activeTab === 'inbox') {
      setupWebSocket();
    }

    return () => {
      if (isWebSocketConnected) {
        messageService.disconnect();
        setIsWebSocketConnected(false);
      }
    };
  }, [activeTab]);

  // Add WebSocket subscription for active conversation
  useEffect(() => {
    if (activeConversation && isWebSocketConnected) {
      messageService.subscribeToConversation(
        activeConversation,
        handleNewMessage,
        handleTypingStatus
      );

      return () => {
        messageService.unsubscribeFromConversation(activeConversation);
      };
    }
  }, [activeConversation, isWebSocketConnected]);

  // Handle new messages from WebSocket
  const handleNewMessage = (message) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === message.conversationId) {
          const updatedMessages = [...conv.messages, message];
          const unreadCount = message.senderId !== authService.getUserId() 
            ? conv.unreadCount + 1 
            : conv.unreadCount;

          return {
            ...conv,
            messages: updatedMessages,
            unreadCount,
            lastMessageDate: message.timestamp
          };
        }
        return conv;
      });
    });
  };

  // Handle typing status updates
  const handleTypingStatus = (data) => {
    // You can implement typing indicator UI here
    console.log('Typing status:', data);
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      messageService.sendTypingNotification(activeConversation, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      messageService.sendTypingNotification(activeConversation, false);
    }, 3000);
  };

  const handleConversationSelect = async (conversationId) => {
    try {
      await conversationService.markConversationAsRead(conversationId);
      setActiveConversation(conversationId);
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  // Update the existing handleSendMessage function
  const handleSendMessage = async () => {
    if (!newMessageText.trim() || !activeConversation || !isWebSocketConnected) return;

    try {
      const message = {
        conversationId: activeConversation,
        content: newMessageText,
        senderId: authService.getUserId(),
        timestamp: new Date().toISOString()
      };

      // Send message through WebSocket
      await messageService.sendMessage(activeConversation, newMessageText);

      // Update local state
      setConversations(prevConversations => 
        prevConversations.map(conv =>
          conv.id === activeConversation
            ? {
                ...conv,
                messages: [...conv.messages, message],
                lastMessageDate: message.timestamp
              }
            : conv
        )
      );

      setNewMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Update the message input in the inbox section
  {activeTab === 'inbox' && (
    <div className="inbox-page">
      <h2 className="section-title">Messages</h2>
      <div className="inbox-container">
        <div className="conversations-list">
          {isLoadingConversations ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading conversations...</p>
            </div>
          ) : conversationError ? (
            <div className="error-state">
              <i className="fas fa-exclamation-circle"></i>
              <p>{conversationError}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-comments"></i>
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map(conversation => (
              <div
                key={conversation.id}
                className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
                onClick={() => handleConversationSelect(conversation.id)}
              >
                <img src={conversation.organizerPhoto || 'https://i.pravatar.cc/150?img=1'} alt={conversation.organizerName} />
                <div className="conversation-info">
                  <h3>{conversation.organizerName}</h3>
                  <p>{conversation.messages[conversation.messages.length - 1]?.content || 'No messages yet'}</p>
                  <span className="conversation-time">
                    {conversation.lastMessageDate && new Date(conversation.lastMessageDate).toLocaleDateString()}
                  </span>
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="unread-badge">{conversation.unreadCount}</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="chat-area">
          {activeConversation ? (
            <>
              <div className="chat-header">
                <img
                  src={conversations.find(c => c.id === activeConversation)?.organizerPhoto || 'https://i.pravatar.cc/150?img=1'}
                  alt="Organizer"
                />
                <div className="chat-header-info">
                  <h3>{conversations.find(c => c.id === activeConversation)?.organizerName}</h3>
                  {isTyping && <span className="typing-indicator">typing...</span>}
                </div>
              </div>

              <div className="messages-container">
                {conversations
                  .find(c => c.id === activeConversation)
                  ?.messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === authService.getUserId() ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p>{message.content}</p>
                        <span className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessageText}
                  onChange={(e) => {
                    setNewMessageText(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newMessageText.trim()) {
                      handleSendMessage();
                    }
                  }}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessageText.trim() || !isWebSocketConnected}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <i className="fas fa-comments"></i>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )}

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/Auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should still log the user out locally
      authService.clearAuth();
      navigate('/Auth/login');
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">Get<span>UrTicket</span></div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="header-icons">
          <button className="icon-button"  onClick={() => setActiveTab('notifications')}>
            <i className="fas fa-bell"></i>
            {unreadNotificationsCount > 0 && (
            <span className="notification-badge">3</span>
            )}
          </button>
          <button className="icon-button" onClick={() => setActiveTab('inbox')}>
            <i className="fas fa-envelope"></i>
          </button>
          <button className="icon-button" onClick={() => setActiveTab(activeTab === 'cart' ? 'home' : 'cart')}>
            <i className="fas fa-shopping-cart"></i>
            {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span> )}
          </button>
          <div className="user-profile">
            <img src={user.photo} alt={user.nickname} />
            <span>{user.name} {user.nickname}</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
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
          <button
            className={`nav-button ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => setActiveTab('inbox')}
          >
            <i className="fas fa-envelope"></i>
            <span>Inbox</span>
          </button>
          <button
            className={`nav-button ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <i className="fas fa-file-invoice"></i>
            <span>My invoices</span>
          </button>
        </nav>

        <div className="help-section">
          <button className="help-button">
            <i className="fas fa-question-circle"></i>
            <span>Help & Support</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'home' && (
          <>
            {/* Welcome Banner Section */}
            <section className="welcome-banner">
              <h1>Hello, {user.nickname} {user.name}!</h1>
              <p>Events are waiting for you!</p>
              {user.upcomingEvents > 0 && (
                <div className="upcoming-alert">
                  You have {user.upcomingEvents} upcoming events!
                </div>
              )}
            </section>

            {/* Carousel Section */}
            /*<div className="carousel-section">
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
            </div>*/
            <section className="recommended-section">
              <h2 className="section-title">Recommended for you</h2>
              <div className="events-grid">
                {filteredEvents.slice(0, 3).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onLike={toggleLike}
                  />
                ))}
              </div>
            </section>

            <section className="trending-section">
              <h2 className="section-title">Viral Events</h2>
              <div className="events-grid">
                {filteredEvents.slice().reverse().map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onLike={toggleLike}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'explore' && (
          <div className="explore-page">
            <h2 className="section-title">Explore Events</h2>
            <div className="filters">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="music">Music</option>
                <option value="art">Art</option>
                <option value="travel">Travel</option>
              </select>

              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="all">All locations</option>
                <option value="Agadir">Agadir</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Casablanca">Casablanca</option>
              </select>

              <select
                value={filters.price}
                onChange={(e) => handleFilterChange('price', e.target.value)}
              >
                <option value="all">All prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>
            <div className="events-grid">
              {filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onLike={toggleLike}
                  showCapacity={true}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookings-page">
            <h2 className="section-title">My Reservations</h2>
            <div className="booking-tabs">
              <button
                className={activeBookingTab === 'upcoming' ? 'active' : ''}
                onClick={() => setActiveBookingTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={activeBookingTab === 'past' ? 'active' : ''}
                onClick={() => setActiveBookingTab('past')}
              >
                Past
              </button>
              <button
                className={activeBookingTab === 'cancelled' ? 'active' : ''}
                onClick={() => setActiveBookingTab('cancelled')}
              >
                Cancelled
              </button>
            </div>
            <div className="bookings-list">
              {displayedBookings.length > 0 ? (
                displayedBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="empty-state">
                  <i className="fas fa-calendar-times"></i>
                  <p>No {activeBookingTab} reservations found 😕</p>
                  <p>Time to explore some exciting events! 🎉</p>
                  <button className="explore-button" onClick={() => setActiveTab('explore')}>
                    Explore Events 🎯
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-page">
            <h2 className="section-title">Mes Événements Favoris</h2>
            {events.filter(e => e.liked).length > 0 ? (
              <div className="events-grid">
                {events.filter(e => e.liked).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onLike={toggleLike}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-heart-broken"></i>
                <p>Vous n'avez aucun événement favori pour le moment</p>
                <button className="explore-button" onClick={() => setActiveTab('explore')}>
                  Explorer les événements
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-page">
            <h2 className="section-title">My Profil</h2>
            {!isEditingProfile ? (
              <div className="profile-container">
                <div className="profile-main">
                  <div className="profile-header">
                    <div className="profile-image-container">
                      <img src={user.photo} alt={user.name} className="profile-image" />
                      <button className="edit-photo-button" onClick={handleProfileEdit}>
                        <i className="fas fa-camera"></i>
                      </button>
                    </div>
                    <div className="profile-info">
                      <h3 className="profile-name">{user.name} {user.nickname}</h3>
                      <div className="profile-contact">
                        <p><i className="fas fa-envelope"></i> {user.email}</p>
                        <p><i className="fas fa-phone"></i> +2126 51 48 33 14</p>
                        <p><i className="fas fa-map-marker-alt"></i> {user.address}, {user.city}, {user.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-stats-container">
                    <div className="stat-card">
                      <i className="fas fa-calendar-check"></i>
                      <div className="stat-info">
                        <h4>Events</h4>
                        <p>12</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <i className="fas fa-heart"></i>
                      <div className="stat-info">
                        <h4>Favorites</h4>
                        <p>5</p>
                      </div>
                    </div>
                    <div className="stat-card">
                      <i className="fas fa-clock"></i>
                      <div className="stat-info">
                        <h4>Since</h4>
                        <p>2025</p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions-container">
                    <div className="action-group">
                      <button className="action-button" onClick={() => setShowPasswordModal(true)}>
                        <i className="fas fa-key"></i>
                        <span>Change Password</span>
                      </button>
                      <button className="action-button" onClick={() => setShowNotificationSettings(true)}>
                        <i className="fas fa-bell"></i>
                        <span>Notification Preferences</span>
                      </button>
                    </div>

                    <div className="newsletter-section">
                      <h4>Newsletter Preferences</h4>
                      <div className="newsletter-control">
                        <p>Actual Frequency: <span>{user.newsletterFrequency}</span></p>
                        <select
                          value={user.newsletterFrequency}
                          onChange={(e) => setUser({...user, newsletterFrequency: e.target.value})}
                          className="newsletter-select"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="never">Turn Off</option>
                        </select>
                      </div>
                    </div>

                    <div className="danger-actions">
                      <button className="action-button danger" onClick={() => setShowDeleteAccountModal(true)}>
                        <i className="fas fa-trash-alt"></i>
                        <span>Delete Account</span>
                      </button>
                      <button className="action-button logout" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="profile-edit-container">
                <div className="edit-header">
                  <h3>Modify Profil</h3>
                  <button className="close-edit" onClick={handleProfileCancel}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="edit-form">
                  <div className="photo-upload-section">
                    <div className="current-photo">
                      <img src={tempUser.photo} alt="Current profile" />
                    </div>
                    <div className="upload-controls">
                      <label htmlFor="photo" className="upload-button">
                        <i className="fas fa-camera"></i>
                        Changer la photo
                      </label>
                      <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden-input"/>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name">First Name</label>
                      <input type="text" id="name" name="name" value={tempUser.name} onChange={handleInputChange}
                        placeholder="Votre nom" 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input type="email" id="email" name="email" value={tempUser.email}
                        onChange={handleInputChange} placeholder="Votre email"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={tempUser.phoneNumber}
                        onChange={handleInputChange} placeholder="Votre numéro"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input type="text" id="address" name="address" value={tempUser.address}
                        onChange={handleInputChange} placeholder="Votre adresse"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input type="text" id="city" name="city" value={tempUser.city} onChange={handleInputChange}
                        placeholder="Votre ville" 
                      />
                    </div>
                    <div className="form-group">
                          <label htmlFor="country">Country</label>
                      <input type="text" id="country" name="country" value={tempUser.country}
                        onChange={handleInputChange} placeholder="Votre pays"
                      />
                    </div>
                  </div>

                  <div className="newsletter-edit">
                    <label>Newsletter Frequency</label>
                    <select 
                      value={tempUser.newsletterFrequency} 
                      onChange={handleNewsletterChange}
                      className="newsletter-select"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Turn off</option>
                    </select>
                  </div>

                  <div className="edit-actions">
                    <button className="cancel-button" onClick={handleProfileCancel}>
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                    <button className="save-button" onClick={handleProfileSave}>
                      <i className="fas fa-check"></i>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

{activeTab === 'inbox' && (
  <div className="inbox-page">
    <h2 className="section-title">Messages</h2>
    <div className="inbox-container">
      <div className="conversations-list">
        {isLoadingConversations ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading conversations...</p>
          </div>
        ) : conversationError ? (
          <div className="error-state">
            <i className="fas fa-exclamation-circle"></i>
            <p>{conversationError}</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-comments"></i>
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeConversation === conversation.id ? 'active' : ''}`}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <img src={conversation.organizerPhoto || 'https://i.pravatar.cc/150?img=1'} alt={conversation.organizerName} />
              <div className="conversation-info">
                <h3>{conversation.organizerName}</h3>
                <p>{conversation.messages[conversation.messages.length - 1]?.content || 'No messages yet'}</p>
                <span className="conversation-time">
                  {conversation.lastMessageDate && new Date(conversation.lastMessageDate).toLocaleDateString()}
                </span>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="unread-badge">{conversation.unreadCount}</span>
              )}
            </div>
          ))
        )}
      </div>

      <div className="chat-area">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <img
                src={conversations.find(c => c.id === activeConversation)?.organizerPhoto || 'https://i.pravatar.cc/150?img=1'}
                alt="Organizer"
              />
              <div className="chat-header-info">
                <h3>{conversations.find(c => c.id === activeConversation)?.organizerName}</h3>
                {isTyping && <span className="typing-indicator">typing...</span>}
              </div>
            </div>

            <div className="messages-container">
              {conversations
                .find(c => c.id === activeConversation)
                ?.messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === authService.getUserId() ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessageText}
                onChange={(e) => {
                  setNewMessageText(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && newMessageText.trim()) {
                    handleSendMessage();
                  }
                }}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!newMessageText.trim() || !isWebSocketConnected}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="no-conversation-selected">
            <i className="fas fa-comments"></i>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}

        {activeTab === 'eventDetails' && selectedEvent && (
          <div className="event-details-page">
            <button
              className="back-button"
              onClick={() => {
                setSelectedEvent(null);
                setActiveTab('home');
              }}
            >
              <i className="fas fa-arrow-left"></i> Retour
            </button>

            <div className="event-details-content">
              <div className="event-details-header">
                <img src={selectedEvent.videoImageUrl} alt={selectedEvent.title} />
                <div className="event-details-info">
                  <h1>{selectedEvent.title}</h1>
                  <div className="event-meta">
                    <p><i className="fas fa-calendar-alt"></i> {selectedEvent.eventDate.toLocaleDateString()}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {selectedEvent.lieu}</p>
                    <p><i className="fas fa-tag"></i> {selectedEvent.category}</p>
                  </div>
                </div>
              </div>

              <div className="event-details-body">
                <div className="event-details-main">
                  <section className="description-section">
                    <h2>Description</h2>
                    <p>{selectedEvent.description}</p>
                  </section>

                  <section className="details-section">
                    <h2>Informations</h2>
                    <div className="details-grid">
                      <div className="detail-item">
                        <h3>Organisateur</h3>
                        <p className="organizer-link"
                          onClick={() => handleOrganizerClick(selectedEvent.organizer.id)}
                          style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>{selectedEvent.organizer.name}</p>
                      </div>
                      <div className="detail-item">
                        <h3>Capacité</h3>
                        <p>{selectedEvent.capacity} places</p>
                      </div>
                      <div className="detail-item">
                        <h3>Places restantes</h3>
                        <p>{selectedEvent.capacity - selectedEvent.participants.length}</p>
                      </div>
                      <div className="detail-item">
                        <h3>Prix</h3>
                        <p>{selectedEvent.price}</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="event-details-sidebar">
                  <div className="action-card">
                    <button
                      className={`like-button ${selectedEvent.liked ? 'liked' : ''}`}
                      onClick={() => toggleLike(selectedEvent.id)}
                    >
                      {selectedEvent.liked ? 'Remove from favorites' : 'Add To favorites'}
                    </button>
                    <button className="book-button" onClick={() => {
                            addToCart(selectedEvent.id);
                            setActiveTab('cart');
                            setCheckoutStep('cart');
                          }}
                      disabled={selectedEvent.sold >= selectedEvent.capacity}
                    >
                      {selectedEvent.sold >= selectedEvent.capacity ? 'Done' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
              {activeTab === 'organizerProfile' && selectedOrganizer && (
          <div className="organizer-profile-page">
            <button
              className="back-button"
              onClick={() => {
                setSelectedOrganizer(null);
                setOrganizerDashboard(null);
                setActiveTab('home');
              }}
            >
              <i className="fas fa-arrow-left"></i> Retour
            </button>
            <h2>Profil de l'organisateur</h2>
            <div className="organizer-profile">
              <img src={selectedOrganizer.photo} alt={selectedOrganizer.name} />
              <h3>{selectedOrganizer.name}</h3>
              <div className="organizer-info">
                <p><i className="fas fa-envelope"></i> {selectedOrganizer.email}</p>
                <p><i className="fas fa-phone"></i> {selectedOrganizer.phone}</p>
                <p><i className="fas fa-star"></i> Rating: {selectedOrganizer.rating.toFixed(1)}</p>
                <p><i className="fas fa-check-circle"></i> Status: {selectedOrganizer.status}</p>
                {selectedOrganizer.portfolioLink && (
                  <p>
                    <i className="fas fa-link"></i>
                    <a href={selectedOrganizer.portfolioLink} target="_blank" rel="noopener noreferrer">
                      Portfolio
                    </a>
                  </p>
                )}
              </div>

              {organizerDashboard && (
                <div className="organizer-dashboard">
                  <h4>Statistiques</h4>
                  <div className="dashboard-stats">
                    <div className="stat-item">
                      <span className="stat-value">{organizerDashboard.totalEvents}</span>
                      <span className="stat-label">Événements</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{organizerDashboard.totalParticipants}</span>
                      <span className="stat-label">Participants</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{organizerDashboard.totalTicketsSold}</span>
                      <span className="stat-label">Billets vendus</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{organizerDashboard.totalRevenue.toFixed(2)}€</span>
                      <span className="stat-label">Revenus</span>
                    </div>
                  </div>

                  <h4>Événements à venir</h4>
                  <div className="upcoming-events">
                    {organizerDashboard.upcomingEvents.map(event => (
                      <div key={event.id} className="event-card">
                        <h5>{event.title}</h5>
                        <p><i className="fas fa-calendar"></i> {new Date(event.eventDate).toLocaleDateString()}</p>
                        <p><i className="fas fa-map-marker-alt"></i> {event.lieu}</p>
                        <p><i className="fas fa-ticket-alt"></i> {event.availableTickets} places disponibles</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'notifications' && (
                  <div className="notifications-page">
                    <h2>Notifications</h2>
                    {notifications.length === 0 ? (
                      <p>No notification for the moment.</p>
                    ) : (
                      <ul>
                        {notifications.map(notification => (
                          <li
                            key={notification.id}
                            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          >
                            <span className="notification-message">{notification.message}</span>
                            {!notification.read && (
                              <button onClick={() => markNotificationAsRead(notification.id)}>
                                Mark as read
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

            {activeTab === 'invoices' && (
              <div className="invoices-page">
                   <h2 className="section-title">My Invoices</h2>
                      <table className="invoices-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Event</th>
                                <th>Amount</th>
                                <th>Action</th>
                             </tr>
                        </thead>
                        <tbody>
                          {invoices.map(invoice => (
                            <tr key={invoice.id}>
                                <td>{invoice.date}</td>
                               <td>{invoice.event}</td>
                               <td>{invoice.amount}</td>
                               <td>
                                   <button
                                     className="download-button"
                                      onClick={() => handleDownloadInvoice(invoice.id)}
                                    >
                                                 Download
                                    </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
              </div>
            )}
        {activeTab === 'cart' && checkoutStep === 'cart' && (
          <div className="checkout-page">
            <div className="checkout-header">
              <h2>Votre Panier</h2>
              <div className="checkout-steps">
                <div className="step active">Cart</div>
                <div className="step">Informations</div>
                <div className="step">Paiement</div>
                <div className="step">Confirmation</div>
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <button
                  className="explore-button"
                  onClick={() => setActiveTab('explore')}
                >
                  Explore events
                </button>
              </div>
            ) : (
              <>
                <div className="checkout-content">
                  <div className="cart-items-section">
                    {cart.map(item => (
                      <div key={item.eventId} className="cart-item-card">
                        <div className="cart-item-image">
                          <img src={item.image} alt={item.title} />
                        </div>
                        <div className="cart-item-details">
                          <div className="cart-item-info">
                            <h3>{item.title}</h3>
                            <p className="event-date">
                              <i className="fas fa-calendar-alt"></i> {item.date}
                            </p>
                            <p className="event-price">{item.price}</p>
                          </div>
                          <div className="cart-item-actions">
                            <div className="quantity-controls">
                              <button
                                onClick={() => decreaseQuantity(item.eventId)}
                                disabled={item.quantity <= 1}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span>{item.quantity}</span>
                              <button onClick={() => increaseQuantity(item.eventId)}>
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                            <button
                              className="remove-button"
                              onClick={() => removeFromCart(item.eventId)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="checkout-sidebar">
                    <div className="order-summary">
                      <h3>Récapitulatif</h3>
                      <div className="summary-items">
                        {cart.map(item => (
                          <div key={item.eventId} className="summary-item">
                            <span>{item.title} x{item.quantity}</span>
                            <span>{item.price === 'Gratuit' ? 'Gratuit' :
                              `${parseFloat(item.price) * item.quantity}€`}</span>
                          </div>
                        ))}
                      </div>
                      <div className="summary-fees">
                        <div className="fee-item">
                          <span>Frais de service</span>
                          <span>5.00€</span>
                        </div>
                      </div>
                      <div className="summary-total">
                        <span>Total</span>
                        <span>{cart.reduce((total, item) => {
                          const price = item.price === 'Gratuit' ? 0 : parseFloat(item.price);
                          return total + (price * item.quantity);
                        }, 5)}€</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="checkout-footer">
                  <button
                    className="back-button"
                    onClick={clearCart}
                  >
                    Vider le panier
                  </button>
                  <button
                    className="next-button"
                    onClick={() => setCheckoutStep('information')}
                  >
                    Passer à la caisse
                  </button>
                </div>
              </>
            )}
          </div>
        )}

{checkoutStep === 'information' && (
              <InformationComponent
                cart={cart}
                onConfirm={(participantsData) => {
                  // Process the checkout
                  console.log('Participants Data:', participantsData);
                  alert('Paiement simulé réussi!');
                  clearCart(); // Do not clear cart here, do it at the end after payment
                  setCheckoutStep('payment');
                  //setIsCheckoutOpen(false); // No longer used
                  //setActiveTab('home'); // Return to home after checkout
                }}
                setCheckoutStep={setCheckoutStep}
              />
            )}

            {checkoutStep === 'payment' && (
              <PaymentComponent setCheckoutStep={setCheckoutStep} />
            )}

            {checkoutStep === 'confirmation' && (
              <ConfirmationComponent />
            )}

      </main>

      <PasswordModal />
      <NotificationSettingsModal />
      <DeleteAccountModal />
       {memoizedCancelModal}
    </div>
  );
};

export default DashboardParticipant;