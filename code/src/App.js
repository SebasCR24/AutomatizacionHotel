import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Controla si el usuario está autenticado
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen(!isOpen); // Alterna el Sidebar
    };

    const handleLogin = () => {
        setIsAuthenticated(true); // Cambia el estado a autenticado después del login
    };

    return (
        <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {isAuthenticated ? (
                    <>
                        <Header handleDrawerToggle={handleDrawerToggle} />
                        <Sidebar isOpen={isOpen} handleDrawerToggle={handleDrawerToggle} />
                        <div style={{ flex: 1, padding: '20px' }}>
                            <Dashboard />
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
