import React, { useEffect, useState } from "react";
import { Calendar, Users, Phone, Mail, MapPin, Star, Play, X, Check } from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="nav-container">
        <div className="logo">
          <div className="logo-icon">CGR</div>
          <div className="logo-text">
            <span className="brand-name">CHENNAI GRAND</span>
            <span className="brand-sub">RESIDENCY</span>
          </div>
        </div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#rooms">Rooms</a></li>
          <li><a href="#amenities">Amenities</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <div className="hero-badge">★ Premier Kodaikanal Retreat ★</div>
        <h1 className="hero-title">
          Experience Luxury in the<br />
          <span className="gradient-text">Heart of Hills</span>
        </h1>
        <p className="hero-description">
          Immerse yourself in the perfect blend of comfort and elegance amidst Kodaikanal's scenic beauty. 
          Your unforgettable mountain escape awaits.
        </p>
        <div className="hero-features">
          <div className="feature-item">
            <Check size={20} />
            <span>10 Premium Rooms</span>
          </div>
          <div className="feature-item">
            <Check size={20} />
            <span>Mountain Views</span>
          </div>
          <div className="feature-item">
            <Check size={20} />
            <span>Modern Amenities</span>
          </div>
        </div>
        <a href="#rooms" className="hero-cta">
          <span>Explore Rooms</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
      <div className="scroll-indicator">
        <div className="mouse"></div>
      </div>
    </section>
  );
}

function BookingPopup({ isOpen, onClose, roomTitle, maxRooms }) {
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
    rooms: "1",
    adults: "2",
    children: "0"
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
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (response.ok) {
        alert('✨ Booking request sent successfully! We will contact you shortly.');
        setBookingData({
          name: "", email: "", phone: "", checkin: "", checkout: "",
          rooms: "1", adults: "2", children: "0"
        });
        onClose();
      } else {
        throw new Error('Failed to send booking request');
      }
    } catch {
      alert('Failed to send booking request. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="popup-header">
          <h3>Reserve Your Stay</h3>
          <p className="popup-subtitle">{roomTitle}</p>
        </div>
        <div className="popup-form">
          <div className="form-row">
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={bookingData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={bookingData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={bookingData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Number of Rooms *</label>
              <select name="rooms" value={bookingData.rooms} onChange={handleInputChange}>
                {[...Array(maxRooms)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Room{i !== 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Adults *</label>
              <select name="adults" value={bookingData.adults} onChange={handleInputChange}>
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Adult{i !== 0 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="input-group">
              <label>Children</label>
              <select name="children" value={bookingData.children} onChange={handleInputChange}>
                {[...Array(4)].map((_, i) => (
                  <option key={i} value={i}>{i} Child{i !== 1 ? 'ren' : ''}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                name="checkin"
                value={bookingData.checkin}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label>Check-out Date *</label>
              <input
                type="date"
                name="checkout"
                value={bookingData.checkout}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="submit-btn" onClick={handleSubmit}>
            <Check size={20} />
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ title, desc, imgSrc, videoUrl, maxRooms, onBookNow }) {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={imgSrc} alt={title} />
        <div className="room-badge">
          <Star size={16} fill="currentColor" />
          <span>5.0</span>
        </div>
        {videoUrl && (
          <a href={videoUrl} className="video-btn" target="_blank" rel="noreferrer">
            <Play size={20} />
          </a>
        )}
      </div>
      <div className="room-details">
        <h3 className="room-title">{title}</h3>
        <p className="room-desc">{desc}</p>
        <div className="room-footer">
          <button className="book-btn" onClick={() => onBookNow(title, maxRooms)}>
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
    <section className="rooms-section" id="rooms">
      <div className="section-header">
        <span className="section-badge">OUR COLLECTION</span>
        <h2 className="section-title">Handpicked Accommodations</h2>
        <p className="section-subtitle">
          Choose from our carefully curated selection of 10 premium rooms
        </p>
      </div>
      <div className="rooms-grid">
        <RoomCard
          title="Deluxe Room"
          desc="Spacious sanctuary with king-size bed, premium WiFi, and breathtaking Kodaikanal village panoramas."
          imgSrc="/105.jpg"
          videoUrl="/deluxe%20room.mp4"
          maxRooms={2}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
        <RoomCard
          title="Standard Room"
          desc="Comfortable haven with queen bed and carefully selected amenities for a relaxing mountain retreat."
          imgSrc="/102.jpg"
          videoUrl="/standard%20room.mp4"
          maxRooms={5}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
        <RoomCard
          title="Luxury Suite"
          desc="Elegant suite featuring separate living area, private balcony with full village views, and concierge service."
          imgSrc="/109.jpg"
          videoUrl="/luxury%20suite%20room.mp4"
          maxRooms={3}
          onBookNow={(title, max) => setPopupData({ isOpen: true, roomTitle: title, maxRooms: max })}
        />
      </div>
      <BookingPopup
        isOpen={popupData.isOpen}
        onClose={() => setPopupData({ isOpen: false, roomTitle: "", maxRooms: 1 })}
        roomTitle={popupData.roomTitle}
        maxRooms={popupData.maxRooms}
      />
    </section>
  );
}

function Amenities() {
  const amenities = [
    { icon: "🏔️", title: "Mountain Views", desc: "Panoramic vistas" },
    { icon: "📶", title: "High-Speed WiFi", desc: "Stay connected" },
    { icon: "🍽️", title: "In-Room Dining", desc: "24/7 service" },
    { icon: "🅿️", title: "Free Parking", desc: "Secure parking" },
    { icon: "🧹", title: "Daily Housekeeping", desc: "Impeccable service" },
    { icon: "🛁", title: "Premium Toiletries", desc: "Luxury amenities" }
  ];

  return (
    <section className="amenities-section" id="amenities">
      <div className="section-header">
        <span className="section-badge">AMENITIES</span>
        <h2 className="section-title">Designed for Comfort</h2>
      </div>
      <div className="amenities-grid">
        {amenities.map((item, i) => (
          <div key={i} className="amenity-card">
            <div className="amenity-icon">{item.icon}</div>
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
    <footer id="contact">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>CHENNAI GRAND RESIDENCY</h2>
          <p>Your premium mountain escape in Kodaikanal</p>
        </div>
        <div className="footer-info">
          <div className="info-item">
            <MapPin size={20} />
            <span>Near Manorama Building, Pachamarathu Odai, Naidupuram, Kodaikanal</span>
          </div>
          <div className="info-item">
            <Phone size={20} />
            <span>+91 93421 066710 | +91 97890 58023</span>
          </div>
        </div>
        <div className="footer-links">
          <a href="https://maps.app.goo.gl/y2HpCeBNegftkiMfA" target="_blank" rel="noreferrer" className="footer-link">
            <MapPin size={18} />
            View on Google Maps
          </a>
          <a href="https://www.booking.com/hotel/in/chennai-grand-residency-kodaikanal.en-gb.html" target="_blank" rel="noreferrer" className="footer-link booking-link">
            Book on Booking.com
          </a>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Chennai Grand Residency. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function ChennaiGrandResidency() {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Rooms />
      <Amenities />
      <Footer />

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          color: #1a1a1a;
          background: #ffffff;
          overflow-x: hidden;
          overflow-y: auto;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          padding-bottom: 0;
        }

        /* Navbar */
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        nav.scrolled {
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
        }

        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #1a1a1a;
          font-size: 18px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #1a1a1a;
        }

        .brand-sub {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2px;
          color: #666;
        }

        .nav-links {
          display: flex;
          gap: 40px;
          list-style: none;
        }

        .nav-links a {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          position: relative;
          transition: color 0.3s;
        }

        .nav-links a:hover {
          color: #d4af37;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #d4af37;
          transition: width 0.3s;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* Hero */
        .hero {
          position: relative;
          height: 100vh;
          background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920') center/cover;
          opacity: 0.3;
          animation: slowZoom 20s ease-in-out infinite alternate;
        }

        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          max-width: 900px;
          padding: 0 40px;
          animation: fadeInUp 1s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          color: #f4d03f;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 30px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 72px;
          font-weight: 700;
          color: white;
          line-height: 1.2;
          margin-bottom: 30px;
          letter-spacing: -2px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 20px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          margin-bottom: 40px;
          font-weight: 300;
        }

        .hero-features {
          display: flex;
          gap: 40px;
          justify-content: center;
          margin-bottom: 50px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 15px;
          font-weight: 500;
        }

        .feature-item svg {
          color: #d4af37;
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 40px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 10px 40px rgba(212, 175, 55, 0.3);
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 50px rgba(212, 175, 55, 0.4);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
        }

        .mouse {
          width: 26px;
          height: 40px;
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          position: relative;
        }

        .mouse::before {
          content: '';
          width: 4px;
          height: 8px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 2px;
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          animation: scroll 1.5s ease-in-out infinite;
        }

        @keyframes scroll {
          0%, 100% { top: 8px; opacity: 1; }
          50% { top: 20px; opacity: 0.3; }
        }

        /* Rooms Section */
        .rooms-section {
          padding: 120px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }

        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 208, 63, 0.1));
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          color: #d4af37;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 48px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .section-subtitle {
          font-size: 18px;
          color: #666;
          font-weight: 400;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 40px;
        }

        .room-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 10px 60px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .room-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 80px rgba(0, 0, 0, 0.12);
        }

        .room-image {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .room-card:hover .room-image img {
          transform: scale(1.08);
        }

        .room-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 14px;
          color: #1a1a1a;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .room-badge svg {
          color: #d4af37;
        }

        .video-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a1a;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .video-btn:hover {
          transform: scale(1.1);
          background: #d4af37;
          color: white;
        }

        .room-details {
          padding: 32px;
        }

        .room-title {
          font-size: 26px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
        }

        .room-desc {
          font-size: 15px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 28px;
        }

        .room-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .book-btn {
          width: 100%;
          padding: 16px 32px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.4);
        }

        /* Amenities */
        .amenities-section {
          padding: 120px 40px;
          background: linear-gradient(135deg, #f8f9fa, #ffffff);
          max-width: 1400px;
          margin: 0 auto;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
        }

        .amenity-card {
          background: white;
          padding: 40px 32px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .amenity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
        }

        .amenity-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .amenity-card h4 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .amenity-card p {
          font-size: 14px;
          color: #666;
        }

        /* Popup */
        .popup-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .popup-content {
          background: white;
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .popup-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.05);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 1;
        }

        .popup-close:hover {
          background: rgba(0, 0, 0, 0.1);
          transform: rotate(90deg);
        }

        .popup-header {
          padding: 48px 48px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .popup-header h3 {
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .popup-subtitle {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        .popup-form {
          padding: 40px 48px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 24px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .input-group label {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .input-group input,
        .input-group select {
          padding: 14px 18px;
          border: 2px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.3s;
          background: rgba(0, 0, 0, 0.02);
        }

        .input-group input:focus,
        .input-group select:focus {
          outline: none;
          border-color: #d4af37;
          background: white;
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 18px 32px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
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
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.4);
        }

        /* Footer */
        footer {
          background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
          color: white;
          padding: 90px 40px 60px;
          margin-bottom: 0;
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-brand {
          text-align: center;
          margin-bottom: 50px;
        }

        .footer-brand h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .footer-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          margin-bottom: 40px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 15px;
        }

        .info-item svg {
          color: #d4af37;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 50px;
        }

        .footer-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          color: white;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s;
        }

        .footer-link:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateY(-2px);
        }

        .booking-link {
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
          border: none;
        }

        .booking-link:hover {
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-title {
            font-size: 56px;
          }

          .section-title {
            font-size: 40px;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            padding: 16px 24px;
          }

          .nav-links {
            gap: 24px;
          }

          .nav-links a {
            font-size: 14px;
          }

          .hero-title {
            font-size: 40px;
          }

          .hero-description {
            font-size: 16px;
          }

          .hero-features {
            flex-direction: column;
            gap: 16px;
            align-items: center;
          }

          .rooms-section,
          .amenities-section {
            padding: 80px 24px;
          }

          .section-title {
            font-size: 32px;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }

          .amenities-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .popup-header,
          .popup-form {
            padding: 32px 24px;
          }

          .popup-header h3 {
            font-size: 24px;
          }

          .footer-links {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media (max-width: 480px) {
          .logo-icon {
            width: 40px;
            height: 40px;
            font-size: 16px;
          }

          .brand-name {
            font-size: 14px;
          }

          .brand-sub {
            font-size: 10px;
          }

          .hero-title {
            font-size: 32px;
          }

          .hero-cta {
            padding: 14px 28px;
            font-size: 14px;
          }

          .section-badge {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}