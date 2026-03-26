import React, { useEffect, useState } from "react";
import { Calendar, Users, Phone, Mail, MapPin, Star, Play, X, Check, ArrowLeft, Building2 } from "lucide-react";
import ChatBot from "./ChatBot";

function Navbar({ onBack, user, onLogout, onLogin }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`cv-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="cv-nav-container">
        <button className="cv-back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>All Resorts</span>
        </button>
        <div className="cv-logo">
          <div className="cv-logo-icon">CGR</div>
          <div className="cv-logo-text">
            <span className="cv-brand-name">ROSHAN'S CHENNAI GRAND</span>
            <span className="cv-brand-sub">RESIDENCY · CITY VIEW</span>
          </div>
        </div>
        <ul className="cv-nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#rooms">Rooms</a></li>
          <li className="nav-hide-mobile"><a href="#amenities">Amenities</a></li>
          <li className="nav-hide-mobile"><a href="#contact">Contact</a></li>
          <li>
            {user ? (
              <button className="hv-logout-btn" onClick={onLogout}>Sign Out</button>
            ) : (
              <button className="hv-logout-btn" onClick={onLogin}>Sign In</button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="cv-hero" id="home">
      <div className="cv-hero-particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`cv-particle cv-particle-${i % 5}`} />
        ))}
      </div>
      <div className="cv-hero-lighting">
        <div className="lighting-gold" />
        <div className="lighting-blue" />
      </div>
      <div className="cv-hero-overlay" />
      <div className="cv-hero-content">
        <div className="cv-hero-badge">✦ Roshan's Premier Kodaikanal Retreat ✦</div>
        <h1 className="cv-hero-title">
          Urban Luxury in the<br />
          <span className="cv-gradient-text">Heart of Kodaikanal</span>
        </h1>
        <p className="cv-hero-description">
          Experience the pulse of the city from towering heights. Roshan's Chennai Grand Residency
          blends contemporary elegance with stunning panoramic city views.
        </p>
        <div className="cv-hero-features">
          <div className="cv-feature-item">
            <Check size={20} />
            <span>Premium City Rooms</span>
          </div>
          <div className="cv-feature-item">
            <Check size={20} />
            <span>Skyline Views</span>
          </div>
          <div className="cv-feature-item">
            <Check size={20} />
            <span>Urban Amenities</span>
          </div>
        </div>
        <a href="#rooms" className="cv-hero-cta">
          <span>Explore Rooms</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <div className="cv-scroll-indicator">
        <div className="cv-mouse" />
      </div>
    </section>
  );
}

function BookingPopup({ isOpen, onClose, roomTitle, maxRooms, property }) {
  const [bookingData, setBookingData] = useState({
    name: "", email: "", phone: "", checkin: "", checkout: "", rooms: "1", adults: "2", children: "0"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!bookingData.name || !bookingData.email || !bookingData.phone || !bookingData.checkin || !bookingData.checkout) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const botToken = '8007590401:AAH1RcXj_dio2DWXg8Ob5gq902kWXiHVwJE';
      const chatId = '1350433378';
      const message = `
🏨 New Booking Request
━━━━━━━━━━━━━━━━━━
🏢 Property: ${property || "Roshan's Chennai Grand Residency – City View"}
🏷️ Room Type: ${roomTitle}
👤 Name: ${bookingData.name}
📧 Email: ${bookingData.email}
📱 Phone: ${bookingData.phone}
🏠 Number of Rooms: ${bookingData.rooms}
👥 Adults: ${bookingData.adults}
👶 Children: ${bookingData.children}
📅 Check-in: ${bookingData.checkin}
📅 Check-out: ${bookingData.checkout}
━━━━━━━━━━━━━━━━━━
      `.trim();

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
      });

      if (response.ok) {
        alert('✨ Booking request sent successfully! We will contact you shortly.');
        setBookingData({ name: "", email: "", phone: "", checkin: "", checkout: "", rooms: "1", adults: "2", children: "0" });
        onClose();
      } else {
        throw new Error('Failed');
      }
    } catch {
      alert('Failed to send booking request. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cv-popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cv-popup-content">
        <button className="cv-popup-close" onClick={onClose}><X size={24} /></button>
        <div className="cv-popup-header">
          <h3>Reserve Your Stay</h3>
          <p className="cv-popup-subtitle">{roomTitle}</p>
        </div>
        <div className="cv-popup-form">
          <div className="cv-form-row">
            <div className="cv-input-group">
              <label>Full Name *</label>
              <input type="text" name="name" placeholder="John Doe" value={bookingData.name} onChange={handleInputChange} />
            </div>
            <div className="cv-input-group">
              <label>Email Address *</label>
              <input type="email" name="email" placeholder="john@example.com" value={bookingData.email} onChange={handleInputChange} />
            </div>
          </div>
          <div className="cv-form-row">
            <div className="cv-input-group">
              <label>Phone Number *</label>
              <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" value={bookingData.phone} onChange={handleInputChange} />
            </div>
            <div className="cv-input-group">
              <label>Number of Rooms *</label>
              <select name="rooms" value={bookingData.rooms} onChange={handleInputChange}>
                {[...Array(maxRooms)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Room{i !== 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="cv-form-row">
            <div className="cv-input-group">
              <label>Adults *</label>
              <select name="adults" value={bookingData.adults} onChange={handleInputChange}>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Adult{i !== 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="cv-input-group">
              <label>Children</label>
              <select name="children" value={bookingData.children} onChange={handleInputChange}>
                {[...Array(4)].map((_, i) => (
                  <option key={i} value={i}>{i} Child{i !== 1 ? 'ren' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="cv-form-row">
            <div className="cv-input-group">
              <label>Check-in Date *</label>
              <input type="date" name="checkin" value={bookingData.checkin} onChange={handleInputChange} />
            </div>
            <div className="cv-input-group">
              <label>Check-out Date *</label>
              <input type="date" name="checkout" value={bookingData.checkout} onChange={handleInputChange} />
            </div>
          </div>
          <button className="cv-submit-btn" onClick={handleSubmit}>
            <Check size={20} />
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ title, desc, imgSrc, maxRooms, onBookNow }) {
  return (
    <div className="cv-room-card">
      <div className="cv-room-image">
        <img src={imgSrc} alt={title} />
        <div className="cv-room-badge">
          <Star size={16} fill="currentColor" />
          <span>5.0</span>
        </div>
        <div className="cv-city-tag">🌆 City View</div>
      </div>
      <div className="cv-room-details">
        <h3 className="cv-room-title">{title}</h3>
        <p className="cv-room-desc">{desc}</p>
        <div className="cv-room-footer">
          <button className="cv-book-btn" onClick={() => onBookNow(title, maxRooms)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

function Rooms() {
  const [popupData, setPopupData] = useState({ isOpen: false, roomTitle: "", maxRooms: 1 });

  return (
    <section className="cv-rooms-section" id="rooms">
      <div className="cv-section-header">
        <span className="cv-section-badge">OUR COLLECTION</span>
        <h2 className="cv-section-title">City-View Accommodations</h2>
        <p className="cv-section-subtitle">
          Premium rooms with breathtaking Kodaikanal panoramas
        </p>
      </div>
      <div className="cv-rooms-grid">
        <RoomCard
          title="City Deluxe Room"
          desc="Spacious city-facing suite with king-size bed, panoramic skyline views, and premium WiFi for the modern traveler."
          imgSrc="/city-deluxe.png"
          maxRooms={2}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
        <RoomCard
          title="Family Room"
          desc="Generously sized family room with comfortable double beds, warm decor, and everything your family needs for a perfect stay."
          imgSrc="/city-family.png"
          maxRooms={4}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
        <RoomCard
          title="Standard Room"
          desc="Well-appointed standard room with a cozy double bed, elegant wooden interiors, and all essential modern amenities."
          imgSrc="/city-standard.png"
          maxRooms={3}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
      </div>
      <BookingPopup
        isOpen={popupData.isOpen}
        onClose={() => setPopupData({ isOpen: false, roomTitle: "", maxRooms: 1 })}
        roomTitle={popupData.roomTitle}
        maxRooms={popupData.maxRooms}
        property="Roshan's Chennai Grand Residency – City View"
      />
    </section>
  );
}

function Amenities() {
  const amenities = [
    { icon: "📶", title: "High-Speed WiFi", desc: "Fiber-optic connectivity" },
    { icon: "🧹", title: "Daily Housekeeping", desc: "Impeccable service" },
    { icon: "🛁", title: "Premium Toiletries", desc: "Luxury bath amenities" },
  ];

  return (
    <section className="cv-amenities-section" id="amenities">
      <div className="cv-section-header">
        <span className="cv-section-badge">AMENITIES</span>
        <h2 className="cv-section-title">Urban Luxury Redefined</h2>
      </div>
      <div className="cv-amenities-grid">
        {amenities.map((item, i) => (
          <div key={i} className="cv-amenity-card">
            <div className="cv-amenity-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="cv-footer" id="contact">
      <div className="cv-footer-content">
        <div className="cv-footer-brand">
          <h2>ROSHAN'S CHENNAI GRAND RESIDENCY</h2>
          <p>Your premier city-view luxury retreat in Kodaikanal</p>
        </div>
        <div className="cv-footer-info">
          <div className="cv-info-item">
            <MapPin size={20} />
            <span>No 02, Vilpatti Road, Naidupuram, Kodaikanal</span>
          </div>
          <div className="cv-info-item">
            <Phone size={20} />
            <span>+91 93421 06671 | +91 97890 58023</span>
          </div>
        </div>
        <div className="cv-footer-links">
          <a href="https://www.google.com/maps/search/No+02,+Vilpatti+Road,+Naidupuram,+Kodaikanal" target="_blank" rel="noreferrer" className="cv-footer-link">
            <MapPin size={18} />
            View on Google Maps
          </a>
          <a href="https://www.booking.com" target="_blank" rel="noreferrer" className="cv-footer-link cv-booking-link">
            Book on Booking.com
          </a>
        </div>
        <div className="cv-footer-bottom">
          <p>© 2025 Roshan's Chennai Grand Residency. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function CityViewResidency({ onBack, user, onLogout, onLogin }) {
  const [chatBooking, setChatBooking] = useState({ isOpen: false, roomTitle: "", maxRooms: 1 });

  const roomMaxMap = {
    "City Deluxe Room": 2,
    "Family Room": 4,
    "Standard Room": 3,
  };

  const handleChatBookNow = (roomName) => {
    setChatBooking({
      isOpen: true,
      roomTitle: roomName,
      maxRooms: roomMaxMap[roomName] || 1,
    });
  };

  useEffect(() => {
    document.documentElement.lang = "en";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cv-app">
      <Navbar onBack={onBack} user={user} onLogout={onLogout} onLogin={onLogin} />
      <Hero />
      <Rooms />
      <Amenities />
      <Footer />
      <ChatBot 
        onBookNow={handleChatBookNow} 
        propertyName="Roshan's Chennai Grand Residency"
        propertyLocation="No 02, Vilpatti Road, Naidupuram, Kodaikanal"
        googleMapsLink="https://www.google.com/maps/search/No+02,+Vilpatti+Road,+Naidupuram,+Kodaikanal"
      />
      <BookingPopup
        isOpen={chatBooking.isOpen}
        onClose={() => setChatBooking({ isOpen: false, roomTitle: "", maxRooms: 1 })}
        roomTitle={chatBooking.roomTitle}
        maxRooms={chatBooking.maxRooms}
        property="Roshan's Chennai Grand Residency – City View"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          overflow-x: hidden;
        }

        .cv-app { min-height: 100vh; }

        /* Navbar */
        .cv-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .cv-nav.scrolled { box-shadow: 0 10px 40px rgba(0,0,0,0.08); }

        .cv-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .cv-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(30, 80, 160, 0.08);
          border: 1px solid rgba(30, 80, 160, 0.15);
          border-radius: 30px;
          color: #1565c0;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          white-space: nowrap;
        }

        .cv-back-btn:hover {
          background: rgba(30, 80, 160, 0.15);
          transform: translateX(-2px);
        }

        .cv-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cv-logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 16px;
          box-shadow: 0 4px 16px rgba(21, 101, 192, 0.3);
        }

        .cv-logo-text { display: flex; flex-direction: column; }

        .cv-brand-name {
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #1a1a1a;
        }

        .cv-brand-sub {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          color: #1565c0;
        }

        .cv-nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
        }

        .cv-nav-links a {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          position: relative;
          transition: color 0.3s;
        }

        .cv-nav-links a:hover { color: #1565c0; }

        .cv-nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px; left: 0;
          width: 0; height: 2px;
          background: #1565c0;
          transition: width 0.3s;
        }

        .cv-nav-links a:hover::after { width: 100%; }

        .hv-logout-btn {
          padding: 8px 18px;
          background: rgba(30, 80, 160, 0.08);
          border: 1px solid rgba(30, 80, 160, 0.2);
          border-radius: 20px;
          color: #1565c0;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }

        .hv-logout-btn:hover {
          background: rgba(30, 80, 160, 0.15);
          color: #1e88e5;
        }

        /* Premium Lighting & Particles */
        .cv-hero-particles {
          position: absolute;
          inset: 0;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .cv-particle {
          position: absolute;
          border-radius: 50%;
          animation: cvFloat linear infinite;
          opacity: 0.2;
        }

        .cv-particle-0 { width: 10px; height: 10px; background: #d4af37; left: 10%; animation-duration: 20s; }
        .cv-particle-1 { width: 15px; height: 15px; background: #64b5f6; left: 30%; animation-duration: 25s; animation-delay: -5s; }
        .cv-particle-2 { width: 8px; height: 8px; background: #fff; left: 55%; animation-duration: 18s; animation-delay: -2s; }
        .cv-particle-3 { width: 12px; height: 12px; background: #d4af37; left: 80%; animation-duration: 22s; animation-delay: -10s; }
        .cv-particle-4 { width: 18px; height: 18px; background: #42a5f5; left: 95%; animation-duration: 30s; animation-delay: -7s; }

        @keyframes cvFloat {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          20% { opacity: 0.3; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
        }

        .cv-hero-lighting {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }

        .lighting-gold {
          position: absolute;
          top: -20%; left: -10%;
          width: 60%; height: 80%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          animation: pulseGold 10s ease-in-out infinite alternate;
        }

        .lighting-blue {
          position: absolute;
          bottom: -20%; right: -10%;
          width: 60%; height: 80%;
          background: radial-gradient(circle, rgba(66, 165, 245, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          animation: pulseBlue 12s ease-in-out infinite alternate-reverse;
        }

        @keyframes pulseGold {
          from { transform: scale(1) translate(0, 0); opacity: 0.5; }
          to { transform: scale(1.2) translate(5%, 5%); opacity: 0.8; }
        }

        @keyframes pulseBlue {
          from { transform: scale(1) translate(0, 0); opacity: 0.5; }
          to { transform: scale(1.3) translate(-8%, -5%); opacity: 0.8; }
        }

        /* Hero */
        .cv-hero {
          position: relative;
          height: 100vh;
          background: linear-gradient(135deg, #0a0f1e 0%, #0d2137 50%, #0a1628 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .cv-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url('/naidupuram-view.png') center/cover;
          opacity: 0.4;
          filter: saturate(1.4) contrast(1.15);
          animation: cvSlowZoom 25s ease-in-out infinite alternate;
        }

        @keyframes cvSlowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }

        .cv-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(0, 5, 20, 0.45) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 2, 10, 0.65) 100%);
          backdrop-filter: blur(1px);
          z-index: 2;
        }

        .cv-hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 900px;
          padding: 0 40px;
          animation: cvFadeInUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        @keyframes cvFadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cv-hero-badge {
          display: inline-block;
          padding: 8px 24px;
          background: rgba(66, 165, 245, 0.12);
          border: 1px solid rgba(66, 165, 245, 0.3);
          border-radius: 40px;
          color: #90caf9;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 35px;
          backdrop-filter: blur(12px);
          text-transform: uppercase;
        }

        .cv-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 82px;
          font-weight: 700;
          color: white;
          line-height: 1.1;
          margin-bottom: 35px;
          letter-spacing: -3px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }

        .cv-gradient-text {
          background: linear-gradient(135deg, #64b5f6, #42a5f5, #1565c0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          margin-top: 10px;
        }

        .cv-hero-description {
          font-size: 21px;
          color: rgba(255,255,255,0.7);
          line-height: 1.6;
          margin-bottom: 45px;
          font-weight: 300;
          max-width: 750px;
          margin-left: auto;
          margin-right: auto;
        }

        .cv-hero-features {
          display: flex;
          gap: 50px;
          justify-content: center;
          margin-bottom: 55px;
        }

        .cv-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.9);
          font-size: 15px;
          font-weight: 500;
        }

        .cv-feature-item svg { color: #64b5f6; }

        .cv-hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          color: white;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(21, 101, 192, 0.35);
        }

        .cv-hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(21, 101, 192, 0.5);
        }

        .cv-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
        }

        .cv-mouse {
          width: 26px;
          height: 40px;
          border: 2px solid rgba(255,255,255,0.5);
          border-radius: 20px;
          position: relative;
        }

        .cv-mouse::before {
          content: '';
          width: 4px;
          height: 8px;
          background: rgba(255,255,255,0.7);
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: cvScroll 1.5s ease-in-out infinite;
        }

        @keyframes cvScroll {
          0%, 100% { top: 8px; opacity: 1; }
          50% { top: 20px; opacity: 0.3; }
        }

        /* Rooms Section */
        .cv-rooms-section {
          padding: 120px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cv-section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .cv-section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, rgba(21,101,192,0.1), rgba(66,165,245,0.1));
          border: 1px solid rgba(21,101,192,0.2);
          border-radius: 20px;
          color: #1565c0;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .cv-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .cv-section-subtitle {
          font-size: 18px;
          color: #666;
          font-weight: 400;
        }

        .cv-rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 40px;
        }

        .cv-room-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 60px rgba(0,0,0,0.08);
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          border: 1px solid rgba(21,101,192,0.05);
        }

        .cv-room-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 80px rgba(21,101,192,0.12);
          border-color: rgba(21,101,192,0.1);
        }

        .cv-room-image {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .cv-room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
        }

        .cv-room-card:hover .cv-room-image img { transform: scale(1.08); }

        .cv-room-badge {
          position: absolute;
          top: 20px; right: 20px;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
          color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .cv-room-badge svg { color: #f4d03f; }

        .cv-city-tag {
          position: absolute;
          bottom: 20px; left: 20px;
          background: rgba(21, 101, 192, 0.85);
          backdrop-filter: blur(10px);
          padding: 6px 14px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .cv-room-details { padding: 32px; }

        .cv-room-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .cv-room-desc {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .cv-room-footer { display: flex; }

        .cv-book-btn {
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
        }

        .cv-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(21,101,192,0.4);
        }

        /* Amenities */
        .cv-amenities-section {
          padding: 120px 40px;
          background: linear-gradient(135deg, #f0f4ff, #ffffff);
          max-width: 100%;
        }

        .cv-amenities-section .cv-section-header {
          max-width: 1400px;
          margin: 0 auto 60px;
        }

        .cv-amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 28px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .cv-amenity-card {
          background: white;
          padding: 36px 28px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          border: 1px solid rgba(21,101,192,0.06);
        }

        .cv-amenity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(21,101,192,0.1);
          border-color: rgba(21,101,192,0.15);
        }

        .cv-amenity-icon { font-size: 44px; margin-bottom: 18px; }
        .cv-amenity-card h4 { font-size: 17px; font-weight: 600; color: #1a1a1a; margin-bottom: 10px; }
        .cv-amenity-card p { font-size: 14px; color: #666; }

        /* Popup */
        .cv-popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: cvFadeIn 0.3s ease-out;
        }

        @keyframes cvFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .cv-popup-content {
          background: white;
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 90px rgba(0,0,0,0.3);
          animation: cvSlideUp 0.4s cubic-bezier(0.4,0,0.2,1);
        }

        @keyframes cvSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .cv-popup-close {
          position: absolute;
          top: 24px; right: 24px;
          width: 40px; height: 40px;
          background: rgba(0,0,0,0.05);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 1;
        }

        .cv-popup-close:hover { background: rgba(0,0,0,0.1); transform: rotate(90deg); }

        .cv-popup-header {
          padding: 48px 48px 32px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .cv-popup-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .cv-popup-subtitle { font-size: 16px; color: #1565c0; font-weight: 500; }

        .cv-popup-form { padding: 40px 48px; }

        .cv-form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .cv-input-group { display: flex; flex-direction: column; gap: 10px; }

        .cv-input-group label { font-size: 14px; font-weight: 600; color: #1a1a1a; }

        .cv-input-group input,
        .cv-input-group select {
          padding: 14px 18px;
          border: 2px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
          background: rgba(0,0,0,0.02);
        }

        .cv-input-group input:focus,
        .cv-input-group select:focus {
          outline: none;
          border-color: #1565c0;
          background: white;
          box-shadow: 0 0 0 4px rgba(21,101,192,0.1);
        }

        .cv-submit-btn {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 32px;
          font-family: inherit;
        }

        .cv-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(21,101,192,0.4);
        }

        /* Footer */
        .cv-footer {
          background: linear-gradient(135deg, #0a0f1e, #0d2137);
          color: white;
          padding: 90px 40px 60px;
        }

        .cv-footer-content { max-width: 1400px; margin: 0 auto; }

        .cv-footer-brand { text-align: center; margin-bottom: 50px; }

        .cv-footer-brand h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #42a5f5, #64b5f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cv-footer-brand p { color: rgba(255,255,255,0.5); font-size: 15px; }

        .cv-footer-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          margin-bottom: 40px;
        }

        .cv-info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 15px;
        }

        .cv-info-item svg { color: #42a5f5; }

        .cv-footer-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 50px;
        }

        .cv-footer-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s;
        }

        .cv-footer-link:hover {
          background: rgba(66,165,245,0.15);
          border-color: rgba(66,165,245,0.4);
          transform: translateY(-2px);
        }

        .cv-booking-link {
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          border: none;
        }

        .cv-booking-link:hover { box-shadow: 0 8px 30px rgba(21,101,192,0.4); }

        .cv-footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .cv-footer-bottom p { color: rgba(255,255,255,0.3); font-size: 14px; }

        /* Responsive */
        @media (max-width: 1024px) {
          .cv-hero-title { font-size: 56px; }
          .cv-section-title { font-size: 40px; }
          .cv-nav-links { gap: 20px; }
        }

        @media (max-width: 768px) {
          .cv-nav-container { padding: 14px 20px; gap: 12px; }
          .cv-nav-links { display: none; }
          .cv-hero-title { font-size: 38px; }
          .cv-hero-description { font-size: 16px; }
          .cv-hero-features { flex-direction: column; gap: 16px; align-items: center; }
          .cv-rooms-section, .cv-amenities-section { padding: 80px 24px; }
          .cv-section-title { font-size: 32px; }
          .cv-rooms-grid { grid-template-columns: 1fr; }
          .cv-form-row { grid-template-columns: 1fr; }
          .cv-popup-header, .cv-popup-form { padding: 28px 24px; }
          .cv-brand-name { font-size: 12px; }
        }

        @media (max-width: 480px) {
          .cv-hero-title { font-size: 30px; }
          .cv-back-btn span { display: none; }
        }
      `}</style>
    </div>
  );
}
