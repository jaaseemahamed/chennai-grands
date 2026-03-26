import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import LoginPage from './LoginPage.jsx'
import LandingPage from './LandingPage.jsx'
import ChennaiGrandResidency from './ChennaiGrandResidency.jsx'
import CityViewResidency from './CityViewResidency.jsx'
import { getSession, clearSession } from './firebase.js'

function App() {
  const [user, setUser] = useState(null);           // logged-in user
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'hill' | 'city'
  const [authChecked, setAuthChecked] = useState(false);

  // Restore session on page load
  useEffect(() => {
    const session = getSession();
    if (session) setUser(session);
    setAuthChecked(true);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setCurrentView('landing');
  };

  const handleSelectResort = (resort) => {
    setCurrentView(resort);
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('landing');
    window.scrollTo(0, 0);
  };

  const handleLoginRequest = () => {
    setCurrentView('login');
    window.scrollTo(0, 0);
  };

  // Don't render until we've checked localStorage
  if (!authChecked) return null;

  // Determine which page to show based on currentView
  // All pages are now technically public for SEO, but booking features will require login
  if (currentView === 'login') {
    return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={handleBack} />;
  }

  if (currentView === 'hill') {
    return <ChennaiGrandResidency onBack={handleBack} user={user} onLogout={handleLogout} onLogin={handleLoginRequest} />;
  }

  if (currentView === 'city') {
    return <CityViewResidency onBack={handleBack} user={user} onLogout={handleLogout} onLogin={handleLoginRequest} />;
  }

  return <LandingPage onSelectResort={handleSelectResort} onLogin={handleLoginRequest} user={user} onLogout={handleLogout} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
