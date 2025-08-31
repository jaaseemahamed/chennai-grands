import React, { useEffect, useState } from "react";

// Single-file React version of your HTML page
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

function RoomCard({ title, desc, imgSrc, videoUrl }) {
  const [isBooking, setIsBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const botToken = '8007590401:AAH1RcXj_dio2DWXg8Ob5gq902kWXiHVwJE'; // Replace with your Telegram bot token
      const chatId = '1350433378'; // Replace with your chat ID
      
      const message = `
New Booking Request:
Room Type: ${title}
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Check-in: ${bookingData.checkin}
Check-out: ${bookingData.checkout}
      `.trim();

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });

      if (response.ok) {
        alert('Booking request sent successfully! We will contact you shortly.');
        setBookingData({
          name: "",
          email: "",
          phone: "",
          checkin: "",
          checkout: "",
        });
        setIsBooking(false);
      } else {
        throw new Error('Failed to send booking request');
      }
    } catch (error) {
      alert('Failed to send booking request. Please try again later.');
    }
  };

  return (
    <div className="card">
      <img src={imgSrc} alt={title} />
      <div className="card-body">
        <h3>{title}</h3>
        <p>{desc}</p>
        {videoUrl && (
          <p>
            <a href={videoUrl} target="_blank" rel="noreferrer noopener">
              view in video
            </a>
          </p>
        )}
        {!isBooking ? (
          <button onClick={() => setIsBooking(true)}>Book Now</button>
        ) : (
          <form onSubmit={handleSubmit} className="booking-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={bookingData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={bookingData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={bookingData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="checkin"
              placeholder="Check-in Date"
              value={bookingData.checkin}
              onChange={handleInputChange}
              required
            />
            <input
              type="date"
              name="checkout"
              placeholder="Check-out Date"
              value={bookingData.checkout}
              onChange={handleInputChange}
              required
            />
            <div className="booking-buttons">
              <button type="submit">Confirm Booking</button>
              <button type="button" onClick={() => setIsBooking(false)}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Rooms() {
  return (
    <section className="rooms" id="rooms">
      <h2>Available Rooms</h2>
      <p
        style={{
          textAlign: "center",
          fontSize: 18,
          marginBottom: 20,
          color: "#4d5e6f",
        }}
      >
        <strong>Total Rooms Available:</strong> 2 Deluxe Rooms, 5 Standard
        Rooms, 3 Luxury Suites
      </p>
      <div className="room-cards">
        <RoomCard
          title="Deluxe Room"
          desc="Spacious room with a king-size bed, WiFi, and Kodaikanal village view."
          imgSrc="/105.jpg"
        />
        <RoomCard
          title="Standard Room"
          desc="Comfortable room with queen bed and all basic amenities."
          imgSrc="/102.jpg"
        />
        <RoomCard
          title="Luxury Suite"
          desc="Elegant suite with living area, balcony, full Kodaikanal village view, and premium service."
          imgSrc="/109.jpg"
        />
      </div>
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

      {/* Styles copied and lightly adapted from your HTML */}
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
    }

    nav h1 {
      font-size: 22px;
    }

    nav ul {
      list-style: none;
      display: flex;
    }

    nav ul li {
      margin: 0 15px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
      transition: 0.3s;
    }

    nav ul li a:hover {
      color: #f39c12;
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
    }

    .hero h2 {
      font-size: 48px;
      font-family: 'Segoe Script', 'Brush Script MT', cursive, Arial, sans-serif;
      font-weight: bold;
      background: rgba(255, 255, 255, 0.25);
      padding: 10px 20px;
      border-radius: 16px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.2);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.3);
      color: #e6dddd;
      display: inline-block;
    }

    .hero-content {
      background: rgba(255, 255, 255, 0.25);
      padding: 30px 40px;
      border-radius: 16px;
      box-shadow: 0 4px 32px rgba(0,0,0,0.2);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.3);
      display: inline-block;
    }

    .hero-content h2 {
      font-size: 48px;
      font-family: 'Segoe Script', 'Brush Script MT', cursive, Arial, sans-serif;
      font-weight: bold;
      color: #e6dddd;
      margin-bottom: 20px;
      background: linear-gradient(90deg, #ff8c00, #1e90ff, #32cd32);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-content p {
      color: #074e4e;
      font-size: 18px;
      line-height: 1.5;
      text-shadow: 0 0 8px #1e90ff, 0 0 16px #32cd32, 0 0 24px #ff8c00;
    }

    /* Rooms Section */
    .rooms {
      padding: 50px 20px;
      max-width: 1200px;
      margin: auto;
    }

    .rooms h2 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 32px;
      background: green;
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
    }

    .room-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }

    .card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .card:hover {
      transform: scale(1.05);
    }

    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .card-body {
      padding: 15px;
    }

    .card-body h3 {
      font-size: 20px;
      margin-bottom: 10px;
    }

    .card-body p {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .card-body button {
      background: #f39c12;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }

    .card-body button:hover {
      background: #d35400;
    }

    /* Booking Modal */
    .modal {
      display: block; /* controlled via React conditional */
      position: fixed;
      z-index: 2000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background: rgba(0,0,0,0.6);
    }

    .modal-content {
      background: white;
      margin: 10% auto;
      padding: 20px;
      width: 90%;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    }

    .modal-content h2 { margin-bottom: 15px; }

    .modal-content label { display: block; margin: 10px 0 5px; }

    .modal-content input {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .modal-content button {
      width: 100%;
      padding: 12px;
      background: #2c3e50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .modal-content button:hover { background: #1a242f; }

    .close {
      float: right;
      font-size: 24px;
      cursor: pointer;
    }

    /* Footer */
    footer {
      background: #2c3e50;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: 30px;
    }

    @media (max-width: 768px) {
      nav ul { display: none; }
    }
  `}</style>
    </div>
  );
}
