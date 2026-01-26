import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Business from './components/Business';
import Products from './components/Products';
import Professionals from './components/Professionals';
import Plans from './components/Plans';
import Submissions from './components/Submissions';
import Users from './components/Users';

// Dashboard component (the main admin interface)
function Dashboard() {
  const [activeTab, setActiveTab] = useState('business');
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="App">
      {/* Navigation Header */}
      <nav className="main-nav">
        <div className="nav-container">
          {/* Logo */}
          <div className="nav-logo">
            <img src="/icon.jpeg" alt="Ismaal Logo" className="nav-logo-img" />
          </div>

          {/* Navigation Tabs */}
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'business' ? 'active' : ''}`}
              onClick={() => setActiveTab('business')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.33334 17.5V7.5L10 2.5L16.6667 7.5V17.5H11.6667V11.6667H8.33334V17.5H3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Business</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6667 5.83334L10 2.5L3.33334 5.83334M16.6667 5.83334L10 9.16668M16.6667 5.83334V14.1667L10 17.5M10 9.16668L3.33334 5.83334M10 9.16668V17.5M3.33334 5.83334V14.1667L10 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Products</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'professionals' ? 'active' : ''}`}
              onClick={() => setActiveTab('professionals')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 10 12.5H5C4.11595 12.5 3.26809 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5M18.3333 17.5V15.8333C18.3329 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6858 3.20892 15.1396 3.79359C15.5935 4.37827 15.8398 5.09736 15.8398 5.8375C15.8398 6.57764 15.5935 7.29673 15.1396 7.88141C14.6858 8.46608 14.0503 8.88308 13.3333 9.06667M10 5.83333C10 7.67428 8.50762 9.16667 6.66667 9.16667C4.82572 9.16667 3.33334 7.67428 3.33334 5.83333C3.33334 3.99238 4.82572 2.5 6.66667 2.5C8.50762 2.5 10 3.99238 10 5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Profiles</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1.66667L12.575 6.88334L18.3333 7.725L14.1667 11.7833L15.15 17.5167L10 14.8083L4.85 17.5167L5.83333 11.7833L1.66667 7.725L7.425 6.88334L10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Plans</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6667 1.66667H5.00001C4.55798 1.66667 4.13406 1.84227 3.82149 2.15483C3.50893 2.4674 3.33334 2.89131 3.33334 3.33334V16.6667C3.33334 17.1087 3.50893 17.5326 3.82149 17.8452C4.13406 18.1577 4.55798 18.3333 5.00001 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L11.6667 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.6667 1.66667V6.66667H16.6667M13.3333 10.8333H6.66667M13.3333 14.1667H6.66667M8.33334 7.50001H6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Submissions</span>
            </button>
            <button
              className={`nav-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6667 17.5V15.8333C16.6667 14.9493 16.3155 14.1014 15.6903 13.4763C15.0652 12.8512 14.2174 12.5 13.3333 12.5H6.66667C5.78261 12.5 4.93477 12.8512 4.30965 13.4763C3.68453 14.1014 3.33334 14.9493 3.33334 15.8333V17.5M13.3333 5.83333C13.3333 7.67428 11.8409 9.16667 10 9.16667C8.15906 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15906 2.5 10 2.5C11.8409 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="nav-tab-text">Users</span>
            </button>
          </div>

          {/* Logout Button */}
          <div className="nav-user">
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="main-content">
        {activeTab === 'business' && <Business />}
        {activeTab === 'products' && <Products />}
        {activeTab === 'professionals' && <Professionals />}
        {activeTab === 'plans' && <Plans />}
        {activeTab === 'submissions' && <Submissions />}
        {activeTab === 'users' && <Users />}
      </main>
    </div>
  );
}

// Loading Spinner Component
function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner-large"></div>
      <p>Loading...</p>
    </div>
  );
}

// Main App Content - handles auth state
function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
}

// Main App with Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
