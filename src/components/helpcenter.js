import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Header from "./header";
import Footer from "./footer";
import "../App.css";
import "./home.css";
import "./helpcenter.css";

const faqData = [
  {
    category: "Account and Registration",
    questions: [
      {
        q: "How to create an account?",
        a: "You can register on the platform by clicking the 'Sign Up' button at the top right, then filling out the form and following the instructions."
      },
      {
        q: "I forgot my password, what should I do?",
        a: "Click on 'Forgot Password' on the login page, and follow the instructions to reset your password."
      },
      {
        q: "Can I modify my personal information?",
        a: "Yes, in your personal space, under 'Personal Account Management'."
      },
      {
        q: "How to delete my account?",
        a: "Go to settings, then to 'Manage Personal Account'."
      }
    ]
  },
  {
    category: "Reservations & Tickets",
    questions: [
      {
        q: "How to make a reservation?",
        a: "Add the event to your cart, fill in the necessary information, make the payment if required, and you will receive an e-ticket or QR code."
      },
      {
        q: "Can I cancel or modify a reservation?",
        a: "Yes, in the participant space, under 'My Reservations'."
      },
      {
        q: "How to check the status of a reservation?",
        a: "In 'My Reservations', you will see ongoing, confirmed, or cancelled reservations."
      },
      {
        q: "Is there a reservation limit per user?",
        a: "Yes, you can reserve for yourself and others (friends, family), but a limit will be set (maximum 6 or 8 reservations)."
      },
      {
        q: "What are the rules for late arrival or absence?",
        a: "This depends on each event. Please check the specific conditions of the organizer or contact them for more information."
      }
    ]
  },
  {
    category: "Payment & Refund",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept credit cards, such as Visa or PayPal. Payments are made online only."
      },
      {
        q: "Can I pay in installments?",
        a: "No, only a single payment is accepted."
      },
      {
        q: "What to do in case of payment failure?",
        a: "Your items will remain in the cart. You can try the payment again later."
      },
      {
        q: "How to request a refund?",
        a: "If you are eligible (cancellation within deadlines, etc.), the refund will be automatically processed to the same card used. For more information, contact support."
      }
    ]
  },
  {
    category: "Assistance & Support",
    questions: [
      {
        q: "How to contact support?",
        a: "Go to the Help Center and fill out the form. Remember to check the FAQs first."
      },
      {
        q: "What is the average response time?",
        a: "48 hours on average."
      },
      {
        q: "Is there phone support?",
        a: "Yes, check the 'Contact Us' page for more info."
      },
      {
        q: "What are the support hours?",
        a: "From 8:00 AM to 6:00 PM."
      }
    ]
  },
  {
    category: "Platform Usage",
    questions: [
      {
        q: "How to use the dashboard?",
        a: "Detailed guides will be available soon."
      },
      {
        q: "How to become a partner or organizer?",
        a: "During registration, indicate that you are an organizer and follow the instructions."
      },
      {
        q: "How to manage preferences?",
        a: "Feature under clarification, stay tuned for more info."
      },
      {
        q: "How to invite other users?",
        a: "You can share the event or platform link directly with them."
      }
    ]
  }
];

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSupportForm, setShowSupportForm] = useState(false);

  const handleToggle = (idx) => {
    setOpenQuestionIndex(openQuestionIndex === idx ? null : idx);
  };

  const getFilteredQuestions = () => {
    if (activeCategory !== null) {
      return faqData[activeCategory].questions.filter((q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rechercher dans toutes les catégories si aucune sélection
    return faqData.flatMap((section) =>
      section.questions.filter((q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const filteredQuestions = getFilteredQuestions();

  return (
    <div className="event-website">
      <Header />

      <div className="help-center-container">
        <h1 className="help-title">Help Center</h1>

        <input
          type="text"
          placeholder="Type your question here..."
          className="help-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="faq-categories">
          {faqData.map((section, idx) => (
            <div
              key={idx}
              className={`faq-category ${activeCategory === idx ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(idx === activeCategory ? null : idx);
                setOpenQuestionIndex(null);
              }}
            >
              {section.category}
            </div>
          ))}
        </div>

        <div className="faq-questions">
          {filteredQuestions.length === 0 ? (
            <p>No results found.</p>
          ) : (
            filteredQuestions.map((item, idx) => (
              <div
                key={idx}
                className={`faq-item ${openQuestionIndex === idx ? "open" : ""}`}
              >
                <div
                  className="faq-item-header"
                  onClick={() => handleToggle(idx)}
                >
                  <span>{item.q}</span>
                  <FiChevronDown className="chevron" />
                </div>
                {openQuestionIndex === idx && (
                  <div className="faq-item-body">{item.a}</div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="contact-support">
          <h2>Need additional help?</h2>
          <p>Haven't found the answer to your question?</p>
          <button onClick={() => setShowSupportForm((prev) => !prev)}>
            {showSupportForm ? "Close form" : "Contact support"}
          </button>

          {showSupportForm && (
            <form className="support-form">
              <input type="text" placeholder="Your full name" required />
              <input type="email" placeholder="Your email address" required />
              <select required>
                <option value="">Subject</option>
                <option value="reservation">Reservation issue</option>
                <option value="remboursement">Refund request</option>
                <option value="technique">Technical assistance</option>
                <option value="autre">Other</option>
              </select>
              <textarea
                placeholder="Your message"
                rows="5"
                required
              ></textarea>
              <button type="submit">Send request</button>
            </form>
          )}
        </div>

        <div className="popular-articles">
          <h3>Popular articles</h3>
          <ul>
            <li><a href="#">How to book an event?</a></li>
            <li><a href="#">Understanding your dashboard</a></li>
            <li><a href="#">Modify your personal information</a></li>
          </ul>
        </div>

        <div className="chatbot-banner">
          <img src="/icons/chatbot.svg" alt="Assistant" />
          <span>👋 I'm here to help, ask me a question!</span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
