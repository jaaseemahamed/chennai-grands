import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus, ArrowRight, Check } from "lucide-react";
import { signIn, signUp, saveSession } from "./firebase";

export default function LoginPage({ onLoginSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [visible, setVisible] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const formatError = (code, msg) => {
    const map = {
      "auth/email-already-in-use": "This email is already registered. Please log in.",
      "auth/invalid-login-credentials": "Incorrect email or password.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password.",
    };
    return map[code] || msg || "An error occurred. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "signup" && !form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      let user;
      if (mode === "login") {
        user = await signIn(form.email, form.password);
      } else {
        user = await signUp(form.email, form.password, form.name.trim());
        setSuccess("Account created! Signing you in…");
        await new Promise(r => setTimeout(r, 900));
      }
      saveSession({ ...user, displayName: form.name });
      onLoginSuccess({ uid: user.localId, email: user.email, name: user.displayName || form.name });
    } catch (err) {
      setError(formatError(err.code, err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      {/* Animated background */}
      <div className="lp-bg">
        <div className="lp-bg-img" />
        <div className="lp-bg-overlay" />
        <div className="lp-orb lp-orb1" />
        <div className="lp-orb lp-orb2" />
        <div className="lp-orb lp-orb3" />
      </div>

      {/* Card */}
      <div className={`lp-card ${visible ? "lp-card-visible" : ""}`}>

        {/* Left panel */}
        <div className="lp-panel-left">
          <div className="lp-panel-logo">
            <div className="lp-logo-icon">CGR</div>
            <button className="lp-back-home" onClick={onBack}>
              <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />
              <span>Back to Home</span>
            </button>
          </div>
          <h2 className="lp-panel-title">Chennai Grand<br />Residency Group</h2>
          <p className="lp-panel-sub">Your gateway to two iconic luxury retreats</p>
          <div className="lp-panel-features">
            {["Hill & Mountain View – Kodaikanal", "City View – Kodaikanal", "Instant booking confirmation", "Exclusive member rates"].map((f, i) => (
              <div key={i} className="lp-panel-feat">
                <div className="lp-feat-check"><Check size={14} /></div>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="lp-panel-img-badge">
            <span>🏨</span>
            <span>2 Premium Properties</span>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="lp-panel-right">
          {/* Tab switcher */}
          <div className="lp-tabs">
            <button
              className={`lp-tab ${mode === "login" ? "lp-tab-active" : ""}`}
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              className={`lp-tab ${mode === "signup" ? "lp-tab-active" : ""}`}
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
            >
              <UserPlus size={16} />
              Create Account
            </button>
          </div>

          <div className="lp-form-header">
            <h1 className="lp-form-title">
              {mode === "login" ? "Welcome back" : "Join us today"}
            </h1>
            <p className="lp-form-sub">
              {mode === "login"
                ? "Sign in to manage your bookings"
                : "Create your account to start booking"}
            </p>
          </div>

          <form className="lp-form" onSubmit={handleSubmit} noValidate>

            {/* Name field — signup only */}
            {mode === "signup" && (
              <div className="lp-field lp-field-slide">
                <label>Full Name</label>
                <div className="lp-input-wrap">
                  <User size={18} className="lp-input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Roshan Kumar"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="lp-field">
              <label>Email Address</label>
              <div className="lp-input-wrap">
                <Mail size={18} className="lp-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="lp-field">
              <label>Password</label>
              <div className="lp-input-wrap">
                <Lock size={18} className="lp-input-icon" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder={mode === "signup" ? "At least 6 characters" : "Your password"}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error / Success messages */}
            {error && (
              <div className="lp-msg lp-msg-error">
                ⚠️ {error}
              </div>
            )}
            {success && (
              <div className="lp-msg lp-msg-success">
                ✅ {success}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="lp-submit-btn" disabled={loading}>
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>
                  <span>{mode === "login" ? "Sign In" : "Create Account"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Toggle mode */}
            <p className="lp-toggle-text">
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                className="lp-toggle-btn"
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setSuccess(""); }}
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        .lp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        /* ── Background ── */
        .lp-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
        }

        .lp-bg-img {
          position: absolute;
          inset: 0;
          background: url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80') center/cover no-repeat;
          filter: brightness(0.3) saturate(0.8);
        }

        .lp-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(10,15,30,0.92) 0%, rgba(20,10,5,0.88) 100%);
        }

        .lp-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: orbFloat 12s ease-in-out infinite alternate;
          pointer-events: none;
        }

        .lp-orb1 {
          width: 500px; height: 500px;
          background: rgba(212,175,55,0.12);
          top: -150px; left: -150px;
        }

        .lp-orb2 {
          width: 400px; height: 400px;
          background: rgba(21,101,192,0.12);
          bottom: -100px; right: -100px;
          animation-delay: -5s;
        }

        .lp-orb3 {
          width: 300px; height: 300px;
          background: rgba(212,175,55,0.07);
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation-delay: -9s;
        }

        @keyframes orbFloat {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(30px, 30px) scale(1.1); }
        }

        /* ── Card ── */
        .lp-card {
          position: relative;
          z-index: 10;
          display: flex;
          width: 100%;
          max-width: 960px;
          min-height: 600px;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 120px rgba(0,0,0,0.6);
          opacity: 0;
          transform: translateY(32px) scale(0.97);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .lp-card-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* ── Left Panel ── */
        .lp-panel-left {
          flex: 0 0 42%;
          background: linear-gradient(160deg, #1a0e00 0%, #2d1a00 50%, #1a1000 100%);
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: relative;
          overflow: hidden;
        }

        .lp-panel-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 100% 60% at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 100% 100%, rgba(212,175,55,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .lp-panel-logo { 
          margin-bottom: 32px; 
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .lp-back-home {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 12px;
          border-radius: 20px;
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .lp-back-home:hover {
          background: rgba(255,255,255,0.15);
          color: #fff;
        }
        
        .lp-logo-icon {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #1a1a1a;
          font-size: 20px;
          letter-spacing: 1px;
          box-shadow: 0 8px 32px rgba(212,175,55,0.4);
        }

        .lp-panel-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 14px;
        }

        .lp-panel-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          margin-bottom: 40px;
        }

        .lp-panel-features {
          display: flex;
          flex-direction: column;
          gap: 16px;
          flex: 1;
        }

        .lp-panel-feat {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 13.5px;
          font-weight: 400;
        }

        .lp-feat-check {
          width: 24px; height: 24px;
          background: rgba(212,175,55,0.2);
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          flex-shrink: 0;
        }

        .lp-panel-img-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 30px;
          color: rgba(212,175,55,0.85);
          font-size: 13px;
          font-weight: 500;
          margin-top: 32px;
          width: fit-content;
        }

        /* ── Right Panel ── */
        .lp-panel-right {
          flex: 1;
          background: #ffffff;
          padding: 48px 52px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        /* ── Tabs ── */
        .lp-tabs {
          display: flex;
          gap: 4px;
          background: #f4f4f6;
          padding: 5px;
          border-radius: 14px;
          margin-bottom: 36px;
          width: fit-content;
        }

        .lp-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: inherit;
          white-space: nowrap;
        }

        .lp-tab-active {
          background: white;
          color: #1a1a1a;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        /* ── Form header ── */
        .lp-form-header { margin-bottom: 32px; }

        .lp-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .lp-form-sub { font-size: 14px; color: #888; }

        /* ── Fields ── */
        .lp-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .lp-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .lp-field-slide {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lp-field label {
          font-size: 13px;
          font-weight: 600;
          color: #444;
          letter-spacing: 0.3px;
        }

        .lp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .lp-input-icon {
          position: absolute;
          left: 16px;
          color: #aaa;
          pointer-events: none;
          transition: color 0.2s;
        }

        .lp-input-wrap:focus-within .lp-input-icon {
          color: #d4af37;
        }

        .lp-input-wrap input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          border: 2px solid #eee;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          color: #1a1a1a;
          background: #fafafa;
          transition: all 0.25s;
          outline: none;
        }

        .lp-input-wrap input:focus {
          border-color: #d4af37;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(212,175,55,0.1);
        }

        .lp-eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          display: flex;
          align-items: center;
          padding: 4px;
          transition: color 0.2s;
        }

        .lp-eye-btn:hover { color: #555; }

        /* ── Messages ── */
        .lp-msg {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          line-height: 1.5;
        }

        .lp-msg-error {
          background: #fff2f2;
          border: 1px solid #fcc;
          color: #c0392b;
        }

        .lp-msg-success {
          background: #f0fff4;
          border: 1px solid #b2dfdb;
          color: #1b5e20;
        }

        /* ── Submit ── */
        .lp-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #c9a227, #f4d03f);
          color: #1a1a1a;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-family: inherit;
          letter-spacing: 0.3px;
          margin-top: 4px;
          box-shadow: 0 6px 24px rgba(212,175,55,0.3);
        }

        .lp-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(212,175,55,0.45);
        }

        .lp-submit-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        /* ── Spinner ── */
        .lp-spinner {
          width: 20px; height: 20px;
          border: 3px solid rgba(26,26,26,0.2);
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Toggle ── */
        .lp-toggle-text {
          text-align: center;
          font-size: 14px;
          color: #888;
          margin-top: 4px;
        }

        .lp-toggle-btn {
          background: none;
          border: none;
          color: #b8942a;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
          text-decoration: underline;
          text-underline-offset: 3px;
          padding: 0;
        }

        .lp-toggle-btn:hover { color: #d4af37; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .lp-card { flex-direction: column; max-width: 480px; }
          .lp-panel-left { display: none; }
          .lp-panel-right { padding: 40px 28px; }
          .lp-form-title { font-size: 26px; }
        }

        @media (max-width: 480px) {
          .lp-panel-right { padding: 32px 20px; }
          .lp-tabs { width: 100%; }
          .lp-tab { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
