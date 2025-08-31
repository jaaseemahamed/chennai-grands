import React, { useEffect, useState } from "react";

// Single-file React version with popup booking form
// - Drop images/video into /public (e.g., /public/105.jpg)
// - Keep your backend at http://localhost:3000/book
// - In Vite, set <title> & favicon in index.html (root)

function Navbar() {
  return (
    <nav>
      <h1>CHENNAI GRAND RESIDENCY</h1>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#rooms">Rooms</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h2>FIND YOUR PERFECT STAY</h2>
        <p>
          The best cottage in Kodaikanal, Chennai Grand Residency, offers a
          perfect blend of comfort and elegance amidst the scenic beauty of the
          hills. Surrounded by lush greenery and a peaceful atmosphere, it
          provides a homely stay with modern amenities, spacious rooms, and warm
          hospitality. Its convenient location makes it ideal for exploring
          nearby attractions while still enjoying the serenity of nature. Whether
          for a family vacation, a romantic getaway, or a relaxing retreat,
          Chennai Grand Residency stands out as a truly memorable place to stay
          in Kodaikanal.
        </p>
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
    // Basic validation
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML'
        }),
      });

      if (response.ok) {
        alert('✨ Booking request sent successfully! We will contact you shortly.');
        setBookingData({
          name: "",
          email: "",
          phone: "",
          checkin: "",
          checkout: "",
          rooms: "1",
          adults: "2",
          children: "0"
        });
        onClose();
      } else {
        throw new Error('Failed to send booking request');
      }
    } catch (error) {
      alert('Failed to send booking request. Please try again later.');
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleBackdropClick}>
      <div className="popup-content">
        <div className="popup-header">
          <h3>Book {roomTitle}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-booking-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={bookingData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={bookingData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={bookingData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Number of Rooms</label>
              <select
                name="rooms"
                value={bookingData.rooms}
                onChange={handleInputChange}
                required
              >
                {[...Array(maxRooms)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Room{i !== 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Adults</label>
              <select
                name="adults"
                value={bookingData.adults}
                onChange={handleInputChange}
                required
              >
                {[...Array(6)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Adult{i !== 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Children</label>
              <select
                name="children"
                value={bookingData.children}
                onChange={handleInputChange}
              >
                {[...Array(4)].map((_, i) => (
                  <option key={i} value={i}>
                    {i} Child{i !== 1 ? 'ren' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkin"
                value={bookingData.checkin}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkout"
                value={bookingData.checkout}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="popup-booking-actions">
            <button className="confirm-btn" onClick={handleSubmit}>
              Confirm Reservation
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ title, desc, imgSrc, videoUrl, maxRooms = 5, onBookNow }) {
  return (
    <div className="premium-card">
      <div className="card-image-wrapper">
        <img src={imgSrc} alt={title} />
        {videoUrl && (
          <a href={videoUrl} className="video-tour-btn" target="_blank" rel="noreferrer noopener">
            <span className="play-icon">▶</span>
            View Virtual Tour
          </a>
        )}
      </div>
      <div className="card-content">
        <div className="card-header">
          <h3>{title}</h3>
          <div className="room-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-text">5.0</span>
          </div>
        </div>
        <p className="room-description">{desc}</p>
        <button className="book-now-btn" onClick={() => onBookNow(title, maxRooms)}>
          Reserve Your Stay
        </button>
      </div>
    </div>
  );
}

function Rooms() {
  const [popupData, setPopupData] = useState({ isOpen: false, roomTitle: "", maxRooms: 1 });

  const handleBookNow = (roomTitle, maxRooms) => {
    setPopupData({ isOpen: true, roomTitle, maxRooms });
  };

  const closePopup = () => {
    setPopupData({ isOpen: false, roomTitle: "", maxRooms: 1 });
  };

  return (
    <section className="rooms" id="rooms">
      <h2>Available Rooms</h2>
      <p style={{
        textAlign: "center",
        fontSize: 18,
        marginBottom: 20,
        color: "#4d5e6f",
      }}>
        <strong>Total Rooms Available:</strong> 2 Deluxe Rooms, 5 Standard
        Rooms, 3 Luxury Suites
      </p>
      <div className="room-cards">
        <RoomCard
          title="Deluxe Room"
          desc="Spacious room with a king-size bed, WiFi, and Kodaikanal village view."
          imgSrc="/105.jpg"
          videoUrl="/VN20250811_140943-Copy.mp4"
          maxRooms={2}
          onBookNow={handleBookNow}
        />
        <RoomCard
          title="Standard Room"
          desc="Comfortable room with queen bed and all basic amenities."
          imgSrc="/102.jpg"
          maxRooms={5}
          onBookNow={handleBookNow}
        />
        <RoomCard
          title="Luxury Suite"
          desc="Elegant suite with living area, balcony, full Kodaikanal village view, and premium service."
          imgSrc="/109.jpg"
          maxRooms={3}
          onBookNow={handleBookNow}
        />
      </div>
      
      <BookingPopup
        isOpen={popupData.isOpen}
        onClose={closePopup}
        roomTitle={popupData.roomTitle}
        maxRooms={popupData.maxRooms}
      />
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact">
      <h1>CHENNAI GRAND RESIDENCY</h1>
      <p>📍 NEAR MANORAMA BUILDING, PACHAMARATHU ODAI, NAIDUPURAM, KODAIKANAL</p>
      <p>☎️ +91 93421 066710 | +91 97890 58023</p>
      <p>
        <a
          href="https://maps.app.goo.gl/y2HpCeBNegftkiMfA"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "#f39c12", textDecoration: "underline" }}
        >
          VIEW IN GOOGLE MAPS
        </a>
      </p>
      <p>
        <a
          href="https://www.booking.com/hotel/in/chennai-grand-residency-kodaikanal.en-gb.html"
          target="_blank"
          rel="noreferrer noopener"
          style={{ color: "#0a7a19", textDecoration: "underline" }}
        >
          Book Chennai Grand Residency on Booking.com
        </a>
      </p>
      <p>&copy; 2025 RoomBook. All Rights Reserved.</p>
    </footer>
  );
}

export default function ChennaiGrandResidency() {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Rooms />
      <Footer />

      {/* Styles */}
      <style>{`
        /* General Reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
        }

        body {
          line-height: 1.6;
          color: #333;
          background: #f9f9f9;
          background-image: url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-repeat: no-repeat;
          background-attachment: fixed;
        }

        /* Navbar */
        nav {
          background: #2c3e50;
          color: white;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        nav h1 {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        nav ul {
          list-style: none;
          display: flex;
          gap: 30px;
        }

        nav ul li a {
          color: white;
          text-decoration: none;
          transition: 0.3s;
          font-weight: 500;
          padding: 5px 0;
          position: relative;
        }

        nav ul li a:after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #f39c12;
          transition: width 0.3s ease;
        }

        nav ul li a:hover:after {
          width: 100%;
        }

        /* Hero Section */
        .hero {
          background: url('https://images.unsplash.com/photo-1501117716987-c8e2a01da7e6?auto=format&fit=crop&w=1350&q=80') 
            no-repeat center center/cover;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          position: relative;
        }

        .hero:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          padding: 40px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .hero-content h2 {
          font-size: 48px;
          margin-bottom: 20px;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          background: linear-gradient(45deg, #f39c12, #e67e22);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-content p {
          font-size: 18px;
          line-height: 1.8;
          color: rgba(255,255,255,0.9);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        /* Premium Card Styles */
        .premium-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin: 20px;
        }

        .premium-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        }

        .card-image-wrapper {
          position: relative;
          overflow: hidden;
          height: 250px;
        }

        .card-image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .premium-card:hover .card-image-wrapper img {
          transform: scale(1.05);
        }

        .video-tour-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background: rgba(255,255,255,0.9);
          color: #2c3e50;
          padding: 8px 16px;
          border-radius: 25px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          backdrop-filter: blur(4px);
          transition: transform 0.3s ease;
        }

        .video-tour-btn:hover {
          transform: scale(1.05);
        }

        .play-icon {
          color: #f39c12;
        }

        .card-content {
          padding: 24px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 24px;
          color: #2c3e50;
          margin: 0;
          font-weight: 600;
        }

        .room-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stars {
          color: #f39c12;
          letter-spacing: 2px;
        }

        .rating-text {
          color: #2c3e50;
          font-weight: 600;
        }

        .room-description {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .book-now-btn {
          width: 100%;
          padding: 14px 28px;
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .book-now-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(230, 126, 34, 0.4);
        }

        /* Popup Styles */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 20px;
          backdrop-filter: blur(5px);
        }

        .popup-content {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          animation: popupSlideIn 0.3s ease-out;
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
          border-bottom: 1px solid #eee;
          margin-bottom: 24px;
        }

        .popup-header h3 {
          font-size: 24px;
          color: #2c3e50;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #999;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f8f9fa;
          color: #666;
          transform: rotate(90deg);
        }

        .popup-booking-form {
          padding: 0 24px 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #2c3e50;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: #fafbfc;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #f39c12;
          box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1);
          background: #fff;
        }

        .popup-booking-actions {
          display: flex;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .confirm-btn,
        .cancel-btn {
          flex: 1;
          padding: 14px 20px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .confirm-btn {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }

        .cancel-btn {
          background: #e9ecef;
          color: #495057;
          border: 2px solid transparent;
        }

        .confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(230, 126, 34, 0.4);
        }

        .cancel-btn:hover {
          background: #dee2e6;
          border-color: #adb5bd;
          transform: translateY(-2px);
        }

        /* Room Cards Section */
        .rooms {
          padding: 50px 20px;
          max-width: 1200px;
          margin: auto;
        }

        .rooms h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 32px;
          background: linear-gradient(135deg, #2c3e50, #3498db);
          color: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(44, 62, 80, 0.2);
        }

        .room-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          padding: 20px;
        }

        /* Footer */
        footer {
          background: linear-gradient(135deg, #2c3e50, #34495e);
          color: white;
          text-align: center;
          padding: 40px 20px;
          margin-top: 30px;
        }

        footer h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #f39c12;
        }

        footer p {
          margin: 10px 0;
          color: rgba(255,255,255,0.9);
        }

        footer a {
          display: inline-block;
          margin: 5px 0;
          padding: 8px 16px;
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        footer a:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            text-align: center;
            padding: 10px;
          }

          nav ul {
            margin-top: 10px;
            gap: 15px;
          }

          .hero-content h2 {
            font-size: 36px;
          }

          .popup-content {
            margin: 10px;
            max-height: 95vh;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .popup-booking-actions {
            flex-direction: column;
          }

          .popup-header h3 {
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .popup-overlay {
            padding: 10px;
          }
          
          .popup-header {
            padding: 20px 20px 0;
          }
          
          .popup-booking-form {
            padding: 0 20px 20px;
          }
        }
      `}</style>
    </div>
  );
}