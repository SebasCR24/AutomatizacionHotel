import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FoodRequests from './components/FoodRequest';

function App() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setIsOpen(false);
  };

  const handleDrawerToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router basename="/">
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {user ? (
          <>
            <Header handleDrawerToggle={handleDrawerToggle} />
            <Sidebar isOpen={isOpen} handleDrawerToggle={handleDrawerToggle} onLogout={handleLogout} />
            <div style={{ flex: 1, padding: '20px' }}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/food-requests" element={user ? <FoodRequests /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
            <Footer />
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
