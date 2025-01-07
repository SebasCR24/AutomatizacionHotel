import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FoodRequests from './components/FoodRequest';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Controla el estado del Sidebar

    useEffect(() => {
        const authStatus = localStorage.getItem('isAuthenticated') === 'true';
        setIsAuthenticated(authStatus);
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
    };

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen); // Alterna el estado de apertura/cierre del Sidebar
    };

    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {isAuthenticated ? (
                    <>
                        <Header handleDrawerToggle={handleDrawerToggle} />
                        <Sidebar
                            isOpen={isOpen} // Pasa el estado de apertura
                            handleDrawerToggle={handleDrawerToggle} // Pasa la función de toggle
                            onLogout={handleLogout} // Manejo de cierre de sesión
                        />
                        <div style={{ flex: 1, padding: '20px' }}>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/food-requests" element={<FoodRequests />} />
                                <Route path="*" element={<Navigate to="/" />} />
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
