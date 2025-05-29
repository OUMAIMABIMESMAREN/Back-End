import React from "react";
import Header from "./header";
import Footer from "./footer";
import "../App.css";
import "./home.css";
import "./about.css";

const About = () => {
  // Témoignages adaptés à votre double public
  const testimonials = [
    {
      id: 1,
      name: "Lina P.",
      role: "Participant",
      text: "I discovered exclusive concerts thanks to GetUrTicket. Booking is simpler than e-commerce!",
      rating: "★★★★★"
    },
    {
      id: 2,
      name: "Mehdi R.",
      role: "Organizer",
      text: "Managing my festivals has become intuitive. The registration and QR code tools save me 10h/week!",
      rating: "★★★★☆"
    }
  ];

  return (
    <div className="event-website">
      <Header onLoginClick={() => {}} />

      {/* Bannière thématique événements */}
      <div className="about-banner">
        <img 
          src="/images/event-crowd.webp"  // Image de foule/événement
          alt="EventLink Community" className="banner-image"
        />

        <div className="banner-overlay">
          <h1>GetUrTicket: Your bridge to the event experience</h1>
        </div>
      </div>

      <div className="about-content">

         {/* --- Notre Histoire --- */}
         <section className="about-section">
          <h2 className="section-title">Our Story</h2>
          <div className="history-timeline">
            <div className="timeline-item">
              <h3>2023: The Idea 💡</h3>
              <p>
                It all started at university, during a development project. 
                <strong> Frustrated by the complexity of event bookings</strong>, 
                we decided to create a simple and modern solution.
              </p>
            </div>
            <div className="timeline-item">
              <h3>2024: The Launch 🚀</h3>
              <p>
                After months of intensive coding between classes at the Faculty of Sciences, 
                GetYourTicket was born with <strong>15 pilot events</strong> organized 
                by student associations.
              </p>
            </div>
            <div className="timeline-item">
              <h3>Today: The Ambition ✨</h3>
              <p>
                To become the reference for <strong>university and cultural events in Morocco</strong>, 
                while keeping our soul as passionate developers.
              </p>
            </div>
          </div>
        </section>

        {/* --- Équipe --- */}
        <section className="about-section">
          <h2 className="section-title">The Team Behind GetYourTicket</h2>
          <div className="team-grid">
            {[
              { 
                name: "Oumaima Bimesmaren", 
                role: "Full-Stack Developer", 
                bio: "Specialized in UX/UI, she makes the application intuitive like second nature.",
                funFact: "🎧 Coding playlist: Lo-fi beats & Rai"
              },
              { 
                name: "Imane Chaabani", 
                role: "Back-End Lead", 
                bio: "Database and security genius, she ensures smooth and secure transactions.",
                funFact: "⚡ Fun fact: Can solve a Rubik's cube in 2 min"
              },
              { 
                name: "Assia Tamai", 
                role: "Project Manager", 
                bio: "Transforms bugs into features and ideas into clear roadmap.",
                funFact: "🌱 Passion: Permaculture and tech for good"
              }
            ].map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-header">
                  <h3>{member.name}</h3>
                  <p className="role-badge">{member.role}</p>
                </div>
                <p className="member-bio">{member.bio}</p>
                <p className="fun-fact">{member.funFact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Valeurs */}
        <section className="about-section">
          <h2 className="section-title">Our Philosophy</h2>
          <div className="value-cards">
            <div className="value-card">
              <h3>🎟️ For Participants</h3>
              <p>Find the perfect event in 3 clicks, without booking stress.</p>
            </div>
            <div className="value-card">
              <h3>📢 For Organizers</h3>
              <p>All-in-one tools to maximize your audience and management.</p>
            </div>
          </div>
        </section>

        {/* Fonctionnalités phares (adaptées à vos personas) */}
        <section className="about-section">
          <h2 className="section-title">What Makes Us Different</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h4>🔍 Smart Discovery</h4>
              <p>Recommendation algorithms based on your interests.</p>
            </div>
            <div className="feature-card">
              <h4>💳 Secure Payment</h4>
              <p>CMI and bank card integration for smooth transactions.</p>
            </div>
            <div className="feature-card">
              <h4>📊 Organizer Dashboard</h4>
              <p>Real-time booking tracking and statistics.</p>
            </div>
            <div className="feature-card">
              <h4>📱 Instant QR Codes</h4>
              <p>Entry validation in 2 seconds, even offline.</p>
            </div>
          </div>
        </section>

        {/* Témoignages */}
        <section className="about-section">
          <h2 className="section-title">They Use GetUrTicket</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-rating">{testimonial.rating}</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA différenciés */}
        <div className="dual-cta">
          <div className="cta-card participant-cta">
            <h3>Want to participate?</h3>
            <a href="/events" className="cta-btn">Explore events</a>
          </div>
          <div className="cta-card organizer-cta">
            <h3>Are you an organizer?</h3>
            <a href="/organizer/signup" className="cta-btn">Create a pro account</a>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default About;