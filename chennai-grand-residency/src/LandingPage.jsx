import React, { useState, useEffect } from "react";
import { MapPin, Star, Mountain, Building2, ArrowRight } from "lucide-react";
import ChatBot from "./ChatBot";

export default function LandingPage({ onSelectResort, user, onLogout }) {
  const [hovered, setHovered] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="landing-root">
      {/* Background */}
      <div className="landing-bg">
        <div className="landing-bg-gradient" />
        <div className="landing-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 5}`} />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className={`landing-header ${visible ? "visible" : ""}`}>
        <div className="landing-logo">
          <div className="landing-logo-icon">CGR</div>
          <div className="landing-logo-text">
            <span className="landing-brand">CHENNAI GRAND</span>
            <span className="landing-brand-sub">RESIDENCY GROUP</span>
          </div>
        </div>
        {user && (
          <div className="landing-user-bar">
            <span className="landing-user-greet">👋 Welcome, <strong>{user.name || user.email}</strong></span>
            <button className="landing-logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        )}
      </header>

      {/* Hero Text */}
      <div className={`landing-hero ${visible ? "visible" : ""}`}>
        <div className="landing-tagline">✦ TWO ICONIC DESTINATIONS ✦</div>
        <h1 className="landing-title">
          Choose Your<br />
          <span className="landing-title-gold">Perfect Escape</span>
        </h1>
        <p className="landing-subtitle">
          Discover two extraordinary retreats, each offering a unique slice of luxury
        </p>
      </div>

      {/* Resort Cards */}
      <div className={`landing-cards ${visible ? "visible" : ""}`}>

        {/* Card 1: Hill & Mountain View – Kodaikanal */}
        <div
          className={`resort-card hill-card ${hovered === "hill" ? "card-hovered" : ""}`}
          onMouseEnter={() => setHovered("hill")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelectResort("hill")}
        >
          <div className="card-bg-image hill-bg" />
          <div className="card-overlay" />
          <div className="card-content">
            <div className="card-icon-row">
              <div className="card-icon"><Mountain size={28} /></div>
              <div className="card-rating"><Star size={14} fill="currentColor" /> 5.0</div>
            </div>
            <div className="card-location">
              <MapPin size={16} />
              <span>Kodaikanal, Tamil Nadu</span>
            </div>
            <h2 className="card-title">Chennai Grand<br />Residency</h2>
            <p className="card-view-type hill-view">🏔️ Hill &amp; Mountain View</p>
            <p className="card-desc">
              Nestled in the misty hills of Kodaikanal, this serene retreat offers
              panoramic mountain vistas and a cool alpine escape from the city.
            </p>
            <div className="card-features">
              <span className="card-feat">10 Premium Rooms</span>
              <span className="card-feat">Mountain Views</span>
              <span className="card-feat">Peaceful Retreat</span>
            </div>
            <button className="card-btn hill-btn">
              <span>Explore &amp; Book</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="cards-divider">
          <div className="divider-line" />
          <div className="divider-or">OR</div>
          <div className="divider-line" />
        </div>

        {/* Card 2: City View – Kodaikanal */}
        <div
          className={`resort-card city-card ${hovered === "city" ? "card-hovered" : ""}`}
          onMouseEnter={() => setHovered("city")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelectResort("city")}
        >
          <div className="card-bg-image city-bg" />
          <div className="card-overlay" />
          <div className="card-content">
            <div className="card-icon-row">
              <div className="card-icon city-icon"><Building2 size={28} /></div>
              <div className="card-rating"><Star size={14} fill="currentColor" /> 5.0</div>
            </div>
            <div className="card-location">
              <MapPin size={16} />
              <span>No 02, Vilpatti Road, Naidupuram, Kodaikanal</span>
            </div>
            <h2 className="card-title">Roshan's Chennai<br />Grand Residency</h2>
            <p className="card-view-type city-view">🌆 City View</p>
            <p className="card-desc">
              Experience luxury at its finest in the heart of Kodaikanal, with
              stunning city views and world-class contemporary amenities.
            </p>
            <div className="card-features">
              <span className="card-feat">City View</span>
              <span className="card-feat">15 Premium Rooms</span>
              <span className="card-feat">Prime Location</span>
            </div>
            <button className="card-btn city-btn">
              <span>Explore &amp; Book</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <ChatBot mode="landing" onSelectProperty={onSelectResort} />
 
      {/* Footer */}
      <div className="landing-footer">
        <p>© 2025 Chennai Grand Residency Group · All Rights Reserved</p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .landing-root {
          min-height: 100vh;
          background: #08090a;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        /* Background */
        .landing-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .landing-bg-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 20%, rgba(92, 61, 0, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 80% 80%, rgba(0, 40, 80, 0.35) 0%, transparent 60%),
            linear-gradient(180deg, #08090a 0%, #0e1117 100%);
        }

        .landing-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          animation: float linear infinite;
          opacity: 0.15;
        }

        ${[...Array(20)].map((_, i) => `
          .particle:nth-child(${i + 1}) {
            width: ${6 + (i % 4) * 4}px;
            height: ${6 + (i % 4) * 4}px;
            left: ${(i * 17 + 5) % 100}%;
            top: ${(i * 23 + 10) % 100}%;
            background: ${i < 10 ? '#d4af37' : '#4a90d9'};
            animation-duration: ${15 + (i % 5) * 4}s;
            animation-delay: ${i * -2}s;
          }
        `).join('')}

        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
          50% { opacity: 0.25; }
          100% { transform: translateY(-120px) rotate(360deg); opacity: 0; }
        }

        /* Header */
        .landing-header {
          position: relative;
          z-index: 10;
          width: 100%;
          padding: 32px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          opacity: 0;
          transform: translateY(-20px);
          transition: all 0.8s ease;
        }

        .landing-header.visible { opacity: 1; transform: translateY(0); }

        .landing-user-bar {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .landing-user-greet {
          color: rgba(255,255,255,0.75);
          font-size: 14px;
        }

        .landing-user-greet strong {
          color: #f4d03f;
          font-weight: 600;
        }

        .landing-logout-btn {
          padding: 8px 18px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
        }

        .landing-logout-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #fff;
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .landing-logo-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #1a1a1a;
          font-size: 18px;
          letter-spacing: 1px;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
        }

        .landing-logo-text {
          display: flex;
          flex-direction: column;
        }

        .landing-brand {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #fff;
        }

        .landing-brand-sub {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          color: rgba(212, 175, 55, 0.8);
        }

        /* Hero Text */
        .landing-hero {
          position: relative;
          z-index: 10;
          text-align: center;
          padding: 20px 40px 50px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease 0.2s;
        }

        .landing-hero.visible { opacity: 1; transform: translateY(0); }

        .landing-tagline {
          color: rgba(212, 175, 55, 0.9);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 4px;
          margin-bottom: 20px;
        }

        .landing-title {
          font-family: 'Playfair Display', serif;
          font-size: 62px;
          font-weight: 700;
          color: white;
          line-height: 1.15;
          margin-bottom: 20px;
        }

        .landing-title-gold {
          background: linear-gradient(135deg, #d4af37, #f4d03f, #d4af37);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .landing-subtitle {
          font-size: 17px;
          color: rgba(255, 255, 255, 0.55);
          font-weight: 400;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Cards Section */
        .landing-cards {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: stretch;
          gap: 0;
          padding: 0 40px 60px;
          max-width: 1200px;
          width: 100%;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.4s;
        }

        .landing-cards.visible { opacity: 1; transform: translateY(0); }

        /* Resort Card */
        .resort-card {
          flex: 1;
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          cursor: pointer;
          min-height: 560px;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .resort-card.card-hovered {
          transform: translateY(-10px) scale(1.01);
          border-color: rgba(212, 175, 55, 0.3);
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
        }

        .city-card.card-hovered {
          border-color: rgba(74, 144, 217, 0.3);
        }

        /* Background images */
        .card-bg-image {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          filter: brightness(0.45) saturate(0.9);
        }

        .hill-bg {
          background-image: url('/city-background.png');
        }

        .city-bg {
          background-image: url('/naidupuram-view.png');
        }

        .resort-card.card-hovered .card-bg-image {
          transform: scale(1.08);
          filter: brightness(0.55) saturate(1.1);
        }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(0,0,0,0.2) 0%,
            rgba(0,0,0,0.1) 40%,
            rgba(0,0,0,0.6) 100%
          );
          transition: all 0.5s ease;
        }

        .hill-card .card-overlay {
          background: linear-gradient(
            160deg,
            rgba(30, 15, 0, 0.3) 0%,
            rgba(0,0,0,0.15) 40%,
            rgba(15, 8, 0, 0.75) 100%
          );
        }

        .city-card .card-overlay {
          background: linear-gradient(
            160deg,
            rgba(0, 20, 40, 0.3) 0%,
            rgba(0,0,0,0.15) 40%,
            rgba(0, 10, 25, 0.75) 100%
          );
        }

        /* Card Content */
        .card-content {
          position: relative;
          z-index: 2;
          padding: 40px;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .card-icon-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-icon {
          width: 56px;
          height: 56px;
          background: rgba(212, 175, 55, 0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f4d03f;
          transition: all 0.3s;
        }

        .city-icon {
          background: rgba(74, 144, 217, 0.15);
          border-color: rgba(74, 144, 217, 0.3);
          color: #64b5f6;
        }

        .card-rating {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 14px;
          border-radius: 20px;
          color: #f4d03f;
          font-weight: 700;
          font-size: 14px;
        }

        .card-location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.65);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .card-location svg { color: rgba(212, 175, 55, 0.8); }
        .city-card .card-location svg { color: rgba(100, 181, 246, 0.8); }

        .card-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: white;
          line-height: 1.3;
          margin-bottom: 10px;
        }

        .card-view-type {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 14px;
          letter-spacing: 0.5px;
        }

        .hill-view { color: #f4d03f; }
        .city-view { color: #64b5f6; }

        .card-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.7;
          margin-bottom: 22px;
        }

        .card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 28px;
        }

        .card-feat {
          padding: 5px 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          backdrop-filter: blur(8px);
        }

        .card-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.5px;
        }

        .hill-btn {
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
          box-shadow: 0 8px 30px rgba(212, 175, 55, 0.3);
        }

        .hill-btn:hover {
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.5);
          transform: translateY(-2px);
        }

        .city-btn {
          background: linear-gradient(135deg, #1565c0, #42a5f5);
          color: white;
          box-shadow: 0 8px 30px rgba(66, 165, 245, 0.3);
        }

        .city-btn:hover {
          box-shadow: 0 12px 40px rgba(66, 165, 245, 0.5);
          transform: translateY(-2px);
        }

        /* Divider */
        .cards-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 24px;
          flex-shrink: 0;
        }

        .divider-line {
          width: 1px;
          flex: 1;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent);
        }

        .divider-or {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          backdrop-filter: blur(8px);
          flex-shrink: 0;
        }

        /* Footer */
        .landing-footer {
          position: relative;
          z-index: 10;
          padding: 0 40px 32px;
          text-align: center;
        }

        .landing-footer p {
          color: rgba(255, 255, 255, 0.2);
          font-size: 13px;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .landing-title { font-size: 44px; }

          .landing-cards {
            flex-direction: column;
            padding: 0 20px 40px;
          }

          .cards-divider {
            flex-direction: row;
            padding: 16px 0;
          }

          .divider-line {
            width: auto;
            height: 1px;
            flex: 1;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          }

          .resort-card { min-height: 480px; }
        }

        @media (max-width: 600px) {
          .landing-title { font-size: 34px; }
          .card-title { font-size: 24px; }
          .card-content { padding: 28px; }
        }
      `}</style>
    </div>
  );
}
