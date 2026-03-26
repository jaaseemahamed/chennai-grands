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

  // Don't render until we've checked localStorage
  if (!authChecked) return null;

  // Not logged in — show login page
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Logged in — show the resort pages
  if (currentView === 'hill') {
    return <ChennaiGrandResidency onBack={handleBack} user={user} onLogout={handleLogout} />;
  }

  if (currentView === 'city') {
    return <CityViewResidency onBack={handleBack} user={user} onLogout={handleLogout} />;
  }

  return <LandingPage onSelectResort={handleSelectResort} user={user} onLogout={handleLogout} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
